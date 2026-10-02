# State Ownership and Cloudflare Mapping

**Status:** Phase 0  
**Objetivo:** impedir múltiplas fontes de verdade silenciosas e definir onde cada classe de estado deve viver.

## Ownership matrix

| Estado | Source of truth | Cache/replica | Observação |
|---|---|---|---|
| user/account | IdP + D1 profile | Worker request context | IdP autentica; D1 guarda metadata de produto |
| device registration/public key | D1 | Durable Object | private key nunca sai do device |
| device online presence | Durable Object | dashboard/API | D1 guarda somente last seen histórico |
| active WebSocket | Durable Object | nenhum | connection-scoped |
| local hard policy | Agent | cloud recebe summary/hash | cloud nunca amplia |
| account/workspace restriction | D1 | Worker/DO cache | somente restringe |
| write lease/lock | Durable Object | nenhum | não usar D1 como lock realtime |
| pairing durable state | D1 | Worker/DO | transições monotônicas |
| active command correlation | Durable Object + Agent | D1 audit metadata | estado reconciliável |
| processo real do SO | Agent | DO/D1 metadata | cloud nunca é owner do processo |
| stdout/stderr ring buffer | Agent | R2 opcional | bounded |
| artifact blob | R2 | metadata em D1 | acesso temporário/scoped |
| audit event | D1 append-only lógico | Analytics Engine projection | conteúdo mínimo |
| aggregate telemetry | Analytics Engine | nenhum | não é source of truth operacional |
| feature flag não crítica | KV | Worker cache | nunca usar KV para auth/policy crítica |
| async cleanup/telemetry | Queue | D1/R2 conforme destino | fora do caminho síncrono |
| release metadata | D1 | KV opcional | binário em release store futuro |

## Worker

Workers devem permanecer stateless para correção funcional.

Responsabilidades:
- autenticar;
- validar tool request;
- aplicar restrictions remotas;
- resolver tenant/device;
- localizar Durable Object do device;
- formatar resposta MCP/HTTP;
- criar metadata de audit.

Não manter como requisito de correção em memória do Worker:
- process state;
- locks;
- approvals consumíveis;
- connection state;
- pairing one-time state.

## Durable Object

Um coordinator lógico por device é o baseline.

Responsável por:
- active connection;
- presence;
- command correlation;
- workspace/path leases;
- bounded command state para reconnect;
- coordenação de approval pendente;
- backpressure do canal realtime.

O DO não substitui o agent como source of truth de:
- processo local;
- filesystem;
- policy local;
- secret store.

## D1

D1 guarda estado durável de produto:
- users/profiles;
- devices;
- device keys públicas;
- pairings;
- account/workspace restrictions;
- session metadata;
- approval metadata;
- command/audit metadata;
- artifact metadata;
- release metadata.

D1 não deve armazenar:
- private keys;
- access/refresh tokens em claro;
- conteúdos completos de arquivos por padrão;
- stdout/stderr volumoso;
- secrets locais.

## R2

Usado quando payload excede o limite inline ou precisa retenção explícita:
- build/test output grande;
- diagnostics bundle;
- diff grande;
- screenshots futuros;
- artifacts autorizados.

Todo object deve possuir:
- tenant/account binding;
- creator execution;
- digest;
- retention/expiry metadata;
- content type;
- authorization no download.

## KV

Permitido para:
- feature flags não críticas;
- cache de configuração pública;
- cache derivável.

Proibido como source of truth de:
- revocation;
- permission;
- approval;
- device key;
- lock.

## Queues

Somente para trabalho assíncrono que tolera atraso:
- analytics fanout;
- cleanup;
- retention;
- non-critical notifications;
- audit export.

Não colocar tool call síncrona normal em Queue.

## Analytics Engine

Usado para métricas agregadas:
- latency;
- bytes;
- tool family;
- success/failure;
- device/client dimensions não sensíveis.

Nunca é usado para authorization ou reconstrução de estado crítico.

## Princípio de indisponibilidade

Se D1/DO necessários à autorização estiverem indisponíveis, a operação remota falha fechada.

Se Analytics/KV/Queue estiverem indisponíveis:
- tool execution pode prosseguir somente se segurança/audit obrigatório não forem prejudicados;
- telemetry auxiliar pode degradar.

## Reversibilidade do provedor

O wire protocol e os schemas em \`specs/\` não incluem tipos proprietários da Cloudflare.

O mapping acima é deployment architecture, não contrato de compatibilidade do agent.
