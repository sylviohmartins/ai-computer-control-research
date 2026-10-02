# ADR-0010: Persistir material público pendente no pairing antes da ativação

- **Status:** Accepted
- **Data:** 2026-10-02

## Contexto

O modelo conceitual da Phase 0 fazia `pairings.device_key_id` referenciar `device_keys`, e `device_keys.device_id` exigia um `device` existente.

Isso cria uma dependência circular no fluxo real: em `CREATED`, o control plane precisa preservar public key/fingerprint para impedir key substitution, mas o device ainda não deve existir como ativo antes de:

1. usuário confirmar o pairing;
2. agent provar a private key;
3. transição chegar a `ACTIVE`.

## Decisão

Durante estados pré-ativação, **`pairings` é a source of truth do material público pendente**:

- `device_key_id`;
- public key;
- algoritmo;
- fingerprint;
- installation ID;
- metadata mínima apresentada ao usuário;
- digests, attempts e timestamps do fluxo.

`devices` e `device_keys` só são materializados após prova Ed25519 válida.

O `device_key_id` em `pairings` é um identificador lógico antes de `ACTIVE`; portanto não possui foreign key para `device_keys` durante essa etapa.

A ativação usa um batch transacional D1 para:

1. marcar `DEVICE_PROVED_KEY`;
2. criar `devices`;
3. criar `device_keys`;
4. marcar `ACTIVE` com `activated_device_id`.

## Segurança

- somente material **público** fica em D1;
- private key nunca é enviada;
- fingerprint é recalculado pelo servidor;
- public key não pode ser alterada entre `CREATED` e `ACTIVE`;
- challenge e user code não são armazenados em claro;
- replay não cria um segundo device.

## Migração

`apps/control-plane/migrations/0002_pairing_identity.sql` migra a tabela existente preservando eventuais linhas da estrutura anterior.

Nenhum database remoto havia sido provisionado/deployado antes desta migration, mas a transformação ainda é versionada como migration append-only.

## Consequências

- resolve a inconsistência entre pairing pré-ativação e registro de device ativo;
- mantém uma única source of truth por estado;
- Phase 4 pode consumir `devices/device_keys` somente após `ACTIVE`;
- revocation permanece durável em D1 e corta futuras provas/conexões.
