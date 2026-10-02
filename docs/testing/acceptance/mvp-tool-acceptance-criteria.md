# Acceptance Criteria — MVP Tool Contracts

**Data:** 2026-10-02  
**Status:** Accepted para especificação da Phase 0  
**Escopo:** contratos do primeiro vertical slice; não constitui implementação.

## Invariantes comuns

Toda tool call deve:
- carregar request ID/idempotency key quando houver side effect;
- identificar usuário, AI client, device e session autenticados;
- passar por authorization no control plane e policy enforcement final no agent local;
- possuir deadline/timeout;
- retornar erro estruturado;
- emitir audit event;
- não expor secrets por padrão;
- respeitar protocol/tool schema version;
- rejeitar device revogado, session expirada e payload acima do limite;
- nunca elevar privilégios implicitamente.

Erros base: UNAUTHENTICATED, UNAUTHORIZED, POLICY_DENIED, APPROVAL_REQUIRED, DEVICE_OFFLINE, DEVICE_REVOKED, INVALID_ARGUMENT, NOT_FOUND, CONFLICT, TIMEOUT, OUTPUT_TRUNCATED e INTERNAL_ERROR.

## device.list
- retorna apenas devices visíveis ao usuário;
- não retorna chaves/tokens;
- inclui device_id, display name, OS, arch, agent version, status e last seen;
- ordenação determinística;
- device revogado nunca aparece como operacional.

## device.info
- exige device autorizado;
- retorna capabilities negociadas e policy summary não sensível;
- offline é estado válido;
- não expõe material secreto do host.

## fs.list
- exige FS_READ;
- canonicaliza path no agent;
- valida allowed root após resolver symlink/reparse point;
- traversal fora do root retorna POLICY_DENIED;
- resposta é limitada/paginada.

## fs.stat
- exige FS_READ;
- retorna metadata e hash quando solicitado/suportado;
- não segue link para fora do root;
- inexistência retorna NOT_FOUND.

## fs.read
- exige FS_READ;
- suporta range;
- limita resposta inline;
- sensitive paths continuam bloqueados mesmo dentro do root;
- binário não é convertido silenciosamente em texto.

## fs.write
- exige FS_WRITE;
- risco default pelo menos MEDIUM;
- suporta expected_hash/precondition;
- escrita deve ser atômica quando possível;
- path protegido é negado;
- conflito retorna CONFLICT;
- audit registra metadata/digest, não conteúdo por padrão.

## fs.patch
- exige FS_WRITE;
- usa precondition;
- falha não pode deixar arquivo corrompido;
- retorna resumo/diff estruturado;
- conflito de contexto retorna CONFLICT;
- é a operação preferida para source code.

## fs.search
- exige FS_READ;
- restringe busca aos roots autorizados;
- impõe limites de resultados/bytes/duração;
- não atravessa links proibidos;
- timeout é explícito.

## shell.exec
- destinado a comandos curtos;
- exige SHELL_SAFE ou SHELL_FULL;
- recebe command, cwd, timeout e env references permitidos;
- cwd respeita boundary;
- não permite elevation implícita;
- risk engine pode produzir ALLOW/ASK/DENY;
- timeout encerra processo e filhos quando possível;
- stdout/stderr têm limite;
- package install/network podem exigir permission domain adicional;
- retorna exit code e truncation metadata.

## process.start
- cria process_id estável e opaco;
- acknowledgement não espera o processo terminar;
- processo pertence ao agent/device, não à request HTTP;
- idempotency impede duplicate start após retry;
- stdout/stderr usam ring buffer limitado;
- audit registra start/final state.

## process.read
- exige acesso ao process/session;
- usa cursor/offset;
- informa running/exited/failed/cancelled, exit code e truncation;
- funciona mesmo após a request que iniciou o processo terminar.

## process.write
- exige PROCESS_CONTROL;
- só escreve em processo que aceite stdin;
- payload tem limite;
- write após término retorna estado estruturado.

## process.cancel
- exige PROCESS_CONTROL;
- é idempotente;
- tenta graceful termination antes de hard kill quando configurado;
- atua apenas em processo autorizado;
- matar processo arbitrário do SO fica fora do MVP.

## process.list
- lista por padrão apenas processos gerenciados pelo Telechir;
- não retorna environment completo;
- inventory completo do SO é capability futura.

## git.status
- read-only;
- opera só em workspace autorizado;
- discovery não escapa do root;
- não modifica index/working tree.

## git.diff
- read-only;
- limita payload inline e pode usar artifact;
- não executa hooks;
- commit/push/pull/merge/rebase ficam fora do MVP.

## system.metrics
- retorna métricas coarse-grained de health;
- não expõe process args, environment ou inventory sensível.

## artifact.get
- exige autorização do artifact;
- token/URL é short-lived;
- inclui checksum;
- retention é explícita;
- acesso é auditado.

## Cenário de aceite Java/Spring

Em máquina de teste sem dados sensíveis:

1. device.list;
2. fs.list no workspace;
3. fs.read em pom.xml;
4. fs.read em source;
5. fs.patch com expected_hash;
6. process.start para mvn test;
7. process.read até exit;
8. interpretar falha;
9. novo fs.patch;
10. executar mvn test novamente;
11. git.status;
12. git.diff;
13. confirmar audit trail;
14. nenhuma operação de commit/push.

## Security acceptance

A suíte futura deve demonstrar:
- traversal bloqueado;
- symlink/reparse escape bloqueado;
- sensitive path hard deny;
- stale expected_hash gera CONFLICT;
- replay não duplica side effect;
- device revogado não executa;
- approval expirado não executa;
- elevation é negada por default;
- conteúdo de arquivo/output não altera policy;
- processo longo sobrevive ao fim da request inicial.

## Definition of Done deste documento

Phase 0 pode refinar schemas e limites numéricos, mas não pode reduzir estes invariantes sem ADR explícito.
