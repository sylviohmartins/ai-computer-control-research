# ADR-0006: Usar WebSocket Outbound com Protocolo Interno Próprio

- **Status:** Accepted
- **Data:** 2026-10-02

## Contexto

O canal cloud↔device precisa suportar presença, reconnect, streaming de output, cancelamento, processos long-running, locks e idempotência sem exigir porta inbound aberta no computador do usuário.

MCP resolve integração de tools com clientes de IA, mas não foi desenhado como protocolo obrigatório de lifecycle do device.

## Opções consideradas

- polling HTTP;
- SSE;
- WebSocket outbound;
- WebRTC;
- Cloudflare Tunnel;
- reutilizar MCP internamente.

## Decisão

Adotar **WebSocket TLS iniciado pelo agent** como transporte realtime primário do baseline, com protocolo interno versionado definido em `specs/protocol/`.

MCP permanece na integração externa.

## Razões

- comunicação bidirecional;
- compatível com device outbound-only;
- adequado a heartbeats, command chunks e cancelamento;
- não mantém uma request HTTP como owner do processo;
- simples de implementar antes de considerar WebRTC.

## Consequências

- Durable Object pode coordenar uma conexão lógica por device;
- reconnect e duplicate execution precisam de command IDs/idempotency;
- backpressure e limites de frame são requisitos de primeira classe;
- fallback futuro pode existir, mas não deve criar semântica diferente de execução.

## Não escolhido agora

- Polling: custo/latência piores para realtime.
- SSE: unidirecional; exigiria canal separado para device input.
- WebRTC: complexidade prematura para filesystem/process tools.
- Tunnel: útil como opção futura/enterprise, não necessário para MVP.
- MCP interno: acoplaria lifecycle do device à evolução do protocolo externo.

## Reversibilidade

Alta no nível do agent se o wire contract permanecer desacoplado do transporte. Um transporte futuro pode carregar as mesmas mensagens versionadas.
