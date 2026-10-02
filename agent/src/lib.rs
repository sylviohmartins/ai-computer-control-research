#![forbid(unsafe_code)]

pub mod config;
pub mod lifecycle;
pub mod ports;
pub mod protocol;

pub use config::AgentConfig;
pub use lifecycle::{CommandLifecycle, CommandState, TransitionError};
pub use protocol::{DeviceMessage, MessageType, ProtocolValidationError, decode_and_validate};
