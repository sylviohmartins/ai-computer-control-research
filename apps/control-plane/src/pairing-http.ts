import type { Env } from "./env";
import { failure, success } from "./http";
import {
  type CreatePairingInput,
  type DeviceProofInput,
  PairingError,
  PairingService,
} from "./pairing";

const MAX_PAIRING_BODY_BYTES = 16 * 1024;

function createService(env: Env): PairingService {
  if (!env.PAIRING_SERVER_SECRET || !env.PAIRING_VERIFICATION_URI) {
    throw new PairingError(
      "INTERNAL_ERROR",
      "pairing service is not configured",
      503,
    );
  }

  return new PairingService(
    env.DB,
    env.PAIRING_SERVER_SECRET,
    env.PAIRING_VERIFICATION_URI,
  );
}

async function readJsonObject(
  request: Request,
): Promise<Record<string, unknown>> {
  const declaredLength = request.headers.get("content-length");
  if (
    declaredLength &&
    Number.isFinite(Number(declaredLength)) &&
    Number(declaredLength) > MAX_PAIRING_BODY_BYTES
  ) {
    throw new PairingError(
      "INVALID_ARGUMENT",
      "pairing request body is too large",
      413,
    );
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_PAIRING_BODY_BYTES) {
    throw new PairingError(
      "INVALID_ARGUMENT",
      "pairing request body is too large",
      413,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new PairingError(
      "INVALID_ARGUMENT",
      "request body must contain valid JSON",
      400,
    );
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new PairingError(
      "INVALID_ARGUMENT",
      "request body must be a JSON object",
      400,
    );
  }

  return parsed as Record<string, unknown>;
}

function requiredString(input: Record<string, unknown>, name: string): string {
  const value = input[name];
  if (typeof value !== "string") {
    throw new PairingError("INVALID_ARGUMENT", `${name} must be a string`, 400);
  }
  return value;
}

function errorResponse(error: unknown): Response {
  if (error instanceof PairingError) {
    return failure(error.code, error.message, error.status);
  }

  return failure("INTERNAL_ERROR", "unexpected pairing failure", 500);
}

export async function pairingHttpRoute(
  request: Request,
  env: Env,
  url: URL,
): Promise<Response | null> {
  if (request.method === "POST" && url.pathname === "/api/v1/pairings") {
    try {
      const body = await readJsonObject(request);
      const input: CreatePairingInput = {
        device_key_id: requiredString(body, "device_key_id"),
        device_installation_id: requiredString(body, "device_installation_id"),
        algorithm: requiredString(body, "algorithm"),
        public_key: requiredString(body, "public_key"),
        fingerprint: requiredString(body, "fingerprint"),
        display_name: requiredString(body, "display_name"),
        os: requiredString(body, "os"),
        arch: requiredString(body, "arch"),
        agent_version: requiredString(body, "agent_version"),
      };

      return success(await createService(env).createPairing(input), 201);
    } catch (error) {
      return errorResponse(error);
    }
  }

  const match = /^\/api\/v1\/pairings\/([^/]+)$/u.exec(url.pathname);
  if (!match) {
    const proofMatch = /^\/api\/v1\/pairings\/([^/]+)\/proof$/u.exec(
      url.pathname,
    );
    if (!proofMatch || request.method !== "POST") {
      return null;
    }

    try {
      const body = await readJsonObject(request);
      const proof: DeviceProofInput = {
        device_key_id: requiredString(body, "device_key_id"),
        device_installation_id: requiredString(body, "device_installation_id"),
        signature: requiredString(body, "signature"),
      };
      return success(
        await createService(env).proveDevice(proofMatch[1]!, proof),
      );
    } catch (error) {
      return errorResponse(error);
    }
  }

  if (request.method !== "GET") {
    return null;
  }

  try {
    const deviceKeyId = request.headers.get("x-telechir-device-key-id");
    const installationId = request.headers.get(
      "x-telechir-device-installation-id",
    );
    if (!deviceKeyId || !installationId) {
      throw new PairingError(
        "UNAUTHORIZED",
        "device pairing identity headers are required",
        401,
      );
    }

    return success(
      await createService(env).getStatus(
        match[1]!,
        deviceKeyId,
        installationId,
      ),
    );
  } catch (error) {
    return errorResponse(error);
  }
}
