import {
  DEVICE_KEY_ALGORITHM,
  challengeDigest,
  derivePairingChallenge,
  generateUserCode,
  importEd25519PublicKey,
  publicKeyFingerprint,
  userCodeDigest,
  verifyPairingProof,
  verifyUserCodeDigest,
} from "./pairing-crypto";

export const PAIRING_TTL_MS = 10 * 60 * 1000;
export const MAX_VERIFICATION_ATTEMPTS = 5;
export const MAX_PROOF_ATTEMPTS = 5;
export const MAX_ACTIVE_PAIRINGS_PER_INSTALLATION = 3;

export type PairingState =
  | "CREATED"
  | "USER_VERIFIED"
  | "DEVICE_PROVED_KEY"
  | "ACTIVE"
  | "EXPIRED"
  | "REVOKED";

export interface CreatePairingInput {
  device_key_id: string;
  device_installation_id: string;
  algorithm: string;
  public_key: string;
  fingerprint: string;
  display_name: string;
  os: string;
  arch: string;
  agent_version: string;
}

export interface CreatePairingResult {
  pairing_id: string;
  user_code: string;
  verification_uri: string;
  expires_at: string;
  fingerprint: string;
}

export interface PairingStatusResult {
  pairing_id: string;
  state: PairingState;
  expires_at: string;
  fingerprint: string;
  challenge?: string;
  device_id?: string;
}

export interface DeviceProofInput {
  device_key_id: string;
  device_installation_id: string;
  signature: string;
}

export interface ActivationResult {
  pairing_id: string;
  state: "ACTIVE";
  device_id: string;
}

export interface DeviceConnectionIdentity {
  device_id: string;
  device_key_id: string;
  public_key: string;
  algorithm: string;
  fingerprint: string;
}

interface PairingRow {
  id: string;
  user_id: string | null;
  device_key_id: string;
  state: PairingState;
  public_key: string;
  algorithm: string;
  fingerprint: string;
  device_installation_id: string;
  display_name: string;
  os: string;
  arch: string;
  agent_version: string;
  user_code_digest: string;
  challenge_digest: string;
  challenge_used_at: string | null;
  verification_attempts: number;
  proof_attempts: number;
  expires_at: string;
  verified_at: string | null;
  proved_at: string | null;
  activated_at: string | null;
  activated_device_id: string | null;
  created_at: string;
}

type Clock = () => Date;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;
export class PairingError extends Error {
  constructor(
    public readonly code:
      | "INVALID_ARGUMENT"
      | "NOT_FOUND"
      | "UNAUTHORIZED"
      | "CONFLICT"
      | "RATE_LIMITED"
      | "DEVICE_REVOKED"
      | "TIMEOUT"
      | "INTERNAL_ERROR",
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "PairingError";
  }
}

export class PairingService {
  constructor(
    private readonly db: D1Database,
    private readonly serverSecret: string,
    private readonly verificationUri: string,
    private readonly clock: Clock = () => new Date(),
  ) {
    if (new TextEncoder().encode(serverSecret).byteLength < 32) {
      throw new PairingError(
        "INTERNAL_ERROR",
        "pairing server secret must contain at least 32 bytes",
        500,
      );
    }

    let uri: URL;
    try {
      uri = new URL(verificationUri);
    } catch {
      throw new PairingError(
        "INTERNAL_ERROR",
        "pairing verification URI is invalid",
        500,
      );
    }
    if (uri.protocol !== "https:") {
      throw new PairingError(
        "INTERNAL_ERROR",
        "pairing verification URI must use HTTPS",
        500,
      );
    }
  }

  async createPairing(input: CreatePairingInput): Promise<CreatePairingResult> {
    await this.validateCreateInput(input);

    const now = this.clock();
    const nowIso = now.toISOString();
    const windowStart = new Date(now.getTime() - PAIRING_TTL_MS).toISOString();
    const activeCount = await this.db
      .prepare(
        `SELECT COUNT(*) AS count
         FROM pairings
         WHERE device_installation_id = ?
           AND state IN ('CREATED', 'USER_VERIFIED', 'DEVICE_PROVED_KEY')
           AND created_at >= ?
           AND expires_at > ?`,
      )
      .bind(input.device_installation_id, windowStart, nowIso)
      .first<{ count: number }>();

    if ((activeCount?.count ?? 0) >= MAX_ACTIVE_PAIRINGS_PER_INSTALLATION) {
      throw new PairingError(
        "RATE_LIMITED",
        "too many active pairing attempts for this installation",
        429,
      );
    }

    const existingKey = await this.db
      .prepare(
        `SELECT d.revoked_at
         FROM device_keys k
         JOIN devices d ON d.id = k.device_id
         WHERE k.id = ?`,
      )
      .bind(input.device_key_id)
      .first<{ revoked_at: string | null }>();

    if (existingKey) {
      throw new PairingError(
        existingKey.revoked_at ? "DEVICE_REVOKED" : "CONFLICT",
        existingKey.revoked_at
          ? "revoked device key cannot be paired again"
          : "device key is already active",
        existingKey.revoked_at ? 403 : 409,
      );
    }

    const pairingId = crypto.randomUUID();
    const userCode = generateUserCode();
    const challenge = await derivePairingChallenge(
      this.serverSecret,
      pairingId,
    );
    const expiresAt = new Date(now.getTime() + PAIRING_TTL_MS).toISOString();
    const codeDigest = await userCodeDigest(
      this.serverSecret,
      pairingId,
      userCode,
    );
    const storedChallengeDigest = await challengeDigest(pairingId, challenge);

    await this.db
      .prepare(
        `INSERT INTO pairings (
          id, user_id, device_key_id, state, public_key, algorithm,
          fingerprint, device_installation_id, display_name, os, arch,
          agent_version, user_code_digest, challenge_digest,
          challenge_used_at, verification_attempts, proof_attempts,
          expires_at, verified_at, proved_at, activated_at,
          activated_device_id, created_at
        ) VALUES (
          ?, NULL, ?, 'CREATED', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL,
          0, 0, ?, NULL, NULL, NULL, NULL, ?
        )`,
      )
      .bind(
        pairingId,
        input.device_key_id,
        input.public_key,
        input.algorithm,
        input.fingerprint,
        input.device_installation_id,
        input.display_name,
        input.os,
        input.arch,
        input.agent_version,
        codeDigest,
        storedChallengeDigest,
        expiresAt,
        nowIso,
      )
      .run();

    return {
      pairing_id: pairingId,
      user_code: userCode,
      verification_uri: this.verificationUri,
      expires_at: expiresAt,
      fingerprint: input.fingerprint,
    };
  }
  async getStatus(
    pairingId: string,
    deviceKeyId: string,
    deviceInstallationId: string,
  ): Promise<PairingStatusResult> {
    let row = await this.getPairing(pairingId);
    this.assertDeviceBinding(row, deviceKeyId, deviceInstallationId);
    row = await this.expireIfNeeded(row);

    const result: PairingStatusResult = {
      pairing_id: row.id,
      state: row.state,
      expires_at: row.expires_at,
      fingerprint: row.fingerprint,
    };

    if (row.state === "USER_VERIFIED" || row.state === "DEVICE_PROVED_KEY") {
      result.challenge = await this.checkedChallenge(row);
    }
    if (row.state === "ACTIVE" && row.activated_device_id) {
      result.device_id = row.activated_device_id;
    }

    return result;
  }

  async verifyUser(
    pairingId: string,
    userId: string,
    userCode: string,
  ): Promise<{ pairing_id: string; state: "USER_VERIFIED" }> {
    let row = await this.getPairing(pairingId);
    row = await this.expireIfNeeded(row);

    if (row.state !== "CREATED") {
      throw this.stateError(
        row.state,
        "pairing code has already been consumed",
      );
    }

    const user = await this.db
      .prepare("SELECT id FROM users WHERE id = ? AND disabled_at IS NULL")
      .bind(userId)
      .first<{ id: string }>();
    if (!user) {
      throw new PairingError("UNAUTHORIZED", "user is not eligible", 403);
    }

    const validCode = await verifyUserCodeDigest(
      this.serverSecret,
      row.id,
      userCode,
      row.user_code_digest,
    );
    const attempts = row.verification_attempts + 1;

    if (!validCode) {
      const exhausted = attempts >= MAX_VERIFICATION_ATTEMPTS;
      await this.db
        .prepare(
          `UPDATE pairings
           SET verification_attempts = ?,
               state = CASE WHEN ? THEN 'EXPIRED' ELSE state END
           WHERE id = ? AND state = 'CREATED'`,
        )
        .bind(attempts, exhausted ? 1 : 0, row.id)
        .run();

      throw new PairingError(
        exhausted ? "RATE_LIMITED" : "UNAUTHORIZED",
        exhausted
          ? "pairing verification attempt limit reached"
          : "pairing code is invalid",
        exhausted ? 429 : 403,
      );
    }

    const nowIso = this.clock().toISOString();
    const update = await this.db
      .prepare(
        `UPDATE pairings
         SET state = 'USER_VERIFIED',
             user_id = ?,
             verified_at = ?,
             verification_attempts = ?
         WHERE id = ? AND state = 'CREATED' AND expires_at > ?`,
      )
      .bind(userId, nowIso, attempts, row.id, nowIso)
      .run();

    if ((update.meta.changes ?? 0) !== 1) {
      row = await this.expireIfNeeded(await this.getPairing(pairingId));
      throw this.stateError(row.state, "pairing could not be verified");
    }

    return { pairing_id: pairingId, state: "USER_VERIFIED" };
  }
  async proveDevice(
    pairingId: string,
    proof: DeviceProofInput,
  ): Promise<ActivationResult> {
    let row = await this.getPairing(pairingId);
    this.assertDeviceBinding(
      row,
      proof.device_key_id,
      proof.device_installation_id,
    );
    row = await this.expireIfNeeded(row);

    if (row.state === "CREATED") {
      throw new PairingError(
        "CONFLICT",
        "pairing is waiting for user verification",
        409,
      );
    }
    if (row.state === "REVOKED") {
      throw new PairingError("DEVICE_REVOKED", "device is revoked", 403);
    }
    if (row.state === "EXPIRED") {
      throw new PairingError("TIMEOUT", "pairing has expired", 410);
    }

    const challenge = await this.checkedChallenge(row);
    const validProof = await verifyPairingProof({
      publicKey: row.public_key,
      pairingId: row.id,
      deviceKeyId: proof.device_key_id,
      deviceInstallationId: proof.device_installation_id,
      challenge,
      signature: proof.signature,
    });

    if (!validProof) {
      if (row.state === "USER_VERIFIED") {
        const attempts = row.proof_attempts + 1;
        const exhausted = attempts >= MAX_PROOF_ATTEMPTS;
        await this.db
          .prepare(
            `UPDATE pairings
             SET proof_attempts = ?,
                 state = CASE WHEN ? THEN 'EXPIRED' ELSE state END
             WHERE id = ? AND state = 'USER_VERIFIED'`,
          )
          .bind(attempts, exhausted ? 1 : 0, row.id)
          .run();
        throw new PairingError(
          exhausted ? "RATE_LIMITED" : "UNAUTHORIZED",
          exhausted
            ? "device proof attempt limit reached"
            : "device proof is invalid",
          exhausted ? 429 : 403,
        );
      }

      throw new PairingError("UNAUTHORIZED", "device proof is invalid", 403);
    }

    if (row.state === "ACTIVE" && row.activated_device_id) {
      return {
        pairing_id: row.id,
        state: "ACTIVE",
        device_id: row.activated_device_id,
      };
    }

    if (row.state !== "USER_VERIFIED") {
      throw this.stateError(row.state, "pairing cannot be activated");
    }

    const nowIso = this.clock().toISOString();
    const deviceId = crypto.randomUUID();

    await this.db.batch([
      this.db
        .prepare(
          `UPDATE pairings
           SET state = 'DEVICE_PROVED_KEY',
               proved_at = ?,
               challenge_used_at = ?,
               proof_attempts = proof_attempts + 1
           WHERE id = ?
             AND state = 'USER_VERIFIED'
             AND challenge_used_at IS NULL
             AND expires_at > ?`,
        )
        .bind(nowIso, nowIso, row.id, nowIso),
      this.db
        .prepare(
          `INSERT INTO devices (
             id, user_id, display_name, os, arch, agent_version,
             status_hint, last_seen_at, created_at, revoked_at
           )
           SELECT ?, user_id, display_name, os, arch, agent_version,
                  'offline', NULL, ?, NULL
           FROM pairings
           WHERE id = ?
             AND state = 'DEVICE_PROVED_KEY'
             AND user_id IS NOT NULL
             AND activated_device_id IS NULL`,
        )
        .bind(deviceId, nowIso, row.id),
      this.db
        .prepare(
          `INSERT INTO device_keys (
             id, device_id, public_key, algorithm, fingerprint,
             created_at, rotated_at, revoked_at
           )
           SELECT device_key_id, ?, public_key, algorithm, fingerprint,
                  ?, NULL, NULL
           FROM pairings
           WHERE id = ?
             AND state = 'DEVICE_PROVED_KEY'
             AND activated_device_id IS NULL`,
        )
        .bind(deviceId, nowIso, row.id),
      this.db
        .prepare(
          `UPDATE pairings
           SET state = 'ACTIVE',
               activated_at = ?,
               activated_device_id = ?
           WHERE id = ?
             AND state = 'DEVICE_PROVED_KEY'
             AND activated_device_id IS NULL`,
        )
        .bind(nowIso, deviceId, row.id),
    ]);

    row = await this.getPairing(pairingId);
    if (row.state !== "ACTIVE" || !row.activated_device_id) {
      throw new PairingError(
        "INTERNAL_ERROR",
        "pairing activation did not reach ACTIVE state",
        500,
      );
    }

    return {
      pairing_id: row.id,
      state: "ACTIVE",
      device_id: row.activated_device_id,
    };
  }
  async revokeDevice(
    userId: string,
    deviceId: string,
  ): Promise<{ device_id: string; revoked_at: string }> {
    const device = await this.db
      .prepare(
        "SELECT id, revoked_at FROM devices WHERE id = ? AND user_id = ?",
      )
      .bind(deviceId, userId)
      .first<{ id: string; revoked_at: string | null }>();

    if (!device) {
      throw new PairingError("NOT_FOUND", "device not found", 404);
    }
    if (device.revoked_at) {
      return { device_id: deviceId, revoked_at: device.revoked_at };
    }

    const nowIso = this.clock().toISOString();
    await this.db.batch([
      this.db
        .prepare(
          `UPDATE devices
           SET revoked_at = ?, status_hint = 'revoked'
           WHERE id = ? AND user_id = ? AND revoked_at IS NULL`,
        )
        .bind(nowIso, deviceId, userId),
      this.db
        .prepare(
          "UPDATE device_keys SET revoked_at = ? WHERE device_id = ? AND revoked_at IS NULL",
        )
        .bind(nowIso, deviceId),
      this.db
        .prepare(
          `UPDATE pairings
           SET state = 'REVOKED'
           WHERE activated_device_id = ? AND state = 'ACTIVE'`,
        )
        .bind(deviceId),
    ]);

    return { device_id: deviceId, revoked_at: nowIso };
  }

  async assertDeviceConnectable(
    deviceId: string,
    deviceKeyId: string,
  ): Promise<DeviceConnectionIdentity> {
    const active = await this.db
      .prepare(
        `SELECT
           d.id AS device_id,
           k.id AS device_key_id,
           k.public_key,
           k.algorithm,
           k.fingerprint
         FROM devices d
         JOIN device_keys k ON k.device_id = d.id
         WHERE d.id = ?
           AND k.id = ?
           AND d.revoked_at IS NULL
           AND k.revoked_at IS NULL`,
      )
      .bind(deviceId, deviceKeyId)
      .first<DeviceConnectionIdentity>();

    if (active) {
      return active;
    }

    const revoked = await this.db
      .prepare("SELECT revoked_at FROM devices WHERE id = ?")
      .bind(deviceId)
      .first<{ revoked_at: string | null }>();
    if (revoked?.revoked_at) {
      throw new PairingError("DEVICE_REVOKED", "device is revoked", 403);
    }

    throw new PairingError("UNAUTHORIZED", "device identity is invalid", 403);
  }
  private async validateCreateInput(input: CreatePairingInput): Promise<void> {
    if (!UUID_PATTERN.test(input.device_key_id)) {
      throw new PairingError(
        "INVALID_ARGUMENT",
        "device_key_id must be a UUID",
        400,
      );
    }
    if (!UUID_PATTERN.test(input.device_installation_id)) {
      throw new PairingError(
        "INVALID_ARGUMENT",
        "device_installation_id must be a UUID",
        400,
      );
    }
    if (input.algorithm !== DEVICE_KEY_ALGORITHM) {
      throw new PairingError(
        "INVALID_ARGUMENT",
        "only Ed25519 device keys are supported",
        400,
      );
    }

    for (const [name, value, max] of [
      ["display_name", input.display_name, 120],
      ["os", input.os, 64],
      ["arch", input.arch, 64],
      ["agent_version", input.agent_version, 64],
    ] as const) {
      if (value.length === 0 || value.length > max) {
        throw new PairingError(
          "INVALID_ARGUMENT",
          `${name} must contain between 1 and ${max} characters`,
          400,
        );
      }
    }

    try {
      await importEd25519PublicKey(input.public_key);
    } catch {
      throw new PairingError(
        "INVALID_ARGUMENT",
        "public_key is not a valid Ed25519 raw public key",
        400,
      );
    }

    const fingerprint = await publicKeyFingerprint(input.public_key);
    if (fingerprint !== input.fingerprint) {
      throw new PairingError(
        "INVALID_ARGUMENT",
        "public key fingerprint does not match",
        400,
      );
    }
  }

  private async getPairing(pairingId: string): Promise<PairingRow> {
    if (!UUID_PATTERN.test(pairingId)) {
      throw new PairingError("NOT_FOUND", "pairing not found", 404);
    }

    const row = await this.db
      .prepare("SELECT * FROM pairings WHERE id = ?")
      .bind(pairingId)
      .first<PairingRow>();
    if (!row) {
      throw new PairingError("NOT_FOUND", "pairing not found", 404);
    }

    return row;
  }

  private assertDeviceBinding(
    row: PairingRow,
    deviceKeyId: string,
    deviceInstallationId: string,
  ): void {
    if (
      row.device_key_id !== deviceKeyId ||
      row.device_installation_id !== deviceInstallationId
    ) {
      throw new PairingError("NOT_FOUND", "pairing not found", 404);
    }
  }

  private async expireIfNeeded(row: PairingRow): Promise<PairingRow> {
    if (
      row.state === "ACTIVE" ||
      row.state === "REVOKED" ||
      row.state === "EXPIRED"
    ) {
      return row;
    }

    if (this.clock().getTime() < Date.parse(row.expires_at)) {
      return row;
    }

    await this.db
      .prepare(
        `UPDATE pairings
         SET state = 'EXPIRED'
         WHERE id = ?
           AND state IN ('CREATED', 'USER_VERIFIED', 'DEVICE_PROVED_KEY')`,
      )
      .bind(row.id)
      .run();

    return { ...row, state: "EXPIRED" };
  }

  private async checkedChallenge(row: PairingRow): Promise<string> {
    const challenge = await derivePairingChallenge(this.serverSecret, row.id);
    const digest = await challengeDigest(row.id, challenge);
    if (digest !== row.challenge_digest) {
      throw new PairingError(
        "INTERNAL_ERROR",
        "pairing challenge integrity check failed",
        500,
      );
    }
    return challenge;
  }

  private stateError(state: PairingState, fallback: string): PairingError {
    if (state === "EXPIRED") {
      return new PairingError("TIMEOUT", "pairing has expired", 410);
    }
    if (state === "REVOKED") {
      return new PairingError("DEVICE_REVOKED", "device is revoked", 403);
    }
    return new PairingError("CONFLICT", fallback, 409);
  }
}
