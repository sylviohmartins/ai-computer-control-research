#![forbid(unsafe_code)]

pub mod config;
pub mod identity;
pub mod lifecycle;
pub mod ports;
pub mod protocol;

pub use config::AgentConfig;
pub use identity::{
    DEVICE_KEY_ALGORITHM, DeviceIdentity, DeviceIdentityManager, DeviceIdentityStore,
    DevicePairingMetadata, DevicePublicIdentity, IdentityError, MemoryIdentityStore,
    NativeKeyringIdentityStore, PAIRING_PROOF_AUDIENCE, PairingProof, PairingRegistration,
    pairing_proof_message,
};
pub use lifecycle::{CommandLifecycle, CommandState, TransitionError};
pub use protocol::{DeviceMessage, MessageType, ProtocolValidationError, decode_and_validate};
