# ADR-0001: Registrar Decisões Arquiteturais

- **Status:** Accepted
- **Data:** 2026-10-01

## Contexto

O projeto é intensivo em pesquisa e deve evoluir entre plataformas de IA, serviços Cloudflare, tecnologia do agente local e boundaries de segurança. Decisões importantes precisam manter justificativa durável.

## Decisão

Utilizar Architecture Decision Records em `docs/architecture/adr/`. ADRs históricos são imutáveis, exceto por pequenas correções factuais; decisões alteradas devem ser substituídas por novos ADRs.

## Consequências

- decisões permanecem explicáveis para futuros colaboradores e agentes;
- trade-offs ficam visíveis;
- existe pequeno custo documental adicional, compensado pela redução de redesenho repetido.
