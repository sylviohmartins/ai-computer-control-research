# Architecture Tabletop Exercises

O primeiro blueprint simulou a arquitetura no papel antes da implementação. Cenários que devem ser preservados no Blueprint v2:

- read/write de filesystem com limites;
- `mvn test` long-running sem manter uma request aberta;
- lifecycle de processo de aplicação detached;
- comportamento com device offline;
- reconnect sem execução duplicada;
- approval/negação de comando perigoso;
- prompt injection proveniente do repositório;
- clientes concorrentes no mesmo workspace;
- output de comando muito grande;
- segurança futura de GUI/screenshot;
- update assinado do agent e rollback;
- indisponibilidade do control plane hospedado.

Os resultados formais da Phase 0 estão em `phase0-tabletop-results.md`. Cada cenário deve virar integration/chaos test executável quando o subsistema correspondente existir.
