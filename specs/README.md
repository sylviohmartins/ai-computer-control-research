# Especificações do Telechir

**Status:** Phase 0  
**Versão de baseline:** `0.1-draft`

Este diretório contém os contratos que separam intenção de produto de implementação. Nenhum arquivo aqui implica que o runtime já exista.

## Fontes de verdade por assunto

- `protocol/` — transporte interno cloud↔device, envelopes, lifecycle e versionamento;
- `tools/` — superfície pública de tools e schemas do MVP;
- `auth/` — identidade de device, pairing e autenticação;
- `policy/` — autorização, risk model e approvals;
- `data/` — ownership de estado e modelo conceitual persistente;
- `fixtures/` — exemplos válidos/inválidos usados em testes de contrato;
- `repository-layout.md` — boundaries do monorepo futuro.

## Princípios

1. **MCP é interface externa, não protocolo de device.**
2. **O agent local é a autoridade final de policy.**
3. **Side effects precisam de identidade, idempotência e auditoria.**
4. **Processos longos usam handles explícitos.**
5. **Filesystem é autorizado após canonicalização/resolução de links.**
6. **Schemas são versionados e validados antes de execução.**
7. **Outputs grandes viram artifacts; não atravessam interfaces inline sem limites.**
8. **Public tools são focadas e individualmente revisáveis.**

## Compatibilidade externa

A superfície MCP mira a revisão `2026-07-28`, com core stateless. Tasks podem ser usadas quando o cliente anunciar a extensão, mas os process handles do Telechir continuam sendo o fallback interoperável.

## Regra de mudança

Mudanças breaking em contratos desta pasta exigem:
- bump de versão;
- fixture de migração/compatibilidade;
- atualização de ADR quando alterarem uma decisão arquitetural;
- atualização dos acceptance criteria.
