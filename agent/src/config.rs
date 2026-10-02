use thiserror::Error;

use crate::protocol::{ConnectionLimits, PROTOCOL_VERSION};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AgentConfig {
    pub protocol_version: String,
    pub max_recent_commands: usize,
    pub limits: ConnectionLimits,
}

impl Default for AgentConfig {
    fn default() -> Self {
        Self {
            protocol_version: PROTOCOL_VERSION.to_owned(),
            max_recent_commands: 1024,
            limits: ConnectionLimits::default(),
        }
    }
}

impl AgentConfig {
    pub fn validate(&self) -> Result<(), ConfigError> {
        if self.protocol_version != PROTOCOL_VERSION {
            return Err(ConfigError::UnsupportedProtocol(
                self.protocol_version.clone(),
            ));
        }
        if self.max_recent_commands == 0 {
            return Err(ConfigError::InvalidRecentCommandCapacity);
        }
        self.limits
            .validate()
            .map_err(ConfigError::InvalidConnectionLimits)
    }
}
#[derive(Debug, Error, PartialEq, Eq)]
pub enum ConfigError {
    #[error("unsupported protocol version: {0}")]
    UnsupportedProtocol(String),
    #[error("max_recent_commands must be greater than zero")]
    InvalidRecentCommandCapacity,
    #[error("invalid connection limits: {0}")]
    InvalidConnectionLimits(String),
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn defaults_are_valid_and_safe_for_phase1() {
        AgentConfig::default().validate().unwrap();
    }

    #[test]
    fn zero_recent_command_capacity_is_rejected() {
        let config = AgentConfig {
            max_recent_commands: 0,
            ..AgentConfig::default()
        };

        assert_eq!(
            config.validate(),
            Err(ConfigError::InvalidRecentCommandCapacity)
        );
    }
}
