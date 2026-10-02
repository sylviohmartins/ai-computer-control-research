# Telechir Agent

Core local do Telechir implementado em Rust.

## Fases implementadas

### Phase 1 — Local Agent Core

- Device Wire Protocol `0.1`;
- validação de envelope/payload;
- error/permission/risk/command contracts;
- configuração local;
- command lifecycle;
- ports para policy, transport, clock e execution;
- contract-drift tests contra `../specs/`.

### Phase 3 — Device Identity

- `device_key_id` e `device_installation_id` persistentes;
- keypair Ed25519;
- private key atrás de `DeviceIdentityStore`;
- adapter padrão `NativeKeyringIdentityStore`;
- public key raw em Base64 URL-safe sem padding;
- fingerprint SHA-256 da public key;
- payload público `PairingRegistration`;
- assinatura do contrato `../specs/auth/pairing-proof-v1.md`;
- fixture Ed25519 compartilhado com o control plane.

A private key não faz parte de nenhum DTO serializável do agent.

## Native keyring

O adapter padrão usa o crate `keyring` e seleciona o backend nativo suportado pelo target:

- Windows Credential Manager;
- macOS Keychain;
- Secret Service em Unix/Linux suportado.

O `MemoryIdentityStore` existe somente para testes e adapters controlados.

## Limites atuais

O binário ainda **não abre conexão de rede e não executa operações do host**.

Ficam para fases posteriores:

- WebSocket/reconnect/presence;
- MCP/OAuth;
- filesystem;
- shell/processos;
- Git;
- approvals/audit operacional.

## Build e validação

No diretório `agent/`:

```bash
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo test --all-features
cargo run
```

A Phase 3 também exige compile checks para:

```text
x86_64-pc-windows-msvc
aarch64-apple-darwin
```

## Windows e antivírus

Se o antivírus do host interceptar repetidamente executáveis temporários `build-script-build.exe` do Cargo, execute os gates em container Linux com `CARGO_TARGET_DIR` em volume Docker.

Não é necessário desativar proteção nem criar exclusão ampla para o repositório.

Evidências:

- `../docs/testing/acceptance/phase1-exit-review-2026-10-02.md`;
- `../docs/testing/acceptance/phase3-exit-review-2026-10-02.md`.
