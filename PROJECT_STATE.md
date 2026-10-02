# Estado do Projeto

**Atualizado em:** 2026-10-02

## Fase atual

**Product & Technical Discovery / Research Foundation**

A implementação de runtime/produção **não começou**. O repositório continua sendo a base versionada de pesquisa, arquitetura e histórico do produto **Telechir**.

## Gates atuais

- [x] Naming discovery: **`NAME_READY` — produto oficialmente chamado Telechir**.
- [~] Clearance jurídico/comercial da marca: **`COMMERCIAL_CLEARANCE_PENDING`** — domínio, packages, handles e trademark precisam de consulta/reserva autoritativa antes de lançamento.
- [~] ChatGPT Plus + plugin público: caminho de referência validado empiricamente com Remote Desktop Commander (write/process); review/disponibilidade do plugin próprio continuam como release gates.
- [x] Blueprint técnico/de produto v2 consolidado.
- [~] Definition of Ready: `CONDITIONAL_READY` para Phase 0 documental/especificativa; ainda não READY para runtime/produção.
- [ ] Estratégia de licenciamento open source definida.

## Decisões atuais

- **Telechir é a marca oficial do produto.**
- O nome físico do repositório `ai-computer-control-research` é temporário; target de rename: `telechir`.
- Naming criativo está encerrado; nova rodada só deve ocorrer se surgir impedimento material/jurídico.
- O produto deve permanecer agnóstico a modelos e multi-IA por design.
- A distribuição pública no ChatGPT deve usar plugin/app publicado apoiado por um serviço Remote MCP, sem exigir que usuários Plus registrem manualmente um custom MCP.
- Cloudflare continua sendo o principal candidato a control plane, sujeito à validação de implementação/custo.
- O agente local deve aplicar a política final de segurança do dispositivo.
- GUI/browser/computer-use permanecem pós-MVP, salvo nova evidência.
- Artefatos históricos permanecem como evidência imutável; conclusões atuais vivem em `docs/`.
- Artefatos originados no ChatGPT são rastreados em `artifacts/provenance/source-manifest.json`.

## Estado do naming

- 2026-09-29: Telechir chegou a `NAME_CONDITIONAL`.
- 2026-10-01, palavras reais: Grapnel, Skeg, Nervo, Prehend e Hawse bloqueados por colisões.
- 2026-10-01, Stage 2: 560 nomes construídos; nenhum superou Telechir.
- 2026-10-01, Stage 3: screening final preliminar; sem colisão contemporânea material em AI/dev tooling.
- 2026-10-02, Stage 4: **Telechir selecionado definitivamente; gate `NAME_READY`.**
- Domínio/packages/trademark passam a ser `COMMERCIAL_CLEARANCE_PENDING`, separado da decisão criativa.

## Identidade atual

**Produto:** Telechir  
**Descriptor:** *Secure computer control for AI agents*  
**Tagline:** *Give AI a secure hand on your machines.*

## Rejeições explícitas

- **MachinaPort** como nome de produto. Permanece apenas em snapshots históricos.

## Histórico

Consulte `docs/history/research-lineage.md` para a evolução desde a observação inicial envolvendo Remote Desktop Commander e limite do Codex até censo, arquitetura, correção Plus/plugin e seleção final de Telechir.

## Próximos trabalhos recomendados

1. Reservar/validar os ativos comerciais de Telechir (domínio, packages, GitHub org/handles e trademark).
2. Atualizar o nome físico do repositório para `telechir` quando a ação administrativa estiver disponível.
3. Fechar o gate de licenciamento/open-source strategy.
4. Reexecutar a Definition of Ready e iniciar apenas a Phase 0 documental/especificativa.
