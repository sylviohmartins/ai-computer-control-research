# D1 Conceptual Data Model

**Status:** Phase 0  
**Observação:** este é um modelo conceitual. Tipos SQL, índices e migrations serão materializados na fase do control plane.

## Entidades

### users

- \`id\` — ID interno opaco;
- \`identity_provider\`;
- \`provider_subject_hash\`;
- \`display_name?\`;
- \`created_at\`;
- \`disabled_at?\`.

Não armazenar senha própria quando autenticação for delegada.

### devices

- \`id\`;
- \`user_id\`;
- \`display_name\`;
- \`os\`;
- \`arch\`;
- \`agent_version\`;
- \`status_hint\` — histórico, não presence realtime;
- \`last_seen_at?\`;
- \`created_at\`;
- \`revoked_at?\`.

### device_keys

- \`id\`;
- \`device_id\`;
- \`public_key\`;
- \`algorithm\`;
- \`fingerprint\`;
- \`created_at\`;
- \`rotated_at?\`;
- \`revoked_at?\`.

Nunca armazenar private key.

### pairings

- \`id\`;
- \`user_id?\`;
- \`device_key_id\`;
- \`state\`;
- \`user_code_digest\`;
- \`challenge_digest\`;
- \`expires_at\`;
- \`verified_at?\`;
- \`activated_at?\`;
- \`created_at\`.

Estados: \`CREATED\`, \`USER_VERIFIED\`, \`DEVICE_PROVED_KEY\`, \`ACTIVE\`, \`EXPIRED\`, \`REVOKED\`.

### workspaces

- \`id\`;
- \`user_id\`;
- \`device_id\`;
- \`display_name\`;
- \`created_at\`;
- \`archived_at?\`.

Workspace é boundary lógico de policy; paths reais permanecem validados localmente.

### policy_restrictions

- \`id\`;
- \`scope_type\` — account/workspace/device/session;
- \`scope_id\`;
- \`permission\`;
- \`effect\` — allow/ask/deny, lembrando que cloud só restringe;
- \`constraint_json\`;
- \`revision\`;
- \`created_at\`;
- \`expires_at?\`.

Hard policy local não é substituída por esta tabela.

### sessions

- \`id\`;
- \`user_id\`;
- \`ai_client_type\`;
- \`client_instance_hash?\`;
- \`started_at\`;
- \`ended_at?\`;
- \`last_seen_at\`.

Não armazenar access token.

### approvals

- \`id\`;
- \`user_id\`;
- \`device_id\`;
- \`session_id\`;
- \`command_id?\`;
- \`permission\`;
- \`risk\`;
- \`scope\`;
- \`argument_digest\`;
- \`decision\`;
- \`requested_at\`;
- \`decided_at?\`;
- \`expires_at\`;
- \`consumed_at?\`.

### commands

- \`id\`;
- \`device_id\`;
- \`session_id\`;
- \`tool_name\`;
- \`operation\`;
- \`idempotency_key_hash?\`;
- \`argument_digest\`;
- \`risk\`;
- \`state\`;
- \`requested_at\`;
- \`accepted_at?\`;
- \`completed_at?\`;
- \`error_code?\`;
- \`artifact_id?\`.

Não registrar argumentos completos por default.

### processes

Metadata remota de handles gerenciados:
- \`id\`;
- \`device_id\`;
- \`command_id\`;
- \`state_hint\`;
- \`started_at\`;
- \`ended_at?\`;
- \`exit_code?\`;
- \`last_reconciled_at\`.

O processo real vive no agent.

### artifacts

- \`id\`;
- \`user_id\`;
- \`device_id?\`;
- \`command_id?\`;
- \`r2_key\`;
- \`mime_type?\`;
- \`file_name?\`;
- \`size_bytes\`;
- \`sha256\`;
- \`created_at\`;
- \`expires_at?\`;
- \`deleted_at?\`.

### audit_events

- \`id\`;
- \`user_id?\`;
- \`device_id?\`;
- \`session_id?\`;
- \`command_id?\`;
- \`event_type\`;
- \`decision?\`;
- \`risk?\`;
- \`target_digest?\`;
- \`metadata_json\`;
- \`created_at\`.

Audit não deve carregar secret values ou conteúdo completo de arquivo.

## Relações principais

\`\`\`text
user 1---N devices
device 1---N device_keys
user 1---N sessions
device 1---N workspaces
session 1---N commands
command 0---1 process
command 0---N audit_events
command 0---N artifacts
approval -> user/device/session/(command)
\`\`\`

## Índices conceituais obrigatórios

- devices(user_id, revoked_at);
- device_keys(device_id, revoked_at);
- pairings(user_code_digest, expires_at);
- sessions(user_id, started_at);
- commands(device_id, requested_at);
- commands(session_id, requested_at);
- approvals(device_id, expires_at, consumed_at);
- audit_events(device_id, created_at);
- artifacts(user_id, created_at).

## Retention

Valores exatos serão definidos por privacy/cost tests.

Princípios:
- pairing expirado: retenção curta;
- command/audit metadata: retenção configurável;
- artifacts: TTL explícito, mínimo necessário;
- telemetry agregada: sem payload sensível;
- deletion/revocation precisa ser observável/auditável.

## Migrações

- migrations append-only versionadas;
- nenhuma migration destructive sem backup/rollback plan;
- schema version deve ser observável pelo control plane;
- agent não depende diretamente do schema D1.
