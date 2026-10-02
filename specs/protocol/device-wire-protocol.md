# Device Wire Protocol

**Baseline:** \`telechir-device/0.1\`  
**Status:** Phase 0 — contract draft congelado para Phase 1

## 1. Objetivo

O protocolo interno conecta o control plane ao **Telechir Agent**. Ele não é MCP e não é exposto diretamente a clientes de IA.

O canal primário previsto é WebSocket TLS iniciado pelo agent para o control plane, sem porta inbound obrigatória no device.

## 2. Invariantes

- todo frame lógico é JSON UTF-8 no baseline 0.1;
- todo frame é validado contra \`device-message.schema.json\`;
- \`message_id\` é único;
- comandos com side effect possuem \`command_id\` e \`idempotency_key\` estáveis entre retries;
- \`sequence\` ordena frames dentro de uma conexão, mas **não** é mecanismo de idempotência;
- reconnect nunca implica reexecução automática;
- \`deadline_at\` expirado impede início de nova execução;
- policy final é aplicada no agent após recebimento do comando;
- secrets não trafegam em metadata genérica.

## 3. Lifecycle da conexão

\`\`\`text
Agent
  |  WS connect
  |---------------------------->
  |  agent.hello
  |---------------------------->
  |  agent.hello_ack
  |<----------------------------
  |  heartbeat / commands
  |<===========================>
  |  disconnect
  X
  |  reconnect + new connection_id
  |---------------------------->
\`\`\`

### \`agent.hello\`

Payload mínimo:

\`\`\`json
{
  "device_public_id": "dev_...",
  "device_key_id": "key_...",
  "agent_version": "0.1.0",
  "os": "windows",
  "arch": "x86_64",
  "supported_protocol_versions": ["0.1"],
  "capabilities": [
    "filesystem.v1",
    "process.v1",
    "git.read.v1"
  ],
  "connection_nonce": "base64url..."
}
\`\`\`

A mensagem deve ser autenticada por credential/challenge associado à identidade registrada do device.

### \`agent.hello_ack\`

Inclui:
- \`connection_id\`;
- \`selected_protocol_version\`;
- \`server_time\`;
- heartbeat interval;
- limits efetivos negociados;
- policy revision/hash que o agent pode usar para detectar stale metadata.

## 4. Tipos de mensagem

### Conexão/presença

- \`agent.hello\`
- \`agent.hello_ack\`
- \`heartbeat\`
- \`heartbeat_ack\`
- \`capabilities.changed\`

### Comando

- \`command.request\`
- \`command.accepted\`
- \`command.chunk\`
- \`command.completed\`
- \`command.failed\`
- \`command.cancel\`
- \`command.cancelled\`

### Approval

- \`approval.request\`
- \`approval.decision\`

### Protocol

- \`protocol.error\`

## 5. Command request

Payload conceitual:

\`\`\`json
{
  "command_id": "cmd_...",
  "idempotency_key": "idem_...",
  "operation": "process.start",
  "arguments": {},
  "requested_permissions": ["SHELL_SAFE"],
  "risk": "MEDIUM",
  "workspace_id": "ws_...",
  "approval": null
}
\`\`\`

O campo \`risk\` recebido da nuvem é apenas informação. O agent recalcula/classifica policy localmente e pode elevar a classificação ou negar.

## 6. Command state machine

\`\`\`text
received
  ├─> denied -> command.failed
  ├─> needs approval -> approval.request
  │                     ├─ deny -> command.failed
  │                     └─ allow -> accepted
  └─> accepted
         ├─> running -> chunk* -> completed
         ├─> running -> failed
         └─> running -> cancelled
\`\`\`

\`command.accepted\` confirma que o agent registrou a operação sob \`command_id\`. Ele não significa sucesso da operação.

## 7. Idempotência

Para side effects:
- o control plane deve reutilizar \`idempotency_key\` em retry da mesma intenção;
- o agent mantém cache bounded de decisões/resultados recentes;
- mesma key + mesmo digest de operação retorna o estado conhecido;
- mesma key + payload diferente retorna \`IDEMPOTENCY_CONFLICT\`;
- cache expirado não autoriza retry cego de operação destrutiva.

## 8. Output streaming

\`command.chunk\` inclui:
- \`command_id\`;
- \`stream\`: stdout/stderr/event;
- \`offset\`;
- \`data\` ou artifact reference;
- \`truncated\`;
- digest opcional.

Defaults do baseline, ajustáveis por capability negotiation:
- logical frame alvo: até 256 KiB;
- chunk de output alvo: até 64 KiB;
- ring buffer por processo: 4 MiB;
- resultado MCP inline alvo: até 256 KiB.

Esses números são limites iniciais de contrato; load/security tests podem alterá-los antes de release mediante versionamento/documentação.

## 9. Backpressure

- o agent não deve produzir memória ilimitada;
- chunks são enviados com offsets monotônicos;
- control plane pode sinalizar pause/resume futuramente;
- overflow do ring buffer marca \`truncated=true\`;
- outputs grandes podem ser promovidos a artifact no R2 por fluxo autorizado.

## 10. Cancelamento

\`command.cancel\` é idempotente.

O agent:
1. valida ownership/session/policy;
2. tenta graceful stop quando aplicável;
3. aplica hard kill após grace period configurado;
4. responde \`command.cancelled\` ou estado terminal já existente.

## 11. Reconnect

No reconnect:
- cria-se novo \`connection_id\`;
- processos locais continuam existindo;
- command states são reconciliados por \`command_id\`;
- comandos sem confirmação não são automaticamente reexecutados;
- control plane pode perguntar status de handles conhecidos.

## 12. Clock e deadlines

- timestamps são RFC 3339 UTC;
- lógica crítica usa duration/monotonic clock local quando possível;
- clock skew não pode ampliar autorização;
- \`deadline_at\` expirado causa \`DEADLINE_EXCEEDED\`.

## 13. Segurança de transporte

Baseline:
- TLS;
- device identity vinculada a chave assimétrica;
- short-lived connection credential/challenge;
- replay protection;
- revocation check antes de aceitar a conexão;
- nenhuma autorização baseada apenas em \`device_id\`.

## 14. Extensões futuras

Sem quebrar o core:
- binary frames;
- compression;
- direct artifact upload;
- screen/video stream;
- sandbox runtime;
- peer/WebRTC channel.

Extensões precisam de capability/version negotiation explícita.
