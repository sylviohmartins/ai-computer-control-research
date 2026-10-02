import toolCatalog from "../../../specs/tools/tool-catalog.json";
import publicToolSchema from "../../../specs/tools/public-tools.schema.json";

type JsonObject = Record<string, unknown>;

export interface PublicToolDefinition {
  name: string;
  title: string;
  description: string;
  annotations: {
    readOnlyHint: boolean;
    destructiveHint: boolean;
    openWorldHint: boolean;
    idempotentHint: boolean;
  };
  internal_operation: string;
  execution_plane: "control-plane" | "device";
  input_schema_ref: string;
  output_schema_ref: string;
  securitySchemes: Array<{
    type: "oauth2";
    scopes: string[];
  }>;
}

const PHASE5_TOOL_NAMES = new Set(["list_devices", "get_device"]);

const catalogTools = toolCatalog.tools as PublicToolDefinition[];

export const PHASE5_TOOLS = catalogTools.filter((tool) =>
  PHASE5_TOOL_NAMES.has(tool.name),
);

if (
  PHASE5_TOOLS.length !== PHASE5_TOOL_NAMES.size ||
  PHASE5_TOOLS.some((tool) => tool.execution_plane !== "control-plane")
) {
  throw new Error("Phase 5 MCP tool catalog is inconsistent");
}

export const PHASE5_OAUTH_SCOPES = [
  ...new Set(
    PHASE5_TOOLS.flatMap((tool) =>
      tool.securitySchemes.flatMap((scheme) => scheme.scopes),
    ),
  ),
].sort();

function schemaNameFromRef(ref: string): string {
  const prefix = "public-tools.schema.json#/$defs/";
  if (!ref.startsWith(prefix)) {
    throw new Error(`unsupported tool schema ref: ${ref}`);
  }
  return ref.slice(prefix.length);
}

function schemaDefinition(name: string): JsonObject {
  const defs = publicToolSchema.$defs as unknown as Record<string, JsonObject>;
  const definition = defs[name];
  if (!definition) {
    throw new Error(`missing public tool schema definition: ${name}`);
  }
  return definition;
}

function dereference(value: unknown, stack: readonly string[] = []): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => dereference(item, stack));
  }
  if (!value || typeof value !== "object") {
    return value;
  }

  const object = value as JsonObject;
  const ref = object.$ref;
  if (typeof ref === "string" && ref.startsWith("#/$defs/")) {
    const name = ref.slice("#/$defs/".length);
    if (stack.includes(name)) {
      throw new Error(`cyclic public tool schema ref: ${name}`);
    }
    const resolved = dereference(schemaDefinition(name), [...stack, name]);
    if (!resolved || typeof resolved !== "object" || Array.isArray(resolved)) {
      return resolved;
    }
    const siblings = Object.fromEntries(
      Object.entries(object).filter(([key]) => key !== "$ref"),
    );
    return {
      ...(resolved as JsonObject),
      ...(dereference(siblings, stack) as JsonObject),
    };
  }

  return Object.fromEntries(
    Object.entries(object).map(([key, item]) => [
      key,
      dereference(item, stack),
    ]),
  );
}

export function publicSchema(ref: string): JsonObject {
  const name = schemaNameFromRef(ref);
  return dereference(schemaDefinition(name), [name]) as JsonObject;
}

export function phase5Tool(name: string): PublicToolDefinition {
  const tool = PHASE5_TOOLS.find((candidate) => candidate.name === name);
  if (!tool) {
    throw new Error(`tool is not enabled in Phase 5: ${name}`);
  }
  return tool;
}
