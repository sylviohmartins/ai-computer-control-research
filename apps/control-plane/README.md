# Telechir Control Plane

Control plane do Telechir em TypeScript para Cloudflare Workers.

## Fases implementadas

### Phase 2 — Hosted Control-Plane Skeleton

- Worker HTTP;
- `/health`, `/ready`, `/version`;
- `DeviceCoordinator` Durable Object skeleton;
- D1;
- boundaries para R2, Analytics Engine e Queue;
- testes via `@cloudflare/vitest-plugin`.

### Phase 3 — Pairing and Device Identity

- state machine de pairing;
- TTL de 10 minutos;
- user code one-time armazenado somente por HMAC keyed;
- limite de tentativas para user code e prova criptográfica;
- challenge derivado de segredo do servidor e persistido apenas por digest;
- verificação Ed25519 pelo Workers Web Crypto;
- ativação transacional que cria `devices/device_keys` somente após prova válida;
- replay de ativação idempotente;
- revogação durável;
- migration `0002_pairing_identity.sql`;
- contrato device-side em `../../specs/auth/pairing-api-v1.md`;
- pairing proof em `../../specs/auth/pairing-proof-v1.md`.

## Boundaries de autenticação

A Phase 3 não implementa OAuth/browser login.

`PairingService.verifyUser(...)` recebe um `user_id` já autenticado. O futuro adapter browser/OAuth deverá chamar esse domínio sem alterar suas invariantes.

Revogação também existe como operação de domínio, mas ainda não como dashboard/API pública autenticada.

## Configuração sensível

O serviço requer, quando pairing está habilitado:

- `PAIRING_SERVER_SECRET` — pelo menos 32 bytes;
- `PAIRING_VERIFICATION_URI` — HTTPS.

Nenhum valor operacional é commitado em `wrangler.jsonc`.

Sem essas configurações, `/ready` falha fechado com `503`.

## Fronteiras intencionais

Ainda não implementados:

- WebSocket/presence/reconnect/command correlation reais;
- Remote MCP/OAuth;
- filesystem/process/Git;
- dashboard.

Rotas como `/devices`, `/ws` e `/mcp` continuam fechadas.

## Desenvolvimento local

A configuração versionada usa somente um `database_id` placeholder.

```bash
npm run format:check
npm run typecheck
npm test
npm run d1:migrate:local
npm run dry-run
npm audit --audit-level=high
```

`dry-run` gera o bundle sem deploy.

## State ownership

- Worker continua stateless para correção funcional;
- D1 é source of truth durável para pairing/device registration;
- material público pendente vive em `pairings` antes de `ACTIVE`;
- private key nunca sai do agent;
- Durable Object continua apenas skeleton até a Phase 4;
- cloud nunca amplia a policy local do agent.
