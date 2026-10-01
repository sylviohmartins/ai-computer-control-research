# Estado do Projeto

**Atualizado em:** 2026-10-01

## Fase atual

**Product & Technical Discovery / Research Foundation**

A implementação **não começou**. O repositório funciona como base versionada de pesquisa, arquitetura e histórico do projeto.

## Gates atuais

- [~] Naming discovery: **`NAME_CONDITIONAL` — Telechir é o primary candidate**. Faltam verificações autoritativas de domínio/packages/trademark e teste oral.
- [ ] Caminho ChatGPT Plus + plugin público validado ponta a ponta.
- [ ] Blueprint técnico/de produto v2 atualizado após naming + validação de distribuição.
- [ ] Definition of Ready reexecutada e aprovada.
- [ ] Estratégia de licenciamento open source definida.

## Decisões atuais

- O nome do repositório é descritivo e temporário; não é a marca do produto.
- **Telechir** é a recomendação primária de naming, mas ainda não está aprovado para rename/public launch.
- O produto deve permanecer agnóstico a modelos e multi-IA por design.
- A distribuição pública no ChatGPT deve usar plugin/app publicado apoiado por um serviço Remote MCP, sem exigir que usuários Plus registrem manualmente um custom MCP.
- Cloudflare continua sendo o principal candidato a control plane, sujeito à validação de viabilidade.
- O agente local deve aplicar a política final de segurança do dispositivo.
- GUI/browser/computer-use permanecem pós-MVP, salvo nova evidência.
- Artefatos históricos permanecem como evidência imutável; conclusões atuais vivem em `docs/`.
- Artefatos originados no ChatGPT são rastreados em `artifacts/provenance/source-manifest.json`.

## Estado do naming

- 2026-09-29: Telechir chegou a `NAME_CONDITIONAL`.
- 2026-10-01, palavras reais: Grapnel, Skeg, Nervo, Prehend e Hawse foram bloqueados por colisões; gate `NAME_NOT_READY`.
- 2026-10-01, Stage 2 Constructed Distinctive Names: 560 candidatos materializados; nenhum construído superou Telechir; finalistas Telechir, Clevren, Ferenis, Kheric e Tactren; gate **`NAME_CONDITIONAL`**.
- Próximo subgate de naming: clearance autoritativo de Telechir.

## Rejeições explícitas

- **MachinaPort** como nome de produto. Permanece apenas em snapshots históricos.

## Histórico

Consulte `docs/history/research-lineage.md` para a evolução desde a observação inicial envolvendo Remote Desktop Commander e limite do Codex até censo, blueprint, correção Plus/plugin e naming.

## Próximos trabalhos recomendados

1. Executar o clearance autoritativo de Telechir (domínio/packages/trademark/handles + teste oral) até `NAME_READY` ou rejeição.
2. Validar o caminho de plugin público no ChatGPT Plus, incluindo write/process execution, surface disponível e comportamento de quota.
3. Produzir Blueprint v2.
4. Reexecutar Definition of Ready antes da implementação.
