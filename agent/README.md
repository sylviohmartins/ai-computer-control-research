# Telechir Agent

Core local do Telechir implementado em Rust.

## Escopo da Phase 1

Esta fase cria somente a fundação executável do agent:

- tipos do Device Wire Protocol `0.1`;
- validação do envelope e do binding de payload;
- contratos de error, permission, risk e command operation;
- configuração local mínima;
- state machine de command lifecycle;
- ports/interfaces para policy, transport, clock e execution;
- testes unitários e contract tests contra `../specs/fixtures/protocol`;
- contract-drift checks que mantêm enums e a regra de idempotência sincronizados com os JSON Schemas em `../specs/protocol`.

O binário atual **não conecta à rede e não executa operações do host**.
## Limites intencionais

Ficam para as fases seguintes:

- control plane;
- pairing e device identity real;
- WebSocket/reconnect real;
- MCP/OAuth;
- filesystem;
- shell/processos;
- Git;
- approvals e audit persistente.

Essas fronteiras evitam que a Phase 1 antecipe responsabilidades já separadas no roadmap.

## Build e validação

No diretório `agent/`:

```bash
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-features
cargo run
```

O `cargo run` apenas valida a configuração default e informa que o core está pronto.

### Windows e antivírus

Se o antivírus do host interceptar repetidamente os executáveis temporários `build-script-build.exe` criados pelo Cargo, prefira executar os gates em container Linux com o checkout montado como read-only e `CARGO_TARGET_DIR` em um volume Docker. Não é necessário desativar a proteção nem criar uma exclusão ampla para o repositório.

A evidência reproduzível usada no exit review está documentada em `../docs/testing/acceptance/phase1-exit-review-2026-10-02.md`.
