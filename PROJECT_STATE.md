# Estado do Projeto

**Atualizado em:** 2026-10-03

## Fase atual

**Discovery concluído / Phases 0–6 concluídas / Phase 6 — Filesystem Tools concluída**

A implementação possui Local Agent Core, control plane, identidade/pairing Ed25519, canal realtime outbound, Remote MCP/OAuth e seis typed filesystem tools com enforcement final no agent. A superfície MCP atual possui oito tools; o projeto **não possui deploy de produção** e ainda não iniciou shell/process lifecycle ou Git.

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
- [x] Phase 5 — Remote MCP Integration and OAuth: **`PHASE_5_COMPLETE`**.
- [x] Phase 6 — Filesystem Tools: **`PHASE_6_COMPLETE`**.
- [ ] Phase 7 — Shell/Process Lifecycle iniciada.

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
- `docs/testing/acceptance/phase5-exit-review-2026-10-02.md`
- `docs/testing/acceptance/phase6-exit-review-2026-10-03.md`
- `docs/research/cloudflare/phase2-revalidation-2026-10-02.md`
- `docs/research/cloudflare/phase4-revalidation-2026-10-02.md`
- `docs/research/mcp/phase5-revalidation-2026-10-02.md`

Resultado atual:

> **PHASE_6_COMPLETE**

A Phase 6 implementa `fs.list`, `fs.stat`, `fs.read`, `fs.write`, `fs.patch` e `fs.search` no agent com roots deny-by-default, traversal/symlink protection, hard deny de paths sensíveis, limites, hash/preconditions, escrita atômica e idempotência. O MCP expõe as seis tools correspondentes com `telechir:files:read/write`, ownership, presença/capability e dispatch pelo realtime channel.

O agent passou em fmt/clippy, 45 testes e compile checks Windows/macOS. O control plane passou em format/typecheck, 60 testes, migrations `0001 + 0002 + 0003` aplicadas do zero, Wrangler dry-run e `npm audit` sem vulnerabilidades. A Phase 6 preserva os boundaries do roadmap: não há shell/process lifecycle, Git, dashboard ou deploy de produção implementados.

## Próximos trabalhos

1. Em uma execução dedicada de build/test, iniciar **Phase 7 — Shell/Process Lifecycle**.
2. Em paralelo, completar/reservar ativos comerciais de Telechir antes de lançamento.
3. Manter os release gates de OpenAI, segurança operacional, signing e custos antes de beta/publicação.

## Histórico

Consulte `docs/history/research-lineage.md` para a evolução completa desde o gatilho inicial com Remote Desktop Commander até Telechir.
