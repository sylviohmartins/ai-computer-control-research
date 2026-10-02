use std::fs;
use std::path::Path;

use base64::Engine;
use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use ed25519_dalek::{Signature, Verifier, VerifyingKey};
use serde::Deserialize;
use telechir_agent::{
    CONNECTION_PROOF_AUDIENCE, CONNECTION_PROOF_VERSION, connection_credential_proof_message,
};

#[derive(Debug, Deserialize)]
struct Fixture {
    version: String,
    algorithm: String,
    audience: String,
    device_id: String,
    device_key_id: String,
    connection_nonce: String,
    requested_at: String,
    public_key: String,
    signature: String,
    canonical_message: String,
}

#[test]
fn rust_connection_credential_contract_matches_shared_fixture() {
    let path = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join("specs")
        .join("fixtures")
        .join("auth")
        .join("connection-credential-ed25519-v1.json");
    let fixture: Fixture = serde_json::from_str(&fs::read_to_string(path).unwrap()).unwrap();

    assert_eq!(fixture.version, CONNECTION_PROOF_VERSION);
    assert_eq!(fixture.algorithm, "Ed25519");
    assert_eq!(fixture.audience, CONNECTION_PROOF_AUDIENCE);

    let canonical = connection_credential_proof_message(
        &fixture.device_id,
        &fixture.device_key_id,
        &fixture.connection_nonce,
        &fixture.requested_at,
        &fixture.audience,
    )
    .unwrap();
    assert_eq!(canonical, fixture.canonical_message);

    let public_key: [u8; 32] = URL_SAFE_NO_PAD
        .decode(fixture.public_key)
        .unwrap()
        .try_into()
        .unwrap();
    let verifying_key = VerifyingKey::from_bytes(&public_key).unwrap();
    let signature: [u8; 64] = URL_SAFE_NO_PAD
        .decode(fixture.signature)
        .unwrap()
        .try_into()
        .unwrap();

    verifying_key
        .verify(canonical.as_bytes(), &Signature::from_bytes(&signature))
        .unwrap();
}
