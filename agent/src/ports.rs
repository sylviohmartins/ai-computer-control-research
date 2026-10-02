use chrono::{DateTime, Utc};

use crate::protocol::{CommandRequest, DeviceMessage, TelechirError};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PolicyDecision {
    Allow,
    Ask,
    Deny,
}

pub trait PolicyEngine {
    fn authorize(&self, request: &CommandRequest) -> PolicyDecision;
}

pub trait Clock {
    fn now(&self) -> DateTime<Utc>;
}

pub trait Transport {
    type Error;

    fn send(&mut self, message: &DeviceMessage) -> Result<(), Self::Error>;
}

pub trait CommandExecutor {
    type Error;

    fn execute(&mut self, request: &CommandRequest) -> Result<ExecutionOutcome, Self::Error>;
}
#[derive(Debug, Clone, PartialEq)]
pub enum ExecutionOutcome {
    Completed(serde_json::Value),
    Failed(TelechirError),
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn phase1_ports_are_interfaces_only() {
        fn assert_object_safe(_: &dyn PolicyEngine) {}

        struct DenyAll;
        impl PolicyEngine for DenyAll {
            fn authorize(&self, _: &CommandRequest) -> PolicyDecision {
                PolicyDecision::Deny
            }
        }

        let engine = DenyAll;
        assert_object_safe(&engine);
        assert_eq!(
            engine.authorize(&CommandRequest::test_read_only()),
            PolicyDecision::Deny
        );
    }
}
