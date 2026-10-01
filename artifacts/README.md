# Research Artifacts

This directory stores dated, mostly immutable snapshots produced during research and discovery.

## Conventions

- Filenames start with the research date in `YYYY-MM-DD` form when practical.
- `reports/` contains human-readable generated reports.
- `datasets/` contains structured exports used to reproduce or extend analyses.
- `archive/` contains superseded snapshots that remain valuable for historical traceability.
- `source/` preserves important originating snapshots when a curated archive is not enough.
- `provenance/` maps original ChatGPT/library artifacts to their repository representation and checksums.
- Living conclusions belong under `docs/`; archived artifacts should not be silently rewritten to match later decisions.

## 2026-09-29 — AI computer-control ecosystem census

- `reports/2026-09-29-ai-computer-control-ecosystem-census.md`
- `datasets/2026-09-29-ai-computer-control-ecosystem-census.csv`
- `datasets/2026-09-29-ai-computer-control-ecosystem-census.json`

The source research normalized 181 materially relevant candidates spanning bridges/MCP servers, coding agents, computer-use/browser tools, sandboxes and CI/CD executors. Treat individual mutable claims as dated research and revalidate them before shipping product decisions.

## 2026-09-29 — Product & technical blueprint draft

- `archive/2026-09-29-product-technical-blueprint-machinaport-draft.md`
- `source/chatgpt/2026-09-29/machinaport_product_technical_blueprint_2026-09-29.md`

The blueprint used the now-rejected **MachinaPort** working name and predates the current ChatGPT Plus/public-plugin feasibility gate. It remains valuable as historical design context but is not current truth.

## 2026-09-29 and 2026-10-01 — Naming discovery

Reports:
- `reports/naming/2026-09-29-naming-discovery-report.md`
- `reports/naming/2026-10-01-naming-discovery-report.md`

Datasets:
- `datasets/naming/2026-09-29-naming-discovery-candidates.json`
- `datasets/naming/2026-10-01-naming-discovery-catalog.json`
- `datasets/naming/2026-10-01-naming-discovery-top20.csv`
- `datasets/naming/2026-10-01-naming-discovery-raw-candidates.csv`
- `datasets/naming/canonical-naming-candidates.csv`

The canonical naming dataset deduplicates large intermediate candidate exports from both rounds while retaining source-file lineage.

## Provenance

Use:
- `provenance/source-manifest.json` for exact source filenames, dates, sizes, SHA-256 checksums and canonical mappings;
- `provenance/coverage.md` for the human-readable coverage matrix.

This policy preserves the **history and reasoning trail** without turning the repository into an unstructured dump of repeated ChatGPT downloads.
