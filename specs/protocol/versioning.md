# Versioning and Compatibility

## 1. Três versões independentes

Telechir versiona separadamente:

1. **produto/release** — SemVer do software;
2. **device protocol** — contrato cloud↔agent;
3. **public tool schema** — contratos model-callable.

Uma mudança de dashboard não força bump do protocolo.

## 2. Device protocol

Baseline: \`0.1\`.

Durante \`agent.hello\`, o agent anuncia \`supported_protocol_versions\`. O servidor escolhe uma versão comum.

Sem interseção:
- conexão é encerrada com \`UNSUPPORTED_PROTOCOL\`;
- nenhuma execução é permitida.

## 3. Compatibilidade

Dentro da mesma minor draft:
- campos opcionais podem ser adicionados;
- enum fechado não recebe novos valores sem coordenação;
- consumidores devem ignorar metadata explicitamente marcada como extensível;
- campos required não são removidos/renomeados.

Breaking change:
- nova versão de protocolo;
- período de compatibilidade definido por release policy;
- fixtures de versões antiga/nova.

## 4. Capabilities

Features variáveis são negociadas separadamente da versão:

\`\`\`text
filesystem.v1
process.v1
git.read.v1
artifact.v1
ui.v1
browser.v1
sandbox.v1
\`\`\`

Capability ausente retorna \`UNSUPPORTED_CAPABILITY\`.

## 5. MCP

O Remote MCP mira a revisão \`2026-07-28\`.

O core MCP é stateless; estado de negócio deve ser explícito por handles como \`process_id\` e \`artifact_id\`.

Quando um cliente anuncia a extensão MCP Tasks, Telechir poderá mapear processos longos para Tasks. Sem essa extensão, os handles Telechir permanecem o caminho padrão.

## 6. Tool schema version

Cada catálogo publicado possui \`tool_schema_version\`, inicialmente \`0.1\`.

Mudanças incompatíveis em argumento/resultado devem:
- criar nova versão da tool ou catálogo;
- manter janela de migração quando já houver clientes externos;
- atualizar golden prompts e fixtures;
- não alterar silenciosamente o significado de um campo existente.

## 7. Deprecation

Antes de release público 1.0, deprecations podem ter janela curta, mas devem ser documentadas.

Após 1.0, qualquer remoção pública deve ter política explícita e telemetria de uso antes do desligamento.
