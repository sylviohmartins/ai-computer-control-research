# Authorization, Risk and Approvals

**Status:** Phase 0

## 1. Invariante

> A policy local do device define o teto. Nenhuma policy cloud, scope OAuth, approval remoto ou instrução do modelo pode ampliar esse teto.

## 2. Permission domains

\`\`\`text
FS_READ
FS_WRITE
FS_DELETE
SHELL_SAFE
SHELL_FULL
PROCESS_CONTROL
NETWORK
GIT_WRITE
GIT_REMOTE_WRITE
SCREEN_READ
INPUT_CONTROL
BROWSER
SECRET_USE
ELEVATION
ADMIN
\`\`\`

MVP usa principalmente:
- FS_READ
- FS_WRITE
- SHELL_SAFE/SHELL_FULL
- PROCESS_CONTROL
- NETWORK
- Git read sem permission de write específica

## 3. Decisão

Uma avaliação retorna:
- \`ALLOW\`
- \`ASK\`
- \`DENY\`

## 4. Precedência

\`\`\`text
hard deny local
> local device policy
> local workspace rule
> cloud account/workspace restriction
> temporary session grant
> OAuth/client requested scope
\`\`\`

Camadas inferiores só restringem.

## 5. Risk levels

### LOW
Leitura/diagnóstico bounded.

Exemplos:
- list files;
- read source file não sensível;
- git status;
- system metrics.

### MEDIUM
Mudanças locais/reversíveis ou processos controlados.

Exemplos:
- patch em source autorizado;
- build/test;
- cancelar processo do Telechir.

### HIGH
Impacto remoto, amplo ou persistente.

Exemplos:
- package install;
- network write;
- futura criação de commit;
- alteração extensa.

### CRITICAL
Privilégio, destruição ampla ou alteração sistêmica.

Exemplos:
- elevation;
- mass delete;
- disk/system configuration;
- credential store manipulation.

CRITICAL = local confirmation obrigatória ou DENY por default.

## 6. Approval object

Approval deve ser vinculado a:
- \`approval_id\`;
- \`device_id\`;
- \`session_id\`;
- actor/client;
- permission domains;
- canonical target;
- digest dos argumentos normalizados;
- risk;
- decision;
- scope;
- \`expires_at\`.

Scopes:
- \`once\`;
- \`session\`;
- futuramente \`rule\` via alteração explícita de policy.

Approval não pode ser reutilizado para payload diferente.

## 7. Approval lifecycle

\`\`\`text
REQUESTED
 -> APPROVED -> CONSUMED
 -> DENIED
 -> EXPIRED
\`\`\`

\`once\` é consumido atomicamente.

## 8. Local vs remote approval

- LOW pode ser auto-allow conforme policy.
- MEDIUM pode usar approval no host remoto/ChatGPT quando local policy autorizar esse mecanismo.
- HIGH requer confirmation mais explícita e TTL curto.
- CRITICAL é local-only por default.

Um approval exibido pela plataforma de IA não substitui o approval do Telechir quando a local policy exige ambos.

## 9. Risk engine

Não depender só de regex.

Sinais futuros:
- executable/interpreter;
- args;
- path targets;
- redirections;
- command chaining;
- package manager;
- network destination;
- environment/secret use;
- privilege intent;
- operation blast radius.

O classifier pode elevar risco; nunca reduzir abaixo de hard rules.

## 10. Prompt injection

Conteúdo vindo de:
- arquivo;
- terminal;
- browser;
- screenshot;
- clipboard

é marcado conceitualmente como **untrusted data**. Esse conteúdo não altera permission scopes nem policy.

## 11. Secret references

Inputs podem transportar identificadores como \`secret://...\`, nunca o valor secreto.

O agent resolve localmente somente quando:
- tool possui permission adequada;
- secret policy permite;
- target process/operation está autorizado.

## 12. Audit

Registrar:
- decision;
- rule/policy revision;
- risk;
- approval ID quando existir;
- normalized target;
- result.

Não registrar secret value ou conteúdo completo de arquivo por default.
