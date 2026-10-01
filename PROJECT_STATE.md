# Estado do Projeto

**Atualizado em:** 2026-10-01

## Fase atual

**Product & Technical Discovery / Research Foundation**

A implementação **não começou**. O repositório funciona neste momento como base versionada de pesquisa, arquitetura e histórico do projeto.

## Gates atuais

- [ ] Naming discovery atingir um estado de marca aprovado. A rodada mais recente terminou em `NAME_NOT_READY`.
- [ ] Caminho ChatGPT Plus + plugin público validado ponta a ponta.
- [ ] Blueprint técnico/de produto v2 atualizado após essas duas descobertas.
- [ ] Definition of Ready reexecutada e aprovada.
- [ ] Estratégia de licenciamento open source definida.

## Decisões atuais

- O nome do repositório é descritivo e temporário; não é a marca do produto.
- O produto deve permanecer agnóstico a modelos e multi-IA por design.
- A distribuição pública no ChatGPT deve usar plugin/app publicado apoiado por um serviço Remote MCP, sem exigir que usuários Plus registrem manualmente um custom MCP.
- Cloudflare continua sendo o principal candidato a control plane, sujeito à validação de viabilidade.
- O agente local deve aplicar a política final de segurança do dispositivo.
- GUI/browser/computer-use permanecem pós-MVP, salvo nova evidência.
- Artefatos históricos permanecem como evidência imutável; conclusões atuais vivem em `docs/`.
- Artefatos originados no ChatGPT são rastreados em `artifacts/provenance/source-manifest.json`.

## Estado do naming

- Rodada de 2026-09-29: **Telechir** chegou a `NAME_CONDITIONAL`.
- Rodada ampliada de 2026-10-01: Grapnel, Skeg, Nervo, Prehend e Hawse apareceram entre os finalistas criativos, mas o gate voltou a **`NAME_NOT_READY`** porque nenhum candidato passou pelo conjunto qualidade + clearance/colisão.
- Nenhuma marca de produto está aprovada atualmente.

## Rejeições explícitas

- **MachinaPort** como nome de produto. O nome permanece apenas em snapshots históricos.

## Histórico

Consulte `docs/history/research-lineage.md` para a evolução desde a observação inicial envolvendo Remote Desktop Commander e limite do Codex até o censo, blueprint, correção Plus/plugin e rodadas de naming.

## Próximos trabalhos recomendados

1. Continuar o naming até uma marca ultrapassar o gate.
2. Validar o caminho de plugin público no ChatGPT Plus, incluindo write/process execution, surface disponível e comportamento de quota.
3. Produzir o Blueprint v2.
4. Reexecutar a Definition of Ready antes da implementação.
