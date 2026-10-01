# Agent Instructions

This repository may be used by ChatGPT, Codex, Claude Code, Gemini CLI and other AI agents. These rules are repository-wide unless a more specific `AGENTS.md` is introduced later.

## Current phase guardrail

The project is in research/discovery. **Do not implement production code, deploy infrastructure, create paid resources or publish a plugin unless the current project state explicitly authorizes that phase.**

## Source-of-truth order

1. `PROJECT_STATE.md`
2. accepted ADRs under `docs/architecture/adr/`
3. living documentation under `docs/`
4. project lineage under `docs/history/`
5. immutable snapshots and source provenance under `artifacts/`

If a living document conflicts with an archived artifact, prefer the living document and preserve the artifact unchanged. Before redesigning product scope, naming, distribution or core architecture, read `docs/history/research-lineage.md` and the relevant entries in `artifacts/provenance/` so earlier decisions are not accidentally rediscovered or erased.

## Research standards

- Date mutable claims.
- Prefer primary sources for platform capabilities, pricing, limits and security behavior.
- Separate verified facts from hypotheses and proposed design decisions.
- Record meaningful source URLs in the relevant document.
- Never claim a platform, domain, package or trademark is available without a current check.

## Architecture standards

- Record durable architectural decisions as ADRs.
- Do not rewrite historical ADRs to hide changed decisions; supersede them with a new ADR.
- Keep the external AI integration protocol separate from the internal device transport unless an ADR explicitly changes that boundary.
- Treat local policy enforcement as a security invariant until superseded by an accepted ADR.

## Repository hygiene

- Use focused commits with Conventional Commit-style messages.
- Do not mix unrelated research, architecture and implementation changes in one commit.
- Do not commit secrets, tokens, credentials, private infrastructure identifiers or user data.
- Do not edit files under `artifacts/` except to add a new immutable snapshot, add provenance metadata, or correct accidental corruption with an explicit explanation.
- When importing ChatGPT/research outputs, preserve the original source under `artifacts/source/` when practical and map it in `artifacts/provenance/source-manifest.json`.

## Documentation language

Public-facing living documentation should prefer English for global accessibility. Historical research artifacts may remain in their original language.
