import type { Env } from "./env";
import { failure, success } from "./http";
import {
  RealtimeError,
  RealtimeService,
  type ConnectionCredentialRequest,
} from "./realtime";

const MAX_BODY_BYTES = 8 * 1024;

function service(env: Env): RealtimeService {
  if (!env.REALTIME_SERVER_SECRET) {
    throw new RealtimeError(
      "INTERNAL_ERROR",
      "realtime service is not configured",
      503,
    );
  }
  return new RealtimeService(env.DB, env.REALTIME_SERVER_SECRET);
}

async function body(request: Request): Promise<Record<string, unknown>> {
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    throw new RealtimeError(
      "INVALID_ARGUMENT",
      "realtime request body is too large",
      413,
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new RealtimeError(
      "INVALID_ARGUMENT",
      "request body must contain valid JSON",
      400,
    );
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new RealtimeError(
      "INVALID_ARGUMENT",
      "request body must be a JSON object",
      400,
    );
  }
  return parsed as Record<string, unknown>;
}

function stringField(value: Record<string, unknown>, name: string): string {
  const field = value[name];
  if (typeof field !== "string") {
    throw new RealtimeError(
      "INVALID_ARGUMENT",
      `${name} must be a string`,
      400,
    );
  }
  return field;
}

function errorResponse(error: unknown): Response {
  if (error instanceof RealtimeError) {
    return failure(error.code, error.message, error.status);
  }
  return failure("INTERNAL_ERROR", "unexpected realtime failure", 500);
}

export async function realtimeHttpRoute(
  request: Request,
  env: Env,
  url: URL,
): Promise<Response | null> {
  const credentialMatch =
    /^\/api\/v1\/devices\/([^/]+)\/connection-credential$/u.exec(url.pathname);
  if (credentialMatch && request.method === "POST") {
    try {
      const parsed = await body(request);
      const input: ConnectionCredentialRequest = {
        device_key_id: stringField(parsed, "device_key_id"),
        connection_nonce: stringField(parsed, "connection_nonce"),
        requested_at: stringField(parsed, "requested_at"),
        signature: stringField(parsed, "signature"),
      };
      return success(
        await service(env).issueCredential(
          decodeURIComponent(credentialMatch[1]!),
          input,
        ),
        201,
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  const realtimeMatch = /^\/api\/v1\/devices\/([^/]+)\/realtime$/u.exec(
    url.pathname,
  );
  if (!realtimeMatch || request.method !== "GET") {
    return null;
  }

  try {
    if (request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      throw new RealtimeError(
        "INVALID_ARGUMENT",
        "WebSocket upgrade is required",
        426,
      );
    }

    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ")) {
      throw new RealtimeError(
        "UNAUTHENTICATED",
        "Bearer connection credential is required",
        401,
      );
    }

    const deviceId = decodeURIComponent(realtimeMatch[1]!);
    const claims = await service(env).authenticateCredential(
      deviceId,
      authorization.slice("Bearer ".length),
    );

    const coordinatorId = env.DEVICE_COORDINATOR.idFromName(deviceId);
    const coordinator = env.DEVICE_COORDINATOR.get(coordinatorId);
    return coordinator.fetch("https://device-coordinator/connect", {
      method: "GET",
      headers: {
        Upgrade: "websocket",
        "x-telechir-device-id": claims.device_id,
        "x-telechir-device-key-id": claims.device_key_id,
        "x-telechir-connection-nonce": claims.connection_nonce,
        "x-telechir-credential-jti": claims.jti,
        "x-telechir-credential-expires-at": claims.expires_at,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
