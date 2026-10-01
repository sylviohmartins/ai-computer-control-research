# Naming Discovery

**Status:** etapa de nomes construídos concluída; clearance autoritativo ainda necessário  
**Gate:** `NAME_CONDITIONAL`  
**Primary candidate:** **Telechir**  
**Atualizado em:** 2026-10-01

O projeto ainda não possui uma marca juridicamente/operacionalmente aprovada. A recomendação primária atual é **Telechir**, mas o repositório continua com nome descritivo até `NAME_READY`.

## Sequência histórica

### Rodada 1 — 2026-09-29

A primeira rodada estruturada elevou **Telechir** a `NAME_CONDITIONAL`.

Por que sobreviveu:
- termo técnico histórico e autêntico de teleoperação;
- fontes terminológicas o definem como manipulador remoto semelhante a uma mão;
- fit excepcional com o conceito de transformar intenção de uma IA em ação autorizada na máquina;
- boa extensibilidade para Agent, CLI, MCP, Runtime e SDK.

Pendências identificadas:
- pronúncia/spellability;
- domínio/packages sem verificação autoritativa;
- trademark clearance incompleto.

Fonte: `artifacts/reports/naming/2026-09-29-naming-discovery-report.md`.

### Rodada ampliada de palavras reais — 2026-10-01

Foram explorados 333 candidatos em 24 territórios. Grapnel, Skeg, Nervo, Prehend e Hawse foram os finalistas criativos, mas todos apresentaram colisões contemporâneas suficientes para bloquear a marca.

O gate voltou a `NAME_NOT_READY`.

Fonte: `artifacts/reports/naming/2026-10-01-naming-discovery-report.md`.

### Stage 2 — Constructed Distinctive Names — 2026-10-01

A etapa seguinte testou a hipótese de que nomes construídos poderiam escapar da saturação observada entre palavras reais curtas.

Resultados:
- **560 candidatos construídos/normalizados** materializados;
- screening antecipado de colisão em candidatos promissores;
- shortlist de 10;
- finalistas: **Telechir, Clevren, Ferenis, Kheric e Tactren**;
- nenhum nome construído superou Telechir em autenticidade + storytelling + fit de produto;
- **Telechir retorna como primary candidate**, com `NAME_CONDITIONAL`.

Fontes:
- `artifacts/reports/naming/2026-10-01-constructed-names-discovery-report.md`;
- `artifacts/datasets/naming/2026-10-01-constructed-name-candidates.csv`;
- `artifacts/datasets/naming/2026-10-01-constructed-name-shortlist.csv`;
- `artifacts/datasets/naming/2026-10-01-constructed-name-catalog.json`.

## Por que Telechir

A história de marca é intrínseca ao termo:

> **A IA pensa; Telechir é a mão remota, autorizada e auditável que transforma intenção em ação sobre uma máquina.**

Essa metáfora continua válida se o produto evoluir de filesystem/terminal para browser, GUI, servidores, sandboxes e outros execution environments.

## Sistema de naming candidato

```text
Telechir
telechir
telechir-agent
telechir-cli
telechir-mcp
telechir-sdk
@telechir/core
@telechir/mcp
Telechir Cloud
Telechir Runtime
Telechir Enterprise
```

Descriptor de trabalho:

> **Secure computer control for AI agents**

## Clearance necessário para NAME_READY

Antes de tratar Telechir como marca aprovada:

1. consultar domínio em registrador/RDAP/WHOIS autoritativo;
2. consultar diretamente npm, PyPI, crates.io e outros namespaces desejados;
3. verificar handles sociais relevantes em tempo real;
4. executar busca direta no INPI para marca exata e semelhantes nas classes aplicáveis;
5. executar USPTO/EUIPO/WIPO se o escopo comercial for internacional;
6. fazer um pequeno teste oral/soletração em PT-BR, inglês e espanhol.

Ausência em mecanismos de busca não prova disponibilidade.

## Working name rejeitado

**MachinaPort** permanece rejeitado. Artefatos históricos podem conter esse nome, mas ele não representa decisão atual.

## Objetivo da marca

A marca deve ser memorável, pronunciável, internacionalmente utilizável, fácil de escrever e ampla o suficiente para continuar válida quando o produto ultrapassar o caso de remote desktop.

A personalidade-alvo permanece:

> **capacidade + confiança + inteligência + movimento**

## Naming do repositório

`ai-computer-control-research` continua intencionalmente descritivo e temporário.

**Não renomeie o repositório para Telechir enquanto o gate permanecer `NAME_CONDITIONAL`.**
