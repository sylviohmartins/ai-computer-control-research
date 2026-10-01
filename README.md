# Pesquisa sobre Controle de Computadores por IA

Repositório de pesquisa, discovery de produto e arquitetura para uma futura plataforma que permita que clientes de IA autorizados operem computadores e ambientes executáveis por meio de uma camada de controle segura e auditável.

> **Estado do projeto:** pesquisa e discovery técnico/de produto. Nenhuma implementação de produção foi iniciada. O nome do produto permanece intencionalmente **TBD**; a rodada mais recente de naming terminou em `NAME_NOT_READY`.

## Por que este repositório existe

O projeto investiga uma camada de execução agnóstica a modelos que possa conectar clientes como ChatGPT, Codex, Claude, Gemini, Copilot e ferramentas compatíveis com MCP a máquinas autorizadas, tratando identidade do dispositivo, permissões, aprovações, auditoria, revogação e futuro sandboxing como preocupações de primeira classe.

Este repositório é a fonte de verdade para:

- pesquisa de mercado e ecossistema;
- discovery e posicionamento de produto;
- estudos de viabilidade técnica;
- decisões arquiteturais e ADRs;
- segurança e threat modeling;
- naming e estratégia de marca;
- histórico de como a ideia e as decisões evoluíram;
- artefatos e datasets de pesquisa;
- futuro roadmap de implementação.

## Princípios atuais

- **Agnóstico a modelos:** a camada de execução não deve depender de um único provedor de LLM.
- **Menor privilégio:** a política local deve continuar sendo a autoridade final.
- **Conectividade outbound-first:** evitar exigir portas de entrada abertas nas máquinas do usuário.
- **Typed tools primeiro:** preferir operações explícitas de filesystem, processos e Git a uma interface irrestrita de “execute qualquer coisa”.
- **Auditabilidade:** ações remotas devem ser atribuíveis, revisáveis e revogáveis.
- **Isolamento progressivo:** diferenciar execução no host, guarded host e sandbox.
- **Pesquisa antes da implementação:** gates não resolvidos de plataforma, segurança e naming devem ser documentados antes do código.
- **Preservação da linhagem:** pesquisas superadas continuam registradas como evidência histórica.

## Mapa do repositório

- `PROJECT_STATE.md` — fase atual, gates e estado da implementação.
- `AGENTS.md` — regras para agentes de IA que trabalhem neste repositório.
- `docs/` — documentação viva de produto, discovery, arquitetura, segurança, testes e histórico.
- `docs/history/research-lineage.md` — narrativa de como o projeto nasceu e por que decisões importantes mudaram.
- `artifacts/` — snapshots datados, relatórios e datasets estruturados.
- `artifacts/provenance/` — rastreabilidade entre os artefatos originados no ChatGPT e suas representações no repositório.

## Linhagem da pesquisa

O projeto começou com uma observação prática: após o esgotamento de uma quota principal de coding agent, o Remote Desktop Commander ainda expunha filesystem e processos úteis a partir do ChatGPT. Isso levou a um censo mais amplo de 181 ferramentas e arquiteturas, a um primeiro blueprint completo, a uma correção importante sobre distribuição via ChatGPT Plus/plugin público e a múltiplas rodadas de naming.

Veja `docs/history/research-lineage.md` para a narrativa completa.

## Cobertura dos artefatos

Os trabalhos originados neste chat produziram datasets e relatórios de censo, blueprint técnico, pesquisas de naming, exports de candidatos e uma imagem de referência. Cada artefato único está representado diretamente ou por uma representação canônica/normalizada com proveniência registrada em:

- `artifacts/provenance/source-manifest.json`
- `artifacts/provenance/coverage.md`

Exports intermediários grandes de naming são preservados como fontes e também consolidados em `artifacts/datasets/naming/canonical-naming-candidates.csv`.

## Convenção de idioma

- **nomes de arquivos e diretórios:** inglês;
- **conteúdo documental:** português do Brasil;
- **identificadores técnicos, comandos, nomes de produtos, APIs e campos de schemas:** mantidos em inglês quando isso melhora interoperabilidade ou precisão.

Veja `docs/language-and-naming-conventions.md`.

## Observações importantes

O nome do repositório é descritivo e temporário. Ele **não** é a marca final do produto.

O repositório é público para transparência da pesquisa. **Nenhuma licença open source foi escolhida ainda**; visibilidade pública não implica permissão automática de reutilização ou redistribuição além do permitido pela legislação aplicável.

## Contribuição

O projeto ainda está em discovery. Consulte `CONTRIBUTING.md` antes de abrir issues ou propor alterações.

## Segurança

Não publique secrets, credenciais, tokens, detalhes privados de infraestrutura ou relatos de vulnerabilidade acionáveis em issues públicas. Consulte `SECURITY.md`.
