import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

import type { Env } from "../src/env";
import worker from "../src/index";
import { PairingService } from "../src/pairing";
import {
  pairingProofMessage,
  publicKeyFingerprint,
  toBase64Url,
} from "../src/pairing-crypto";

const bindings = env as unknown as Env;
const encoder = new TextEncoder();

async function makeIdentity() {
  const pair = (await crypto.subtle.generateKey({ name: "Ed25519" }, true, [
    "sign",
    "verify",
  ])) as CryptoKeyPair;
  const publicKey = toBase64Url(
    new Uint8Array(await crypto.subtle.exportKey("raw", pair.publicKey)),
  );

  return {
    pair,
    body: {
      device_key_id: crypto.randomUUID(),
      device_installation_id: crypto.randomUUID(),
      algorithm: "Ed25519",
      public_key: publicKey,
      fingerprint: await publicKeyFingerprint(publicKey),
      display_name: "HTTP paired device",
      os: "linux",
      arch: "x86_64",
      agent_version: "0.1.0",
    },
  };
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  return worker.fetch(
    new Request(`https://telechir.test${path}`, init),
    bindings,
  );
}

describe("pairing HTTP adapter", () => {
  it("drives device-side create/status/proof while user verification stays behind the auth boundary", async () => {
    const identity = await makeIdentity();
    const createResponse = await request("/api/v1/pairings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(identity.body),
    });
    const createBody = (await createResponse.json()) as {
      ok: boolean;
      data: {
        pairing_id: string;
        user_code: string;
        verification_uri: string;
      };
    };

    expect(createResponse.status).toBe(201);
    expect(createBody.ok).toBe(true);
    expect(createBody.data.verification_uri).toBe(
      bindings.PAIRING_VERIFICATION_URI,
    );

    const missingHeaders = await request(
      `/api/v1/pairings/${createBody.data.pairing_id}`,
    );
    expect(missingHeaders.status).toBe(401);

    const userId = crypto.randomUUID();
    await bindings.DB.prepare(
      `INSERT INTO users (
         id, identity_provider, provider_subject_hash, display_name,
         created_at, disabled_at
       ) VALUES (?, 'phase3-http-test', ?, 'HTTP User', ?, NULL)`,
    )
      .bind(userId, `subject-${userId}`, new Date().toISOString())
      .run();

    const domain = new PairingService(
      bindings.DB,
      bindings.PAIRING_SERVER_SECRET!,
      bindings.PAIRING_VERIFICATION_URI!,
    );
    await domain.verifyUser(
      createBody.data.pairing_id,
      userId,
      createBody.data.user_code,
    );

    const statusResponse = await request(
      `/api/v1/pairings/${createBody.data.pairing_id}`,
      {
        headers: {
          "x-telechir-device-key-id": identity.body.device_key_id,
          "x-telechir-device-installation-id":
            identity.body.device_installation_id,
        },
      },
    );
    const statusBody = (await statusResponse.json()) as {
      data: { state: string; challenge: string };
    };
    expect(statusResponse.status).toBe(200);
    expect(statusBody.data.state).toBe("USER_VERIFIED");

    const canonical = pairingProofMessage({
      pairingId: createBody.data.pairing_id,
      deviceKeyId: identity.body.device_key_id,
      deviceInstallationId: identity.body.device_installation_id,
      challenge: statusBody.data.challenge,
    });
    const signature = toBase64Url(
      new Uint8Array(
        await crypto.subtle.sign(
          { name: "Ed25519" },
          identity.pair.privateKey,
          encoder.encode(canonical),
        ),
      ),
    );

    const proofResponse = await request(
      `/api/v1/pairings/${createBody.data.pairing_id}/proof`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          device_key_id: identity.body.device_key_id,
          device_installation_id: identity.body.device_installation_id,
          signature,
        }),
      },
    );
    const proofBody = (await proofResponse.json()) as {
      data: { state: string; device_id: string };
    };

    expect(proofResponse.status).toBe(200);
    expect(proofBody.data.state).toBe("ACTIVE");
    expect(proofBody.data.device_id).toMatch(/^[0-9a-f]{8}-[0-9a-f-]{27}$/iu);
  });

  it("rejects oversized pairing payloads before JSON parsing", async () => {
    const response = await request("/api/v1/pairings", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "content-length": String(20 * 1024),
      },
      body: "{}",
    });

    expect(response.status).toBe(413);
  });
});
