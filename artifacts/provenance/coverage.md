# ChatGPT Artifact Coverage

This matrix answers a specific project-governance question: **is every file generated/used during the originating ChatGPT research represented in the repository?**

As of 2026-10-01, **yes at the content/provenance level**. Some large working exports are intentionally normalized instead of duplicated verbatim. See `source-manifest.json` for SHA-256 checksums and exact mappings.

| Source artifact | Repository representation | Treatment |
|---|---|---|
| `79CAF644-44B8-427F-BEDC-C35FB7D58E69.jpeg` | `docs/history/research-lineage.md` + manifest | historical evidence described; checksum preserved |
| `relatorio_censo_ferramentas_ai_execucao_2026-09-29.md` | `artifacts/reports/2026-09-29-ai-computer-control-ecosystem-census.md` | archived report |
| `censo_ferramentas_ai_execucao_2026-09-29.csv` | `artifacts/datasets/2026-09-29-ai-computer-control-ecosystem-census.csv` | canonical dataset |
| `censo_ferramentas_ai_execucao_2026-09-29.json` | `artifacts/datasets/2026-09-29-ai-computer-control-ecosystem-census.json` | normalized structured dataset |
| `machinaport_product_technical_blueprint_2026-09-29.md` | `artifacts/archive/...` + `artifacts/source/chatgpt/...` | superseded blueprint retained historically |
| `naming_discovery_report_2026-09-29.md` | `artifacts/reports/naming/2026-09-29-naming-discovery-report.md` | archived report |
| `naming_discovery_candidates_2026-09-29.json` | `artifacts/datasets/naming/2026-09-29-naming-discovery-candidates.json` | archived structured discovery |
| `naming_candidates_2026-09-29.json` | `artifacts/datasets/naming/canonical-naming-candidates.csv` | normalized/deduplicated |
| `naming_candidates_2026-09-29.csv` | `artifacts/datasets/naming/canonical-naming-candidates.csv` | normalized/deduplicated |
| `naming_discovery_report_2026-10-01.md` | `artifacts/reports/naming/2026-10-01-naming-discovery-report.md` | archived report |
| `naming_discovery_catalog_2026-10-01.json` | `artifacts/datasets/naming/2026-10-01-naming-discovery-catalog.json` | archived structured discovery |
| `naming_discovery_top20_2026-10-01.csv` | `artifacts/datasets/naming/2026-10-01-naming-discovery-top20.csv` | archived shortlist |
| `naming_discovery_raw_candidates_2026-10-01.csv` | `artifacts/datasets/naming/2026-10-01-naming-discovery-raw-candidates.csv` | archived raw shortlist export |
| `naming_candidates_2026-10-01.json` | `artifacts/datasets/naming/canonical-naming-candidates.csv` | normalized/deduplicated |
| `naming_candidates_2026-10-01.csv` | `artifacts/datasets/naming/canonical-naming-candidates.csv` | normalized/deduplicated |

## Duplicate references

The ChatGPT file list contained repeated references to the census report/CSV/JSON and the MachinaPort blueprint. They are the same source artifacts and are intentionally represented once.

## Why normalize some exports?

The large `naming_candidates_*.{csv,json}` files are intermediate projections of the same candidate pool. Keeping each verbatim would create redundant, noisy sources of truth. Their candidate content is merged into `canonical-naming-candidates.csv`, which retains source-file lineage per candidate. The original source checksums remain in `source-manifest.json`.

If a future audit requires byte-for-byte recovery, the manifest identifies which original artifact needs to be recovered from the originating ChatGPT/library export.
