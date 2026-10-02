import type { Env } from "./env";
import { PairingService } from "./pairing";
import {
  CONNECTION_REQUEST_MAX_SKEW_MS,
  issueConnectionCredential,
  verifyConnectionCredential,
  verifyConnectionRequestProof,
  type ConnectionCredentialClaims,
} from "./realtime-crypto";

export interface ConnectionCredentialRequest {
  device_key_id: string;
  connection_nonce: string;
  requested_at: string;
  signature: string;
}

export interface ConnectionCredentialResult {
  credential: string;
  expires_at: string;
  websocket_path: string;
}

interface ActiveDeviceKey {
  device_id: string;
  device_key_id: string;
  public_key: string;
  revoked_at: string | null;
  key_revoked_at: string | null;
}

type Clock = () => Date;

export class RealtimeError extends Error {
  constructor(
    public readonly code:
      | "INVALID_ARGUMENT"
      | "UNAUTHENTICATED"
      | "UNAUTHORIZED"
      | "DEVICE_REVOKED"
      | "NOT_FOUND"
      | "CONFLICT"
      | "INTERNAL_ERROR",
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "RealtimeError";
  }
}

export async function revokeDeviceAndCloseRealtime(
  env: Env,
  userId: string,
  deviceId: string,
): Promise<{ device_id: string; revoked_at: string }> {
  if (
    !env.PAIRING_SERVER_SECRET ||
    !env.PAIRING_VERIFICATION_URI ||
    !env.REALTIME_SERVER_SECRET
  ) {
    throw new RealtimeError(
      "INTERNAL_ERROR",
      "revocation orchestration is not configured",
      503,
    );
  }

  const pairing = new PairingService(
    env.DB,
    env.PAIRING_SERVER_SECRET,
    env.PAIRING_VERIFICATION_URI,
  );
  const revoked = await pairing.revokeDevice(userId, deviceId);
  const realtime = new RealtimeService(env.DB, env.REALTIME_SERVER_SECRET);
  await realtime.closeRevokedConnection(env.DEVICE_COORDINATOR, deviceId);
  return revoked;
}

export class RealtimeService {
  constructor(
    private readonly db: D1Database,
    private readonly serverSecret: string,
    private readonly clock: Clock = () => new Date(),
  ) {
    if (new TextEncoder().encode(serverSecret).byteLength < 32) {
      throw new RealtimeError(
        "INTERNAL_ERROR",
        "realtime server secret must contain at least 32 bytes",
        500,
      );
    }
  }

  async issueCredential(
    deviceId: string,
    input: ConnectionCredentialRequest,
  ): Promise<ConnectionCredentialResult> {
    if (
      input.connection_nonce.length < 16 ||
      input.connection_nonce.length > 128 ||
      input.connection_nonce.includes("\n") ||
      input.connection_nonce.includes("\r")
    ) {
      throw new RealtimeError(
        "INVALID_ARGUMENT",
        "connection_nonce must contain between 16 and 128 safe characters",
        400,
      );
    }

    const requestedAtMs = Date.parse(input.requested_at);
    const now = this.clock();
    if (
      !Number.isFinite(requestedAtMs) ||
      Math.abs(now.getTime() - requestedAtMs) > CONNECTION_REQUEST_MAX_SKEW_MS
    ) {
      throw new RealtimeError(
        "UNAUTHENTICATED",
        "connection credential request timestamp is outside the allowed skew",
        401,
      );
    }

    const identity = await this.getActiveDeviceKey(
      deviceId,
      input.device_key_id,
    );
    const proofValid = await verifyConnectionRequestProof({
      publicKey: identity.public_key,
      deviceId,
      deviceKeyId: input.device_key_id,
      connectionNonce: input.connection_nonce,
      requestedAt: input.requested_at,
      signature: input.signature,
    });
    if (!proofValid) {
      throw new RealtimeError(
        "UNAUTHENTICATED",
        "connection credential proof is invalid",
        401,
      );
    }

    const issued = await issueConnectionCredential(this.serverSecret, {
      deviceId,
      deviceKeyId: input.device_key_id,
      connectionNonce: input.connection_nonce,
      now,
    });

    return {
      credential: issued.credential,
      expires_at: issued.claims.expires_at,
      websocket_path: `/api/v1/devices/${deviceId}/realtime`,
    };
  }
  async authenticateCredential(
    deviceId: string,
    credential: string,
  ): Promise<ConnectionCredentialClaims> {
    const claims = await verifyConnectionCredential(
      this.serverSecret,
      credential,
      this.clock(),
    );
    if (!claims || claims.device_id !== deviceId) {
      throw new RealtimeError(
        "UNAUTHENTICATED",
        "connection credential is invalid or expired",
        401,
      );
    }

    await this.getActiveDeviceKey(deviceId, claims.device_key_id);
    return claims;
  }

  async closeRevokedConnection(
    namespace: DurableObjectNamespace,
    deviceId: string,
  ): Promise<void> {
    const id = namespace.idFromName(deviceId);
    const stub = namespace.get(id);
    const response = await stub.fetch(
      "https://device-coordinator/internal/revoke",
      {
        method: "POST",
        headers: {
          "x-telechir-device-id": deviceId,
        },
      },
    );
    if (!response.ok) {
      throw new RealtimeError(
        "INTERNAL_ERROR",
        "device coordinator failed to close revoked connection",
        500,
      );
    }
  }

  private async getActiveDeviceKey(
    deviceId: string,
    deviceKeyId: string,
  ): Promise<ActiveDeviceKey> {
    const row = await this.db
      .prepare(
        `SELECT
           d.id AS device_id,
           k.id AS device_key_id,
           k.public_key,
           d.revoked_at,
           k.revoked_at AS key_revoked_at
         FROM devices d
         JOIN device_keys k ON k.device_id = d.id
         WHERE d.id = ? AND k.id = ?`,
      )
      .bind(deviceId, deviceKeyId)
      .first<ActiveDeviceKey>();

    if (!row) {
      throw new RealtimeError(
        "UNAUTHORIZED",
        "device identity is not active",
        403,
      );
    }
    if (row.revoked_at || row.key_revoked_at) {
      throw new RealtimeError(
        "DEVICE_REVOKED",
        "device identity is revoked",
        403,
      );
    }
    return row;
  }
}
