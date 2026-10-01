# ADR-0004: Usar Cloudflare como Principal Candidato ao Control Plane Hospedado

- **Status:** Proposed
- **Data:** 2026-10-01

## Contexto

O produto precisa de endpoints HTTPS públicos, autenticação, routing de baixo custo, presença realtime de dispositivos, metadata durável e armazenamento de artefatos. O discovery anterior identificou Workers, Durable Objects, D1 e R2 como stack coerente.

## Decisão proposta

Utilizar Cloudflare como alvo padrão do primeiro control plane hospedado, mantendo protocolo de dispositivo e agente local independentes do provedor.

## Mapeamento esperado

- Workers: APIs públicas, MCP/OAuth e routing;
- Durable Objects: coordenação/presença realtime por dispositivo;
- D1: metadata durável e referências de policy;
- R2: artefatos grandes;
- Analytics Engine/Queues/KV: papéis auxiliares quando justificados.

## Riscos

- billing/limites de WebSocket e mensagens exigem load validation;
- processos long-running do usuário jamais devem executar em Workers;
- futura opção self-hosted/private pode exigir adapters.
