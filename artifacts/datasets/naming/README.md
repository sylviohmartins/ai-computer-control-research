# Datasets de Naming

Evidência estruturada utilizada no naming discovery.

## Snapshots datados

- `2026-09-29-naming-discovery-candidates.json`
- `2026-10-01-naming-discovery-catalog.json`
- `2026-10-01-naming-discovery-top20.csv`
- `2026-10-01-naming-discovery-raw-candidates.csv`

- `2026-10-01-constructed-name-candidates.csv` — universo de 560 candidatos construídos/normalizados da Stage 2.
- `2026-10-01-constructed-name-shortlist.csv` — shortlist comparativa da Stage 2.
- `2026-10-01-constructed-name-catalog.json` — gate, finalistas, metodologia e pendências de clearance da Stage 2.

## Projeção canônica

- `canonical-naming-candidates.csv` — projeção deduplicada dos exports de candidatos das duas rodadas. Mantém primeira/última ocorrência, melhor estágio/score observado e linhagem do arquivo de origem.

Os grandes exports intermediários `naming_candidates_*.csv/json` também são preservados em `artifacts/source/chatgpt/` com nomes normalizados em inglês. Checksums SHA-256 e mapeamentos ficam em `artifacts/provenance/source-manifest.json`.
