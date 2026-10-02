# Connection Credential v1

**Status:** congelado na Phase 4  
**Audience:** `telechir-control-plane/realtime`  
**Credential TTL:** 60 segundos  
**Request clock skew máximo:** ±60 segundos

## Objetivo

Autorizar uma conexão WebSocket outbound do agent sem transformar `device_id` em bearer credential e sem reutilizar a private key fora do device.

## Prova do device

Antes do upgrade WebSocket, o agent solicita uma credential curta e assina exatamente:

```text
telechir-connection-credential-proof-v1
device_id=<device_id>
device_key_id=<device_key_id>
connection_nonce=<base64url-or-safe-string>
requested_at=<RFC3339>
audience=telechir-control-plane/realtime
```

Regras:

- algoritmo: Ed25519;
- `device_id` e `device_key_id` precisam corresponder a identidade ativa;
- `connection_nonce` tem 16..128 caracteres;
- `requested_at` deve estar dentro do skew aceito;
- device/key revogado falha fechado;
- a assinatura cobre todos os campos acima.

## Credential emitida

O control plane emite token HMAC-SHA-256 com claims:

- `v = 1`;
- `jti` único;
- `device_id`;
- `device_key_id`;
- `connection_nonce`;
- `audience`;
- `issued_at`;
- `expires_at`.

A credential:

- expira em 60 segundos;
- é enviada em `Authorization: Bearer` no upgrade WebSocket;
- é single-use no `DeviceCoordinator`;
- não substitui verificação de revogação em D1;
- não concede autorização de tools;
- não é persistida em D1.

## Handshake

Depois do upgrade aceito, a primeira mensagem deve ser `agent.hello`.

O servidor valida:

- `device_public_id`;
- `device_key_id`;
- `connection_nonce`;
- interseção de versão com `0.1`;
- sequência e `message_id`.

Somente então responde `agent.hello_ack`.

## Replay e reconnect

- reutilizar o mesmo `jti` é rejeitado;
- reconnect requer nova credential e novo `connection_id`;
- uma nova conexão válida substitui explicitamente a conexão anterior do mesmo device;
- reconnect nunca autoriza reexecução automática de comandos.

## Fixture

O fixture canônico está em:

`specs/fixtures/auth/connection-credential-ed25519-v1.json`.
