# Primeiro Vertical Slice — Critérios de Aceite

**Status:** proposto; aplicável somente após abertura do gate de implementação.

Uma primeira implementação relevante deve demonstrar, em máquina de teste não sensível, que:

1. o agent roda sem exigir administrator/root para operação normal;
2. o device é pareado com verificação one-time;
3. a máquina não exige porta pública inbound;
4. cliente IA/MCP autorizado consegue listar o device;
5. operações de filesystem não escapam dos roots configurados;
6. arquivo permitido pode ser lido;
7. write/patch permitido respeita policy local;
8. processo seguro pode ser iniciado e identificado por handle estável;
9. output pode ser lido após a request original terminar;
10. processo pode ser cancelado;
11. `git status` e `git diff` podem ser obtidos;
12. toda ação remota produz audit event;
13. revogação do device bloqueia novas ações/reconnect;
14. comando perigoso é negado ou passa pelo approval local configurado;
15. reconnect/retry não duplica comando já reconhecido.
