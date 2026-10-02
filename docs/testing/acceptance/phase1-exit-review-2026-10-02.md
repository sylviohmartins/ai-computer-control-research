# Phase 1 Exit Review — Local Agent Core

**Data:** 2026-10-02
**Branch:** `phase1/local-agent-core`
**Issue:** #17
**Resultado:** `PHASE_1_COMPLETE` na branch; integração em `main` ainda pendente.

## Escopo entregue

A Phase 1 materializa a fundação Rust do Telechir Agent sem antecipar as fases de integração com host ou cloud.

Foram implementados:

- crate `telechir-agent` em `agent/`, com library e binary bootstrap;
- `#![forbid(unsafe_code)]`;
- tipos do Device Wire Protocol `0.1`;
- modelagem dos 15 `message_type` congelados na Phase 0;
- validação de envelope e binding payload ↔ message type;
- error model, permissions, risk levels e command operations;
- regra de idempotência para operações com side effect;
- connection limits e defaults do baseline;
- configuração local mínima;
- state machine de command lifecycle;
- ports estreitos para policy, clock, transport e command execution;
- unit tests e contract tests contra fixtures da Phase 0.

## Fronteiras preservadas

A Phase 1 deliberadamente **não** implementa:

- control plane hospedado;
- pairing/device identity real;
- WebSocket/reconnect real;
- Remote MCP/OAuth;
- filesystem real;
- shell/process lifecycle real;
- Git real;
- approvals/audit persistente;
- dashboard ou deploy.

Esses itens continuam pertencendo às fases 2–10 do roadmap.

## Evidências de validação

Runner reproduzível: container `rust:1.99-bookworm`, checkout montado read-only e `CARGO_TARGET_DIR` isolado em `/tmp`.

Gates executados com sucesso:

```text
cargo fmt --all -- --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-features
cargo run --quiet
```

Resultado dos testes:

- 9 unit tests: **PASS**;
- 6 contract tests: **PASS**;
- doc tests: **PASS**;
- total: **15 testes, 0 falhas**;
- bootstrap: `telechir-agent 0.1.0 core ready (protocol 0.1)`.

Cross-target compile checks também passaram:

```text
cargo check --all-targets --all-features --target x86_64-pc-windows-msvc
cargo check --all-targets --all-features --target aarch64-apple-darwin
```

O próprio runner Linux cobre o target Linux usado para execução dos testes.

## Observação sobre o runner Windows nativo

O primeiro runner Windows recebeu Rust/Cargo 1.99.0 user-level e conseguiu compilar vários crates, mas execuções de `build-script-build.exe` ficaram presas repetidamente sem erro de código. Uma tentativa interrompida deixou processos filhos mantendo arquivos em `target`, causando `os error 5` no `cargo clean`.

Após isolar a validação em Docker Linux:

- os mesmos crates que travavam no host Windows compilaram normalmente;
- o `telechir-agent` compilou;
- todos os gates de qualidade passaram;
- o cross-check para `x86_64-pc-windows-msvc` passou.

Portanto, a anomalia é registrada como problema do ambiente de execução Windows utilizado nesta sessão, não como falha conhecida do código da Phase 1. Ela deve ser reavaliada antes de testes nativos de integração Windows em fases que adicionarem adapters de OS.

## Definition of Done

- [x] `agent/` criado como projeto Rust;
- [x] library/core separado do binary bootstrap;
- [x] 15 message types modelados/validados;
- [x] enums Rust de protocol/error/permission/risk/operation sincronizados com os JSON Schemas;
- [x] fixtures válidas aceitas;
- [x] fixture de side effect sem idempotency rejeitada;
- [x] lifecycle impede transições inválidas;
- [x] nenhum filesystem/process/Git/network side effect real implementado;
- [x] `cargo fmt --check` passa;
- [x] `cargo clippy ... -D warnings` passa;
- [x] `cargo test --all-features` passa;
- [x] compile check Windows passa;
- [x] compile check macOS passa;
- [x] fronteira Phase 1 vs. fases futuras documentada.

## Decisão

A Phase 1 atende ao escopo definido na issue #17 e pode ser marcada como **`PHASE_1_COMPLETE`** após integração desta branch.

O próximo trabalho de runtime é **Phase 2 — Hosted Control-Plane Skeleton**. O início da Phase 2 continua exigindo tarefa dedicada; este exit review não autoriza deploy, recursos pagos ou publicação.
