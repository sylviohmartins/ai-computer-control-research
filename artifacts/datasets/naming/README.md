# Datasets de Naming

Evidência estruturada utilizada no Naming Discovery.

## Snapshots datados

- `2026-09-29-naming-discovery-candidates.json`
- `2026-10-01-naming-discovery-catalog.json`
- `2026-10-01-naming-discovery-top20.csv`
- `2026-10-01-naming-discovery-raw-candidates.csv`
- `2026-10-01-constructed-name-candidates.csv` — universo de 560 candidatos da Stage 2.
- `2026-10-01-constructed-name-shortlist.csv` — shortlist da Stage 2.
- `2026-10-01-constructed-name-catalog.json` — gate, finalistas e metodologia da Stage 2.
- `2026-10-01-final-clearance.json` — resultado estruturado da Stage 3.
- `2026-10-02-final-name-selection.json` — **decisão final: Telechir / `NAME_READY`**.

## Projeção canônica

- `canonical-naming-candidates.csv` — projeção deduplicada dos exports anteriores. Mantém primeira/última ocorrência, melhor estágio/score observado e linhagem do arquivo de origem.

Os grandes exports intermediários também são preservados em `artifacts/source/chatgpt/` com nomes normalizados em inglês. Checksums SHA-256 e mapeamentos ficam em `artifacts/provenance/source-manifest.json`.
