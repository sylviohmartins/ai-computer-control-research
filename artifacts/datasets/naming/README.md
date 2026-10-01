# Naming Datasets

Structured evidence behind naming discovery.

## Dated snapshots

- `2026-09-29-naming-discovery-candidates.json`
- `2026-10-01-naming-discovery-catalog.json`
- `2026-10-01-naming-discovery-top20.csv`
- `2026-10-01-naming-discovery-raw-candidates.csv`

## Canonical projection

- `canonical-naming-candidates.csv` — deduplicated projection of the candidate exports from both naming rounds. It retains first/last seen dates, best observed stage/score and the originating source filenames.

Large intermediate `naming_candidates_*.csv/json` exports are represented through this canonical projection rather than duplicated verbatim. Their SHA-256 checksums and mapping are retained under `artifacts/provenance/source-manifest.json`.
