# ADR-0009: Usar Ed25519 para identidade inicial de device

- **Status:** Accepted
- **Data:** 2026-10-02

## Contexto

A Phase 3 precisa de uma identidade criptográfica persistente por instalação, com private key exclusivamente local, assinatura de challenges de pairing e verificação interoperável entre o agent Rust e o control plane.

O contrato precisa ser compacto, independente de provedor e suportado pelos runtimes escolhidos.

## Decisão

Usar **Ed25519** como algoritmo baseline de identidade de device do MVP.

Representação externa:

- public key raw de 32 bytes em Base64 URL-safe sem padding;
- assinatura de 64 bytes no mesmo encoding;
- fingerprint = SHA-256 da public key raw;
- `device_key_id` e `device_installation_id` são UUIDs independentes;
- formato assinado definido em `specs/auth/pairing-proof-v1.md`.

No agent, a private key é armazenada via adapter de keyring nativo. A implementação Rust usa o ecossistema `keyring`, que seleciona Keychain no macOS, Windows Credential Manager no Windows e Secret Service em ambientes Unix suportados.

A private key nunca faz parte de DTO público, protocolo, D1, audit ou logs.

## Justificativa

- Ed25519 oferece chaves/assinaturas pequenas;
- implementação madura em Rust;
- Cloudflare Workers suporta Ed25519 em Web Crypto para import/verify;
- evita carregar formato proprietário Cloudflare no protocolo;
- o campo `algorithm` preserva espaço para agility futura.

## Consequências

- pairing proof v1 fica congelado em Ed25519;
- trocar algoritmo exige nova versão do contrato/proof;
- perda da private key exige novo pairing;
- rotação completa de chave continua trabalho futuro;
- testes cross-language devem usar fixture canônico.

## Evidência atual

Revalidado em 2026-10-02:

- Cloudflare Workers Web Crypto: https://developers.cloudflare.com/workers/runtime-apis/web-crypto/
- keyring-rs 4.2: https://docs.rs/keyring/latest/keyring/
- ed25519-dalek 3.0: https://docs.rs/ed25519-dalek/latest/ed25519_dalek/
