# Phase 0 Exit Review — Repository & Protocol Specifications

**Data:** 2026-10-02  
**Status:** `PHASE_0_COMPLETE`  
**Próximo gate:** `READY_FOR_PHASE_1` — implementação do Local Agent Core, somente em execução posterior explicitamente dedicada a build/test.

## Critérios de saída

- [x] licença do core definida e arquivo LICENSE presente;
- [x] contributor policy definida;
- [x] boundaries do monorepo futuro definidos;
- [x] protocolo cloud↔device definido e versionado;
- [x] envelopes e error model em JSON Schema;
- [x] todos os `message_type` do baseline vinculados a payloads específicos em JSON Schema;
- [x] version negotiation e capabilities definidos;
- [x] catálogo público de tools definido;
- [x] mapping explícito entre nomes públicos MCP e operações internas;
- [x] request/result contracts definidos;
- [x] schemas machine-readable das tools definidos;
- [x] `securitySchemes` OAuth e refs de input/output definidos por tool;
- [x] OAuth/client access definido;
- [x] device identity e pairing definidos;
- [x] policy precedence, risk e approvals definidos;
- [x] state ownership Cloudflare/agent definido;
- [x] modelo conceitual D1 definido;
- [x] fixtures de contrato adicionadas;
- [x] JSON dos contratos validado sintaticamente;
- [x] fixtures de protocolo validadas contra envelope+payload; fixture negativa falha somente pela regra esperada;
- [x] consistência catálogo↔schemas↔operações↔error codes validada;
- [x] STRIDE baseline formalizado;
- [x] 40 abuse cases documentados;
- [x] tabletop exercises atualizados;
- [x] ADRs essenciais aceitos.

## Auditoria final de contratos

A revisão independente em `docs/testing/acceptance/phase0-contract-audit-2026-10-02.md` encontrou e corrigiu gaps de binding de payload, namespaces de tool e materialização de OAuth.

Validação final executada nesta branch:
- 15/15 `message_type` com binding de payload e defs existentes;
- 4 fixtures positivas de protocolo com zero erros;
- 1 fixture negativa rejeitada somente por ausência de `idempotency_key`;
- 18/18 tools com nomes únicos, input/output refs resolvidas e `securitySchemes` OAuth;
- 17/17 error codes sincronizados com os acceptance criteria;
- mappings de todas as tools executadas no device presentes na enum de operações internas;
- revisão MCP `2026-07-28` e requisitos atuais de OAuth da OpenAI revalidados em 2026-10-02.

## Decisões congeladas para Phase 1

1. **Local Agent:** Rust.
2. **Device transport:** WebSocket TLS outbound.
3. **Internal protocol:** Telechir Device Protocol 0.1, independente de MCP.
4. **External AI tool interface:** Remote MCP como interface principal.
5. **Policy:** agent local é autoridade final.
6. **Control plane target:** Cloudflare.
7. **Cloud state:** Workers stateless; DO realtime/locks; D1 metadata; R2 artifacts.
8. **Long-running processes:** handles explícitos owned pelo agent.
9. **Filesystem writes:** precondition/hash + canonicalization antes de policy.
10. **Licensing:** Apache-2.0 para o core público.

## O que Phase 0 deliberadamente não fez

- não criou runtime Rust;
- não criou Worker/Durable Object;
- não criou D1 real;
- não fez deploy;
- não publicou plugin;
- não executou comandos remotos via Telechir;
- não implementou GUI/browser/sandbox.

## Gates que permanecem

### Antes de lançamento público/comercial
- commercial clearance da marca;
- namespaces/domínios/trademark;
- plugin review;
- Plus availability do plugin próprio;
- quota/metering;
- signed release/update;
- cost/load validation.

### Antes de Phase 1 mergeável
A implementação do agent deverá demonstrar:
- build/test cross-platform baseline;
- device identity local;
- protocol framing;
- policy boundary scaffolding;
- nenhuma execução real fora dos contratos da Phase 0.

## Resultado

Os contratos agora são suficientemente detalhados para que a Phase 1 comece sem redesenhar:
- message names;
- request/result schemas;
- errors;
- policy precedence;
- identity boundaries;
- version negotiation;
- state ownership;
- acceptance criteria.

**Gate final desta revisão: `READY_FOR_PHASE_1`.**

**Integração:** o conteúdo está concluído na branch `phase0/repository-protocol-specifications`; a issue #13 deve permanecer aberta até a integração em `main`.
