# Definition of Ready — Phase 0

**Data:** 2026-10-02  
**Status:** READY_FOR_PHASE_0

## Objetivo

Determinar se Telechir possui definição suficiente para iniciar **Phase 0 — Repository & Protocol Specifications** sem reabrir decisões fundamentais.

## Checklist

- [x] visão do produto e non-goals;
- [x] marca oficial Telechir / NAME_READY;
- [x] arquitetura externa/interna separada;
- [x] distribuição ChatGPT por plugin/app público + Remote MCP definida;
- [x] referência empírica de write/process em conta Plus;
- [x] control plane Cloudflare definido conceitualmente;
- [x] local policy authority;
- [x] local agent stack recomendada;
- [x] permissions/approvals model;
- [x] tool catalog MVP;
- [x] acceptance criteria formais por tool;
- [x] process lifecycle;
- [x] pairing/device identity;
- [x] filesystem boundary;
- [x] threat families e abuse cases;
- [x] MVP delimitado;
- [x] roadmap faseado;
- [x] golden Java/Spring vertical slice;
- [x] licensing/open-source strategy aceita em ADR-0005;
- [x] Blueprint v2 consolidado.

## Gates que não bloqueiam Phase 0

- COMMERCIAL_CLEARANCE_PENDING;
- aprovação do plugin Telechir pela OpenAI;
- quota/metering do plugin próprio;
- rename físico do repositório;
- code signing;
- infraestrutura Cloudflare real.

Esses itens bloqueiam releases ou fases de runtime conforme o roadmap, não especificações.

## Phase 0 pode

- congelar protocol envelopes/versionamento;
- definir schemas das tools;
- definir error model;
- detalhar OAuth/device identity/pairing;
- detalhar policy/approval contracts;
- definir D1 schema conceitual;
- produzir ADRs;
- definir package/repository boundaries;
- adicionar LICENSE e contributor policy antes do primeiro código distribuível;
- criar fixtures e exemplos de contrato.

## Phase 0 não pode

- provisionar produção;
- publicar plugin;
- executar remote commands reais por Telechir;
- iniciar runtime funcional;
- adicionar GUI/browser;
- considerar release gates concluídos sem evidência.

## Critério de saída

Outro agente/engenheiro deverá conseguir implementar a Phase 1 sem inventar:
- nomes de mensagens;
- request/result schemas;
- error codes;
- policy precedence;
- identity boundaries;
- version negotiation;
- ownership de estado;
- acceptance tests.

## Decisão

**Telechir está READY para iniciar a Phase 0 documental/especificativa.**

Ainda não está READY para Phase 1/runtime de produção.
