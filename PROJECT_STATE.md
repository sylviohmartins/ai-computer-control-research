# Estado do Projeto

**Atualizado em:** 2026-10-02

## Fase atual

**Discovery concluído / READY para Phase 0 — Repository & Protocol Specifications**

A implementação de runtime/produção **não começou**. O repositório é a base versionada de pesquisa, arquitetura, histórico e especificações do produto **Telechir**.

## Gates atuais

- [x] Naming discovery: **`NAME_READY` — produto oficialmente chamado Telechir**.
- [~] Clearance jurídico/comercial da marca: **`COMMERCIAL_CLEARANCE_PENDING`** — domínio, packages, handles e trademark precisam de consulta/reserva autoritativa antes de lançamento.
- [x] ChatGPT Plus + plugin público: caminho de referência validado empiricamente com Remote Desktop Commander para write/process; review/disponibilidade do plugin próprio permanecem release gates.
- [x] Blueprint técnico/de produto v2 consolidado.
- [x] Estratégia de licenciamento/open source definida em ADR-0005.
- [x] Acceptance criteria formais do vertical slice MVP.
- [x] Definition of Ready: **`READY_FOR_PHASE_0`**.
- [ ] Phase 0 iniciada/concluída.
- [ ] Phase 1/runtime autorizada.

## Decisões atuais

- **Telechir é a marca oficial do produto.**
- O repositório físico já foi renomeado para `telechir`.
- Naming criativo está encerrado; nova rodada só ocorre se surgir impedimento material/jurídico.
- O produto é agnóstico a modelos e multi-IA por design.
- Distribuição no ChatGPT: plugin/app público + Remote MCP; usuários Plus não devem precisar registrar manualmente um custom MCP.
- Cloudflare permanece candidato principal a control plane.
- O agent local aplica a autoridade final de policy.
- GUI/browser/computer-use permanecem pós-MVP.
- O core público previsto usa **Apache License 2.0**, com trademark Telechir separado.
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

A nova avaliação está em:

- `docs/testing/acceptance/definition-of-ready-2026-10-02.md`

Resultado:

> **READY_FOR_PHASE_0**

Isso autoriza somente trabalho documental/especificativo de Phase 0. Não autoriza runtime, deploy, agente funcional, Cloudflare real ou publicação de plugin.

## Próximos trabalhos

1. Executar **Phase 0 — Repository & Protocol Specifications**.
2. Em paralelo, completar/reservar ativos comerciais de Telechir antes de lançamento.
3. Reavaliar readiness antes de Phase 1/runtime.

## Histórico

Consulte `docs/history/research-lineage.md` para a evolução completa desde o gatilho inicial com Remote Desktop Commander até Telechir.
