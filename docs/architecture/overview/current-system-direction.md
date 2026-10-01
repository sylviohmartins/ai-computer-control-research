# Direção Atual da Arquitetura

**Status:** discovery / arquitetura proposta. Ainda não é especificação de implementação.

## Boundary do produto

O produto pretendido é uma **camada agnóstica a modelos de execução/controle** entre clientes de IA autorizados e máquinas autorizadas. Ele não deve se tornar outro provedor de LLM nem um coding agent proprietário do reasoning loop.

## Direção atual

```text
Clientes de IA
(ChatGPT / Codex / Claude / Gemini / Copilot / clientes MCP)
        |
        | plugin/app público ou integração Remote MCP direta
        v
Integração / control plane hospedado
(Cloudflare é o principal candidato)
        |
        | canal realtime com escopo por dispositivo
        v
Agente local seguro
        |
        +-- filesystem
        +-- processos / terminal
        +-- Git
        +-- futuros adapters de browser / GUI / sandbox
```

## Correções importantes em relação ao blueprint v1

O primeiro blueprint utilizou **MachinaPort** como working name. Esse nome foi rejeitado. O artefato histórico é preservado sem ser tratado como decisão atual.

A segunda correção é a estratégia de distribuição: o projeto **não pode depender de um usuário ChatGPT Plus registrar manualmente um custom MCP com write completo**. O caminho pretendido na OpenAI é um plugin/app publicado cujo backend exponha Remote MCP, sujeito às regras atuais de review, plano e surface.

## Invariantes em avaliação

- policy local do dispositivo deve ser a autoridade final;
- conectividade do dispositivo deve ser outbound-first;
- typed tools devem ser preferidas a uma API única de command execution irrestrita;
- trabalho long-running deve usar process/task handles explícitos;
- componentes do control plane hospedado não executam workloads do usuário;
- host, guarded-host e sandbox são níveis de segurança distintos e devem ser descritos honestamente.

## Evidência nova

Em 2026-10-01, o caminho de referência ChatGPT Plus + plugin público foi validado empiricamente com Remote Desktop Commander: device listing, execução de processo e escrita/leitura de arquivo funcionaram na conta Plus usada no discovery.

Isso reduz o risco arquitetural, mas não garante aprovação/disponibilidade do nosso futuro plugin específico.

## Validações pendentes

- aprovação e disponibilidade do plugin próprio no Plus;
- quota/metering do plugin próprio;
- naming final (`Telechir` permanece `NAME_CONDITIONAL`);
- custos/limites Cloudflare com tráfego WebSocket realista;
- estratégia de licenciamento/open source;
- ADR final da linguagem do agente local antes de Phase 1.

Blueprint vivo: `docs/architecture/overview/product-technical-blueprint-v2.md`.
