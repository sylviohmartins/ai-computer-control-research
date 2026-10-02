# Device Identity and Pairing

**Status:** baseline da Phase 0, materializado na Phase 3
**Objetivo:** vincular uma máquina a uma conta sem abrir porta inbound e sem tratar um código humano como credential permanente.

## 1. Identidade do device

No primeiro start, o agent gera:
- \`device_key_id\`;
- keypair **Ed25519** no baseline (ADR-0009);
- \`device_installation_id\` aleatório local.

O contrato de assinatura cross-language está congelado em `pairing-proof-v1.md`.

A private key:
- nunca é enviada ao control plane;
- usa keystore nativo quando disponível;
- fallback em armazenamento local protegido exige permissão restrita e warning explícito.

Adapters previstos:
- Windows: credential/key protection nativa;
- macOS: Keychain/Secure Enclave quando aplicável;
- Linux: Secret Service/keyring quando disponível.

## 2. Pairing states

\`\`\`text
CREATED
 -> USER_VERIFIED
 -> DEVICE_PROVED_KEY
 -> ACTIVE

qualquer estado -> EXPIRED
ACTIVE -> REVOKED
\`\`\`

## 3. Fluxo

1. agent gera keypair;
2. agent solicita pairing por HTTPS outbound, enviando public key, key ID e metadata mínima;
3. cloud cria \`pairing_id\`, nonce/challenge e \`user_code\` de curta duração;
4. agent mostra verification URI + code;
5. usuário abre navegador, autentica e confirma nome/OS/fingerprint resumido;
6. cloud marca \`USER_VERIFIED\`;
7. agent recebe challenge final e assina com private key;
8. cloud valida assinatura conforme `pairing-proof-v1.md`, materializa `devices/device_keys` e ativa o device em batch transacional;
9. agent obtém credential de conexão de curta duração ou challenge para abrir WebSocket em fase posterior.

Durante `CREATED`/`USER_VERIFIED`, o material público pendente vive em `pairings`; `devices` e `device_keys` só passam a existir após prova válida (ADR-0010).

## 4. User code

O código:
- é one-time;
- expira em até 10 minutos no baseline;
- não autentica sozinho: exige sessão de usuário no browser;
- não é armazenado em claro; a materialização Phase 3 persiste somente HMAC-SHA-256 keyed por segredo do servidor e domínio/pairing ID;
- tem limite de tentativas por pairing e limite de criação por installation no runtime Phase 3;
- rate limiting adicional por IP/account permanece obrigatório quando a camada autenticada/edge for materializada.

## 5. Device fingerprint apresentado

O usuário deve confirmar:
- display name proposto;
- OS;
- arquitetura;
- prefixo/fingerprint da public key;
- horário aproximado da solicitação.

Não mostrar serial number/hardware identifiers desnecessários.

## 6. Reconnect

Uma conexão normal não repete pairing.

Agent prova identidade com:
- key ID;
- challenge/nonce;
- assinatura;
- credential curta quando usada.

O control plane verifica revocation antes de encaminhar qualquer comando.

## 7. Revocation

Usuário pode revogar device pelo dashboard.

Efeito:
- novas conexões recusadas;
- WebSocket ativo encerrado;
- access leases remotas invalidadas;
- queued work descartado;
- key fica marcada como revoked para auditoria.

Re-pair exige novo vínculo explícito.

## 8. Rotation/recovery

Key rotation futura:
- exige device autenticado + prova da chave antiga, ou novo pairing;
- nunca aceita nova public key apenas por sessão cloud;
- mantém histórico de key IDs sem private material.

Perda da private key = novo pairing.

## 9. Replay defenses

- nonce/challenge single-use;
- TTL;
- assinatura vinculada a pairing/device/server audience;
- pairing state transacional;
- idempotency no endpoint de activation;
- attempts e failures auditados.

## 10. Threat cases obrigatórios

- phishing do user code;
- brute-force do code;
- replay de activation;
- troca de public key após confirmação;
- device revogado reconectando;
- cloned local state;
- cloud tentando elevar policy durante pairing.
