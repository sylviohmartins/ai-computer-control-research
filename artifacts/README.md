# Artefatos de Pesquisa

Este diretório armazena snapshots datados e, em sua maioria, imutáveis, produzidos durante pesquisa e discovery.

## Convenções

- nomes de arquivos começam com a data no formato `YYYY-MM-DD` quando aplicável;
- `reports/` contém relatórios legíveis por pessoas;
- `datasets/` contém exports estruturados usados para reproduzir ou estender análises;
- `archive/` contém snapshots superados que continuam relevantes para rastreabilidade histórica;
- `source/` preserva fontes relevantes quando o material curado não é suficiente;
- `provenance/` mapeia artefatos originados no ChatGPT para suas representações no repositório e checksums;
- conclusões vivas pertencem a `docs/`; artefatos arquivados não devem ser silenciosamente reescritos para acompanhar decisões mais novas.

## 2026-09-29 — Censo do ecossistema de controle de computadores por IA

- `reports/2026-09-29-ai-computer-control-ecosystem-census.md`
- `datasets/2026-09-29-ai-computer-control-ecosystem-census.csv`
- `datasets/2026-09-29-ai-computer-control-ecosystem-census.json`

A pesquisa de origem normalizou 181 candidatos materialmente relevantes entre bridges/MCP servers, coding agents, ferramentas de computer-use/browser, sandboxes e executores CI/CD. Afirmações mutáveis devem ser tratadas como pesquisa datada e revalidadas antes de decisões de produto.

## 2026-09-29 — Draft do blueprint técnico/de produto

- `archive/2026-09-29-product-technical-blueprint-machinaport-draft.md`
- `source/chatgpt/2026-09-29/2026-09-29-product-technical-blueprint-machinaport-draft.md`

O blueprint utilizou o working name rejeitado **MachinaPort** e antecede o gate atual de viabilidade ChatGPT Plus/plugin público. É contexto histórico, não fonte de verdade atual.

## 2026-09-29 e 2026-10-01 — Naming discovery

Relatórios:
- `reports/naming/2026-09-29-naming-discovery-report.md`
- `reports/naming/2026-10-01-naming-discovery-report.md`

Datasets:
- `datasets/naming/2026-09-29-naming-discovery-candidates.json`
- `datasets/naming/2026-10-01-naming-discovery-catalog.json`
- `datasets/naming/2026-10-01-naming-discovery-top20.csv`
- `datasets/naming/2026-10-01-naming-discovery-raw-candidates.csv`
- `datasets/naming/canonical-naming-candidates.csv`

O dataset canônico de naming deduplica grandes exports intermediários, preservando a linhagem das fontes.

## Proveniência

Consulte:
- `provenance/source-manifest.json` para nomes originais, nomes normalizados, datas, tamanhos, SHA-256 e mapeamentos;
- `provenance/coverage.md` para a matriz legível de cobertura.

A política preserva **história e linha de raciocínio** sem transformar o repositório em um dump desestruturado de downloads repetidos.
