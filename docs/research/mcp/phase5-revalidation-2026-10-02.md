# Revalidação MCP/OpenAI para Phase 5 — 2026-10-02

## Objetivo

Revalidar os contratos mutáveis de Remote MCP e autenticação antes do fechamento da Phase 5.

## Resultado

A direção aceita pelo Telechir permanece válida com ajustes para o baseline moderno:

- transporte remoto por **Streamable HTTP** em endpoint HTTPS estável;
- endpoint público `/mcp`;
- Protected Resource Metadata em `/.well-known/oauth-protected-resource`;
- OAuth 2.1 Authorization Code com PKCE S256 no fluxo de cliente;
- validação de assinatura, issuer, audience/resource, expiração e scopes no resource server;
- `securitySchemes` declarados por tool;
- CIMD preferido quando suportado pelo provedor, mantendo DCR/predefined client apenas como compatibilidade;
- baseline MCP moderno de 2026-07-28 com `server/discover` e core stateless.

## Implementação da Phase 5

O Telechir implementa somente o lado **resource server**. Nenhum authorization server próprio é criado nesta fase.

A superfície ativa é deliberadamente pequena:

- `list_devices`;
- `get_device`.

As demais tools continuam congeladas no catálogo, mas não são anunciadas nem executadas antes de suas fases.

## Fontes oficiais

- https://developers.openai.com/plugins/build/auth
- https://developers.openai.com/plugins/build/mcp-server
- https://developers.openai.com/api/docs/guides/tools-connectors-mcp
- https://blog.modelcontextprotocol.io/posts/2026-07-28/

## Gate

A revalidação não autoriza deploy de produção, publicação de plugin, criação de IdP ou ativação antecipada de filesystem/process/Git.
