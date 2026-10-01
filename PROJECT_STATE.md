# Estado do Projeto

**Atualizado em:** 2026-10-01

## Fase atual

**Product & Technical Discovery / Research Foundation**

A implementação **não começou**. O repositório funciona como base versionada de pesquisa, arquitetura e histórico do projeto.

## Gates atuais

- [~] Naming discovery: **discovery concluído; `NAME_CONDITIONAL` — Telechir é o primary candidate**. O que resta é clearance autoritativo externo, não uma nova rodada criativa.
- [~] ChatGPT Plus + plugin público: caminho de referência validado empiricamente com Remote Desktop Commander (write/process); review/disponibilidade do plugin próprio continuam como release gates.
- [ ] Blueprint técnico/de produto v2 atualizado após naming + validação de distribuição.
- [ ] Definition of Ready reexecutada e aprovada.
- [ ] Estratégia de licenciamento open source definida.

## Decisões atuais

- O nome do repositório é descritivo e temporário; não é a marca do produto.
- **Telechir** é a recomendação primária de naming, mas ainda não está aprovado para rename/public launch.
- Não executar nova rodada criativa de naming enquanto Telechir não falhar no clearance autoritativo.
- O produto deve permanecer agnóstico a modelos e multi-IA por design.
- A distribuição pública no ChatGPT deve usar plugin/app publicado apoiado por um serviço Remote MCP, sem exigir que usuários Plus registrem manualmente um custom MCP.
- Cloudflare continua sendo o principal candidato a control plane, sujeito à validação de viabilidade.
- O agente local deve aplicar a política final de segurança do dispositivo.
- GUI/browser/computer-use permanecem pós-MVP, salvo nova evidência.
- Artefatos históricos permanecem como evidência imutável; conclusões atuais vivem em `docs/`.
- Artefatos originados no ChatGPT são rastreados em `artifacts/provenance/source-manifest.json`.

## Estado do naming

- 2026-09-29: Telechir chegou a `NAME_CONDITIONAL`.
- 2026-10-01, palavras reais: Grapnel, Skeg, Nervo, Prehend e Hawse bloqueados por colisões; gate `NAME_NOT_READY`.
- 2026-10-01, Stage 2: 560 nomes construídos; nenhum superou Telechir; gate `NAME_CONDITIONAL`.
- 2026-10-01, Stage 3: screening final executado; nenhuma colisão contemporânea material de AI/dev tooling localizada; domínio/packages/trademark continuam sem verificação autoritativa direta.
- **Conclusão:** discovery criativo encerrado com Telechir como primary candidate.

## Rejeições explícitas

- **MachinaPort** como nome de produto. Permanece apenas em snapshots históricos.

## Histórico

Consulte `docs/history/research-lineage.md` para a evolução desde a observação inicial envolvendo Remote Desktop Commander e limite do Codex até censo, blueprint, correção Plus/plugin e naming.

## Próximos trabalhos recomendados

1. Executar fora do ambiente atual o clearance autoritativo/reserva de Telechir (domínio, packages, trademark e handles) para promoção a `NAME_READY` ou rejeição.
2. Validar o caminho de plugin público no ChatGPT Plus, incluindo write/process execution, surface disponível e comportamento de quota.
3. Produzir Blueprint v2.
4. Reexecutar Definition of Ready antes da implementação.
