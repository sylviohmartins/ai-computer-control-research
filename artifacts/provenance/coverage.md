# Cobertura dos Artefatos do ChatGPT

Esta matriz responde à pergunta de governança: **todos os arquivos gerados ou utilizados no trabalho originário do ChatGPT estão contemplados no repositório?**

Em 2026-10-01, **sim**. Todos os artefatos únicos de texto/dados estão preservados em `artifacts/source/chatgpt/<date>/` com nomes de arquivo normalizados em inglês, além de suas representações curadas/canônicas. A imagem binária de referência é contemplada por um registro semântico de evidência, nome original, tamanho e SHA-256.

Consulte `source-manifest.json` para o mapeamento exato.

| Artefato original | Fonte normalizada no repositório | Representação principal | Tratamento |
|---|---|---|---|
| `79CAF644-44B8-427F-BEDC-C35FB7D58E69.jpeg` | registro em `artifacts/evidence/` | `docs/history/research-lineage.md` + manifesto | evidência histórica descrita; checksum preservado |
| `relatorio_censo_ferramentas_ai_execucao_2026-09-29.md` | `artifacts/source/chatgpt/2026-09-29/2026-09-29-ai-computer-control-ecosystem-census-report.md` | `artifacts/reports/2026-09-29-ai-computer-control-ecosystem-census.md` | relatório arquivado |
| `censo_ferramentas_ai_execucao_2026-09-29.csv` | `artifacts/source/chatgpt/2026-09-29/2026-09-29-ai-computer-control-ecosystem-census.csv` | `artifacts/datasets/2026-09-29-ai-computer-control-ecosystem-census.csv` | dataset canônico |
| `censo_ferramentas_ai_execucao_2026-09-29.json` | `artifacts/source/chatgpt/2026-09-29/2026-09-29-ai-computer-control-ecosystem-census.json` | `artifacts/datasets/2026-09-29-ai-computer-control-ecosystem-census.json` | dataset estruturado normalizado |
| `machinaport_product_technical_blueprint_2026-09-29.md` | `artifacts/source/chatgpt/2026-09-29/2026-09-29-product-technical-blueprint-machinaport-draft.md` | `artifacts/archive/2026-09-29-product-technical-blueprint-machinaport-draft.md` | blueprint superado preservado historicamente |
| `naming_discovery_report_2026-09-29.md` | `artifacts/source/chatgpt/2026-09-29/2026-09-29-naming-discovery-report.md` | `artifacts/reports/naming/2026-09-29-naming-discovery-report.md` | relatório histórico |
| `naming_discovery_candidates_2026-09-29.json` | `artifacts/source/chatgpt/2026-09-29/2026-09-29-naming-discovery-candidates.json` | `artifacts/datasets/naming/2026-09-29-naming-discovery-candidates.json` | discovery estruturado |
| `naming_candidates_2026-09-29.json` | `artifacts/source/chatgpt/2026-09-29/2026-09-29-naming-candidates.json` | `artifacts/datasets/naming/canonical-naming-candidates.csv` | export preservado + projeção canônica |
| `naming_candidates_2026-09-29.csv` | `artifacts/source/chatgpt/2026-09-29/2026-09-29-naming-candidates.csv` | `artifacts/datasets/naming/canonical-naming-candidates.csv` | export preservado + projeção canônica |
| `naming_discovery_report_2026-10-01.md` | `artifacts/source/chatgpt/2026-10-01/2026-10-01-naming-discovery-report.md` | `artifacts/reports/naming/2026-10-01-naming-discovery-report.md` | relatório histórico |
| `naming_discovery_catalog_2026-10-01.json` | `artifacts/source/chatgpt/2026-10-01/2026-10-01-naming-discovery-catalog.json` | `artifacts/datasets/naming/2026-10-01-naming-discovery-catalog.json` | discovery estruturado |
| `naming_discovery_top20_2026-10-01.csv` | `artifacts/source/chatgpt/2026-10-01/2026-10-01-naming-discovery-top20.csv` | `artifacts/datasets/naming/2026-10-01-naming-discovery-top20.csv` | shortlist histórica |
| `naming_discovery_raw_candidates_2026-10-01.csv` | `artifacts/source/chatgpt/2026-10-01/2026-10-01-naming-discovery-raw-candidates.csv` | `artifacts/datasets/naming/2026-10-01-naming-discovery-raw-candidates.csv` | export bruto histórico |
| `naming_candidates_2026-10-01.json` | `artifacts/source/chatgpt/2026-10-01/2026-10-01-naming-candidates.json` | `artifacts/datasets/naming/canonical-naming-candidates.csv` | export preservado + projeção canônica |
| `naming_candidates_2026-10-01.csv` | `artifacts/source/chatgpt/2026-10-01/2026-10-01-naming-candidates.csv` | `artifacts/datasets/naming/canonical-naming-candidates.csv` | export preservado + projeção canônica |

## Referências duplicadas

A lista de arquivos do chat continha referências repetidas ao relatório/CSV/JSON do censo e ao blueprint MachinaPort. São o mesmo artefato de origem e são representados uma única vez.

## Por que manter fonte e representação canônica?

Os exports `naming_candidates_*.{csv,json}` são projeções intermediárias grandes do mesmo universo de candidatos. Eles permanecem preservados em `artifacts/source/chatgpt/`, enquanto análises futuras devem preferir `canonical-naming-candidates.csv`.

A imagem binária é o único artefato não copiado byte a byte; seu significado, arquivo original, tamanho e SHA-256 são preservados em `artifacts/evidence/` e no manifesto.


## Artefatos gerados diretamente no repositório nesta etapa

A Stage 2 de naming foi produzida diretamente na branch de pesquisa, portanto seus artefatos não precisam de uma segunda cópia em `artifacts/source/chatgpt/`. Eles são preservados pelo histórico Git e registrados no manifesto:

| Artefato | Tipo | Papel |
|---|---|---|
| `artifacts/reports/naming/2026-10-01-constructed-names-discovery-report.md` | relatório | conclusão narrativa da Stage 2 |
| `artifacts/datasets/naming/2026-10-01-constructed-name-candidates.csv` | dataset | 560 candidatos construídos |
| `artifacts/datasets/naming/2026-10-01-constructed-name-shortlist.csv` | dataset | shortlist comparativa |
| `artifacts/datasets/naming/2026-10-01-constructed-name-catalog.json` | dataset | gate, finalistas e pendências |

A documentação viva correspondente está em `docs/discovery/naming/README.md`.
