import {
  createMcpHandler,
  fromJsonSchema,
  McpServer,
  requireBearerAuth,
  requireScopes,
  type AuthInfo,
  type OAuthTokenVerifier,
} from "@modelcontextprotocol/server";

import { DeviceToolsError, DeviceToolsService } from "./device-tools";
import type { Env } from "./env";
import {
  FilesystemToolsError,
  FilesystemToolsService,
  PHASE6_FILESYSTEM_TOOL_NAMES,
  type FilesystemToolName,
} from "./filesystem-tools";
import {
  PHASE6_TOOLS,
  publicSchema,
  type PublicToolDefinition,
} from "./mcp-catalog";
import { SERVICE_VERSION } from "./meta";
import {
  JwtAccessTokenVerifier,
  oauthConfigFromEnv,
  telechirUserId,
} from "./oauth";

export const MCP_MAX_REQUEST_BYTES = 256 * 1024;

async function requestBodyExceedsLimit(request: Request): Promise<boolean> {
  if (request.method !== "POST") {
    return false;
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength !== null) {
    const parsed = Number(contentLength);
    if (Number.isFinite(parsed) && parsed > MCP_MAX_REQUEST_BYTES) {
      return true;
    }
  }

  const body = request.clone().body;
  if (!body) {
    return false;
  }

  const reader = body.getReader();
  let total = 0;
  try {
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) {
        return false;
      }
      total += chunk.value.byteLength;
      if (total > MCP_MAX_REQUEST_BYTES) {
        await reader.cancel();
        return true;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

function jsonText(value: unknown): string {
  return JSON.stringify(value);
}

function scopedChallenge(scopes: string[]) {
  const [first, ...rest] = scopes;
  if (!first) {
    throw new Error("OAuth tool scope list must not be empty");
  }
  return requireScopes(first, ...rest);
}

function toolFailure(error: unknown) {
  if (error instanceof DeviceToolsError && error.code === "NOT_FOUND") {
    return {
      content: [{ type: "text" as const, text: "Device not found." }],
      isError: true,
    };
  }

  if (error instanceof FilesystemToolsError) {
    const safe = new Map<string, string>([
      ["NOT_FOUND", "Filesystem target or device was not found."],
      ["DEVICE_OFFLINE", "The selected device is offline."],
      [
        "UNSUPPORTED_CAPABILITY",
        "The selected device does not support this filesystem operation.",
      ],
      [
        "POLICY_DENIED",
        "The local device policy denied this filesystem operation.",
      ],
      [
        "CONFLICT",
        "The filesystem operation conflicted with current file state.",
      ],
      [
        "IDEMPOTENCY_CONFLICT",
        "The filesystem operation conflicts with a previous idempotent request.",
      ],
      ["DEADLINE_EXCEEDED", "The filesystem operation exceeded its deadline."],
      ["TIMEOUT", "The filesystem operation timed out on the device."],
      ["INVALID_ARGUMENT", "The filesystem request is invalid."],
    ]);
    return {
      content: [
        {
          type: "text" as const,
          text:
            safe.get(error.code) ??
            "The Telechir filesystem operation could not be completed.",
        },
      ],
      isError: true,
    };
  }

  return {
    content: [
      {
        type: "text" as const,
        text: "The Telechir control plane could not complete this request.",
      },
    ],
    isError: true,
  };
}

function registerListDevices(
  server: McpServer,
  env: Env,
  tool: PublicToolDefinition,
): void {
  const scopes = tool.securitySchemes.flatMap((scheme) => scheme.scopes);
  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: fromJsonSchema(publicSchema(tool.input_schema_ref)),
      outputSchema: fromJsonSchema(publicSchema(tool.output_schema_ref)),
      annotations: tool.annotations,
      _meta: {
        securitySchemes: tool.securitySchemes,
      },
      scopeChallenge: scopedChallenge(scopes),
    },
    async (args, ctx) => {
      try {
        const userId = telechirUserId(ctx.http?.authInfo);
        const input =
          args && typeof args === "object"
            ? (args as { status?: "online" | "offline" | "all" })
            : {};
        const output = await new DeviceToolsService(
          env.DB,
          env.DEVICE_COORDINATOR,
        ).listDevices(userId, input);
        return {
          content: [{ type: "text", text: jsonText(output) }],
          structuredContent: output,
        };
      } catch (error) {
        return toolFailure(error);
      }
    },
  );
}

function registerGetDevice(
  server: McpServer,
  env: Env,
  tool: PublicToolDefinition,
): void {
  const scopes = tool.securitySchemes.flatMap((scheme) => scheme.scopes);
  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: fromJsonSchema(publicSchema(tool.input_schema_ref)),
      outputSchema: fromJsonSchema(publicSchema(tool.output_schema_ref)),
      annotations: tool.annotations,
      _meta: {
        securitySchemes: tool.securitySchemes,
      },
      scopeChallenge: scopedChallenge(scopes),
    },
    async (args, ctx) => {
      try {
        const userId = telechirUserId(ctx.http?.authInfo);
        const input = args as { device_id: string };
        const output = await new DeviceToolsService(
          env.DB,
          env.DEVICE_COORDINATOR,
        ).getDevice(userId, input);
        return {
          content: [{ type: "text", text: jsonText(output) }],
          structuredContent: output,
        };
      } catch (error) {
        return toolFailure(error);
      }
    },
  );
}

function registerFilesystemTool(
  server: McpServer,
  env: Env,
  tool: PublicToolDefinition,
): void {
  if (!PHASE6_FILESYSTEM_TOOL_NAMES.includes(tool.name as FilesystemToolName)) {
    throw new Error(`unexpected filesystem tool: ${tool.name}`);
  }

  const scopes = tool.securitySchemes.flatMap((scheme) => scheme.scopes);
  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: fromJsonSchema(publicSchema(tool.input_schema_ref)),
      outputSchema: fromJsonSchema(publicSchema(tool.output_schema_ref)),
      annotations: tool.annotations,
      _meta: {
        securitySchemes: tool.securitySchemes,
      },
      scopeChallenge: scopedChallenge(scopes),
    },
    async (args, ctx) => {
      try {
        const userId = telechirUserId(ctx.http?.authInfo);
        if (!args || typeof args !== "object" || Array.isArray(args)) {
          throw new FilesystemToolsError(
            "INVALID_ARGUMENT",
            "Filesystem tool arguments must be an object",
          );
        }

        const output = await new FilesystemToolsService(
          env.DB,
          env.DEVICE_COORDINATOR,
        ).execute(
          userId,
          tool.name as FilesystemToolName,
          args as Record<string, unknown>,
        );
        return {
          content: [{ type: "text", text: jsonText(output) }],
          structuredContent: output,
        };
      } catch (error) {
        return toolFailure(error);
      }
    },
  );
}

export function createTelechirMcpServer(env: Env): McpServer {
  const server = new McpServer({
    name: "telechir",
    version: SERVICE_VERSION,
    title: "Telechir",
  });

  for (const tool of PHASE6_TOOLS) {
    switch (tool.name) {
      case "list_devices":
        registerListDevices(server, env, tool);
        break;
      case "get_device":
        registerGetDevice(server, env, tool);
        break;
      case "list_files":
      case "get_file_metadata":
      case "read_file":
      case "write_file":
      case "patch_file":
      case "search_files":
        registerFilesystemTool(server, env, tool);
        break;
      default:
        throw new Error(`unexpected Phase 6 tool: ${tool.name}`);
    }
  }

  return server;
}

async function materializeOpenAiSecuritySchemes(
  response: Response,
): Promise<Response> {
  if (
    !response.ok ||
    !response.headers.get("content-type")?.includes("application/json")
  ) {
    return response;
  }

  let body: unknown;
  try {
    body = await response.clone().json();
  } catch {
    return response;
  }

  const catalogByName = new Map(
    PHASE6_TOOLS.map((tool) => [tool.name, tool.securitySchemes]),
  );

  const visit = (value: unknown): void => {
    if (!value || typeof value !== "object") {
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        visit(item);
      }
      return;
    }

    const object = value as Record<string, unknown>;
    if (Array.isArray(object.tools)) {
      for (const candidate of object.tools) {
        if (!candidate || typeof candidate !== "object") {
          continue;
        }
        const tool = candidate as Record<string, unknown>;
        if (typeof tool.name !== "string") {
          continue;
        }
        const securitySchemes = catalogByName.get(tool.name);
        if (securitySchemes) {
          tool.securitySchemes = securitySchemes;
        }
      }
    }

    for (const child of Object.values(object)) {
      visit(child);
    }
  };
  visit(body);

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  headers.set("cache-control", "no-store");
  return Response.json(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function sameConfiguredOrigin(
  request: Request,
  resourceUri: string,
): Response | null {
  const resource = new URL(resourceUri);
  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== resource.origin) {
    return Response.json(
      { error: "invalid_request", error_description: "Host is not allowed" },
      { status: 421 },
    );
  }

  const origin = request.headers.get("origin");
  if (origin && origin !== resource.origin) {
    return Response.json(
      {
        error: "invalid_request",
        error_description: "Origin is not allowed",
      },
      { status: 403 },
    );
  }

  return null;
}

export async function mcpHttpRoute(
  request: Request,
  env: Env,
  url: URL,
  verifier?: OAuthTokenVerifier,
): Promise<Response | null> {
  if (url.pathname !== "/mcp") {
    return null;
  }

  let config;
  try {
    config = oauthConfigFromEnv(env);
  } catch {
    return Response.json(
      {
        error: "server_error",
        error_description: "MCP OAuth resource server is not configured",
      },
      {
        status: 503,
        headers: { "cache-control": "no-store" },
      },
    );
  }

  const rejected = sameConfiguredOrigin(request, config.resourceUri);
  if (rejected) {
    return rejected;
  }

  const tokenVerifier = verifier ?? new JwtAccessTokenVerifier(env.DB, config);
  const gate = requireBearerAuth({
    verifier: tokenVerifier,
    resourceMetadataUrl: config.resourceMetadataUrl,
  });
  const auth = await gate(request);
  if (auth instanceof Response) {
    return auth;
  }

  if (await requestBodyExceedsLimit(request)) {
    return Response.json(
      {
        error: "request_too_large",
        error_description: "MCP request body exceeds the configured limit",
      },
      {
        status: 413,
        headers: {
          "cache-control": "no-store",
          "x-content-type-options": "nosniff",
        },
      },
    );
  }

  const handler = createMcpHandler(() => createTelechirMcpServer(env), {
    legacy: "stateless",
  });

  const response = await handler.fetch(request, {
    authInfo: auth as AuthInfo,
  });
  return materializeOpenAiSecuritySchemes(response);
}
