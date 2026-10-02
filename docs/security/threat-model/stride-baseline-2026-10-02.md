# Threat Model — STRIDE Baseline

**Data:** 2026-10-02  
**Status:** baseline de segurança para Phase 0  
**Escopo:** MVP sem GUI/browser/sandbox

## Ativos críticos

Identidade e sessão do usuário, tokens do cliente, chave privada do device, vínculo da public key, pairing challenges, policy local, allowed roots, approvals, filesystem autorizado, processos gerenciados, secrets locais, audit metadata, artifacts, updater e integridade do control plane.

## Trust boundaries

1. AI client ↔ public integration layer
2. browser/user ↔ OAuth/approval UX
3. control plane ↔ Durable Object/D1/R2
4. control plane ↔ device channel
5. agent ↔ OS/filesystem/process APIs
6. agent ↔ local keystore
7. conteúdo não confiável ↔ model/tool loop
8. release pipeline ↔ agent updater

## STRIDE

### Spoofing
Riscos: bearer token roubado, device ID sem prova criptográfica, pairing phishing/replay e client substitution.

Controles: OAuth 2.1 + PKCE, audience/resource binding, device keypair, nonce single-use e credenciais curtas.

### Tampering
Riscos: command payload alterado, public key trocada no pairing, approval adulterado, artifact modificado e updater comprometido.

Controles: TLS, digests, approval argument digest, checksums e signed update path.

### Repudiation
Riscos: negação de execução, retry parecer nova ação e approval sem vínculo com payload.

Controles: audit events, actor/session/device correlation, idempotency keys, policy revision e approval IDs.

### Information Disclosure
Riscos: leitura de secrets, stdout com token, artifact exposto, logs com conteúdo e symlink escape.

Controles: sensitive-path deny, secret references, redaction, artifact ACL/TTL e canonical path checks.

### Denial of Service
Riscos: fork bomb, output infinito, flood de commands, brute-force de pairing e storage flood.

Controles: resource limits, ring buffers, rate limits, concurrency e retention.

### Elevation of Privilege
Riscos: sudo/admin, cloud ampliando policy, path traversal, command obfuscation e client malicioso.

Controles: no implicit elevation, local policy authority, typed tools, risk engine e hard deny.

## Abuse cases obrigatórios

| ID | Abuse case | Controle primário | Teste futuro |
|---|---|---|---|
| AB-001 | token OAuth roubado chama tools | short TTL + audience + scopes | audience errada é rejeitada |
| AB-002 | token expirado reutilizado | exp/nbf validation | 401 após expiry |
| AB-003 | device ID inventado | key proof | conexão sem assinatura falha |
| AB-004 | replay de pairing code | one-time state/TTL | segundo uso falha |
| AB-005 | brute-force do user code | rate limiting | throttle/lockout |
| AB-006 | public key trocada após verificação | challenge ligado ao key digest | activation falha |
| AB-007 | device revogado mantém canal | revocation fecha conexão | command após revoke falha |
| AB-008 | client acessa device de outro usuário | ownership check | UNAUTHORIZED |
| AB-009 | path traversal sai do allowed root | canonicalization | POLICY_DENIED |
| AB-010 | symlink/reparse aponta para secret | resolve-before-authorize | POLICY_DENIED |
| AB-011 | arquivo sensível está dentro do root | hard deny | read negado |
| AB-012 | stale hash sobrescreve edição humana | expected_hash | CONFLICT |
| AB-013 | retry duplica write/process | idempotency key | um único side effect |
| AB-014 | mesma key com payload diferente | payload digest | IDEMPOTENCY_CONFLICT |
| AB-015 | shell tenta elevation | no implicit elevation | deny/critical approval |
| AB-016 | comando ofuscado tenta mass delete | risk/hard rules | deny |
| AB-017 | processo gera output infinito | ring buffer | truncation bounded |
| AB-018 | filhos sobrevivem cancelamento | process tree control | descendants encerrados quando possível |
| AB-019 | fork bomb/exaustão | resource/concurrency limits | limites acionam |
| AB-020 | package install malicioso | risk + approval + network policy | ASK/DENY |
| AB-021 | output contém secret | redaction | secret não chega ao model/log |
| AB-022 | artifact URL compartilhada | scoped short-lived URL | outro tenant falha |
| AB-023 | artifact alterado | digest | checksum mismatch detectado |
| AB-024 | approval expirado é usado | expires_at/consume | POLICY_DENIED |
| AB-025 | approval para comando A usado no B | argument digest | mismatch negado |
| AB-026 | README manda exfiltrar credenciais | untrusted content + local policy | sensitive path segue negado |
| AB-027 | terminal output tenta instruir model | untrusted output | policy não muda |
| AB-028 | duas IAs escrevem o mesmo arquivo | lease + expected_hash | uma recebe CONFLICT |
| AB-029 | reconnect reexecuta comando aceito | reconciliation/idempotency | sem duplicação |
| AB-030 | Cloudflare cai com processo rodando | agent owns process | processo segue e reconcilia |
| AB-031 | control plane pede acesso maior | local ceiling | DENY |
| AB-032 | cloud marca comando crítico como LOW | local reclassification | risco é elevado |
| AB-033 | dashboard tenta bypassar policy | same auth pipeline | negado |
| AB-034 | log recebe bearer token | structured redaction | scanner detecta |
| AB-035 | MCP client envia payload gigante | schema/body limits | rejeitado |
| AB-036 | deadline expirou antes da execução | deadline enforcement | não inicia |
| AB-037 | clock skew amplia TTL | monotonic duration + bounded skew | expiry preservada |
| AB-038 | attacker clona state local sem key | protected keystore | conexão falha ou re-pair |
| AB-039 | updater recebe binário não assinado | signed manifest/binary | update recusado |
| AB-040 | CI publica release falsa | signing key isolation | release não confiável recusada |

## Invariantes que bloqueiam Phase 1

Antes de runtime real:
- nenhuma operação filesystem antes da canonicalização;
- policy local pode negar qualquer request remota;
- revocation corta novas execuções;
- side effect é idempotente em retry;
- approval é payload-bound e expira;
- processo longo não pertence ao Worker;
- logs não carregam secrets conhecidos;
- private key do device nunca é enviada;
- dashboard não bypassa authorization.

## Riscos residuais aceitos no MVP

Shell continua poderoso; classificação semântica nunca é perfeita; host execution herda privilégios do usuário do SO; compromise do host pode comprometer o agent; prompt injection não é eliminada, apenas contida por policy.

O MVP deve ser descrito como controle seguro e auditável, não como sandbox infalível.
