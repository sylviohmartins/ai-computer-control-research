export const DEVICE_KEY_ALGORITHM = "Ed25519";
export const PAIRING_PROOF_VERSION = "telechir-pairing-proof-v1";
export const PAIRING_PROOF_AUDIENCE = "telechir-control-plane";

const encoder = new TextEncoder();
const USER_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/u, "");
}

export function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  if (!/^[A-Za-z0-9_-]+$/u.test(value)) {
    throw new Error("invalid base64url value");
  }

  const padded = value.replaceAll("-", "+").replaceAll("_", "/");
  const padding = "=".repeat((4 - (padded.length % 4)) % 4);
  const binary = atob(padded + padding);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function hmac(secret: string, value: string): Promise<Uint8Array> {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value),
  );
  return new Uint8Array(signature);
}

export async function derivePairingChallenge(
  secret: string,
  pairingId: string,
): Promise<string> {
  const bytes = await hmac(
    secret,
    `telechir-pairing-challenge-v1\npairing_id=${pairingId}`,
  );
  return toBase64Url(bytes);
}

export async function challengeDigest(
  pairingId: string,
  challenge: string,
): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(
      `telechir-pairing-challenge-digest-v1\npairing_id=${pairingId}\nchallenge=${challenge}`,
    ),
  );
  return toBase64Url(new Uint8Array(digest));
}

function normalizeUserCode(code: string): string {
  return code.trim().toUpperCase().replaceAll("-", "");
}

export async function userCodeDigest(
  secret: string,
  pairingId: string,
  code: string,
): Promise<string> {
  const bytes = await hmac(
    secret,
    `telechir-pairing-user-code-v1\npairing_id=${pairingId}\ncode=${normalizeUserCode(code)}`,
  );
  return toBase64Url(bytes);
}

export async function verifyUserCodeDigest(
  secret: string,
  pairingId: string,
  code: string,
  expectedDigest: string,
): Promise<boolean> {
  let signature: Uint8Array<ArrayBuffer>;
  try {
    signature = fromBase64Url(expectedDigest);
  } catch {
    return false;
  }

  const key = await importHmacKey(secret);
  return crypto.subtle.verify(
    "HMAC",
    key,
    signature,
    encoder.encode(
      `telechir-pairing-user-code-v1\npairing_id=${pairingId}\ncode=${normalizeUserCode(code)}`,
    ),
  );
}

export function generateUserCode(): string {
  const random = new Uint8Array(8);
  crypto.getRandomValues(random);
  const characters = Array.from(
    random,
    (byte) => USER_CODE_ALPHABET[byte & 31]!,
  ).join("");
  return `${characters.slice(0, 4)}-${characters.slice(4)}`;
}

export function pairingProofMessage(input: {
  pairingId: string;
  deviceKeyId: string;
  deviceInstallationId: string;
  challenge: string;
  audience?: string;
}): string {
  const audience = input.audience ?? PAIRING_PROOF_AUDIENCE;
  const fields = [
    ["pairing_id", input.pairingId],
    ["device_key_id", input.deviceKeyId],
    ["device_installation_id", input.deviceInstallationId],
    ["challenge", input.challenge],
    ["audience", audience],
  ] as const;

  for (const [name, value] of fields) {
    if (value.length === 0 || value.includes("\n") || value.includes("\r")) {
      throw new Error(`invalid pairing proof field: ${name}`);
    }
  }

  return [
    PAIRING_PROOF_VERSION,
    ...fields.map(([name, value]) => `${name}=${value}`),
  ].join("\n");
}

export async function importEd25519PublicKey(
  encoded: string,
): Promise<CryptoKey> {
  const bytes = fromBase64Url(encoded);
  if (bytes.byteLength !== 32) {
    throw new Error("Ed25519 public key must contain exactly 32 bytes");
  }

  return crypto.subtle.importKey(
    "raw",
    bytes,
    { name: DEVICE_KEY_ALGORITHM },
    false,
    ["verify"],
  );
}

export async function publicKeyFingerprint(encoded: string): Promise<string> {
  const bytes = fromBase64Url(encoded);
  if (bytes.byteLength !== 32) {
    throw new Error("Ed25519 public key must contain exactly 32 bytes");
  }
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return toBase64Url(new Uint8Array(digest));
}

export async function verifyPairingProof(input: {
  publicKey: string;
  pairingId: string;
  deviceKeyId: string;
  deviceInstallationId: string;
  challenge: string;
  signature: string;
}): Promise<boolean> {
  try {
    const key = await importEd25519PublicKey(input.publicKey);
    const signature = fromBase64Url(input.signature);
    if (signature.byteLength !== 64) {
      return false;
    }

    return crypto.subtle.verify(
      { name: DEVICE_KEY_ALGORITHM },
      key,
      signature,
      encoder.encode(
        pairingProofMessage({
          pairingId: input.pairingId,
          deviceKeyId: input.deviceKeyId,
          deviceInstallationId: input.deviceInstallationId,
          challenge: input.challenge,
        }),
      ),
    );
  } catch {
    return false;
  }
}
