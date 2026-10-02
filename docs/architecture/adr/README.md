# Architecture Decision Records

ADRs registram decisões duráveis e seus trade-offs.

Status:

- **Proposed** — em revisão ativa;
- **Accepted** — decisão atual;
- **Superseded** — preservado historicamente, mas substituído;
- **Rejected** — considerado e explicitamente não escolhido.

Não reescreva ADRs históricos para esconder mudança. Quando uma decisão mudar, crie um ADR substituto.

## Índice atual

- `0001-record-architecture-decisions.md` — processo de ADR.
- `0002-chatgpt-plugin-and-remote-mcp.md` — plugin/app público no ChatGPT com backend Remote MCP.
- `0003-local-policy-authority.md` — **Accepted**: agent local como autoridade final de policy.
- `0004-cloudflare-control-plane.md` — **Accepted**: Cloudflare como primeiro control plane hospedado.
- `0005-open-source-licensing-strategy.md` — **Accepted**: Apache-2.0 para o core público e trademark separado.
- `0006-outbound-websocket-device-protocol.md` — **Accepted**: WebSocket outbound + protocolo interno próprio.
- `0007-rust-local-agent.md` — **Accepted**: Rust para o core do Telechir Agent.
- `0008-state-ownership.md` — **Accepted**: ownership explícito entre Worker, DO, D1, R2 e Agent.
