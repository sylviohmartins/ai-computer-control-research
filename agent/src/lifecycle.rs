use thiserror::Error;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CommandState {
    Received,
    AwaitingApproval,
    Accepted,
    Running,
    Completed,
    Failed,
    Cancelled,
}

impl CommandState {
    pub const fn is_terminal(self) -> bool {
        matches!(self, Self::Completed | Self::Failed | Self::Cancelled)
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CommandLifecycle {
    command_id: String,
    state: CommandState,
}

impl CommandLifecycle {
    pub fn new(command_id: impl Into<String>) -> Self {
        Self {
            command_id: command_id.into(),
            state: CommandState::Received,
        }
    }

    pub fn command_id(&self) -> &str {
        &self.command_id
    }

    pub const fn state(&self) -> CommandState {
        self.state
    }
    pub fn transition(&mut self, next: CommandState) -> Result<(), TransitionError> {
        let allowed = matches!(
            (self.state, next),
            (CommandState::Received, CommandState::AwaitingApproval)
                | (CommandState::Received, CommandState::Accepted)
                | (CommandState::Received, CommandState::Failed)
                | (CommandState::AwaitingApproval, CommandState::Accepted)
                | (CommandState::AwaitingApproval, CommandState::Failed)
                | (CommandState::Accepted, CommandState::Running)
                | (CommandState::Accepted, CommandState::Failed)
                | (CommandState::Running, CommandState::Completed)
                | (CommandState::Running, CommandState::Failed)
                | (CommandState::Running, CommandState::Cancelled)
        );

        if !allowed {
            return Err(TransitionError {
                from: self.state,
                to: next,
            });
        }

        self.state = next;
        Ok(())
    }
}

#[derive(Debug, Error, PartialEq, Eq)]
#[error("invalid command transition from {from:?} to {to:?}")]
pub struct TransitionError {
    pub from: CommandState,
    pub to: CommandState,
}
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn supports_nominal_command_lifecycle() {
        let mut lifecycle = CommandLifecycle::new("cmd_1");

        lifecycle.transition(CommandState::Accepted).unwrap();
        lifecycle.transition(CommandState::Running).unwrap();
        lifecycle.transition(CommandState::Completed).unwrap();

        assert!(lifecycle.state().is_terminal());
    }

    #[test]
    fn rejects_skipping_from_received_to_completed() {
        let mut lifecycle = CommandLifecycle::new("cmd_1");

        let error = lifecycle
            .transition(CommandState::Completed)
            .expect_err("transition must be rejected");

        assert_eq!(error.from, CommandState::Received);
        assert_eq!(lifecycle.state(), CommandState::Received);
    }

    #[test]
    fn terminal_states_cannot_transition() {
        let mut lifecycle = CommandLifecycle::new("cmd_1");
        lifecycle.transition(CommandState::Failed).unwrap();

        assert!(lifecycle.transition(CommandState::Accepted).is_err());
    }
}
