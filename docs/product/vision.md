# Telechir — Visão do Produto

## Identidade

**Telechir** — *Secure computer control for AI agents.*

> *Give AI a secure hand on your machines.*

## Conceito em uma linha

Uma camada segura e auditável de ação que permite que clientes de IA autorizados operem computadores e ambientes executáveis autorizados sem depender de um único provedor de modelo.

## Problema

Ferramentas de IA precisam cada vez mais de filesystem, processos, Git, browser e computer-use, mas essas capabilities estão fragmentadas entre agentes específicos de provedor, MCP servers, produtos de remote desktop e cloud sandboxes. Usuários frequentemente precisam escolher entre conveniência, portabilidade e segurança.

## Valor pretendido

Oferecer uma única camada de execução reutilizável por múltiplos clientes de IA, centralizando identidade do dispositivo, permissões, approvals, auditabilidade, revogação e, futuramente, sandboxing.

## Jobs to be done iniciais

- conectar um cliente de IA autorizado a uma máquina autorizada;
- listar/ler/escrever arquivos dentro de roots explicitamente permitidos;
- executar e observar processos curtos ou long-running de desenvolvimento;
- inspecionar Git status/diff sem publicar alterações silenciosamente;
- revogar dispositivo ou sessão centralmente;
- entender o que a IA fez por uma timeline auditável.

## Non-goals da primeira implementação

- construir um novo LLM;
- substituir plataformas completas de RMM/MDM;
- realizar privilege escalation silencioso;
- administração remota irrestrita por padrão;
- streaming completo de remote desktop no MVP;
- deploy autônomo em produção sem policy e approval explícitos.
