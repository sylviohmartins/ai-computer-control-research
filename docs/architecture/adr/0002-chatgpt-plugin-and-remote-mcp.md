# ADR-0002: Tratar o Plugin do ChatGPT como Distribuição e o Remote MCP como Backend de Integração

- **Status:** Proposed
- **Data:** 2026-10-01

## Contexto

Um usuário-alvo pode possuir somente ChatGPT Plus e não ter permissão para registrar manualmente um custom MCP completo com write/modify. O Remote Desktop Commander demonstra uma experiência de plugin publicado apoiada por um serviço Remote MCP.

## Decisão proposta

No ChatGPT, tratar um **plugin/app publicado** como mecanismo de distribuição para o usuário e um **Remote MCP server** como backend de tools. O usuário final não deve precisar configurar manualmente um custom MCP.

O runtime principal continua utilizável por integração MCP direta em outros clientes compatíveis.

## Trade-offs

- melhora onboarding no ChatGPT;
- preserva o core multi-IA;
- introduz dependência de review/eligibilidade da OpenAI;
- disponibilidade real no Plus e capability de write/process precisam ser validadas.

## Gate de aceite

Este ADR não pode migrar para Accepted até um teste ponta a ponta em conta Plus validar o comportamento necessário do plugin público na surface pretendida.
