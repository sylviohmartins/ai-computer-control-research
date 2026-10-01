# Definition of Ready — Implementação

**Data:** 2026-10-01  
**Status:** `CONDITIONAL_READY`

## Objetivo

Avaliar se o projeto possui definição suficiente para iniciar a **Phase 0 — Repository and protocol specifications** sem reabrir decisões fundamentais.

## Checklist

- [x] visão do produto definida;
- [x] non-goals iniciais definidos;
- [x] arquitetura externa/interna separada;
- [x] estratégia ChatGPT plugin público + Remote MCP validada por referência;
- [x] control plane principal definido conceitualmente;
- [x] local policy authority definida;
- [x] local agent stack recomendada;
- [x] modelo inicial de permissions/approvals;
- [x] tool catalog MVP;
- [x] process lifecycle;
- [x] pairing/device identity;
- [x] filesystem boundary;
- [x] threat families;
- [x] MVP delimitado;
- [x] roadmap faseado;
- [x] golden vertical slice;
- [~] naming: discovery concluído, mas Telechir permanece `NAME_CONDITIONAL`;
- [ ] estratégia de licenciamento/open source aceita em ADR;
- [ ] clearance autoritativo/reserva da marca;
- [ ] acceptance criteria detalhados por tool da Phase 0.

## Interpretação

O projeto está tecnicamente pronto para **especificação** da Phase 0, mas ainda não para implementar runtime de produção.

A Phase 0 pode produzir:
- schemas;
- ADRs;
- protocol specification;
- security invariants;
- repository contracts;
- test plans.

A Phase 0 não deve:
- criar cloud resources de produção;
- publicar plugin;
- iniciar agent/runtime funcional de produção;
- comprometer naming definitivo.

## Gates para `READY`

1. decidir estratégia de licenciamento/open source;
2. transformar contratos MVP em acceptance criteria formais;
3. promover a marca a `NAME_READY` ou aceitar formalmente trabalhar com codename/TBD até depois da Phase 0.

## Release gates não bloqueadores da Phase 0

Não é possível exigir antes da implementação:
- aprovação do nosso plugin final;
- quota real do nosso plugin publicado.

Esses itens permanecem release/beta gates.

## Decisão

**`CONDITIONAL_READY` para iniciar Phase 0 documental/especificativa.**

**Ainda não READY para Phase 1/runtime.**
