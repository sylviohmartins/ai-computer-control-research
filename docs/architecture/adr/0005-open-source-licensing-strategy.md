# ADR-0005 — Estratégia de licenciamento do core open source

**Status:** Accepted  
**Data:** 2026-10-02

## Contexto

Telechir precisa equilibrar confiança, adoção, sustentabilidade comercial e clareza jurídica. O agente local terá acesso sensível a filesystem e processos, então transparência do core é parte da proposta de confiança.

Projetos próximos usam licenças permissivas com frequência: Cline e Roo Code usam Apache-2.0; Desktop Commander MCP, OpenCode e QuickDesk usam MIT.

## Opções consideradas

### MIT
Prós: simples, conhecida e com baixa fricção.  
Contras: grant de patentes menos explícito que Apache-2.0.

### Apache License 2.0
Prós: permissiva, aceita por empresas, grant de patentes explícito e adequada a SDKs, agentes e protocolos.  
Contras: não obriga forks/SaaS derivados a publicar modificações.

### AGPL-3.0
Prós: proteção forte contra SaaS fechado derivado.  
Contras: maior fricção jurídica e de adoção para integrações.

### MPL-2.0
Prós: copyleft em nível de arquivo.  
Contras: menos comum no nicho e cria mais complexidade de boundary.

## Decisão

Adotar como estratégia:

> **core público permissivo sob Apache License 2.0, com a marca Telechir protegida separadamente e monetização possível por hosted service, enterprise controls, support e serviços associados.**

O core deverá incluir, quando existir:
- telechir-agent;
- especificação do protocolo interno;
- adapters/servidores MCP públicos;
- CLI;
- SDKs;
- policy primitives necessárias para interoperabilidade.

O repositório de pesquisa atual não recebe automaticamente uma licença retroativa por este ADR. O arquivo LICENSE e a delimitação final do escopo entram na Phase 0, antes do primeiro código distribuível.

Recursos exclusivamente operacionais do serviço hospedado poderão, no futuro, ficar em componentes separados se houver justificativa comercial ou de segurança. Qualquer exceção exige ADR próprio.

## Marca

A licença de código não concede direito de usar a marca **Telechir** de forma que implique origem, endosso ou compatibilidade oficial.

## Consequências

- facilita auditoria e adoção do agent local;
- permite forks e self-hosting do core;
- melhora clareza para integrações comerciais;
- o moat não será a licença, e sim produto, hosted control plane, UX, segurança, ecossistema e marca;
- Phase 0 deve adicionar LICENSE e contributor policy antes do primeiro código distribuível.

## Evidências consideradas

- Cline — Apache-2.0: https://github.com/cline/cline
- Roo Code — Apache-2.0: https://github.com/RooCodeInc/Roo-Code
- Desktop Commander MCP — MIT: https://github.com/wonderwhy-er/DesktopCommanderMCP
- OpenCode — MIT: https://github.com/opencode-ai/opencode
- QuickDesk — MIT: https://github.com/barry-ran/QuickDesk

## Reversibilidade

**Média.** Licenças futuras podem mudar para código cujo copyright seja controlado pelo projeto, mas permissões já concedidas a versões publicadas não são simplesmente revogáveis.
