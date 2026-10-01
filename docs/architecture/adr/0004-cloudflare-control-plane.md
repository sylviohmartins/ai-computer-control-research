# ADR-0004: Use Cloudflare as the Leading Hosted Control-Plane Candidate

- **Status:** Proposed
- **Date:** 2026-10-01

## Context

The product needs public HTTPS endpoints, authentication, low-cost routing, realtime device presence, durable metadata and artifact storage. Earlier discovery identified Cloudflare Workers, Durable Objects, D1 and R2 as a coherent candidate stack.

## Proposed decision

Use Cloudflare as the default hosted-control-plane target for the first implementation, while keeping the device protocol and local agent provider-independent.

## Expected mapping

- Workers: public APIs, MCP/OAuth and routing;
- Durable Objects: per-device realtime coordination/presence;
- D1: durable metadata and policy references;
- R2: large artifacts;
- Analytics Engine/Queues/KV: optional supporting roles where justified.

## Risks

- websocket/message billing and limits require load validation;
- architecture must not force long-running user processes into Workers;
- a future self-hosted/private-control-plane option may require adapters.
