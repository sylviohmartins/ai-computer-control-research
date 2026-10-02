# Estado do Projeto

**Atualizado em:** 2026-10-02

## Fase atual

**Discovery concluído / Phases 0–4 concluídas / Phase 4 — Device Realtime Channel concluída**

A implementação possui o Local Agent Core, control plane, identidade/pairing Ed25519 e canal realtime outbound com credential curta, Durable Objects/WebSocket Hibernation, presence, reconnect e revogação fail-closed. O projeto **não possui deploy de produção** e ainda não iniciou Remote MCP/OAuth ou integrações de filesystem/process/Git.

## Gates atuais

- [x] Naming discovery: **`NAME_READY` — produto oficialmente chamado Telechir**.
- [~] Clearance jurídico/comercial da marca: **`COMMERCIAL_CLEARANCE_PENDING`** — domínio, packages, handles e trademark precisam de consulta/reserva autoritativa antes de lançamento.
- [x] ChatGPT Plus + plugin público: caminho de referência validado empiricamente com Remote Desktop Commander para write/process; review/disponibilidade do plugin próprio permanecem release gates.
- [x] Blueprint técnico/de produto v2 consolidado.
- [x] Estratégia de licenciamento/open source definida em ADR-0005.
- [x] Acceptance criteria formais do vertical slice MVP.
- [x] Definition of Ready para Phase 0: **`READY_FOR_PHASE_0`**.
- [x] Phase 0 — Repository & Protocol Specifications: **`PHASE_0_COMPLETE`**.
- [x] Exit review da Phase 0: **`READY_FOR_PHASE_1`**.
- [x] Phase 1 — Local Agent Core: **`PHASE_1_COMPLETE`**.
- [x] Phase 2 — Hosted Control-Plane Skeleton: **`PHASE_2_COMPLETE`**.
- [x] Phase 3 — Pairing and Device Identity: **`PHASE_3_COMPLETE`**.
- [x] Phase 4 — Device Realtime Channel: **`PHASE_4_COMPLETE`**.
- [ ] Phase 5 — Remote MCP Integration and OAuth iniciada.

## Decisões atuais

- **Telechir é a marca oficial do produto.**
- O repositório físico já foi renomeado para `telechir`.
- Naming criativo está encerrado; nova rodada só ocorre se surgir impedimento material/jurídico.
- O produto é agnóstico a modelos e multi-IA por design.
- Distribuição no ChatGPT: plugin/app público + Remote MCP; usuários Plus não devem precisar registrar manualmente um custom MCP.
- Cloudflare foi aceito como primeiro control plane hospedado em ADR-0004, mantendo protocolo e agent independentes do provedor.
- O agent local aplica a autoridade final de policy.
- GUI/browser/computer-use permanecem pós-MVP.
- O core público usa **Apache License 2.0**, com trademark Telechir separado; `LICENSE` já está na raiz.
- Artefatos históricos permanecem imutáveis; conclusões atuais vivem em `docs/`.
- Artefatos originados no ChatGPT são rastreados em `artifacts/provenance/source-manifest.json`.

## Estado do naming

- 2026-09-29: Telechir chegou a `NAME_CONDITIONAL`.
- 2026-10-01, palavras reais: Grapnel, Skeg, Nervo, Prehend e Hawse bloqueados por colisões.
- 2026-10-01, Stage 2: 560 nomes construídos; nenhum superou Telechir.
- 2026-10-01, Stage 3: screening final preliminar; sem colisão contemporânea material em AI/dev tooling.
- 2026-10-02, Stage 4: **Telechir selecionado definitivamente; gate `NAME_READY`.**
- Clearance comercial permanece separado como `COMMERCIAL_CLEARANCE_PENDING`.

## Identidade atual

**Produto:** Telechir  
**Descriptor:** *Secure computer control for AI agents*  
**Tagline:** *Give AI a secure hand on your machines.*

## Rejeições explícitas

- **MachinaPort** como nome de produto. Permanece somente em snapshots históricos.

## Readiness

As avaliações relevantes estão em:

- `docs/testing/acceptance/definition-of-ready-2026-10-02.md`
- `docs/testing/acceptance/phase0-exit-review-2026-10-02.md`
- `docs/testing/acceptance/phase0-contract-audit-2026-10-02.md`
- `docs/testing/acceptance/phase1-exit-review-2026-10-02.md`
- `docs/testing/acceptance/phase2-exit-review-2026-10-02.md`
- `docs/testing/acceptance/phase3-exit-review-2026-10-02.md`
- `docs/testing/acceptance/phase4-exit-review-2026-10-02.md`
- `docs/research/cloudflare/phase2-revalidation-2026-10-02.md`
- `docs/research/cloudflare/phase4-revalidation-2026-10-02.md`

Resultado atual:

> **PHASE_4_COMPLETE**

A Phase 4 implementa credential curta de conexão, prova Ed25519 cross-language, WebSocket outbound, Durable Objects com Hibernation API, handshake `0.1`, heartbeat/presence, reconnect replacement, replay defense, command correlation sem execução e revogação que encerra conexão ativa. O agent passou em `fmt`, `clippy -D warnings`, 29 testes e compile checks Windows/macOS; o control plane passou em format/typecheck, 33 testes, migrations `0001 + 0002`, Wrangler dry-run e `npm audit` sem vulnerabilidades.

A Phase 4 preserva os boundaries do roadmap: não há Remote MCP/OAuth, filesystem, shell/processos, Git, dashboard ou deploy de produção implementados.

## Próximos trabalhos

1. Em uma execução dedicada de build/test, iniciar **Phase 5 — Remote MCP Integration and OAuth**.
2. Em paralelo, completar/reservar ativos comerciais de Telechir antes de lançamento.
3. Manter os release gates de OpenAI, segurança operacional, signing e custos antes de beta/publicação.

## Histórico

Consulte `docs/history/research-lineage.md` para a evolução completa desde o gatilho inicial com Remote Desktop Commander até Telechir.
