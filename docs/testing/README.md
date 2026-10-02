# Estratégia de Validação

Ainda não existe implementação de produção. Este diretório registra como as hipóteses de arquitetura serão validadas quando a implementação começar.

Camadas esperadas:

- unit/property tests para protocolo, policy e paths;
- integration tests para control plane e agentes simulados;
- testes cross-platform do agent em Windows/macOS/Linux;
- testes de segurança/adversariais;
- reconnect/chaos tests;
- load tests para presence e process output;
- avaliações de tools/agentes em múltiplos clientes;
- workflow Java/Spring Boot como canário representativo de software engineering.

## Phase 0

- `acceptance/phase0-exit-review-2026-10-02.md` — exit gate da Phase 0;
- `acceptance/phase0-contract-audit-2026-10-02.md` — auditoria independente e revalidação dos contratos;
- `tabletop/phase0-tabletop-results.md` — cenários arquiteturais exercitados em papel.
