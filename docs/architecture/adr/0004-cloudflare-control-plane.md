# ADR-0004: Usar Cloudflare como Control Plane Hospedado Inicial

- **Status:** Accepted
- **Data:** 2026-10-01
- **Aceito em:** 2026-10-02

## Contexto

O produto precisa de endpoints HTTPS públicos, autenticação, routing, presença realtime de devices, metadata durável, artifacts e observabilidade. O discovery identificou Workers, Durable Objects, D1 e R2 como stack coerente com esses requisitos.

## Decisão

Usar Cloudflare como deployment target padrão do primeiro control plane hospedado, mantendo o protocolo cloud↔device e o agent independentes do provedor.

Mapeamento:
- Workers: MCP/OAuth/API e routing;
- Durable Objects: presença, conexão, command correlation e locks por device;
- D1: metadata durável;
- R2: artifacts grandes;
- Analytics Engine: telemetry agregada;
- Queues: cleanup/fanout assíncrono;
- KV: cache/feature flags não críticos.

## Restrições

- workloads do computador do usuário nunca executam em Workers;
- Queue não entra no caminho síncrono normal de tool calls;
- KV não é source of truth de autorização, revocation ou approval;
- Durable Objects coordenam estado realtime, mas o processo real continua pertencendo ao agent;
- wire protocol não contém tipos proprietários da Cloudflare.

## Riscos e gates

- pricing/quotas e comportamento realtime precisam ser revalidados antes da Phase 2;
- load test é obrigatório antes de beta;
- provider outage deve falhar fechado para novas execuções;
- opção self-hosted/private pode exigir adapters no futuro.

## Evidência

Detalhamento em:
- `specs/data/state-ownership.md`;
- `specs/data/d1-conceptual-model.md`;
- `docs/research/cloudflare/README.md`.
