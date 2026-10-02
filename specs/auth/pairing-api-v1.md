# Pairing API v1

**Status:** contrato device-side materializado na Phase 3  
**Base path:** `/api/v1/pairings`

## Escopo

Este contrato cobre somente a metade device-side do pairing:

1. agent cria um pairing;
2. agent consulta o estado;
3. depois de `USER_VERIFIED`, agent recebe o challenge;
4. agent envia prova Ed25519;
5. control plane ativa o device.

A confirmação humana e a revogação por usuário existem como operações de domínio autenticadas no control plane, mas **não possuem rota HTTP pública nesta fase**. Browser login/OAuth e dashboard pertencem a fases posteriores.

## POST /api/v1/pairings

Cria um pairing em `CREATED`.

Request JSON:

```json
{
  "device_key_id": "<uuid>",
  "device_installation_id": "<uuid>",
  "algorithm": "Ed25519",
  "public_key": "<base64url raw Ed25519 public key>",
  "fingerprint": "<base64url sha256(public_key)>",
  "display_name": "Developer workstation",
  "os": "windows",
  "arch": "x86_64",
  "agent_version": "0.1.0"
}
```

Response `201`:

```json
{
  "ok": true,
  "data": {
    "pairing_id": "<uuid>",
    "user_code": "ABCD-EFGH",
    "verification_uri": "https://...",
    "expires_at": "<RFC3339>",
    "fingerprint": "<base64url>"
  },
  "meta": {
    "request_id": "<uuid>"
  }
}
```

O body é limitado a 16 KiB.

## GET /api/v1/pairings/:pairing_id

Consulta feita pelo agent.

Headers obrigatórios:

- `x-telechir-device-key-id`;
- `x-telechir-device-installation-id`.

Antes de `USER_VERIFIED`, nenhum challenge é retornado.

Depois de `USER_VERIFIED`, `data.challenge` contém o challenge necessário para o pairing proof.

Em `ACTIVE`, `data.device_id` contém o device ativado.

## POST /api/v1/pairings/:pairing_id/proof

Request:

```json
{
  "device_key_id": "<uuid>",
  "device_installation_id": "<uuid>",
  "signature": "<base64url Ed25519 signature>"
}
```

A assinatura deve obedecer `pairing-proof-v1.md`.

Response de sucesso:

```json
{
  "ok": true,
  "data": {
    "pairing_id": "<uuid>",
    "state": "ACTIVE",
    "device_id": "<uuid>"
  },
  "meta": {
    "request_id": "<uuid>"
  }
}
```

Repetir a mesma prova válida depois de `ACTIVE` retorna o mesmo `device_id`; não cria novo device.

## User verification boundary

A transição `CREATED -> USER_VERIFIED` é executada por `PairingService.verifyUser(...)`, que exige um `user_id` já autenticado e não desabilitado.

A Phase 3 deliberadamente **não** inventa uma sessão browser própria. O adapter OAuth/browser será acoplado a essa operação quando a fase de autenticação pública for aberta.

## Revocation boundary

`PairingService.revokeDevice(user_id, device_id)`:

- marca o device como revogado;
- revoga suas keys ativas;
- move o pairing `ACTIVE -> REVOKED`;
- faz `assertDeviceConnectable` falhar com `DEVICE_REVOKED`.

Encerrar um WebSocket já aberto é responsabilidade da Phase 4.

## Error model

O adapter usa o envelope HTTP do control plane e os códigos já congelados quando aplicáveis:

- `INVALID_ARGUMENT`;
- `NOT_FOUND`;
- `UNAUTHORIZED`;
- `CONFLICT`;
- `RATE_LIMITED`;
- `DEVICE_REVOKED`;
- `TIMEOUT`;
- `INTERNAL_ERROR`.

## Segredos e configuração

O control plane requer:

- `PAIRING_SERVER_SECRET`: no mínimo 32 bytes; usado apenas para HMAC de user codes e derivação de challenges;
- `PAIRING_VERIFICATION_URI`: HTTPS.

Esses valores não são commitados em `wrangler.jsonc`. Ausência de qualquer um deles faz `/ready` retornar `503`.

## Limites da Phase 3

Não há:

- WebSocket/presence/reconnect;
- credential de conexão de curta duração;
- OAuth/browser adapter;
- MCP;
- filesystem/process/Git;
- dashboard.
