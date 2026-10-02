use std::fs;
use std::path::{Path, PathBuf};

use telechir_agent::protocol::{CommandOperation, ErrorCode, PermissionDomain, RiskLevel};
use telechir_agent::{MessageType, ProtocolValidationError, decode_and_validate};

fn fixture_path(name: &str) -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join("specs")
        .join("fixtures")
        .join("protocol")
        .join(name)
}

fn fixture(name: &str) -> String {
    fs::read_to_string(fixture_path(name)).expect("fixture must be readable")
}

fn spec_path(name: &str) -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join("specs")
        .join("protocol")
        .join(name)
}

fn schema_enum(name: &str, pointer: &str) -> Vec<String> {
    let schema: serde_json::Value = serde_json::from_str(
        &fs::read_to_string(spec_path(name)).expect("schema must be readable"),
    )
    .expect("schema must be valid JSON");

    schema
        .pointer(pointer)
        .and_then(serde_json::Value::as_array)
        .expect("schema enum must exist")
        .iter()
        .map(|value| {
            value
                .as_str()
                .expect("enum values must be strings")
                .to_owned()
        })
        .collect()
}

#[test]
fn accepts_valid_phase0_fixtures() {
    let cases = [
        ("valid-agent-hello.json", MessageType::AgentHello),
        ("valid-command-request.json", MessageType::CommandRequest),
        ("valid-heartbeat.json", MessageType::Heartbeat),
        (
            "valid-capabilities-changed.json",
            MessageType::CapabilitiesChanged,
        ),
    ];
    for (name, expected_type) in cases {
        let message = decode_and_validate(&fixture(name))
            .unwrap_or_else(|error| panic!("{name} should be valid: {error}"));
        assert_eq!(message.message_type, expected_type);
    }
}

#[test]
fn rejects_missing_idempotency_for_side_effect_fixture() {
    let error = decode_and_validate(&fixture("invalid-command-request-missing-idempotency.json"))
        .expect_err("fixture must be rejected");

    match error {
        ProtocolValidationError::Payload {
            message_type,
            reason,
        } => {
            assert_eq!(message_type, "command.request");
            assert!(reason.contains("idempotency_key"));
        }
        other => panic!("unexpected error: {other}"),
    }
}

#[test]
fn rejects_payload_bound_to_wrong_message_type() {
    let mut value: serde_json::Value =
        serde_json::from_str(&fixture("valid-heartbeat.json")).unwrap();
    value["message_type"] = serde_json::Value::String("agent.hello".to_owned());

    let error = decode_and_validate(&serde_json::to_string(&value).unwrap())
        .expect_err("payload binding must be enforced");

    assert!(matches!(error, ProtocolValidationError::Payload { .. }));
}
#[test]
fn rejects_unknown_envelope_fields() {
    let mut value: serde_json::Value =
        serde_json::from_str(&fixture("valid-heartbeat.json")).unwrap();
    value["unexpected"] = serde_json::json!(true);

    let error = decode_and_validate(&serde_json::to_string(&value).unwrap())
        .expect_err("unknown fields must be rejected");

    assert!(matches!(error, ProtocolValidationError::InvalidJson(_)));
}

#[test]
fn rust_enums_match_phase0_json_schemas() {
    let message_types = MessageType::ALL
        .iter()
        .map(|value| value.as_str().to_owned())
        .collect::<Vec<_>>();
    assert_eq!(
        message_types,
        schema_enum(
            "device-message.schema.json",
            "/properties/message_type/enum"
        )
    );

    let permissions = PermissionDomain::ALL
        .iter()
        .map(|value| value.as_str().to_owned())
        .collect::<Vec<_>>();
    assert_eq!(
        permissions,
        schema_enum(
            "device-payloads.schema.json",
            "/$defs/permission_domain/enum"
        )
    );

    let risks = RiskLevel::ALL
        .iter()
        .map(|value| value.as_str().to_owned())
        .collect::<Vec<_>>();
    assert_eq!(
        risks,
        schema_enum("device-payloads.schema.json", "/$defs/risk_level/enum")
    );

    let operations = CommandOperation::ALL
        .iter()
        .map(|value| value.as_str().to_owned())
        .collect::<Vec<_>>();
    assert_eq!(
        operations,
        schema_enum(
            "device-payloads.schema.json",
            "/$defs/command_operation/enum"
        )
    );

    let errors = ErrorCode::ALL
        .iter()
        .map(|value| value.as_str().to_owned())
        .collect::<Vec<_>>();
    assert_eq!(
        errors,
        schema_enum("error.schema.json", "/properties/code/enum")
    );
}

#[test]
fn side_effect_classification_matches_phase0_schema() {
    let schema_side_effects = schema_enum(
        "device-payloads.schema.json",
        "/$defs/command_request/allOf/0/if/properties/operation/enum",
    );
    let rust_side_effects = CommandOperation::ALL
        .iter()
        .copied()
        .filter(|operation| operation.has_side_effect())
        .map(|operation| operation.as_str().to_owned())
        .collect::<Vec<_>>();

    assert_eq!(rust_side_effects, schema_side_effects);
}

#[test]
fn baseline_models_all_fifteen_message_types() {
    let expected = [
        "agent.hello",
        "agent.hello_ack",
        "heartbeat",
        "heartbeat_ack",
        "capabilities.changed",
        "command.request",
        "command.accepted",
        "command.chunk",
        "command.completed",
        "command.failed",
        "command.cancel",
        "command.cancelled",
        "approval.request",
        "approval.decision",
        "protocol.error",
    ];
    let actual: Vec<_> = MessageType::ALL
        .iter()
        .map(|message_type| message_type.as_str())
        .collect();

    assert_eq!(actual, expected);
}
