import {
  fromBase64Url,
  importEd25519PublicKey,
  toBase64Url,
} from "./pairing-crypto";

const encoder = new TextEncoder();

export const CONNECTION_PROOF_VERSION =
  "telechir-connection-credential-proof-v1";
export const CONNECTION_CREDENTIAL_VERSION = 1;
export const CONNECTION_CREDENTIAL_AUDIENCE = "telechir-control-plane/realtime";
export const CONNECTION_CREDENTIAL_TTL_MS = 60_000;
export const CONNECTION_REQUEST_MAX_SKEW_MS = 60_000;

export interface ConnectionCredentialClaims {
  v: 1;
  jti: string;
  device_id: string;
  device_key_id: string;
  connection_nonce: string;
  audience: string;
  issued_at: string;
  expires_at: string;
}

export function connectionCredentialProofMessage(input: {
  deviceId: string;
  deviceKeyId: string;
  connectionNonce: string;
  requestedAt: string;
  audience?: string;
}): string {
  const audience = input.audience ?? CONNECTION_CREDENTIAL_AUDIENCE;
  const fields = [
    ["device_id", input.deviceId],
    ["device_key_id", input.deviceKeyId],
    ["connection_nonce", input.connectionNonce],
    ["requested_at", input.requestedAt],
    ["audience", audience],
  ] as const;

  for (const [name, value] of fields) {
    if (value.length === 0 || value.includes("\n") || value.includes("\r")) {
      throw new Error(`invalid connection proof field: ${name}`);
    }
  }

  return [
    CONNECTION_PROOF_VERSION,
    ...fields.map(([name, value]) => `${name}=${value}`),
  ].join("\n");
}
async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function hmac(secret: string, value: string): Promise<string> {
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value),
  );
  return toBase64Url(new Uint8Array(signature));
}

export async function verifyConnectionRequestProof(input: {
  publicKey: string;
  deviceId: string;
  deviceKeyId: string;
  connectionNonce: string;
  requestedAt: string;
  signature: string;
}): Promise<boolean> {
  try {
    const key = await importEd25519PublicKey(input.publicKey);
    const signature = fromBase64Url(input.signature);
    if (signature.byteLength !== 64) {
      return false;
    }
    return crypto.subtle.verify(
      { name: "Ed25519" },
      key,
      signature,
      encoder.encode(
        connectionCredentialProofMessage({
          deviceId: input.deviceId,
          deviceKeyId: input.deviceKeyId,
          connectionNonce: input.connectionNonce,
          requestedAt: input.requestedAt,
        }),
      ),
    );
  } catch {
    return false;
  }
}

export async function issueConnectionCredential(
  secret: string,
  input: {
    deviceId: string;
    deviceKeyId: string;
    connectionNonce: string;
    now: Date;
  },
): Promise<{ credential: string; claims: ConnectionCredentialClaims }> {
  const issuedAt = input.now.toISOString();
  const expiresAt = new Date(
    input.now.getTime() + CONNECTION_CREDENTIAL_TTL_MS,
  ).toISOString();
  const claims: ConnectionCredentialClaims = {
    v: CONNECTION_CREDENTIAL_VERSION,
    jti: crypto.randomUUID(),
    device_id: input.deviceId,
    device_key_id: input.deviceKeyId,
    connection_nonce: input.connectionNonce,
    audience: CONNECTION_CREDENTIAL_AUDIENCE,
    issued_at: issuedAt,
    expires_at: expiresAt,
  };
  const payload = toBase64Url(encoder.encode(JSON.stringify(claims)));
  const signature = await hmac(secret, payload);
  return { credential: `${payload}.${signature}`, claims };
}
export async function verifyConnectionCredential(
  secret: string,
  credential: string,
  now: Date,
): Promise<ConnectionCredentialClaims | null> {
  const [payload, signature, extra] = credential.split(".");
  if (!payload || !signature || extra !== undefined) {
    return null;
  }

  let providedSignature: Uint8Array<ArrayBuffer>;
  try {
    providedSignature = fromBase64Url(signature);
  } catch {
    return null;
  }

  const key = await hmacKey(secret);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    providedSignature,
    encoder.encode(payload),
  );
  if (!valid) {
    return null;
  }

  let claims: ConnectionCredentialClaims;
  try {
    const decoded = new TextDecoder().decode(fromBase64Url(payload));
    claims = JSON.parse(decoded) as ConnectionCredentialClaims;
  } catch {
    return null;
  }

  if (
    claims.v !== CONNECTION_CREDENTIAL_VERSION ||
    claims.audience !== CONNECTION_CREDENTIAL_AUDIENCE ||
    typeof claims.jti !== "string" ||
    typeof claims.device_id !== "string" ||
    typeof claims.device_key_id !== "string" ||
    typeof claims.connection_nonce !== "string" ||
    claims.connection_nonce.length < 16 ||
    typeof claims.expires_at !== "string" ||
    typeof claims.issued_at !== "string"
  ) {
    return null;
  }

  const expiresAt = Date.parse(claims.expires_at);
  const issuedAt = Date.parse(claims.issued_at);
  if (
    !Number.isFinite(expiresAt) ||
    !Number.isFinite(issuedAt) ||
    now.getTime() >= expiresAt ||
    issuedAt > now.getTime() + CONNECTION_REQUEST_MAX_SKEW_MS
  ) {
    return null;
  }

  return claims;
}
