# Telechir Control Plane

Skeleton do control plane hospedado do Telechir para Cloudflare Workers.

## Escopo da Phase 2

Esta fase implementa somente a fundação do serviço:

- Worker HTTP com `/health`, `/ready` e `/version`;
- `DeviceCoordinator` como boundary de Durable Object;
- binding D1 local e migration inicial;
- boundaries tipados para R2, Analytics Engine e Queue;
- testes no Workers runtime via `@cloudflare/vitest-plugin`;
- validação de bundle com `wrangler deploy --dry-run`.

Não há deploy nem recurso Cloudflare real provisionado.

## Fronteiras intencionais

Ficam explicitamente fora desta fase:

- pairing e device identity real;
- WebSocket, presence, reconnect e command correlation reais;
- Remote MCP e OAuth;
- filesystem, processos e Git;
- approvals/audit operacional;
- dashboard.

Por isso rotas como `/devices`, `/pairing`, `/ws` e `/mcp` continuam fechadas.

## Desenvolvimento local

A configuração usa um `database_id` nulo/placeholder para impedir que o repositório carregue um identificador real de infraestrutura.

Com dependências instaladas:

```bash
npm run format:check
npm run typecheck
npm test
npm run d1:migrate:local
npm run dry-run
```

`dry-run` gera o bundle sem realizar deploy.

## State ownership

A implementação segue `../../specs/data/state-ownership.md`:

- Worker permanece stateless para correção funcional;
- Durable Object é boundary de coordenação por device;
- D1 é metadata durável;
- R2/Analytics/Queues ficam opcionais até as fases que realmente os utilizarem;
- nenhuma decisão cloud pode ampliar a policy local do agent.
