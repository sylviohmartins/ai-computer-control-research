# Project State

**Updated:** 2026-10-01

## Current phase

**Product & Technical Discovery / Research Foundation**

Implementation has **not started**. This repository is currently a versioned research, architecture and project-history knowledge base.

## Current gates

- [ ] Naming discovery reaches an approved brand state. The latest completed round is `NAME_NOT_READY`.
- [ ] ChatGPT Plus + public plugin distribution path validated end-to-end.
- [ ] Product/technical Blueprint v2 updated after those two discoveries.
- [ ] Definition of Ready re-run and approved.
- [ ] Open-source licensing strategy selected.

## Current decisions

- Repository name is descriptive and temporary; it is not the product brand.
- The product should remain model-agnostic and multi-AI by design.
- Public ChatGPT distribution is expected to use a published plugin/app backed by a remote MCP service rather than requiring Plus users to manually register a custom MCP.
- Cloudflare remains the leading control-plane candidate, subject to feasibility validation.
- The local agent is expected to enforce the final device-side security policy.
- GUI/browser/computer-use is post-MVP unless discovery proves otherwise.
- Historical research artifacts remain immutable evidence; current conclusions live under `docs/`.
- ChatGPT-generated source artifacts are tracked through `artifacts/provenance/source-manifest.json`.

## Naming state

- 2026-09-29 round: **Telechir** reached `NAME_CONDITIONAL`.
- 2026-10-01 broader round: creative finalists included Grapnel, Skeg, Nervo, Prehend and Hawse, but the final gate returned to **`NAME_NOT_READY`** because no candidate cleared the quality + collision/clearance threshold.
- No product brand is currently approved.

## Explicitly rejected

- **MachinaPort** as a product name. It remains visible only inside archived research snapshots for historical traceability.

## Historical lineage

See `docs/history/research-lineage.md` for the progression from the original Remote Desktop Commander/Codex-limit observation through the ecosystem census, blueprint, Plus/plugin correction and naming rounds.

## Next recommended work

1. Run another naming round or final-clearance workflow until a brand passes the naming gate.
2. Validate the ChatGPT Plus public-plugin path, including write/process execution, surface availability and quota behavior.
3. Produce Blueprint v2.
4. Re-run Definition of Ready before implementation.
