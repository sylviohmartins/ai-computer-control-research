import { describe, expect, it } from "vitest";

import fixture from "../../../specs/fixtures/auth/pairing-proof-ed25519-v1.json";
import {
  pairingProofMessage,
  publicKeyFingerprint,
  verifyPairingProof,
} from "../src/pairing-crypto";

describe("pairing proof cross-language contract", () => {
  it("matches the canonical fixture shared with the Rust agent", async () => {
    const canonical = pairingProofMessage({
      pairingId: fixture.pairing_id,
      deviceKeyId: fixture.device_key_id,
      deviceInstallationId: fixture.device_installation_id,
      challenge: fixture.challenge,
      audience: fixture.audience,
    });

    expect(canonical).toBe(fixture.canonical_message);
    expect(await publicKeyFingerprint(fixture.public_key)).toBe(
      fixture.fingerprint,
    );
    await expect(
      verifyPairingProof({
        publicKey: fixture.public_key,
        pairingId: fixture.pairing_id,
        deviceKeyId: fixture.device_key_id,
        deviceInstallationId: fixture.device_installation_id,
        challenge: fixture.challenge,
        signature: fixture.signature,
      }),
    ).resolves.toBe(true);
  });

  it("rejects a fixture signature when the audience-bound message changes", async () => {
    await expect(
      verifyPairingProof({
        publicKey: fixture.public_key,
        pairingId: fixture.pairing_id,
        deviceKeyId: fixture.device_key_id,
        deviceInstallationId: fixture.device_installation_id,
        challenge: fixture.challenge + "A",
        signature: fixture.signature,
      }),
    ).resolves.toBe(false);
  });
});
