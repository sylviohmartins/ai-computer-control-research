# Validação de Viabilidade — ChatGPT Plus + Plugin Público + Remote MCP

**Data:** 2026-10-01  
**Status:** caminho técnico validado por evidência oficial + teste empírico em conta ChatGPT Plus

## Conclusão

A hipótese arquitetural central foi validada:

> Para o usuário final, o produto pode ser distribuído como **plugin público** no diretório do ChatGPT, enquanto as tools são fornecidas por um **Remote MCP** hospedado pelo desenvolvedor.

Isso é diferente de exigir que um usuário Plus crie manualmente um custom MCP em Developer Mode.

## Evidência oficial

A documentação atual da OpenAI confirma que:

1. plugins podem incluir um Remote MCP server;
2. o diretório de plugins é compartilhado entre ChatGPT e Codex;
3. a publicação pública de um plugin com Remote MCP passa por submission/review;
4. o diretório existe entre planos, embora a disponibilidade/capabilities de um plugin individual dependam de plano, surface, conta e rollout;
5. o Remote Desktop Commander é um plugin público cujo backend é explicitamente descrito como Remote MCP e cujas capacidades incluem filesystem, terminal, processos e edição de arquivos.

Fontes:
- https://developers.openai.com/plugins/deploy/app-review
- https://developers.openai.com/plugins/deploy/submission
- https://help.openai.com/en/articles/20001256-plugins-in-chatgpt
- https://openai.com/business/plugins/remote-desktop-commander/
- https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt

## Evidência empírica desta conta

Na conta ChatGPT Plus usada no discovery:

- o plugin global **Remote Desktop Commander** aparece como ENABLED, AVAILABLE e instalado;
- o plugin expõe tools de leitura, escrita, processos e filesystem;
- um dispositivo autorizado apareceu online;
- uma chamada real de processo executou com sucesso um comando inofensivo: `cmd /c echo CHATGPT_PLUS_PLUGIN_WRITE_EXEC_VALIDATION_OK`;
- uma chamada real de `write_file` criou um arquivo temporário;
- `read_file` recuperou o conteúdo escrito;
- o arquivo temporário foi removido ao final.

### Resultado empírico

Foram validadas, nessa conta/surface atual:

- listagem de dispositivos;
- execução de processo;
- escrita de arquivo;
- leitura de arquivo.

Isso prova que **uma conta Plus pode, hoje, usar ao menos um plugin público aprovado com tools de write/process** sem cadastrar manualmente um MCP customizado.

## O que NÃO foi provado

Este teste não prova automaticamente que:

- qualquer novo plugin nosso será aprovado pela OpenAI;
- nosso plugin será disponibilizado para Plus imediatamente após aprovação;
- todas as surfaces terão as mesmas capabilities;
- a política de review permanecerá igual;
- a quota/metering será igual à do Remote Desktop Commander;
- ferramentas de alto risco não serão bloqueadas por policy/review.

## Gates atualizados

### VALIDADO — OPENAI-ARCH-001
Plugin público pode ter Remote MCP como backend.

### VALIDADO POR REFERÊNCIA — OPENAI-PLUS-001
Uma conta Plus consegue instalar/usar um plugin público aprovado com Remote MCP sem registrar manualmente custom MCP.

### VALIDADO POR REFERÊNCIA — OPENAI-PLUS-002
Um plugin público aprovado pode expor write/process nessa conta/surface, demonstrado pelo Remote Desktop Commander.

### PENDENTE — OPENAI-PRODUCT-001
Nosso futuro plugin precisa passar review e ser efetivamente disponibilizado ao plano Plus.

### PENDENTE — OPENAI-PRODUCT-002
As tools mínimas do nosso produto precisam passar scan/review e permanecer habilitadas na surface-alvo.

### PENDENTE — OPENAI-QUOTA-001
Quota/metering precisam ser medidos no plugin próprio após publicação/beta; não inferir a partir do login.

## Impacto arquitetural

```text
ChatGPT Plus
  -> plugin público
  -> Remote MCP hospedado
  -> control plane
  -> canal outbound
  -> agente local
```

O core continua multi-IA: clientes MCP compatíveis podem usar o Remote MCP diretamente.

## Próximo passo

A incerteza deixou de ser "isso funciona em Plus?" e passou a ser:

> "nosso plugin específico será aprovado e disponibilizado ao Plus com o conjunto de tools necessário?"

Essa incerteza é um **release gate**, não um bloqueio para continuar arquitetura/Blueprint v2.
