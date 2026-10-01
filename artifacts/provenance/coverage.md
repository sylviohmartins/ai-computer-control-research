# ChatGPT Artifact Coverage

This matrix answers a specific project-governance question: **is every file generated/used during the originating ChatGPT research represented in the repository?**

As of 2026-10-01, **yes**. Every text/data source artifact is also preserved under `artifacts/source/chatgpt/<date>/` with its original filename, while curated/normalized representations remain available for practical use. The one binary reference image is represented by a dedicated evidence record plus original filename, size and SHA-256 checksum. See `source-manifest.json` for exact mappings.

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

The large `naming_candidates_*.{csv,json}` files are intermediate projections of the same candidate pool. They are preserved under `artifacts/source/chatgpt/` for provenance, while ongoing analysis should use `canonical-naming-candidates.csv`, which deduplicates the candidate universe and retains source-file lineage per candidate.

The binary screenshot is the only source not copied verbatim; its semantic evidence record and SHA-256 allow later recovery/verification if required.
