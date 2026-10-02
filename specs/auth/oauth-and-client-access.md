# OAuth and Client Access

**Status:** Phase 0  
**Target:** Remote MCP público autenticado  
**Verificado em:** 2026-10-02

## 1. Separar duas identidades

Telechir precisa autenticar:

1. **usuário/AI client → Remote MCP**;
2. **device → control plane**.

OAuth resolve o primeiro problema. Device keypair resolve o segundo. Não reutilizar access token do usuário como identidade permanente do device.

## 2. MCP resource server

O endpoint público deve expor metadata de protected resource e exigir OAuth para tools que acessam devices do usuário.

Target conceitual:

```text
https://<mcp-host>/.well-known/oauth-protected-resource
https://<mcp-host>/mcp
```

Metadata deve informar:
- canonical resource URI;
- authorization server;
- scopes;
- documentação/policy URLs.

## 3. OAuth baseline

- OAuth 2.1 authorization code;
- PKCE S256 obrigatório;
- issuer validation;
- audience/resource binding;
- short-lived access token;
- refresh/revocation conforme IdP;
- token verificado em **toda** tool call.

Preferir IdP estabelecido em vez de construir authorization server do zero.

## 4. Client identification

Para ChatGPT/Codex, suportar o contrato MCP/OpenAI vigente:
- CIMD como caminho preferido quando disponível;
- DCR somente quando necessário;
- predefined client quando aplicável;
- resource parameter propagado na autorização/token;
- `aud`/resource validado pelo MCP resource server.

A implementação deve seguir a documentação oficial vigente na data do desenvolvimento, porque registration/callback details podem mudar.

## 5. Scopes

Scopes externos iniciais:

```text
telechir:devices:read
telechir:files:read
telechir:files:write
telechir:processes:read
telechir:processes:write
telechir:git:read
telechir:metrics:read
telechir:artifacts:read
```

Esses scopes são **teto remoto**, não substituem policy local.

Não criar scope `admin` genérico para o MVP.

## 6. Tool security schemes

Cada tool pública declara `securitySchemes` explicitamente no `specs/tools/tool-catalog.json`; não depender de um default implícito do servidor.

O descriptor MCP deve materializar:
- `securitySchemes: [{ "type": "oauth2", "scopes": [...] }]` no nível da tool;
- `inputSchema` e `outputSchema` derivados das refs congeladas no catálogo;
- mirror em `_meta.securitySchemes` somente quando necessário por compatibilidade do host.

O catálogo é a fonte de verdade do mapping de scopes. Exemplos:
- `list_devices` → `telechir:devices:read`;
- `read_file` → `telechir:files:read`;
- `write_file` → `telechir:files:write`;
- `start_process` → `telechir:processes:write`;
- `get_git_diff` → `telechir:git:read`.

## 7. Authorization pipeline

```text
Bearer token
 -> signature
 -> issuer
 -> audience/resource
 -> exp/nbf
 -> scopes
 -> tenant/user binding
 -> device ownership/access
 -> session/workspace constraints
 -> route to device
 -> local policy enforcement
```

Falha OAuth → 401/challenge.  
Token válido sem permissão → authorization error.  
Policy local nega → `POLICY_DENIED`.

## 8. Dados não propagados

Não enviar ao model/tool result por padrão:
- subject interno do IdP;
- access/refresh token;
- session cookie;
- JWKS details;
- trace IDs;
- device private identifiers que não sejam necessários ao usuário.

## 9. Profile tool

Um futuro `get_profile` read-only pode ser adicionado para UX de múltiplas contas quando exigido pelo host. Não faz parte do vertical slice funcional atual.

## 10. Release gate OpenAI

Antes do plugin público:
- confirmar metadata/callback atuais;
- scan do MCP;
- validar annotations;
- testar OAuth com reviewer account;
- confirmar availability em Plus;
- medir quota/metering.

## Fontes normativas atuais

- OpenAI Plugin Authentication: https://developers.openai.com/plugins/build/auth
- OpenAI Build MCP Server: https://developers.openai.com/plugins/build/mcp-server
- MCP 2026-07-28 release: https://blog.modelcontextprotocol.io/posts/2026-07-28/
