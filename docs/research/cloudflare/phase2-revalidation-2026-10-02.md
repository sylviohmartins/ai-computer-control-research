# Revalidação Cloudflare para Phase 2 — 2026-10-02

## Objetivo

Revalidar o gate do ADR-0004 antes de iniciar o skeleton do control plane. A consulta foi feita em documentação oficial da Cloudflare em 2026-10-02.

## Resultado

A direção do ADR-0004 permanece tecnicamente viável. Nesta fase não foi criado recurso remoto, não houve deploy e não foi assumido nenhum compromisso de plano pago.

### Workers

- Free: 100.000 requests/dia e 10 ms de CPU por invocação.
- Paid: base de US$ 5/mês, com franquias maiores e cobrança adicional por uso.
- `wrangler deploy --dry-run` permite validar bundle sem deploy.

Fontes:
- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/workers/platform/limits/
### Durable Objects

- continuam disponíveis em Workers Free e Paid;
- no Free, o backend disponível é SQLite;
- WebSocket Hibernation continua recomendado para servidor WebSocket por reduzir duração faturável;
- WebSocket/realtime permanece deliberadamente fora da Phase 2.

Fontes:
- https://developers.cloudflare.com/durable-objects/platform/pricing/
- https://developers.cloudflare.com/durable-objects/best-practices/websockets/
- https://developers.cloudflare.com/durable-objects/concepts/durable-object-lifecycle/

### D1

- Free: 5 milhões de rows read/dia e 100 mil rows written/dia;
- Free: até 10 databases, 500 MB por database e 5 GB totais;
- desde 2026-09-01, exceder limites diários do Free provoca erro até o reset.

Fontes:
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/d1/platform/limits/
- https://developers.cloudflare.com/changelog/product/d1/
### R2, Queues e Analytics Engine

R2 permanece adequado para artifacts grandes; o Standard inclui free tier mensal de 10 GB-month, 1 milhão de operações Class A e 10 milhões Class B, com egress gratuito.

Queues continua adequada apenas ao caminho assíncrono; o Free inclui 10 mil operações/dia.

Analytics Engine continua apropriado para projeções agregadas. O Free inclui 100 mil data points escritos/dia e 10 mil read queries/dia; a documentação atual informa que a cobrança anunciada ainda não está ativa.

Fontes:
- https://developers.cloudflare.com/r2/pricing/
- https://developers.cloudflare.com/queues/platform/pricing/
- https://developers.cloudflare.com/analytics/analytics-engine/pricing/
### Tooling

- Cloudflare recomenda `wrangler.jsonc` para projetos novos;
- a integração atual recomendada para unit/integration tests é `@cloudflare/vitest-plugin`;
- D1 migrations podem ser carregadas e aplicadas no harness de testes local.

Fontes:
- https://developers.cloudflare.com/workers/wrangler/configuration/
- https://developers.cloudflare.com/workers/testing/vitest-integration/
- https://developers.cloudflare.com/workers/testing/vitest-integration/recipes/

## Decisão para a Phase 2

Usar Workers + Durable Object + D1 no skeleton local. R2, Queue e Analytics Engine aparecem apenas como boundaries opcionais nesta fase, sem binding remoto e sem provisionamento.

O teste de custos com tráfego WebSocket realista continua pendente antes de beta e deve ocorrer quando a Phase 4 materializar o canal realtime.
