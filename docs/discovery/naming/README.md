# Naming Discovery

**Status:** rodada de pesquisa concluída; nova rodada/clearance ainda necessária  
**Gate:** `NAME_NOT_READY`  
**Atualizado em:** 2026-10-01

O projeto intencionalmente **ainda não possui um nome de produto aprovado**.

## Sequência histórica

### Rodada 1 — 2026-09-29

A primeira rodada estruturada elevou **Telechir** a `NAME_CONDITIONAL`.

Por que sobreviveu:
- termo histórico autêntico de teleoperação;
- fit incomumente forte com o conceito de “mão remota/camada de ação”;
- história de marca e potencial visual fortes;
- baixa colisão preliminar com software.

Por que não passou:
- preocupação com pronúncia/spellability;
- disponibilidade de domínio/packages não verificada de forma autoritativa;
- trademark clearance incompleto.

Fonte: `artifacts/reports/naming/2026-09-29-naming-discovery-report.md`.

### Rodada 2 — 2026-10-01

Uma rodada criativa mais ampla explorou novos territórios semânticos e gerou universo maior de candidatos.

Finalistas criativos incluíram:
- Grapnel;
- Skeg;
- Nervo;
- Prehend;
- Hawse.

O gate voltou a **`NAME_NOT_READY`** porque os nomes mais fortes apresentaram colisões relevantes em busca, software/packages ou pendências de clearance. O processo recusou intencionalmente escolher “o menos ruim” apenas para avançar.

Fonte: `artifacts/reports/naming/2026-10-01-naming-discovery-report.md`.

## Working name rejeitado

**MachinaPort** foi rejeitado após o primeiro blueprint por parecer excessivamente pragmático/descritivo e não atingir o padrão esperado de oralidade, autenticidade e potencial de marca. Artefatos históricos podem continuar contendo esse nome; essas ocorrências não representam decisão atual.

## Objetivo da marca

Encontrar um nome que consiga existir por conta própria como marcas fortes de tecnologia: memorável, fácil de pronunciar, fácil de escrever, utilizável internacionalmente e amplo o suficiente para continuar válido caso o produto ultrapasse o caso de remote desktop.

A marca deve sugerir alguma combinação de **capacidade, confiança, inteligência e movimento**, evitando concatenações mecânicas de palavras como `AI`, `Agent`, `Machine`, `Desktop`, `Remote`, `Bridge`, `Port` ou `Control`.

## Funil obrigatório

1. Pesquisar linguagem da categoria e naming de concorrentes.
2. Definir territórios semânticos independentes.
3. Gerar centenas de candidatos diversos.
4. Filtrar por semântica, fonética e memorabilidade.
5. Executar search-collision screening.
6. Executar testes de oralidade e conotação em PT-BR / EN / ES.
7. Verificar packages, domínios e handles.
8. Analisar profundamente os finalistas.
9. Fazer preliminary trademark screening.
10. Definir `NAME_READY`, `NAME_CONDITIONAL` ou `NAME_NOT_READY`.

## Prioridades de avaliação

Maior peso para:
- memorabilidade e distintividade;
- sonoridade e pronúncia em PT-BR / inglês / espanhol;
- escrita natural / radio test;
- história de marca convincente;
- extensibilidade para Agent, CLI, Cloud, MCP, Runtime e SDK;
- baixa colisão em busca.

SEO deve vir principalmente do descriptor e da arquitetura de conteúdo do produto, não de keyword stuffing no nome.

## Linhagem dos dados

Os exports das duas rodadas estão representados em:
- datasets datados em `artifacts/datasets/naming/`;
- `artifacts/datasets/naming/canonical-naming-candidates.csv`, projeção deduplicada que preserva proveniência;
- `artifacts/provenance/source-manifest.json`, que registra todo arquivo originário e seu SHA-256.

## Naming do repositório

`ai-computer-control-research` é intencionalmente descritivo e seguro enquanto a marca estiver pendente. Não renomeie o repositório para uma marca de produto antes de o naming gate ser aprovado.
