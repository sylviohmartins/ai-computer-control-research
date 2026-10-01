# Linhagem da Pesquisa — Como o Projeto Nasceu

Este documento explica como o projeto evoluiu de uma limitação prática para um programa de pesquisa de produto e arquitetura. É uma narrativa histórica, não a especificação atual do produto.

## 1. Gatilho: continuar trabalhando quando a quota de um agente acaba

O gatilho inicial foi uma imagem capturada durante uso do ChatGPT mostrando a mensagem **“Limite Semanal do Codex acabou, mas...”** enquanto o Remote Desktop Commander era utilizado para continuar operando um ambiente de desenvolvimento. A evidência está registrada em `artifacts/evidence/` e no manifesto de proveniência.

A observação reformulou o problema: a capacidade útil não era “Codex” em si, mas uma camada reutilizável de execução que desse a uma IA autorizada “mãos” controladas sobre uma máquina.

## 2. Censo do ecossistema

A primeira grande fase mapeou o ecossistema em vez de tratar Remote Desktop Commander como produto isolado. O censo normalizou **181 ferramentas/projetos materialmente relevantes** entre:

- bridges e MCP servers;
- coding agents;
- ferramentas de computer-use/browser;
- sandboxes;
- execução remota;
- executores CI/CD.

A pesquisa consolidou o conjunto recorrente de capabilities: filesystem, terminal/process lifecycle, Git, browser/GUI, conectividade remota, sandboxing, auditabilidade e policy.

Fontes canônicas:
- `artifacts/reports/2026-09-29-ai-computer-control-ecosystem-census.md`
- `artifacts/datasets/2026-09-29-ai-computer-control-ecosystem-census.{csv,json}`

## 3. Primeiro blueprint completo

Depois foi produzido um primeiro blueprint técnico/de produto com o working name **MachinaPort**. Ele propôs uma camada de controle agnóstica a modelos e policy-first, com:

- control plane Cloudflare;
- conectividade outbound do dispositivo;
- autoridade de policy local;
- filesystem/process/Git primeiro;
- GUI/browser posteriormente;
- compatibilidade multi-device e multi-IA;
- auditabilidade e sandboxing progressivo.

MachinaPort foi explicitamente rejeitado como nome. O blueprint continua importante porque registra a primeira arquitetura coerente antes das correções seguintes.

Snapshot histórico:
- `artifacts/archive/2026-09-29-product-technical-blueprint-machinaport-draft.md`

## 4. Correção de viabilidade ChatGPT Plus/plugin

Uma descoberta crítica veio depois: a experiência-alvo não pode depender de usuário Plus registrar manualmente um custom MCP com full write.

A arquitetura passou a distinguir:

- **distribution layer:** plugin/app público do ChatGPT;
- **AI integration layer:** backend Remote MCP;
- **control plane:** routing/auth/policy metadata hospedados;
- **device plane:** agente local seguro.

Registros:
- `docs/discovery/feasibility/chatgpt-plus-public-plugin.md`
- `docs/architecture/adr/0002-chatgpt-plugin-and-remote-mcp.md`

O comportamento ponta a ponta no Plus permanece como release gate que deve ser revalidado antes da implementação final.

## 5. Naming discovery — rodada 1 (2026-09-29)

O projeto abandonou nomes compostos excessivamente pragmáticos e executou processo estruturado de naming.

A primeira rodada elevou **Telechir**, termo histórico de teleoperação para um manipulador remoto semelhante a uma mão, a `NAME_CONDITIONAL`. O fit semântico era forte, mas pronúncia, domínio/packages e trademark clearance permaneceram incompletos.

Artefatos:
- `artifacts/reports/naming/2026-09-29-naming-discovery-report.md`
- `artifacts/datasets/naming/2026-09-29-naming-discovery-candidates.json`

## 6. Naming discovery — rodada 2 (2026-10-01)

Uma segunda rodada ampliou territórios semânticos e candidatos. Finalistas criativos incluíram **Grapnel, Skeg, Nervo, Prehend e Hawse**, mas o gate terminou em `NAME_NOT_READY` porque os nomes mais fortes apresentaram colisões materiais ou pendências relevantes de clearance.

Artefatos:
- `artifacts/reports/naming/2026-10-01-naming-discovery-report.md`
- `artifacts/datasets/naming/2026-10-01-naming-discovery-catalog.json`
- `artifacts/datasets/naming/2026-10-01-naming-discovery-top20.csv`
- `artifacts/datasets/naming/2026-10-01-naming-discovery-raw-candidates.csv`

Exports de trabalho combinados ficam também consolidados em:
- `artifacts/datasets/naming/canonical-naming-candidates.csv`

## 7. Por que o repositório existe antes da marca final

O nome descritivo `ai-computer-control-research` é intencional. O repositório funciona como memória versionada enquanto o naming ainda não fechou.

Ele preserva:

- evidência original;
- decisões superadas;
- conclusões vivas;
- ADRs;
- raciocínio de segurança;
- gates de viabilidade;
- pesquisa de naming;
- planos futuros de implementação.

Isso evita que agentes ou colaboradores futuros confundam o documento mais recente com toda a história de por que o produto existe.

## 8. Estado atual

O projeto permanece em **Product & Technical Discovery / Research Foundation**.

Gates atuais:
1. naming atingir estado final aceitável;
2. caminho ChatGPT Plus + plugin público ser validado ponta a ponta;
3. Blueprint v2 incorporar esses resultados;
4. Definition of Ready ser reexecutada antes da implementação de produção.

Artefatos históricos nunca devem ser silenciosamente reescritos para refletir decisões novas. Conclusões novas substituem antigas por documentação viva e ADRs.
