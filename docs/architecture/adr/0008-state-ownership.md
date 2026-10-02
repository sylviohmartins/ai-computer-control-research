# ADR-0008: Separar Ownership de Estado entre Worker, Durable Object, D1, R2 e Agent

- **Status:** Accepted
- **Data:** 2026-10-02

## Contexto

O sistema combina estado durável, realtime e local. Sem ownership explícito, reconnects e outages podem produzir múltiplas fontes de verdade e bugs de segurança.

## Decisão

Adotar o mapping documentado em `specs/data/state-ownership.md`.

Resumo:
- Worker: request stateless;
- Durable Object: presença, active connection, coordination e locks;
- D1: metadata durável;
- R2: blobs/artifacts;
- Agent: filesystem real, processos reais, policy local e secrets;
- Analytics Engine/Queues/KV: funções auxiliares, nunca autoridade crítica.

## Consequências

- process state no cloud é apenas metadata/reconciliation;
- D1 não é lock manager realtime;
- KV não pode decidir autorização;
- Cloudflare outage não mata processo local já iniciado;
- novas execuções falham fechadas quando authorization/state crítico não está disponível.

## Reversibilidade

Alta para componentes cloud porque o ownership conceitual é independente do provedor.
