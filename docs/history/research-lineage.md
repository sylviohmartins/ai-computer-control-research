# Research Lineage — How the Project Was Born

This document explains how the project evolved from a practical limitation into a product/architecture research program. It is a historical narrative, not a current product specification.

## 1. Trigger: keep working when an agent quota is exhausted

The initial practical trigger was a screenshot captured during work with ChatGPT showing the message **“Limite Semanal do Codex acabou, mas...”** while Remote Desktop Commander was being used to continue operating a development environment. The original image is tracked in the artifact provenance manifest by SHA-256.

That observation reframed the problem: the useful capability was not “Codex” itself, but a reusable execution layer that gives an authorized AI controlled hands on a machine.

## 2. Ecosystem census

The first major research phase mapped the broader ecosystem instead of treating Remote Desktop Commander as an isolated product. The census normalized **181 materially relevant tools/projects** across:

- bridges and MCP servers;
- coding agents;
- computer-use/browser tools;
- sandboxes;
- remote execution;
- CI/CD executors.

That research established the recurring capability set: filesystem, terminal/process lifecycle, Git, browser/GUI, remote connectivity, sandboxing, auditability and policy.

Canonical source:
- `artifacts/reports/2026-09-29-ai-computer-control-ecosystem-census.md`
- `artifacts/datasets/2026-09-29-ai-computer-control-ecosystem-census.{csv,json}`

## 3. First full product/technical blueprint

A complete first blueprint was then produced under the temporary working name **MachinaPort**. It proposed a model-agnostic, policy-first control layer with:

- Cloudflare control plane;
- outbound device connectivity;
- local policy authority;
- filesystem/process/Git tools first;
- GUI/browser later;
- multi-device and multi-AI compatibility;
- auditability and progressive sandboxing.

MachinaPort was later explicitly rejected as a product name. The blueprint remains important because it records the first coherent architecture before later corrections.

Historical snapshots:
- `artifacts/archive/2026-09-29-product-technical-blueprint-machinaport-draft.md`
- `artifacts/source/chatgpt/2026-09-29/machinaport_product_technical_blueprint_2026-09-29.md`

## 4. ChatGPT Plus/plugin feasibility correction

A critical discovery followed: the target experience must not depend on a Plus user manually registering a custom full-write MCP.

The architecture therefore distinguishes:

- **distribution layer:** public ChatGPT plugin/app;
- **AI integration layer:** remote MCP backend;
- **control plane:** hosted routing/auth/policy metadata;
- **device plane:** secure local agent.

This is recorded in:
- `docs/discovery/feasibility/chatgpt-plus-public-plugin.md`
- `docs/architecture/adr/0002-chatgpt-plugin-and-remote-mcp.md`

The end-to-end Plus/public-plugin behavior remains a release gate that must be validated against current OpenAI product rules before implementation is considered final.

## 5. Naming discovery — round 1 (2026-09-29)

The project deliberately stopped using pragmatic compound names and ran a structured naming process.

The first round elevated **Telechir**, a historical teleoperation term for a hand-like remote manipulator, to `NAME_CONDITIONAL`. It had unusually strong semantic fit, but pronunciation, domain/package and trademark clearance remained unresolved.

Artifacts:
- `artifacts/reports/naming/2026-09-29-naming-discovery-report.md`
- `artifacts/datasets/naming/2026-09-29-naming-discovery-candidates.json`

## 6. Naming discovery — round 2 (2026-10-01)

A broader second round generated and screened additional semantic territories and candidates. Creative finalists included **Grapnel, Skeg, Nervo, Prehend and Hawse**, but the round concluded `NAME_NOT_READY` because the strongest creative names had material clearance/collision problems.

Artifacts:
- `artifacts/reports/naming/2026-10-01-naming-discovery-report.md`
- `artifacts/datasets/naming/2026-10-01-naming-discovery-catalog.json`
- `artifacts/datasets/naming/2026-10-01-naming-discovery-top20.csv`
- `artifacts/datasets/naming/2026-10-01-naming-discovery-raw-candidates.csv`

The combined working exports from both rounds are deduplicated into:
- `artifacts/datasets/naming/canonical-naming-candidates.csv`

## 7. Why the repository exists before the final brand

The descriptive repository name `ai-computer-control-research` is intentional. The repository is the versioned memory of the project while the brand is unresolved.

It preserves:
- original research evidence;
- superseded decisions;
- live conclusions;
- ADRs;
- security thinking;
- feasibility gates;
- naming work;
- future implementation plans.

This prevents later coding agents or contributors from mistaking the latest document for the entire history of why the product exists.

## 8. Current state

The project remains in **Product & Technical Discovery / Research Foundation**.

Current gates:
1. naming must reach an acceptable final state;
2. ChatGPT Plus + public plugin path must be validated end-to-end;
3. Blueprint v2 must incorporate those results;
4. Definition of Ready must be rerun before production implementation.

Historical artifacts should never be silently rewritten to match newer decisions. New conclusions supersede old ones through living docs and ADRs.
