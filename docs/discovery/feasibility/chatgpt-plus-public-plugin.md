# ChatGPT Plus, Plugins Públicos e Remote MCP — Gate de Viabilidade

**Data da pesquisa:** 2026-10-01  
**Status:** gate de lançamento não resolvido

## Por que isso importa

Um usuário-alvo pode possuir somente ChatGPT Plus. O produto não pode assumir que esse usuário consiga criar/registrar manualmente um custom MCP completo com write/modify.

## Fatos atuais confirmados no discovery

1. A documentação atual da OpenAI não permite assumir full custom MCP com write/modify para usuários Plus.
2. A documentação de plugins públicos descreve uma distribuição que pode incluir um MCP server, skills ou ambos.
3. A disponibilidade do diretório é ampla, mas capabilities de cada plugin dependem de plano, surface, conta, workspace, região e capabilities incluídas.
4. O Remote Desktop Commander declara acesso a filesystem e terminal de computador autorizado por meio do Remote MCP do Desktop Commander.
5. O fluxo de submissão de plugin público oferece suporte a plugins apoiados por Remote MCP e exige review, metadata, verificação do publisher e análise das tools.

## Implicação arquitetural

Para distribuição no ChatGPT, o produto deve tratar o **plugin público como pacote de distribuição para o usuário** e o **Remote MCP como backend de integração**. O usuário não deve configurar custom MCP manualmente.

```text
Usuário ChatGPT Plus
      | instala, se elegível
      v
plugin público
      | Remote MCP
      v
control plane hospedado
      | canal outbound do dispositivo
      v
agente local
```

## O que ainda não está provado

A documentação da OpenAI **não** garante que nosso futuro plugin com write/process estará disponível no Plus em todas as surfaces pretendidas.

Antes do Blueprint v2 considerar o caminho plenamente viável, validar:

- elegibilidade do plugin publicado em conta Plus;
- capability de escrita/modificação na surface pretendida;
- execução de processos/terminal por meio do plugin revisado;
- UX de confirmação/approval para ações de alto impacto;
- surfaces em que o plugin aparece de fato;
- quota/metering do uso de tools.

## Gates de release

### OPENAI-PLUS-001
Uma conta Plus consegue instalar/usar o plugin revisado sem registrar custom MCP manualmente.

### OPENAI-PLUS-002
O plugin revisado consegue invocar o conjunto mínimo de write/process necessário na surface-alvo.

### OPENAI-PLUS-003
Quota/metering são medidos e documentados, não inferidos pelo método de autenticação.

## Fontes primárias

- https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt
- https://help.openai.com/en/articles/20001256-plugins-in-chatgpt
- https://developers.openai.com/plugins/concepts/plugins
- https://developers.openai.com/plugins/build/plugins
- https://developers.openai.com/plugins/deploy/submission
- https://developers.openai.com/plugins/deploy/app-review
- https://openai.com/business/plugins/remote-desktop-commander/
