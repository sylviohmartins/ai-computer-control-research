# Architecture Tabletop Exercises — Phase 0 Results

**Data:** 2026-10-02  
**Status:** validado em papel; transformar em integration/chaos tests nas fases correspondentes

## T1 — Filesystem read/write

Fluxo: AI → MCP → Worker → Device Durable Object → Agent → filesystem.

Validações:
- autenticação antes do routing;
- path canonicalizado no agent;
- local policy como última barreira;
- write com precondition para edição de arquivo existente;
- audit registra metadata, não conteúdo por default.

Falha segura: device offline ou policy deny não cria fallback alternativo.

## T2 — Maven test por 4 minutos

A request HTTP não é owner do processo.

Fluxo:
1. start_process;
2. agent cria handle;
3. resposta retorna process_id;
4. Maven continua no host;
5. cliente usa read_process_output;
6. output usa ring buffer e artifact quando necessário.

Conclusão: duração do Worker não limita vida do processo.

## T3 — Aplicação long-running

Um processo como mvn spring-boot:run continua enquanto o agent e a policy permitirem.

A queda da request ou WebSocket não mata automaticamente o processo. Cancelamento explícito atua somente no process tree gerenciado.

## T4 — Device offline

Default do MVP:
- tool interativa falha imediatamente com DEVICE_OFFLINE;
- não enfileirar write/shell para execução futura silenciosa;
- qualquer queueing futuro exige opt-in e ADR.

## T5 — Reconnect

- novo connection_id;
- handles locais persistem;
- Durable Object reconcilia command/process IDs;
- comando não confirmado não é reexecutado automaticamente;
- mesma idempotency key recupera estado quando possível.

## T6 — Comando perigoso

Exemplo: recursive delete amplo.

- risk local sobe para CRITICAL;
- MVP não tem delete recursivo typed tool;
- shell full pode ser DENY ou local-only approval;
- cloud approval sozinho não supera hard deny.

## T7 — Prompt injection no projeto

README instrui o modelo a enviar credenciais.

Resultado:
- conteúdo é untrusted data;
- sensitive roots seguem bloqueados;
- NETWORK/SECRET_USE continuam sujeitos à policy;
- texto não altera scopes.

## T8 — ChatGPT e Claude no mesmo workspace

- reads podem ser concorrentes;
- writes usam lease/precondition;
- segundo writer pode receber CONFLICT;
- actor/session ficam no audit;
- não existe last-writer-wins silencioso.

## T9 — Output de 500 MB

- não retorna inline;
- ring buffer bounded;
- truncated=true;
- promoção a R2 artifact se autorizada;
- artifact possui digest, TTL e ACL;
- model recebe resumo + handle.

## T10 — GUI futura

Fora do MVP.

Quando existir:
- screenshot e accessibility tree separados;
- click/type serão destructive/high-risk;
- coordenadas ficam vinculadas à versão do frame;
- screenshot stale não autoriza input.

## T11 — Auto-update

Updater futuro:
- manifest assinado;
- digest do binary;
- staged rollout;
- rollback;
- agent recusa release sem assinatura válida.

## T12 — Cloudflare outage

- processos iniciados continuam no agent;
- novas execuções falham fechadas;
- policy local segue válida;
- reconnect usa backoff;
- audit local mínimo pode ser reconciliado sem inventar eventos.

## T13 — Duplicate command após timeout

Cliente não sabe se start_process foi aceito e repete com a mesma idempotency key.

Resultado esperado:
- agent/control plane retorna handle existente;
- nenhum segundo processo inicia.

## T14 — Approval race

Approval expira entre decisão e side effect.

Resultado:
- expiry e digest são revalidados imediatamente antes da execução;
- operação não começa.

## T15 — Revocation durante processo

Device é revogado enquanto processo gerenciado está rodando.

Baseline:
- conexão remota é encerrada;
- nenhum novo command entra;
- processo real continua sendo propriedade do agent;
- a sessão pode solicitar cancelamento dos processos que iniciou, conforme policy;
- estado incerto nunca é reportado como sucesso.

## T16 — Duas writes no mesmo arquivo

A primeira alteração muda o hash. A segunda usa expected_hash antigo.

Resultado:
- primeira write conclui;
- segunda recebe CONFLICT;
- modelo deve reler antes de recalcular patch.

## T17 — Artifact expirado

Tool retorna artifact_id, mas o usuário tenta buscá-lo após retention.

Resultado:
- NOT_FOUND ou estado expired;
- URL anterior não funciona;
- audit registra tentativa sem conteúdo.

## T18 — Pairing code interceptado

Atacante obtém o código, mas não a sessão autenticada do usuário.

Resultado:
- código sozinho não ativa device;
- tentativa é rate-limited e auditada.

## T19 — Device key clonada

Se uma chave exportável for copiada de um host comprometido, duas conexões podem tentar a mesma identidade.

Resultado:
- presença concorrente é detectada;
- evento de segurança é emitido;
- projeto deve preferir keystore não exportável quando disponível;
- usuário pode revogar/re-pair.

## T20 — Approval para payload diferente

Usuário aprova um comando e o cliente tenta alterar cwd/args depois.

Resultado:
- argument digest não confere;
- approval é inválido;
- nova decisão é necessária.

## Resultado geral

Os tabletop exercises não revelaram dependência obrigatória de request longa, porta inbound ou policy exclusivamente cloud.

As decisões necessárias para Phase 1 estão representadas em:
- specs/protocol;
- specs/auth;
- specs/policy;
- specs/data;
- docs/security/threat-model;
- docs/testing/acceptance.
