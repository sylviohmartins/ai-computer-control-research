# Revalidação Cloudflare para Phase 4 — 2026-10-02

## Objetivo

Revalidar a base técnica do ADR-0006 antes de concluir o **Device Realtime Channel**, usando documentação oficial atual da Cloudflare.

## Resultado

A direção **Workers + Durable Objects + WebSocket Hibernation API** continua adequada ao canal realtime outbound do Telechir. A Phase 4 foi validada localmente no Workers runtime; **nenhum deploy remoto foi realizado**.

## WebSocket Hibernation

A documentação atual recomenda a WebSocket Hibernation API para servidores WebSocket em Durable Objects quando o objeto pode ficar ocioso entre mensagens. O socket permanece conectado enquanto o Durable Object pode ser removido da memória e recriado sob demanda.

O Telechir usa:

- `state.acceptWebSocket(...)`;
- handlers `webSocketMessage`, `webSocketClose` e `webSocketError`;
- attachment serializado mínimo por conexão;
- Durable Object nomeado por `device_id`.

Fontes:
- https://developers.cloudflare.com/durable-objects/best-practices/websockets/
- https://developers.cloudflare.com/durable-objects/api/state/
## Limites relevantes

A documentação atual informa:

- até 32.768 WebSockets aceitos por Durable Object;
- mensagem WebSocket recebida de até 32 MiB;
- attachment serializado de WebSocket de até 16.384 bytes.

O Telechir adota limites deliberadamente menores:

- **uma conexão lógica ativa por device**;
- **256 KiB por frame** no protocolo `0.1`;
- attachment contendo somente identidade/conexão, sequence state, IDs recentes, heartbeat e capabilities.

Esses limites são decisões próprias do Telechir e não tentam consumir o máximo oferecido pelo provedor.

Fontes:
- https://developers.cloudflare.com/durable-objects/platform/limits/
- https://developers.cloudflare.com/durable-objects/api/state/
## Hibernação e estado

Memória comum de uma instância não pode ser tratada como source of truth após hibernação. Por isso:

- identidade/revogação durável permanecem no D1;
- JTI consumido e command correlation mínima ficam no storage do Durable Object;
- estado necessário à conexão ativa fica no WebSocket attachment;
- presença é projeção efêmera do Durable Object;
- a policy local do agent continua sendo a autoridade final.

Essa divisão permanece compatível com ADR-0008.

## Decisão para a Phase 4

Prosseguir com Durable Objects + Hibernation API para o canal device ↔ control plane.

A revalidação **não** autoriza:

- deploy de produção;
- MCP/OAuth;
- exposição pública de APIs administrativas;
- filesystem/process/Git;
- aumento de autoridade da cloud sobre a policy local.
