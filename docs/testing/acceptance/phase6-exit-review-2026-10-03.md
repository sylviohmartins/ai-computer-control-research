# Phase 6 Exit Review — Filesystem Tools

**Data:** 2026-10-03  
**Branch:** `phase6/filesystem-tools`  
**Issue:** #28  
**Resultado:** `PHASE_6_COMPLETE` na branch; integração em `main` pendente até o merge.

## Escopo entregue

A Phase 6 implementa o primeiro conjunto real de typed host tools do Telechir sem abrir shell/process/Git.

### Agent Rust

Foram implementadas as operações:

- `fs.list`;
- `fs.stat`;
- `fs.read`;
- `fs.write`;
- `fs.patch`;
- `fs.search`.

O `FilesystemExecutor` permanece separado do transporte realtime e é invocado pelo dispatcher de `command.request`.

## Policy e path safety

O filesystem é **deny-by-default**: sem roots explícitos, nenhuma operação é permitida.

Para paths autorizados:

- roots são canonicalizados;
- um root que já seja path sensível (por exemplo `.ssh`) é rejeitado: hard deny local vence a allowlist;
- paths relativos exigem exatamente um root;
- paths existentes são canonicalizados antes da decisão;
- `Path::starts_with` é aplicado sobre componentes canonicalizados, não prefixo textual;
- traversal para fora do root retorna `POLICY_DENIED`;
- symlink/reparse target fora do root não é seguido;
- no Windows, `FILE_ATTRIBUTE_REPARSE_POINT` (`0x400`) é tratado como link para cobrir junctions/reparse points;
- read/write não seguem target final de link/reparse;
- search não atravessa symlink;
- paths sensíveis locais têm hard deny.

Hard denies atuais incluem, entre outros:

`.ssh`, `.aws`, `.gnupg`, `.azure`, `.kube`, `.docker`, `.env`, `.netrc` e nomes usuais de private key SSH.
## Semântica das operações

### Read

- contrato público aceita `max_bytes <= 262144`;
- chunk inline efetivo é limitado a **176 KiB** para preservar headroom do envelope wire de 256 KiB;
- quando necessário, `truncated=true` e `next_offset` permitem continuação;
- UTF-8 inválido não é convertido silenciosamente; o chamador deve pedir base64.

### Write

- `FS_WRITE`;
- risk mínimo `MEDIUM`;
- inline payload efetivo até **176 KiB**;
- `expected_hash` produz `CONFLICT` quando stale;
- `create_if_missing` é respeitado;
- escrita usa tempfile no mesmo diretório + sync + persist/rename;
- replay com a mesma idempotency key não repete o side effect;
- reutilizar a mesma key com argumentos diferentes retorna `IDEMPOTENCY_CONFLICT`.

### Patch

- unified diff;
- `expected_hash` obrigatório;
- patch/context inválido não produz alteração parcial;
- patch até **192 KiB**;
- escrita final atômica quando a plataforma permite rename no mesmo filesystem.

### Search

- text, regex e glob;
- no máximo 1.000 matches;
- no máximo 1 MiB lido por arquivo;
- no máximo 64 MiB escaneados;
- no máximo 10.000 entries visitadas;
- timeout local de 2 s;
- symlinks e paths sensíveis não são atravessados.
## Vertical slice MCP → device

A superfície MCP acumulada passou de 2 para **8 tools**:

- `list_devices`;
- `get_device`;
- `list_files`;
- `get_file_metadata`;
- `read_file`;
- `write_file`;
- `patch_file`;
- `search_files`.

Filesystem usa:

- `telechir:files:read` para read-only;
- `telechir:files:write` para write/patch.

Antes do dispatch, o control plane valida:

1. OAuth scope;
2. ownership no D1;
3. device não revogado;
4. presença online;
5. capability `fs.*` anunciada pelo agent.

O `device_id` usado para routing não é encaminhado dentro de `arguments`. OAuth token nunca é encaminhado ao agent.

O `DeviceCoordinator` envia `command.request` com deadline bounded, permission/risk e idempotency. O resultado `command.completed/failed` é correlacionado por `command_id` e removido do storage após consumo.

Shell/process/Git continuam indisponíveis.
## Evidências — agent

Runner Linux isolado em Docker; `CARGO_TARGET_DIR` em volume Docker.

A inspeção TLS do Avast exigiu adicionar a CA pública já confiada pelo Windows somente ao trust store do container efêmero. TLS permaneceu validado; nenhum `--insecure`, exclusão do antivírus ou mirror não oficial foi utilizado.

Gates:

```text
cargo fmt --all -- --check
cargo clippy --locked --all-targets --all-features -- -D warnings
cargo test --locked --all-features
cargo check --locked --all-targets --all-features --target x86_64-pc-windows-msvc
cargo check --locked --all-targets --all-features --target aarch64-apple-darwin
```

Resultados:

- 36 unit tests: **PASS**;
- 2 auth cross-language contract tests: **PASS**;
- 7 protocol contract tests: **PASS**;
- total Rust: **45 testes, 0 falhas**;
- Clippy `-D warnings`: **PASS**;
- Windows MSVC compile check: **PASS**;
- macOS ARM64 compile check: **PASS**.

### Nota sobre Windows

Não foram executados testes Rust nativos no host Windows nesta fase, pois builds Cargo nativos já haviam disparado reanálise agressiva do Avast em fases anteriores. O código e os testes `cfg(windows)` foram compilados no target MSVC; a suíte de traversal/symlink foi executada no runner Linux.

Foi executado adicionalmente um acceptance probe no Windows real criando uma junction temporária. O filesystem reportou `Directory, ReparsePoint`, `RawAttributes=1040`, com o bit `0x400` ativo. Esse é exatamente o `FILE_ATTRIBUTE_REPARSE_POINT` verificado pelo helper Windows do agent. A junction e os diretórios temporários foram removidos após o teste. Nenhuma proteção do Avast foi desabilitada.
## Evidências — control plane

Gates:

```text
npm run format:check
npm run typecheck
npm test
npm run d1:migrate:local
npm run dry-run
npm audit --audit-level=high
```

Resultados:

- 11 test files: **PASS**;
- 60 testes: **PASS**;
- D1 migrations `0001 + 0002 + 0003`: **PASS** em database local totalmente nova (`23 + 12 + 2` comandos executados);
- Wrangler dry-run: **PASS**;
- bundle dry-run: **789,31 KiB / gzip 155,05 KiB**;
- `npm audit`: **0 vulnerabilidades**;
- deploy remoto: **não executado**.

O audit Node usou a mesma CA pública do Avast adicionada ao trust store do container; validação TLS permaneceu ativa.

## Cenários exercitados

- deny-by-default sem roots;
- traversal fora do root;
- hard deny de paths sensíveis;
- root sensível rejeitado mesmo quando explicitamente configurado;
- symlink escape;
- Windows junction/reparse point detectado pelo atributo nativo usado no enforcement;
- deterministic list + cursor;
- metadata/hash;
- ranged/chunked read;
- binary exige base64;
- write atômico;
- stale hash conflict;
- idempotent write replay;
- idempotency conflict;
- unified patch;
- invalid patch sem mudança parcial;
- bounded text/regex/glob search;
- oversized write sem side effect;
- read máximo chunked para caber no wire;
- device offline;
- capability ausente;
- ownership de outro usuário;
- FS_READ/FS_WRITE e risk;
- OAuth `files:read/write`;
- Phase 7+ tools continuam indisponíveis.
## Definition of Done

- [x] seis operações filesystem implementadas no agent;
- [x] seis tools MCP ativadas;
- [x] policy local permanece autoridade final;
- [x] roots explícitos e deny-by-default;
- [x] traversal/sensitive paths;
- [x] hard deny vence allowlist de root sensível;
- [x] symlink escape em runtime Unix;
- [x] junction/reparse semantics exercitadas em Windows real;
- [x] código Windows-specific compile-checked em MSVC;
- [x] read/write/patch/search bounded;
- [x] stale hash retorna conflict;
- [x] replay/idempotency testado;
- [x] ownership/scope/online/capability testados;
- [x] reconnect continua sem command replay;
- [x] nenhum shell/process/Git;
- [x] agent fmt/clippy/tests/cross-target;
- [x] control plane format/typecheck/tests/migrations/dry-run/audit;
- [x] nenhum deploy remoto.

## Decisão

A Phase 6 atende ao escopo da issue #28 e pode ser marcada como **`PHASE_6_COMPLETE`** após integração desta branch.

O próximo trabalho é **Phase 7 — Shell/Process Lifecycle**, em tarefa dedicada.
