# Roadmap do Discovery até a Implementação

Este roadmap é intencionalmente gated. Ele descreve a ordem de maturação do projeto, não uma autorização para implementar todas as fases.

## Gates de discovery

1. **Naming discovery** — **concluído**: Telechir / `NAME_READY`.
2. **Commercial clearance da marca** — pendente antes de lançamento público/comercial; não bloqueia Phase 0.
3. **Viabilidade ChatGPT Plus/plugin** — caminho de referência validado; plugin próprio, availability e quota continuam como release gates.
4. **Blueprint v2** — consolidado com as decisões atuais.
5. **Licensing/open-source strategy** — concluída: core Apache-2.0 / ADR-0005.
6. **Definition of Ready** — concluída para Phase 0.
7. **Phase 0** — concluída em 2026-10-02; contratos congelados em `specs/`.
8. **Phase 1 readiness** — `READY_FOR_PHASE_1` concluído.
9. **Phase 1** — Local Agent Core concluída em 2026-10-02; exit review em `docs/testing/acceptance/phase1-exit-review-2026-10-02.md`.

## Fases após readiness

0. Repository and protocol specifications — **concluída**
1. Local agent core — **concluída**
2. Hosted control-plane skeleton — **próxima fase**
3. Pairing and device identity
4. Device realtime channel
5. Remote MCP integration and OAuth
6. Filesystem tools
7. Shell/process lifecycle
8. Basic Git
9. Policy, approvals and audit
10. Dashboard
11. ChatGPT public-plugin readiness
12. Sandbox mode
13. Computer use
14. Browser automation
15. Multi-device/workspace concurrency
16. Multi-AI compatibility certification
17. Public release hardening

A implementação não deve atravessar gates apenas porque uma fase posterior é tecnicamente possível.
