# Phase 3 Exit Review — Pairing and Device Identity

**Data:** 2026-10-02  
**Branch:** `phase3/pairing-device-identity`  
**Issue:** #21  
**Resultado:** `PHASE_3_COMPLETE` na branch; integração em `main` ainda pendente.

## Escopo entregue

A Phase 3 materializa identidade criptográfica de device e pairing sem antecipar o canal realtime ou autenticação pública.

### Agent Rust

- `device_key_id` e `device_installation_id` persistentes;
- keypair Ed25519;
- `DeviceIdentityStore` como boundary de persistência;
- `NativeKeyringIdentityStore` para keyring nativo;
- public key raw em Base64 URL-safe sem padding;
- fingerprint SHA-256;
- DTO público `PairingRegistration` sem private key;
- assinatura do `pairing-proof-v1`;
- buffers de secret key temporários zerados após uso;
- fixture cross-language compartilhado com TypeScript.

### Control plane

- estados `CREATED -> USER_VERIFIED -> DEVICE_PROVED_KEY -> ACTIVE`;
- `EXPIRED` e `REVOKED`;
- TTL baseline de 10 minutos;
- user code one-time armazenado somente por HMAC-SHA-256 keyed;
- challenge derivado de segredo do servidor e persistido somente por digest;
- limites de tentativas para user code e proof;
- limite de pairings ativos por installation;
- fingerprint recalculado no servidor;
- verificação Ed25519 com Workers Web Crypto;
- ativação D1 transacional;
- replay de activation idempotente;
- criação de `devices/device_keys` somente após prova válida;
- revogação durável e `assertDeviceConnectable` fail-closed;
- adapter HTTP device-side para create/status/proof;
- body limit de 16 KiB;
- readiness fail-closed sem configuração de pairing.

## Contratos congelados

- `specs/auth/device-identity-and-pairing.md`;
- `specs/auth/pairing-proof-v1.md`;
- `specs/auth/pairing-api-v1.md`;
- `specs/fixtures/auth/pairing-proof-ed25519-v1.json`;
- ADR-0009 — Ed25519;
- ADR-0010 — material público pré-ativação em `pairings`.

## Migração D1

`0002_pairing_identity.sql` resolve a dependência circular do modelo Phase 0:

- material público pendente fica em `pairings`;
- `devices/device_keys` só existem após proof válida;
- private key nunca entra no D1.

Em banco local vazio:

- `0001_initial.sql`: **23 comandos executados com sucesso**;
- `0002_pairing_identity.sql`: **12 comandos executados com sucesso**;
- ambas as migrations: **PASS**.

## Evidências — agent

Runner Linux isolado em Docker, sem build Rust nativo no Windows.

```text
cargo fmt --all -- --check
cargo clippy --locked --all-targets --all-features -- -D warnings
cargo test --locked --all-features
cargo check --locked --all-targets --all-features --target x86_64-pc-windows-msvc
cargo check --locked --all-targets --all-features --target aarch64-apple-darwin
```

Resultados:

- 15 unit tests: **PASS**;
- 1 pairing cross-language contract test: **PASS**;
- 7 protocol contract tests: **PASS**;
- total Rust: **23 testes, 0 falhas**;
- Windows MSVC compile check: **PASS**;
- macOS ARM64 compile check: **PASS**.

Os adapters de keyring nativo foram compilados para Windows e macOS, mas o acesso real ao Credential Manager/Keychain não foi exercitado em uma máquina nativa nesta fase. Isso permanece integration evidence futura, não uma falha conhecida.

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

- 6 test files: **PASS**;
- 24 testes: **PASS**;
- D1 `0001 + 0002`: **PASS**;
- Wrangler dry-run: **PASS**;
- bundle: **28,70 KiB / gzip 6,79 KiB**;
- `npm audit`: **0 vulnerabilidades**;
- deploy remoto: **não executado**.

## Casos de segurança exercitados

- AB-003 — device/key identity inválida é rejeitada;
- AB-004 — user code é one-time e activation replay é idempotente;
- AB-005 — user-code attempts são limitadas;
- AB-006 — private key trocada após verification é rejeitada;
- AB-007 — device revogado deixa de ser conectável;
- AB-038 — public identity sem private key não permite produzir proof válido.

Também foram testados:

- expiry depois do TTL;
- proof-attempt limit;
- fingerprint substitution;
- pairing creation rate limit por installation;
- `challenge_used_at`;
- ausência de segredo de pairing deixa readiness em `503`;
- payload HTTP > 16 KiB é rejeitado;
- fixture Ed25519 canônico verifica em Rust e Workers.

## Fronteiras preservadas

A Phase 3 deliberadamente **não** implementa:

- WebSocket/presence/reconnect;
- encerramento de canal ativo após revogação;
- credential de conexão de curta duração;
- OAuth/browser login;
- endpoint público de user verification;
- dashboard/revocation UI;
- Remote MCP;
- filesystem/process/Git;
- deploy Cloudflare.

`PairingService.verifyUser` e `revokeDevice` são boundaries de domínio que exigem identidade de usuário já autenticada. O adapter público será conectado somente na fase apropriada.

Rate limiting adicional por IP/account continua obrigatório antes de exposição pública. A Phase 3 implementa limits por pairing/installation, mas não tenta antecipar edge/auth que ainda não existe.

## Definition of Done

- [x] private key não sai do agent;
- [x] DTOs públicos não serializam private key;
- [x] Ed25519 proof verifica cross-language;
- [x] pairing proof versionado e congelado;
- [x] user code one-time e TTL <= 10 min;
- [x] user code não é persistido em claro;
- [x] challenge não é persistido em claro;
- [x] attempts/rate limits de domínio exercitados;
- [x] key substitution rejeitada;
- [x] activation replay idempotente;
- [x] revocation bloqueia identidade futura;
- [x] D1 migration append-only aplica do zero;
- [x] agent fmt/clippy/tests passam;
- [x] compile checks Windows/macOS passam;
- [x] control plane format/typecheck/tests passam;
- [x] Wrangler dry-run passa;
- [x] npm audit sem vulnerabilidades;
- [x] nenhum deploy remoto;
- [x] Phase 4/5 não antecipadas.

## Decisão

A Phase 3 atende ao escopo da issue #21 e pode ser marcada como **`PHASE_3_COMPLETE`** após integração desta branch.

O próximo trabalho é **Phase 4 — Device Realtime Channel**. O início da Phase 4 exige tarefa dedicada e não autoriza automaticamente deploy público ou MCP/OAuth.
