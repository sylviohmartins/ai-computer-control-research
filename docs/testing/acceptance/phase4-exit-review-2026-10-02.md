# Phase 4 Exit Review — Device Realtime Channel

**Data:** 2026-10-02  
**Branch:** `phase4/device-realtime-channel`  
**Issue:** #23  
**Resultado:** `PHASE_4_COMPLETE` na branch; integração em `main` pendente até o merge.

## Escopo entregue

A Phase 4 materializa o canal realtime outbound entre agent e control plane sem antecipar Remote MCP/OAuth ou tools de host.

### Agent Rust

- cliente WebSocket com TLS via rustls;
- `wss://` obrigatório fora de localhost;
- connection nonce criptograficamente aleatório;
- prova Ed25519 para solicitar credential curta;
- `agent.hello -> agent.hello_ack`;
- negociação do protocolo `0.1`;
- validação de `connection_id`;
- sequence monotônica e duplicate-message defense;
- heartbeat;
- frame limit de 256 KiB;
- reconnect backoff exponencial com jitter e teto absoluto de 30 s;
- reconnect explicitamente **não** reproduz comandos automaticamente.
### Control plane

- credential de conexão curta com TTL de 60 s;
- proof Ed25519 vinculada a device/key/nonce/timestamp/audience;
- HMAC-SHA-256 para a credential emitida;
- revalidação de device/key no D1 antes de emissão e upgrade;
- upgrade WebSocket autenticado;
- roteamento por `device_id` para `DeviceCoordinator`;
- WebSocket Hibernation API;
- attachment serializado por conexão;
- um socket lógico ativo por device;
- nova conexão substitui a anterior;
- novo `connection_id` a cada conexão;
- JTI single-use com replay defense;
- limite de JTIs recentes no Durable Object;
- handshake fail-closed;
- heartbeat/presence;
- capabilities efêmeras;
- command correlation mínima por `command_id`, sem executar host work;
- revogação fecha conexão ativa e bloqueia credential futura;
- oversized/binary/invalid frames falham fechado.
## Contrato cross-language

Foi congelado:

- `specs/auth/connection-credential-v1.md`;
- `specs/fixtures/auth/connection-credential-ed25519-v1.json`.

Rust e Workers verificam a mesma mensagem canônica Ed25519.

## Revalidação Cloudflare

A direção Durable Objects + WebSocket Hibernation foi revalidada em fontes oficiais em:

- `docs/research/cloudflare/phase4-revalidation-2026-10-02.md`.

Nenhum recurso remoto foi criado e nenhum deploy foi executado.

## Evidências — agent

Runner Linux isolado em Docker; nenhum build Rust nativo no Windows.

```text
cargo fmt --all -- --check
cargo clippy --locked --all-targets --all-features -- -D warnings
cargo test --locked --all-features
cargo check --locked --all-targets --all-features --target x86_64-pc-windows-msvc
cargo check --locked --all-targets --all-features --target aarch64-apple-darwin
```

Resultados:

- 20 unit tests: **PASS**;
- 1 connection-credential cross-language contract: **PASS**;
- 1 pairing cross-language contract: **PASS**;
- 7 protocol contract tests: **PASS**;
- total Rust: **29 testes, 0 falhas**;
- Windows MSVC compile check: **PASS**;
- macOS ARM64 compile check: **PASS**.
## Evidências — control plane

```text
npm run format:check
npm run typecheck
npm test
npm run d1:migrate:local
npm run dry-run
npm audit --audit-level=high
```

Resultados:

- 8 test files: **PASS**;
- 33 testes: **PASS**;
- D1 `0001 + 0002`: **PASS** em estado local limpo;
- Wrangler dry-run: **PASS**;
- bundle: **55,74 KiB / gzip 11,89 KiB**;
- `npm audit`: **0 vulnerabilidades**;
- deploy remoto: **não executado**.

## Cenários exercitados

- credential válida completa upgrade + hello;
- credential expira exatamente no TTL;
- JTI replay é rejeitado;
- fresh credential substitui conexão anterior;
- reconnect recebe novo `connection_id`;
- heartbeat atualiza presence;
- revogação fecha socket ativo e bloqueia nova credential;
- protocolo incompatível fecha conexão;
- frame acima de 256 KiB fecha conexão;
- sequence/message-id inválidos são rejeitados;
- command lifecycle é correlacionado por `command_id` sem execução;
- ausência de segredo realtime faz `/ready` falhar fechado;
- agent não reexecuta comandos em reconnect.
## Fronteiras preservadas

A Phase 4 deliberadamente **não** implementa:

- Remote MCP;
- OAuth/browser authentication;
- public admin/revocation API;
- filesystem;
- shell/processos;
- Git;
- approvals/audit operacional completo;
- dashboard;
- deploy de produção.

## Definition of Done

- [x] Hibernation WebSocket API exercitada;
- [x] credential curta e replay defense;
- [x] hello/version negotiation;
- [x] heartbeat/presence;
- [x] reconnect replacement e novo `connection_id`;
- [x] reconnect do agent tem backoff bounded e não replaya commands;
- [x] revogação fecha conexão ativa e bloqueia nova conexão;
- [x] frame limits e invalid protocol fail-closed;
- [x] correlation básica sem execução de tools;
- [x] contrato Ed25519 cross-language congelado;
- [x] agent fmt/clippy/tests/cross-target;
- [x] control plane format/typecheck/tests/migrations/dry-run/audit;
- [x] nenhum deploy remoto;
- [x] Phase 5 não antecipada.

## Decisão

A Phase 4 atende ao escopo da issue #23 e pode ser marcada como **`PHASE_4_COMPLETE`** após integração desta branch.

O próximo trabalho é **Phase 5 — Remote MCP Integration and OAuth**, em tarefa dedicada.
