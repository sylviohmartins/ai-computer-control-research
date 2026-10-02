use std::fs;
use std::path::Path;

use base64::Engine;
use base64::engine::general_purpose::URL_SAFE_NO_PAD;
use ed25519_dalek::{Signature, Verifier, VerifyingKey};
use serde_json::Value;
use sha2::{Digest, Sha256};
use telechir_agent::{PAIRING_PROOF_AUDIENCE, pairing_proof_message};

fn fixture() -> Value {
    let path = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join("specs")
        .join("fixtures")
        .join("auth")
        .join("pairing-proof-ed25519-v1.json");
    serde_json::from_str(&fs::read_to_string(path).expect("fixture must be readable"))
        .expect("fixture must be valid JSON")
}

#[test]
fn rust_pairing_proof_matches_cross_language_fixture() {
    let fixture = fixture();
    let field = |name: &str| {
        fixture[name]
            .as_str()
            .unwrap_or_else(|| panic!("missing fixture field {name}"))
    };

    let canonical = pairing_proof_message(
        field("pairing_id"),
        field("device_key_id"),
        field("device_installation_id"),
        field("challenge"),
        PAIRING_PROOF_AUDIENCE,
    )
    .unwrap();
    assert_eq!(canonical, field("canonical_message"));
    assert_eq!(field("audience"), PAIRING_PROOF_AUDIENCE);

    let public_bytes: [u8; 32] = URL_SAFE_NO_PAD
        .decode(field("public_key"))
        .unwrap()
        .try_into()
        .unwrap();
    let fingerprint = URL_SAFE_NO_PAD.encode(Sha256::digest(public_bytes));
    assert_eq!(fingerprint, field("fingerprint"));

    let signature_bytes: [u8; 64] = URL_SAFE_NO_PAD
        .decode(field("signature"))
        .unwrap()
        .try_into()
        .unwrap();
    let signature = Signature::from_bytes(&signature_bytes);
    VerifyingKey::from_bytes(&public_bytes)
        .unwrap()
        .verify(canonical.as_bytes(), &signature)
        .unwrap();
}
