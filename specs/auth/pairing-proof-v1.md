# Pairing Proof v1

**Status:** contrato implementável da Phase 3  
**Algoritmo baseline:** Ed25519  
**Audience:** `telechir-control-plane`

## Objetivo

Definir exatamente os bytes que o agent assina e que o control plane verifica durante a transição `USER_VERIFIED -> DEVICE_PROVED_KEY`.

O contrato é independente de Cloudflare, Rust e de qualquer cliente de IA.

## Chave

- private key: Ed25519, 32 bytes de seed/secret material, armazenada somente no device;
- public key: raw Ed25519 de 32 bytes;
- encoding externo da public key: Base64 URL-safe sem padding;
- assinatura: Ed25519 de 64 bytes;
- encoding externo da assinatura: Base64 URL-safe sem padding;
- fingerprint: SHA-256 dos 32 bytes raw da public key, Base64 URL-safe sem padding.

O campo `algorithm` deve ser `Ed25519` no baseline.

## Mensagem canônica

A assinatura é calculada sobre UTF-8 dos bytes abaixo, sem BOM e sem newline final:

```text
telechir-pairing-proof-v1
pairing_id=<pairing_id>
device_key_id=<device_key_id>
device_installation_id=<device_installation_id>
challenge=<challenge>
audience=telechir-control-plane
```

Cada placeholder deve ser não vazio e não pode conter CR/LF.

O `challenge` é Base64 URL-safe sem padding e é entregue ao agent somente depois de `USER_VERIFIED`.

## Binding de segurança

A assinatura vincula simultaneamente:

- pairing específico;
- key ID confirmado pelo usuário;
- installation ID local;
- challenge one-time;
- audience do control plane;
- versão do formato.

Trocar qualquer um desses valores deve invalidar a assinatura.

## Replay

Uma prova válida pode ser reencaminhada após uma ativação já concluída apenas para obter o mesmo resultado idempotente. Ela **não** cria novo device, nova key ou nova autorização.

Antes de `ACTIVE`, `challenge_used_at` impede uma segunda transição de ativação.

## Fixture canônico

`../fixtures/auth/pairing-proof-ed25519-v1.json` contém um vetor determinístico compartilhado entre os testes Rust e TypeScript.

A chave privada usada para produzir o fixture é apenas material determinístico de teste e não é um segredo operacional. O fixture publica somente public key e assinatura.

## Versionamento

Qualquer alteração na ordem, nomes, separadores, audience, encoding ou algoritmo exige nova versão do pairing proof. Não alterar silenciosamente `telechir-pairing-proof-v1`.
