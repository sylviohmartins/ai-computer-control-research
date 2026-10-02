import { env } from "cloudflare:workers";
import { beforeEach, describe, expect, it } from "vitest";

import type { Env } from "../src/env";
import {
  MAX_ACTIVE_PAIRINGS_PER_INSTALLATION,
  MAX_PROOF_ATTEMPTS,
  MAX_VERIFICATION_ATTEMPTS,
  PairingService,
  type CreatePairingInput,
} from "../src/pairing";
import {
  pairingProofMessage,
  publicKeyFingerprint,
  toBase64Url,
} from "../src/pairing-crypto";

const bindings = env as unknown as Env;
const encoder = new TextEncoder();

interface TestIdentity {
  input: CreatePairingInput;
  privateKey: CryptoKey;
}

let now: Date;
let service: PairingService;

async function seedUser(userId = crypto.randomUUID()): Promise<string> {
  await bindings.DB.prepare(
    `INSERT INTO users (
       id, identity_provider, provider_subject_hash, display_name,
       created_at, disabled_at
     ) VALUES (?, 'phase3-test', ?, 'Test User', ?, NULL)`,
  )
    .bind(userId, `subject-${userId}`, now.toISOString())
    .run();
  return userId;
}

async function createIdentity(
  overrides: Partial<CreatePairingInput> = {},
): Promise<TestIdentity> {
  const pair = (await crypto.subtle.generateKey({ name: "Ed25519" }, true, [
    "sign",
    "verify",
  ])) as CryptoKeyPair;
  const publicBytes = new Uint8Array(
    await crypto.subtle.exportKey("raw", pair.publicKey),
  );
  const publicKey = toBase64Url(publicBytes);

  return {
    privateKey: pair.privateKey,
    input: {
      device_key_id: crypto.randomUUID(),
      device_installation_id: crypto.randomUUID(),
      algorithm: "Ed25519",
      public_key: publicKey,
      fingerprint: await publicKeyFingerprint(publicKey),
      display_name: "Phase 3 test device",
      os: "linux",
      arch: "x86_64",
      agent_version: "0.1.0",
      ...overrides,
    },
  };
}

async function signProof(
  privateKey: CryptoKey,
  input: {
    pairingId: string;
    deviceKeyId: string;
    deviceInstallationId: string;
    challenge: string;
  },
): Promise<string> {
  const signature = await crypto.subtle.sign(
    { name: "Ed25519" },
    privateKey,
    encoder.encode(
      pairingProofMessage({
        pairingId: input.pairingId,
        deviceKeyId: input.deviceKeyId,
        deviceInstallationId: input.deviceInstallationId,
        challenge: input.challenge,
      }),
    ),
  );
  return toBase64Url(new Uint8Array(signature));
}

async function activate(
  identity: TestIdentity,
  userId: string,
): Promise<{ pairingId: string; deviceId: string; userCode: string }> {
  const created = await service.createPairing(identity.input);
  await service.verifyUser(created.pairing_id, userId, created.user_code);
  const status = await service.getStatus(
    created.pairing_id,
    identity.input.device_key_id,
    identity.input.device_installation_id,
  );
  expect(status.state).toBe("USER_VERIFIED");
  expect(status.challenge).toBeTypeOf("string");

  const signature = await signProof(identity.privateKey, {
    pairingId: created.pairing_id,
    deviceKeyId: identity.input.device_key_id,
    deviceInstallationId: identity.input.device_installation_id,
    challenge: status.challenge!,
  });
  const activated = await service.proveDevice(created.pairing_id, {
    device_key_id: identity.input.device_key_id,
    device_installation_id: identity.input.device_installation_id,
    signature,
  });

  return {
    pairingId: created.pairing_id,
    deviceId: activated.device_id,
    userCode: created.user_code,
  };
}

beforeEach(() => {
  now = new Date("2026-10-02T18:00:00.000Z");
  service = new PairingService(
    bindings.DB,
    bindings.PAIRING_SERVER_SECRET!,
    bindings.PAIRING_VERIFICATION_URI!,
    () => new Date(now),
  );
});

describe("pairing and device identity", () => {
  it("activates only after user verification and valid Ed25519 proof", async () => {
    const userId = await seedUser();
    const identity = await createIdentity();
    const created = await service.createPairing(identity.input);

    const storedBeforeVerification = await bindings.DB.prepare(
      `SELECT state, user_code_digest, challenge_digest
       FROM pairings WHERE id = ?`,
    )
      .bind(created.pairing_id)
      .first<{
        state: string;
        user_code_digest: string;
        challenge_digest: string;
      }>();

    expect(storedBeforeVerification?.state).toBe("CREATED");
    expect(storedBeforeVerification?.user_code_digest).not.toContain(
      created.user_code.replaceAll("-", ""),
    );
    expect(storedBeforeVerification?.challenge_digest.length).toBeGreaterThan(
      20,
    );

    await expect(
      service.proveDevice(created.pairing_id, {
        device_key_id: identity.input.device_key_id,
        device_installation_id: identity.input.device_installation_id,
        signature: "invalid",
      }),
    ).rejects.toMatchObject({ code: "CONFLICT" });

    await service.verifyUser(created.pairing_id, userId, created.user_code);
    const status = await service.getStatus(
      created.pairing_id,
      identity.input.device_key_id,
      identity.input.device_installation_id,
    );
    const signature = await signProof(identity.privateKey, {
      pairingId: created.pairing_id,
      deviceKeyId: identity.input.device_key_id,
      deviceInstallationId: identity.input.device_installation_id,
      challenge: status.challenge!,
    });

    const activated = await service.proveDevice(created.pairing_id, {
      device_key_id: identity.input.device_key_id,
      device_installation_id: identity.input.device_installation_id,
      signature,
    });

    expect(activated.state).toBe("ACTIVE");
    const device = await bindings.DB.prepare(
      "SELECT user_id, revoked_at FROM devices WHERE id = ?",
    )
      .bind(activated.device_id)
      .first<{ user_id: string; revoked_at: string | null }>();
    expect(device).toEqual({ user_id: userId, revoked_at: null });

    const key = await bindings.DB.prepare(
      `SELECT public_key, algorithm, fingerprint, revoked_at
       FROM device_keys WHERE id = ?`,
    )
      .bind(identity.input.device_key_id)
      .first<Record<string, unknown>>();
    expect(key).toMatchObject({
      public_key: identity.input.public_key,
      algorithm: "Ed25519",
      fingerprint: identity.input.fingerprint,
      revoked_at: null,
    });

    const pairing = await bindings.DB.prepare(
      "SELECT state, challenge_used_at FROM pairings WHERE id = ?",
    )
      .bind(created.pairing_id)
      .first<{ state: string; challenge_used_at: string | null }>();
    expect(pairing?.state).toBe("ACTIVE");
    expect(pairing?.challenge_used_at).not.toBeNull();
  });

  it("consumes the user code after the first successful verification", async () => {
    const userId = await seedUser();
    const identity = await createIdentity();
    const created = await service.createPairing(identity.input);

    await service.verifyUser(created.pairing_id, userId, created.user_code);

    await expect(
      service.verifyUser(created.pairing_id, userId, created.user_code),
    ).rejects.toMatchObject({ code: "CONFLICT" });
  });

  it("makes activation replay idempotent without duplicating the device", async () => {
    const userId = await seedUser();
    const identity = await createIdentity();
    const created = await service.createPairing(identity.input);
    await service.verifyUser(created.pairing_id, userId, created.user_code);
    const status = await service.getStatus(
      created.pairing_id,
      identity.input.device_key_id,
      identity.input.device_installation_id,
    );
    const signature = await signProof(identity.privateKey, {
      pairingId: created.pairing_id,
      deviceKeyId: identity.input.device_key_id,
      deviceInstallationId: identity.input.device_installation_id,
      challenge: status.challenge!,
    });
    const proof = {
      device_key_id: identity.input.device_key_id,
      device_installation_id: identity.input.device_installation_id,
      signature,
    };

    const first = await service.proveDevice(created.pairing_id, proof);
    const replay = await service.proveDevice(created.pairing_id, proof);

    expect(replay.device_id).toBe(first.device_id);
    const count = await bindings.DB.prepare(
      "SELECT COUNT(*) AS count FROM devices WHERE id = ?",
    )
      .bind(first.device_id)
      .first<{ count: number }>();
    expect(count?.count).toBe(1);
  });

  it("rejects proof made by a swapped private key after user verification", async () => {
    const userId = await seedUser();
    const expectedIdentity = await createIdentity();
    const attackerIdentity = await createIdentity();
    const created = await service.createPairing(expectedIdentity.input);
    await service.verifyUser(created.pairing_id, userId, created.user_code);
    const status = await service.getStatus(
      created.pairing_id,
      expectedIdentity.input.device_key_id,
      expectedIdentity.input.device_installation_id,
    );

    const forgedSignature = await signProof(attackerIdentity.privateKey, {
      pairingId: created.pairing_id,
      deviceKeyId: expectedIdentity.input.device_key_id,
      deviceInstallationId: expectedIdentity.input.device_installation_id,
      challenge: status.challenge!,
    });

    await expect(
      service.proveDevice(created.pairing_id, {
        device_key_id: expectedIdentity.input.device_key_id,
        device_installation_id: expectedIdentity.input.device_installation_id,
        signature: forgedSignature,
      }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("expires a pairing after the ten-minute baseline", async () => {
    const identity = await createIdentity();
    const created = await service.createPairing(identity.input);

    now = new Date(now.getTime() + 10 * 60 * 1000 + 1);
    const status = await service.getStatus(
      created.pairing_id,
      identity.input.device_key_id,
      identity.input.device_installation_id,
    );

    expect(status.state).toBe("EXPIRED");
    await expect(
      service.verifyUser(
        created.pairing_id,
        await seedUser(),
        created.user_code,
      ),
    ).rejects.toMatchObject({ code: "TIMEOUT" });
  });

  it("locks an invalid user code after the configured attempt limit", async () => {
    const userId = await seedUser();
    const identity = await createIdentity();
    const created = await service.createPairing(identity.input);

    for (let attempt = 1; attempt <= MAX_VERIFICATION_ATTEMPTS; attempt++) {
      const expectation = expect(
        service.verifyUser(created.pairing_id, userId, "AAAA-AAAA"),
      ).rejects;
      if (attempt === MAX_VERIFICATION_ATTEMPTS) {
        await expectation.toMatchObject({ code: "RATE_LIMITED" });
      } else {
        await expectation.toMatchObject({ code: "UNAUTHORIZED" });
      }
    }

    const row = await bindings.DB.prepare(
      "SELECT state, verification_attempts FROM pairings WHERE id = ?",
    )
      .bind(created.pairing_id)
      .first<{ state: string; verification_attempts: number }>();
    expect(row).toEqual({
      state: "EXPIRED",
      verification_attempts: MAX_VERIFICATION_ATTEMPTS,
    });
  });

  it("locks invalid cryptographic proofs after the configured attempt limit", async () => {
    const userId = await seedUser();
    const identity = await createIdentity();
    const created = await service.createPairing(identity.input);
    await service.verifyUser(created.pairing_id, userId, created.user_code);

    for (let attempt = 1; attempt <= MAX_PROOF_ATTEMPTS; attempt++) {
      const expectation = expect(
        service.proveDevice(created.pairing_id, {
          device_key_id: identity.input.device_key_id,
          device_installation_id: identity.input.device_installation_id,
          signature: toBase64Url(new Uint8Array(64)),
        }),
      ).rejects;
      if (attempt === MAX_PROOF_ATTEMPTS) {
        await expectation.toMatchObject({ code: "RATE_LIMITED" });
      } else {
        await expectation.toMatchObject({ code: "UNAUTHORIZED" });
      }
    }
  });

  it("revokes the active key and refuses future connection identity", async () => {
    const userId = await seedUser();
    const identity = await createIdentity();
    const activated = await activate(identity, userId);

    await expect(
      service.assertDeviceConnectable(
        activated.deviceId,
        identity.input.device_key_id,
      ),
    ).resolves.toMatchObject({
      device_id: activated.deviceId,
      device_key_id: identity.input.device_key_id,
    });

    await service.revokeDevice(userId, activated.deviceId);

    await expect(
      service.assertDeviceConnectable(
        activated.deviceId,
        identity.input.device_key_id,
      ),
    ).rejects.toMatchObject({ code: "DEVICE_REVOKED" });

    const pairing = await bindings.DB.prepare(
      "SELECT state FROM pairings WHERE id = ?",
    )
      .bind(activated.pairingId)
      .first<{ state: string }>();
    expect(pairing?.state).toBe("REVOKED");
  });

  it("rate-limits repeated pairing creation for one installation", async () => {
    const installationId = crypto.randomUUID();

    for (let index = 0; index < MAX_ACTIVE_PAIRINGS_PER_INSTALLATION; index++) {
      const identity = await createIdentity({
        device_installation_id: installationId,
      });
      await service.createPairing(identity.input);
    }

    const blocked = await createIdentity({
      device_installation_id: installationId,
    });
    await expect(service.createPairing(blocked.input)).rejects.toMatchObject({
      code: "RATE_LIMITED",
    });
  });

  it("rejects public-key fingerprint substitution", async () => {
    const identity = await createIdentity({
      fingerprint: toBase64Url(new Uint8Array(32)),
    });

    await expect(service.createPairing(identity.input)).rejects.toMatchObject({
      code: "INVALID_ARGUMENT",
    });
  });
});
