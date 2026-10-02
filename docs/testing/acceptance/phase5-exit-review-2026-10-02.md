# Phase 5 Exit Review — Remote MCP Integration and OAuth

**Data:** 2026-10-02  
**Branch:** `phase5/remote-mcp-oauth`  
**Issue:** #25  
**Resultado:** `PHASE_5_COMPLETE` na branch; integração em `main` pendente até o merge.

## Escopo entregue

### Remote MCP

- endpoint `/mcp` por Streamable HTTP;
- baseline moderno MCP com `server/discover`;
- `tools/list` e `tools/call`;
- descriptors derivados de `specs/tools/tool-catalog.json`;
- input/output schemas derivados de `public-tools.schema.json`;
- annotations e `securitySchemes` preservados;
- mirror de security schemes para compatibilidade OpenAI;
- superfície ativa limitada a `list_devices` e `get_device`;
- tools de fases futuras não são anunciadas nem executadas;
- request body limitado a 256 KiB.

### OAuth resource server

- Protected Resource Metadata;
- issuer/resource configuráveis;
- JWKS remoto com cache bounded;
- JWT RS256/ES256 allowlist;
- validação de `kid`, assinatura, issuer, audience/resource, `exp`, `nbf` e scopes;
- vínculo do subject externo com usuário Telechir por hash;
- ownership em D1 antes de retornar devices;
- migration `0003_oauth_identity_uniqueness.sql` garante unicidade de principal externo;
- 401/challenge e insufficient-scope exercitados;
- ausência de configuração falha fechado;
- access token não é enviado ao agent.

## Boundaries preservados

Não foram implementados:

- authorization server próprio;
- DCR endpoint próprio;
- filesystem;
- shell/process lifecycle;
- Git;
- approvals/audit operacional completo;
- dashboard;
- deploy remoto;
- publicação de plugin.

## Evidências

### Testes

- 10 arquivos de teste;
- **53 testes PASS**;
- casos incluem discovery moderno, catálogo de tools, ownership, device revogado, future tools bloqueadas, invalid token, wrong issuer/audience, expired token, future `nbf`, unknown subject/key, PKCE S256, cache de metadata/JWKS, scope challenge e body limit.

### Gates

- `npm run format:check` — PASS;
- `npm run typecheck` — PASS;
- `npm test` — 53/53 PASS;
- D1 migrations `0001 + 0002 + 0003` — PASS em estado local limpo;
- Wrangler dry-run — PASS;
- bundle: **774,05 KiB / gzip 151,91 KiB**;
- `npm audit --audit-level=high` — **0 vulnerabilidades**;
- deploy remoto — não executado.

## Decisão

A Phase 5 atende à issue #25 e pode ser marcada como **`PHASE_5_COMPLETE`** após integração desta branch.

O próximo trabalho é **Phase 6 — Filesystem Tools**, em tarefa dedicada.
