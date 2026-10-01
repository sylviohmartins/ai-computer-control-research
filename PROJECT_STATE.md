# Project State

**Updated:** 2026-10-01

## Current phase

**Product & Technical Discovery / Research Foundation**

Implementation has **not started**. This repository is currently a versioned research and architecture knowledge base.

## Current gates

- [ ] Naming discovery completed and brand approved.
- [ ] ChatGPT Plus + public plugin distribution path validated end-to-end.
- [ ] Product/technical blueprint updated after those two discoveries.
- [ ] Definition of Ready re-run and approved.
- [ ] Open-source licensing strategy selected.

## Current decisions

- Repository name is descriptive and temporary; it is not the product brand.
- The product should remain model-agnostic and multi-AI by design.
- Public ChatGPT distribution is expected to use a published plugin/app backed by a remote MCP service rather than requiring Plus users to manually register a custom MCP.
- Cloudflare remains the leading control-plane candidate, subject to feasibility validation.
- The local agent is expected to enforce the final device-side security policy.
- GUI/browser/computer-use is post-MVP unless discovery proves otherwise.

## Explicitly rejected

- **MachinaPort** as a product name. It remains visible only inside archived research snapshots for historical traceability.

## Next recommended work

1. Complete naming discovery and preliminary clearance.
2. Validate the ChatGPT Plus public-plugin path, including write/process execution, surface availability and quota behavior.
3. Produce Blueprint v2.
4. Re-run Definition of Ready before implementation.
