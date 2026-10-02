# Phase 0 Contract Audit — 2026-10-02

**Escopo:** revisão independente dos contratos já existentes na branch `phase0/repository-protocol-specifications` antes de considerar o exit gate encerrado.

## Resultado da auditoria

Foram encontrados três gaps de especificação, sem necessidade de reabrir arquitetura:

1. o envelope aceitava `payload` genérico sem vincular `message_type` ao schema correspondente;
2. os acceptance criteria usavam IDs pontuados enquanto a superfície MCP havia adotado `snake_case`, sem mapping explícito;
3. o documento OAuth exigia scopes por tool, mas `tool-catalog.json` ainda não materializava `securitySchemes` nem refs de input/output.

Também foram encontrados schemas excessivamente abertos em `get_system_metrics` e `policy_summary`, que deixariam decisões desnecessárias para a implementação.

## Correções aplicadas

- binding condicional de todos os tipos de mensagem aos payload schemas;
- payloads adicionados para heartbeat, heartbeat ack, capability change e protocol error;
- enum de operações internas e permission domains;
- idempotency obrigatória para operações internas com side effect;
- mapping público MCP ↔ operação interna congelado;
- `securitySchemes` OAuth e schema refs adicionados por tool;
- schemas de metrics/process state/file kind/policy summary tornados explícitos;
- fixtures positivas e negativa adicionadas.

## Revalidação externa

Em 2026-10-02:

- a linha estável v2 do SDK MCP continua documentando a revisão `2026-07-28` como era moderna;
- a documentação oficial de Plugins da OpenAI exige `securitySchemes` por tool para o fluxo OAuth e recomenda scopes explícitos.

Fontes:
- https://ts.sdk.modelcontextprotocol.io/v2/protocol-versions
- https://developers.openai.com/plugins/build/auth
- https://developers.openai.com/plugins/reference

## Limite

Esta auditoria valida contratos e consistência documental. Não executa runtime Telechir, não provisiona Cloudflare e não valida aprovação futura do plugin.
