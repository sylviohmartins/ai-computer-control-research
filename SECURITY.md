# Security Policy

Security is a primary design concern because the intended product may eventually execute actions on authorized computers.

## Do not disclose sensitive reports publicly

Do not open a public issue containing credentials, tokens, private keys, private infrastructure details, exploit steps against an active deployment, or other sensitive material.

If GitHub private vulnerability reporting is available for this repository, use that channel. Otherwise, contact the repository owner through an appropriate private GitHub-associated channel before sharing actionable details.

## Current implementation status

There is currently no production runtime or deployed service in this repository. Security reports are therefore most likely to concern research artifacts, future design assumptions, dependency recommendations or accidental secret exposure.

## Security principles under evaluation

- device-initiated outbound connectivity;
- short-lived credentials and explicit device identity;
- local least-privilege policy enforcement;
- typed tools instead of unrestricted command execution where practical;
- explicit approvals for high-risk actions;
- auditable actions and revocation;
- progressive isolation through guarded-host and sandbox modes.
