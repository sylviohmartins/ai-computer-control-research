import { describe, expect, it } from "vitest";

import fixture from "../../../specs/fixtures/auth/connection-credential-ed25519-v1.json";
import {
  connectionCredentialProofMessage,
  issueConnectionCredential,
  verifyConnectionCredential,
  verifyConnectionRequestProof,
} from "../src/realtime-crypto";

describe("connection credential cross-language contract", () => {
  it("matches the canonical fixture shared with the Rust agent", async () => {
    const canonical = connectionCredentialProofMessage({
      deviceId: fixture.device_id,
      deviceKeyId: fixture.device_key_id,
      connectionNonce: fixture.connection_nonce,
      requestedAt: fixture.requested_at,
      audience: fixture.audience,
    });

    expect(canonical).toBe(fixture.canonical_message);
    await expect(
      verifyConnectionRequestProof({
        publicKey: fixture.public_key,
        deviceId: fixture.device_id,
        deviceKeyId: fixture.device_key_id,
        connectionNonce: fixture.connection_nonce,
        requestedAt: fixture.requested_at,
        signature: fixture.signature,
      }),
    ).resolves.toBe(true);
  });

  it("rejects the signature when the nonce changes", async () => {
    await expect(
      verifyConnectionRequestProof({
        publicKey: fixture.public_key,
        deviceId: fixture.device_id,
        deviceKeyId: fixture.device_key_id,
        connectionNonce: fixture.connection_nonce + "x",
        requestedAt: fixture.requested_at,
        signature: fixture.signature,
      }),
    ).resolves.toBe(false);
  });

  it("expires a connection credential after sixty seconds", async () => {
    const secret = "contract-secret-0123456789-abcdefghijklmnopqrstuvwxyz";
    const now = new Date("2026-10-02T18:45:00Z");
    const issued = await issueConnectionCredential(secret, {
      deviceId: fixture.device_id,
      deviceKeyId: fixture.device_key_id,
      connectionNonce: fixture.connection_nonce,
      now,
    });

    await expect(
      verifyConnectionCredential(
        secret,
        issued.credential,
        new Date(now.getTime() + 59_999),
      ),
    ).resolves.not.toBeNull();
    await expect(
      verifyConnectionCredential(
        secret,
        issued.credential,
        new Date(now.getTime() + 60_000),
      ),
    ).resolves.toBeNull();
  });
});
