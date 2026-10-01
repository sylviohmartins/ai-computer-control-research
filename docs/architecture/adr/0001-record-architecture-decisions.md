# ADR-0001: Record Architecture Decisions

- **Status:** Accepted
- **Date:** 2026-10-01

## Context

The project is research-heavy and likely to evolve across AI platforms, Cloudflare services, local-agent technology and security boundaries. Important decisions need durable rationale.

## Decision

Use Architecture Decision Records under `docs/architecture/adr/`. Historical ADRs are immutable except for small factual corrections; changed decisions are superseded by new ADRs.

## Consequences

- decisions remain explainable to future contributors and AI agents;
- trade-offs are visible;
- documentation overhead increases slightly but reduces repeated redesign.
