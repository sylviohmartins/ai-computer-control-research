# AI Computer Control Research

Research and architecture workspace for a future platform that lets authorized AI clients operate computers and executable environments through a secure, auditable control layer.

> **Project status:** research and product/technical discovery. No production implementation has started. The product name is intentionally **TBD** while naming discovery is in progress.

## Why this repository exists

The project is exploring a model-agnostic execution layer that can connect AI clients such as ChatGPT, Codex, Claude, Gemini, Copilot and MCP-compatible tools to authorized machines while keeping device identity, permissions, approvals, auditability and future sandboxing as first-class concerns.

This repository is the source of truth for:

- market and ecosystem research;
- product discovery and positioning;
- technical feasibility studies;
- architecture decisions and ADRs;
- security and threat-model work;
- naming and brand discovery;
- immutable research artifacts and datasets;
- the future implementation roadmap.

## Current principles

- **Model agnostic:** the execution layer should not depend on a single LLM provider.
- **Least privilege:** local policy is expected to remain authoritative.
- **Outbound-first connectivity:** avoid requiring inbound ports on user machines.
- **Typed tools first:** prefer explicit filesystem, process and Git operations over an unrestricted "execute anything" interface.
- **Auditability:** remote actions should be attributable, reviewable and revocable.
- **Progressive isolation:** distinguish host execution, guarded-host execution and sandboxed execution.
- **Research before implementation:** unresolved platform, security and naming gates are documented before code is written.

## Repository map

- `PROJECT_STATE.md` — current phase, gates and implementation status.
- `AGENTS.md` — rules for AI coding/research agents working in this repository.
- `docs/` — living product, discovery, architecture, security and feasibility documentation.
- `artifacts/` — dated research snapshots, reports and structured datasets.

## Important status notes

The repository name is descriptive and temporary. It is **not** the final product brand.

The repository is public for transparent research. **No open-source license has been selected yet**, so public visibility must not be interpreted as permission to reuse or redistribute the contents beyond what applicable law allows. Licensing is a pending product/governance decision.

## Contributing

The project is still in discovery. See `CONTRIBUTING.md` before opening issues or proposing changes.

## Security

Do not publish secrets, credentials, tokens, private infrastructure details or actionable vulnerability reports in public issues. See `SECURITY.md`.
