# Security Discovery

Security is a product capability, not a later hardening task.

Current direction:

- local device policy is expected to be authoritative;
- permissions use explicit allow / ask / deny semantics;
- dangerous operations should require stronger approval or remain denied;
- filesystem authorization must be based on canonical resolved paths;
- device identity, revocation and short-lived sessions are first-class concerns;
- host execution, guarded-host execution and sandbox execution are distinct security modes;
- secrets should be referenced/injected without unnecessarily exposing values to the model.

The current threat model is still a discovery artifact and will be frozen into a formal specification only after Blueprint v2.
