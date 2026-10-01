# Censo global de ferramentas que conectam IAs a computadores e ambientes executáveis
**Data da investigação:** 2026-09-29

## 1. Resumo executivo
Foram normalizados **181 candidatos materialmente relevantes** em categorias de bridges/MCPs, coding agents, computer-use/browser, sandboxes e executores CI/CD. A descoberta bruta foi maior; variantes óbvias, forks sem diferenciação material e resultados puramente irrelevantes foram deduplicados. O universo completo de MCPs é muito maior: o diretório Glama observado em 28/09/2026 reportava mais de 93 mil servidores, portanto este catálogo não pretende enumerar literalmente cada servidor MCP existente.

A principal conclusão arquitetural é que o Remote Desktop Commander não é uma categoria única. A mesma capacidade pode ser construída por: (a) bridge MCP para host real; (b) coding agent local com shell/filesystem; (c) computer-use/GUI; (d) sandbox cloud; (e) CI/CD; ou (f) composição de filesystem + shell + Git + browser MCP.

## 2. Metodologia e cobertura
A pesquisa combinou busca web, busca nativa do GitHub, diretório/registry MCP (Glama), npm, PyPI, Product Hunt, Hacker News, Reddit, LinkedIn publicamente indexado, documentação oficial de fornecedores e literatura/benchmarks acadêmicos. Também foram pesquisados GitLab e outros hostings; Codeberg ficou bloqueado por robots.txt nesta sessão. X/Twitter, Discord, Slack e YouTube não puderam ser cobertos integralmente por acesso/indexação e, portanto, não são tratados como exaustivamente pesquisados. A busca realizou múltiplas famílias de consultas: remote desktop, terminal/shell, filesystem, SSH, computer-use, browser, coding agents, Docker/Kubernetes, sandboxes, CI/CD e alternativas por nome/arquitetura.

### Limite de exaustividade
O critério usado foi **saturação prática de categorias**, não a alegação impossível de que todas as ferramentas existentes foram enumeradas. Novas rodadas passaram a produzir principalmente variantes do mesmo padrão (shell MCP, filesystem MCP, computer-use MCP e wrappers de coding agents), sem alterar as categorias arquiteturais principais. Projetos emergentes continuam surgindo diariamente.

## 3. Substitutos diretos do Remote Desktop Commander
| name | architecture | compatible_ai_clients | execution | filesystem_write | terminal | gui | mcp | maturity | confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Remote Desktop Commander | A/M | ChatGPT e superfícies/plugin compatíveis | Híbrido: relay cloud + agente local | Sim | Sim | Parcial | Sim | Beta / plugin publicado | Alta |
| Desktop Commander MCP | A/C/K | Claude Desktop/Code, Cursor, Windsurf e clientes MCP | Local | Sim | Sim | Parcial | Sim | Ativo/maduro | Alta |
| ChatGPT Desktop MCP | A/C/M | ChatGPT via MCP/túnel e clientes MCP | Local ou via túnel | Sim | Sim | Não | Sim | Ativo | Alta |
| Command-Line MCP Server | A/C/K | ChatGPT Web e clientes MCP | Local | Sim | Sim | Não | Sim | Emergente | Média |
| QuickDesk | A/F/H/M | Claude, GPT, Cursor e clientes MCP | Local/remoto | Sim | Sim | Sim | Sim | Emergente/ativo | Alta |
| Windows-MCP | C/F/K | Qualquer cliente MCP/LLM | Windows local ou HTTP remoto | Sim | Sim | Sim | Sim | Ativo/popular | Alta |
| winremote-mcp | C/F/H | Clientes MCP | Windows remoto/local | Sim | Sim | Sim | Sim | Ativo | Alta |
| mcp-node-server | A/C/H | Clientes MCP | Remoto HTTP | Sim | Sim | Sim | Sim | Emergente | Média |
| mcp-remote-control | A/C/H | Clientes MCP | Local/SSH/WinRM | Sim | Sim | Parcial | Sim | Emergente | Média |
| Remote PC MCP | A/C/H | Clientes MCP | Remoto | Sim | Sim | Sim | Sim | Experimental | Média |
| PC Bridge Linux | A/C/K | Clientes MCP | Linux local | Sim | Sim | Sim | Sim | Emergente | Média |
| desktop-touch-mcp | C/F/K | Clientes MCP | Windows local | Sim | Sim | Sim | Sim | Ativo | Alta |
| mcp-linux-desktop | C/F/K | Clientes MCP | Linux local | Sim | Sim | Sim | Sim | Ativo | Média |
| Devicebase MCP | A/C/F/H | Clientes MCP | Dispositivos remotos | Sim | Sim | Sim | Sim | Ativo | Alta |
| smart-terminal-mcp | C/K | Claude Code, Cursor, Trae, Antigravity e clientes MCP | Local | Via terminal | Sim | Não | Sim | Ativo/2026 | Alta |
| nc-tools-mcp | C/K | Clientes MCP | Local | Sim | Sim | Não | Sim | Ativo/2026 | Média |
| Shell MCP Lite | C/K | Claude Desktop, Cursor, Windsurf, Zed e clientes MCP | Local | Sim | Sim | Não | Sim | Ativo/2026 | Alta |
| Devolutions Remote Desktop Manager MCP | A/H | Clientes MCP locais | Desktop/remote sessions | Parcial | Sim | Sim | Sim | Enterprise | Alta |

## 4. Caso Java/Spring Boot/Maven
Para o ciclo `ler repo → editar múltiplos arquivos → mvn test → ler stack trace → corrigir → reexecutar → git diff`, os melhores encaixes são coding agents locais completos ou bridges com filesystem+terminal. O resultado abaixo não é um ranking absoluto; a quota/modelo e o boundary de segurança mudam a escolha.

| name | execution | terminal | git | testing | mcp | quota_model | security_note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Remote Desktop Commander | Híbrido: relay cloud + agente local | Sim | Via terminal | Via terminal | Sim | Work/Codex compartilham allowance quando usado nessas superfícies; quota no Chat normal não é documentada de forma específica | Shell + filesystem reais; dispositivo autorizável/desconectável; alto impacto se comprometido |
| Desktop Commander MCP | Local | Sim | Via terminal | Via terminal | Sim | Depende do modelo/provedor | Acesso amplo a shell/filesystem do usuário; guardrails não equivalem a sandbox |
| OpenAI Codex CLI | Local workspace + modelo cloud | Sim | Via terminal | Via terminal | Sim | Codex/Work allowance ou API, conforme autenticação | Approvals/sandbox configuráveis; ainda pode executar comandos no workspace |
| Claude Code | Local workspace + modelo cloud | Sim | Via terminal | Via terminal | Sim | Claude subscription/API | Permissões/approvals; shell local |
| Claude Code Remote Control | Execução permanece local; controle remoto via Claude | Sim | Via terminal | Via terminal | Sim | Claude subscription | Código/execução local; transcript/sync remoto conforme serviço; proteger sessão |
| Gemini CLI | Local workspace + modelo cloud/local via extensão | Sim | Via terminal | Via terminal | Sim | Gemini/API; tier pessoal documentado separadamente | Approval modes + sandbox configurável; shell local |
| Qwen Code | Local | Sim | Via terminal | Via terminal | Sim | API/provedor ou compute local | Shell/files; proteger workspace e secrets |
| GitHub Copilot CLI | Local + GitHub | Sim | Via terminal | Via terminal | Sim | Copilot premium requests/plan | Trusted folder/approvals; GitHub auth |
| VS Code Agent Mode | IDE/local | Sim | Via terminal | Via terminal | Sim | Copilot/model provider | Approvals/tool permissions e workspace trust |
| Cursor | Local + background agents cloud | Sim | Via terminal | Via terminal | Sim | Cursor/model provider | Background agents em VMs com internet; risco de exfiltration/credentials; terminal local também |
| Windsurf | Local/IDE | Sim | Via terminal | Via terminal | Sim | Windsurf/model provider | Agent terminal/editor com approvals/guardrails conforme configuração |
| Cline | Local + modelos externos | Sim | Via terminal | Via terminal | Sim | Depende do provider; login de assinatura não implica quota normal de chat | HITL para comandos/edits; editor+terminal+browser amplos |
| Roo Code | VS Code/local | Sim | Via terminal | Via terminal | Sim | Provider/API/local compute | Modes/permissions; terminal/browser/filesystem amplos |
| Continue | VS Code/JetBrains/CLI | Sim | Via terminal | Via terminal | Sim | Provider/API/local compute | Agent mode executa terminal/edits; controlar tools e secrets |
| Aider | Local | Sim | Via terminal | Via terminal | Não nativo | Provider/API/local compute | Auto-commit facilita rollback; /run executa shell real |
| Goose | Desktop/CLI local | Sim | Via terminal | Via terminal | Sim | Provider/subscription/local | Extensions/MCP ampliam superfície; sandbox/security controls disponíveis |
| OpenCode | Local/web | Sim | Via terminal | Via terminal | Sim | Depende do provider; OAuth pode usar backend específico | Shell/filesystem completos; policies/provider-specific |
| OpenHands | Docker/local/cloud | Sim | Via terminal | Via terminal | Parcial | Provider/API ou cloud plan | Runtime Docker/sandbox recomendado; browser+bash+filesystem |
| Amp | CLI local + Orbs cloud | Sim | Via terminal | Via terminal | Sim | Amp/provider; não assumir que vínculo ChatGPT = quota normal do Chat | Shell pode rodar sem approval por padrão em alguns modos; preferir ambiente isolado |
| Kilo Code | VS Code/JetBrains/cloud/mobile | Sim | Via terminal | Via terminal | Sim | Provider/Kilo | Multi-surface; conferir policies em cada modo |
| Skales | Windows/macOS/Linux | Sim | Via terminal | Via terminal | Sim | Provider/subscription/local; validar backend de login | 290+ tools elevam superfície; local-first reduz relay, mas controlar permissions |
| OpenHarness | Local | Sim | Via terminal | Via terminal | Parcial | Provider/API/local | Permission gates ask/trust/deny e Git auto-commit; shell real |
| ForgeCode | Local/Zsh | Sim | Via terminal | Via terminal | Parcial | Provider/API | Vive no shell real; respeitar permissões do usuário |

## 5. Opções com isolamento mais forte
| name | category | execution | terminal | filesystem_write | security_note |
| --- | --- | --- | --- | --- | --- |
| Rootpilot MCP | SSH diagnostics | Remoto SSH | Parcial | Não | Read-only por desenho em diagnósticos; risco menor que shell irrestrito |
| Strands Shell | Sandboxed shell | Local/in-process | Sim | Sim | VFS + URL allowlist + secret injection; isolamento lógico mais forte que shell host direto |
| agents-terminal | Jailed terminal | Local/container | Sim | Parcial | Executor com jail/policy; melhor como camada complementar a agentes |
| OpenAI Sandbox Agents | Agent sandbox | Cloud isolated container | Sim | Sim | Isolated filesystem/shell/package install/ports/snapshots; melhor boundary que host shell |
| E2B | Cloud sandbox | Cloud microVM/sandbox | Sim | Sim | Isolamento por sandbox; ainda controlar network/secrets |
| Daytona | Agent sandbox platform | Cloud/local sandbox depending deployment | Sim | Sim | Sandboxes/VMs; suporte Linux/Windows/macOS/GPU conforme oferta |
| Microsandbox | MicroVM sandbox | Local/cloud microVM | Sim | Sim | MicroVM/kernel boundary forte; boa opção para execução não confiável |
| Pydantic Monty | In-process Python sandbox | Local/in-process restricted runtime | Não host shell | Parcial | Mais seguro que shell host para Python limitado; não substitui container para tudo |

## 6. Quotas: regra prática
- **Codex/Work:** quando a tarefa roda nessas superfícies, aplica-se a allowance/créditos do agente correspondente; Work e Codex podem compartilhar allowance conforme o plano.
- **Chat normal + plugin:** não presumir automaticamente a mesma contabilização do Codex; a documentação pública não define uma regra universal por plugin. Validar a surface e o medidor real.
- **OAuth/Login com assinatura:** login com ChatGPT/Claude não prova que o consumo pertence ao chat convencional; alguns agentes usam backends/allowances específicos.
- **BYOK/API:** cobrança separada por API/provedor.
- **Modelo local:** sem quota do provedor de LLM; custo é hardware/energia/infra local.
- **Sandbox/CI:** modelo e execução são cobranças independentes em muitos casos.

## 7. Segurança
Ferramentas com **shell + filesystem do host** devem ser tratadas como execução de código remoto com os privilégios do usuário. Allowed directories e blocklists reduzem acidentes, mas não substituem sandbox quando o agente também possui shell. Para repositórios sensíveis, prefira usuário do SO dedicado, worktree/cópia descartável, container/microVM, credenciais de escopo mínimo, egress controlado, approvals para writes/commands e logs de auditoria. Computer-use adiciona risco de prompt injection visual; CI/CD adiciona risco de tokens/secrets e supply chain.

## 8. Evidência acadêmica relevante
Benchmarks recentes reforçam a necessidade de separar modelo, harness e ambiente. TUA-Bench mede agentes em tarefas gerais de terminal; trabalhos de 2026 argumentam que benchmarks de coding conflam modelo e harness. Em PwP-Bench, agentes de computer-use puramente visuais tiveram desempenho bem menor do que quando receberam APIs textuais simples de edição de arquivos e bash, reforçando por que combinações de GUI + filesystem + terminal tendem a ser superiores para engenharia de software.

## 9. Catálogo mestre
| name | category | architecture | execution | terminal | gui | mcp | open_source | maturity | confidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Remote Desktop Commander | Bridge remoto / MCP | A/M | Híbrido: relay cloud + agente local | Sim | Parcial | Sim | Parcial (agente local/manifest; serviço hospedado fechado) | Beta / plugin publicado | Alta |
| Desktop Commander MCP | MCP local | A/C/K | Local | Sim | Parcial | Sim | Sim | Ativo/maduro | Alta |
| ChatGPT Desktop MCP | Bridge local/remoto | A/C/M | Local ou via túnel | Sim | Não | Sim | Sim | Ativo | Alta |
| Command-Line MCP Server | MCP terminal/filesystem | A/C/K | Local | Sim | Não | Sim | Sim | Emergente | Média |
| QuickDesk | Remote desktop + MCP | A/F/H/M | Local/remoto | Sim | Sim | Sim | Sim | Emergente/ativo | Alta |
| Windows-MCP | Computer use Windows | C/F/K | Windows local ou HTTP remoto | Sim | Sim | Sim | Sim | Ativo/popular | Alta |
| winremote-mcp | Computer use Windows | C/F/H | Windows remoto/local | Sim | Sim | Sim | Sim | Ativo | Alta |
| computer-use-mcp (domdomegg) | Computer use | C/F/K | Local | Parcial | Sim | Sim | Sim | Ativo | Alta |
| computer-use-mcp (Zavora) | Computer use | C/F/K | Local | Parcial | Sim | Sim | Sim | Ativo | Alta |
| macOS Use MCP | Computer use macOS | C/F/K | macOS local | Parcial | Sim | Sim | Sim | Ativo | Alta |
| MCP Remote macOS Use | Remote computer use macOS | C/F/H | macOS remoto | Parcial | Sim | Sim | Sim | Ativo | Alta |
| mcp-vnc | VNC / computer use | C/F/H | Remoto via VNC | Não nativo | Sim | Sim | Sim | Ativo | Alta |
| Open Computer Use | Computer use cross-platform | C/F/K | Local | Parcial | Sim | Sim | Sim | Ativo/2026 | Alta |
| computer-use-linux | Computer use Linux | C/F/K | Linux local | Parcial | Sim | Sim | Sim | Ativo | Alta |
| mcp-node-server | Remote host control | A/C/H | Remoto HTTP | Sim | Sim | Sim | Sim | Emergente | Média |
| mcp-remote-control | Remote executor | A/C/H | Local/SSH/WinRM | Sim | Parcial | Sim | Sim | Emergente | Média |
| Agentic Remote PC | Remote PC / coding-agent bridge | A/H/I | Remoto | Sim | Parcial | Sim | Sim | Emergente | Média |
| Remote PC MCP | Remote PC | A/C/H | Remoto | Sim | Sim | Sim | Sim | Experimental | Média |
| PC Bridge Linux | Linux bridge | A/C/K | Linux local | Sim | Sim | Sim | Sim | Emergente | Média |
| pc-control-mcp | PC control safety-first | C/F/K | Local | Opt-in | Opt-in | Sim | Sim | Emergente | Média |
| OODA Computer Control | Computer use | C/F/K | Local | Sim | Sim | Sim | Sim | Emergente | Média |
| Windows Computer Control MCP | Computer use Windows | C/F/K | Windows local | Parcial | Sim | Sim | Sim | Emergente | Média |
| PC Manager MCP | PC management | C/F/K | Local | Sim | Parcial | Sim | Sim | Experimental | Baixa |
| Poke PC | Remote/local PC bridge | A/C/H | Container/local/remoto | Sim | Parcial | Sim | Sim | Emergente | Média |
| Talk to Your PC | PC control | C/F/K | Local | Sim | Parcial | Sim | Sim | Experimental | Baixa |
| xiaozhi-pc-control | PC control | C/F/K | Local | Sim | Sim | Sim | Sim | Experimental | Baixa |
| pc-bot | PC control | C/F/K | Local | Sim | Parcial | Sim | Sim | Experimental | Baixa |
| LAMDA | Android automation / remote desktop | B/F/H | Android remoto/local | Sim | Sim | Sim | Sim | Ativo | Alta |
| Termux MCP | Android shell | C/H/K | Android/Termux | Sim | Parcial | Sim | Sim | Ativo | Alta |
| desktop-touch-mcp | Windows desktop + terminal | C/F/K | Windows local | Sim | Sim | Sim | Sim | Ativo | Alta |
| mcp-linux-desktop | Linux desktop control | C/F/K | Linux local | Sim | Sim | Sim | Sim | Ativo | Média |
| Codex Desktop Bridge | Codex Computer Use bridge | A/C/H | Linux→Windows via SSH | Sim | Sim | Sim | Sim | Emergente | Média |
| Macuse | macOS apps + computer use | C/F/K | macOS local | Parcial | Sim | Sim | Sim | Ativo | Alta |
| Devicebase MCP | Device/desktop control | A/C/F/H | Dispositivos remotos | Sim | Sim | Sim | Sim | Ativo | Alta |
| Agent-RDP | Windows automation over RDP | F/H | Windows remoto | Parcial | Sim | Não verificado | Sim | Emergente | Média |
| PerceptAI | Local desktop control | F/K | Local | Parcial | Sim | Não verificado | Sim | Emergente | Média |
| Cyberdesk | Virtual desktop API for agents | E/F/L | Cloud VM | Sim | Sim | Não verificado | Sim | Emergente | Média |
| Clide | AI-native terminal | D/K | macOS local | Sim | Parcial | Não verificado | Não verificado | Ativo/2026 | Alta |
| Grove | AI-native script runner/terminal | D/K | macOS local | Sim | Parcial | Sim | Não verificado | Emergente/2026 | Média |
| Shepherd Terminal | Persistent terminal/orchestrator | H/I/K | Local/remoto | Sim | Parcial | Parcial | Não verificado | Emergente/2026 | Alta |
| iTerm MCP | Terminal control | C/K | macOS/iTerm2 | Sim | Parcial | Sim | Sim | Emergente | Média |
| DesktopBridge | Filesystem + shell bridge | A/C/K | macOS local | Sim | Não | Sim | Sim | Emergente | Média |
| terminal-use-mcp | Persistent interactive terminal | C/K/H | Local/remoto | Sim | Não | Sim | Sim | Ativo | Alta |
| claude-terminal-mcp | Terminal MCP | C/K | Local | Sim | Não | Sim | Sim | Ativo | Média |
| smart-terminal-mcp | Persistent PTY MCP | C/K | Local | Sim | Não | Sim | Sim | Ativo/2026 | Alta |
| interminal | Persistent shell MCP | C/K | Local | Sim | Não | Sim | Sim | Ativo | Média |
| shell-0 | Shell/filesystem MCP | C/K | Local | Sim | Não | Sim | Sim | Experimental | Média |
| mcp-shell-server | Shell MCP | C/K | Local | Sim | Não | Sim | Sim | Ativo | Média |
| mcp-shell | Shell MCP | C/K | Local | Sim | Não | Sim | Sim | Ativo | Média |
| shell-command-mcp | Shell MCP | C/K | Local | Sim | Não | Sim | Sim | Ativo | Média |
| dynamic-shell-server | Shell MCP | C/K | Local | Sim | Não | Sim | Sim | Ativo | Média |
| terminal-mcp (@ellery) | Terminal MCP | C/K | Local | Sim | Não | Sim | Sim | Ativo/2026 | Alta |
| mcp-tmux | Terminal/tmux MCP | C/K/H | Local/remoto via tmux | Sim | Não | Sim | Sim | Ativo | Média |
| Forge MCP (PTY) | Persistent PTY / multi-agent | C/H/I | Local/remoto | Sim | Parcial | Sim | Sim | Ativo | Média |
| ExecKit | Stateful shell | C/H | Local/SSH/Docker | Sim | Não | Sim | Sim | Ativo | Média |
| Servonaut | Fleet/SSH executor | C/H | Fleet remoto | Sim | Não | Sim | Sim | Ativo | Média |
| Rootpilot MCP | SSH diagnostics | C/H | Remoto SSH | Parcial | Não | Sim | Sim | Ativo | Média |
| sudo-proxy | Privileged command proxy | A/H | Local/remoto | Parcial | Não | Parcial | Sim | Ativo | Média |
| ssh-mcp | SSH MCP | C/H | Remoto SSH | Sim | Não | Sim | Sim | Ativo | Média |
| mcp-ssh-manager | SSH manager MCP | C/H | Remoto SSH | Sim | Não | Sim | Sim | Ativo | Média |
| MCP Agentic Terminal | Terminal/filesystem MCP | C/K | Local | Sim | Não | Sim | Sim | Ativo/2026 | Alta |
| agentic-terminal-station | Terminal/filesystem MCP | C/K | Local | Sim | Não | Sim | Sim | Ativo/2026 | Alta |
| nc-tools-mcp | Developer toolbox MCP | C/K | Local | Sim | Não | Sim | Sim | Ativo/2026 | Média |
| Filesystem MCP (oficial MCP) | Filesystem MCP | C/K | Local | Não | Não | Sim | Sim | Estável/ativo | Alta |
| Agent Infra Filesystem MCP | Filesystem MCP | C/K | Local | Não | Não | Sim | Sim | Ativo | Alta |
| filesystem-mcp (j0hanz) | Filesystem MCP | C/K | Local | Não | Não | Sim | Sim | Ativo | Média |
| fs-mcp-rs | Filesystem MCP Rust | C/K | Local | Não | Não | Sim | Sim | Ativo | Média |
| Strands Shell | Sandboxed shell | C/E/K | Local/in-process | Sim | Não | Sim | Sim | Ativo/2026 | Alta |
| Shell MCP Lite | Shell + files MCP | C/K | Local | Sim | Não | Sim | Sim | Ativo/2026 | Alta |
| Goodfoot Shell MCP | Shell MCP / OpenAI tunnel | C/K/M | Local via loopback/túnel | Sim | Não | Sim | Sim | Ativo/2026 | Alta |
| Desktop Hypervisor MCP | VM control | C/E/H | Local/híbrido | Parcial | Parcial | Sim | Sim | Ativo/2026 | Média |
| Devolutions Remote Desktop Manager MCP | Enterprise remote access | A/H | Desktop/remote sessions | Sim | Sim | Sim | Não | Enterprise | Alta |
| Terminal Guardian MCP | Policy-bound terminal | C/K | Local | Sim | Não | Sim | Sim | Ativo | Média |
| agents-terminal | Jailed terminal | E/K | Local/container | Sim | Não | Parcial | Sim | Ativo/2026 | Alta |
| agent-shell | Policy/observability shell wrapper | J/K | Local/CI | Parcial | Não | Não | Sim | Ativo/2026 | Alta |
| OpenAI Codex CLI | Coding agent CLI | B/K | Local workspace + modelo cloud | Sim | Não | Sim | Sim | Oficial/estável | Alta |
| Claude Code | Coding agent CLI | B/K | Local workspace + modelo cloud | Sim | Não | Sim | Não | Oficial/estável | Alta |
| Claude Code Remote Control | Remote coding session | B/H/M | Execução permanece local; controle remoto via Claude | Sim | Parcial | Sim | Não | Oficial/ativo | Alta |
| Gemini CLI | Coding agent CLI | B/K | Local workspace + modelo cloud/local via extensão | Sim | Não | Sim | Sim | Oficial/estável | Alta |
| Qwen Code | Coding agent CLI | B/K | Local | Sim | Não | Sim | Sim | Ativo | Alta |
| GitHub Copilot CLI | Coding agent CLI | B/K | Local + GitHub | Sim | Não | Sim | Não | Oficial/ativo | Alta |
| VS Code Agent Mode | IDE agent | D/K | IDE/local | Sim | Parcial | Sim | Parcial (VS Code OSS + serviços Copilot) | Oficial/estável | Alta |
| Cursor | AI IDE/agent | D/K/L | Local + background agents cloud | Sim | Sim | Sim | Não | Production/estável | Alta |
| Windsurf | AI IDE/agent | D/K | Local/IDE | Sim | Sim | Sim | Não | Production/estável | Alta |
| Cline | Coding agent IDE/CLI/Desktop | B/D/K | Local + modelos externos | Sim | Sim | Sim | Sim | Ativo/maduro | Alta |
| Roo Code | Coding agent IDE | B/D/K | VS Code/local | Sim | Sim | Sim | Sim | Ativo/maduro | Alta |
| Continue | Coding agent IDE/CLI | B/D/K | VS Code/JetBrains/CLI | Sim | Sim | Sim | Sim | Ativo/maduro | Alta |
| Aider | Coding agent CLI | B/K | Local | Sim | Não | Não nativo | Sim | Ativo, ritmo recente menor segundo comunidade | Alta |
| Goose | Coding/general agent | B/K | Desktop/CLI local | Sim | Sim | Sim | Sim | Ativo/maduro | Alta |
| OpenCode | Coding agent terminal/desktop/web | B/K | Local/web | Sim | Sim | Sim | Sim | Ativo/maduro | Alta |
| OpenHands | Software engineering agent | B/E/K/L | Docker/local/cloud | Sim | Sim | Parcial | Sim | Ativo/maduro | Alta |
| mini-SWE-agent | SWE agent CLI | B/E/K/L | Local/Docker/Modal/AWS | Sim | Não | Não verificado | Sim | Ativo/recomendado pelo projeto | Alta |
| SWE-agent (legacy) | SWE agent | B/E/K | Local/Docker | Sim | Não | Não verificado | Sim | Maintenance/legado; mini-SWE-agent é sucessor recomendado | Alta |
| gptme | General/coding agent CLI | B/K | Local | Sim | Parcial | Parcial | Sim | Ativo | Alta |
| Open Interpreter | Coding/general agent CLI | B/K | Local | Sim | Parcial | Parcial | Sim | Ativo | Alta |
| Pi Coding Agent | Coding agent harness | B/K | Local | Sim | Não | Sim | Sim | Ativo/2026 | Alta |
| Crush | Coding agent CLI | B/K | Local | Sim | Não | Sim | Sim | Ativo | Alta |
| Zero (Gitlawb) | Coding agent CLI | B/K | Local | Sim | Não | Parcial | Sim | Ativo | Média |
| Hermes Agent | General/coding agent | B/F/K | Local | Sim | Sim | Sim | Sim | Ativo | Média |
| Agent Zero | General agent framework | B/E/K | Docker/Linux desktop | Sim | Sim | Parcial | Sim | Ativo/maduro | Alta |
| Plandex | Coding agent CLI | B/K | Local/cloud | Sim | Não | Parcial | Sim | Ativo | Média |
| VEXI | Coding agent CLI | B/K | Local | Sim | Não | Parcial | Sim | Emergente | Média |
| Zed Agent Panel | IDE agent | D/K | IDE local | Sim | Sim | Sim | Sim | Ativo/production | Alta |
| JetBrains Junie | IDE/CLI coding agent | B/D/K | IDE/CLI local | Sim | Sim | Sim | Não | Production (saiu de beta em 2026) | Alta |
| GitLab Duo CLI | Coding agent CLI | B/K | Local + GitLab | Sim | Não | Parcial | Parcial | GA 2026 | Alta |
| GitLab Duo Agent Platform | Agent platform | B/G/L | GitLab cloud/self-managed conforme oferta | Sim | Parcial | Sim | Parcial | Ativo/enterprise | Alta |
| Atlassian Rovo Dev | Coding agent CLI/IDE/CI | B/D/G/K/L | Local + cloud/CI | Sim | Sim | Parcial | Não | Ativo/enterprise | Alta |
| Kiro | IDE/CLI/agent platform | B/D/K/L | IDE/CLI/web/mobile | Sim | Sim | Sim | Parcial | Ativo/production | Alta |
| Factory Droid | Coding agent CLI/cloud | B/K/L | Local CLI + cloud | Sim | Parcial | Sim | Não | Ativo/enterprise | Alta |
| Google Antigravity | Multi-agent IDE/orchestrator | B/D/I/K | Desktop/local | Sim | Sim | Sim | Não | Ativo/2026 | Alta |
| Warp | Agentic development environment | B/D/I/K/L | Local + cloud | Sim | Sim | Sim | Não | Production | Alta |
| Replit Agent | Cloud coding agent | B/L | Cloud workspace | Sim | Sim | Parcial | Não | Production | Alta |
| Devin | Cloud software agent | B/L | Cloud workspace | Sim | Sim | Parcial | Não | Production | Alta |
| Amp | Coding agent local/cloud | B/K/L | CLI local + Orbs cloud | Sim | Parcial | Sim | Não | Ativo/production | Alta |
| Sourcegraph Cody | IDE/enterprise coding agent | B/D/K | IDE/local + Sourcegraph | Sim | Sim | Sim | Parcial | Production/enterprise | Alta |
| Pochi | Open-source coding agent | B/D/K/L | VS Code/CLI + Remote Pochi cloud | Sim | Sim | Sim | Sim | Ativo | Alta |
| Kilo Code | Coding agent platform | B/D/K/L | VS Code/JetBrains/cloud/mobile | Sim | Sim | Sim | Sim | Ativo/2026 | Alta |
| Skales | Local-first desktop agent | B/F/K | Windows/macOS/Linux | Sim | Sim | Sim | Parcial/source-available | Ativo/2026 | Alta |
| Void | AI code editor | D/K | Desktop local | Sim | Sim | Parcial | Sim | Arquivado em 2026 | Alta |
| Pydantic AI Harness | Agent framework/coding harness | J/E/K/L | Local/cloud/sandbox | Sim | Não | Sim | Sim | Ativo | Alta |
| Kit | Coding agent runtime | B/I/K | Local/headless | Sim | Não | Sim | Sim | Emergente/2026 | Média |
| OpenClawdex | Coding-agent orchestrator UI | I/K | Local | Via agentes | Sim | Parcial | Sim | Emergente | Média |
| AgentWire | Remote coding-agent cockpit | I/H | Self-host/local/remoto via SSH | Sim | Sim | Sim | Sim | Emergente | Alta |
| delegate-team | Agent orchestrator | I/K | Local | Sim | Parcial | Parcial | Sim | Emergente | Alta |
| Claude Squad | Multi-agent terminal orchestrator | I/K | Local/tmux/worktrees | Sim | Não | Parcial | Sim | Ativo | Alta |
| cmux | Multi-agent terminal/workspace | I/K | Local | Sim | Parcial | Parcial | Sim | Ativo | Alta |
| OpenHarness | Coding agent terminal | B/K | Local | Sim | Não | Parcial | Sim | Emergente/2026 | Alta |
| ForgeCode | Zsh-integrated coding agent | B/K | Local/Zsh | Sim | Não | Parcial | Sim | Emergente/2026 | Alta |
| Ante | Offline/local coding agent | B/K | Local/offline ou cloud | Sim | Não | Não verificado | Parcial | Emergente/2026 | Alta |
| Heirloom Agent | Coding agent terminal | B/K | Local | Sim | Não | Sim | Sim | Emergente/2026 | Alta |
| my-agent | Personal terminal agent | B/K | macOS local | Sim | Não | Sim | Sim | Emergente/2026 | Média |
| Plank | Local coding agent | B/K | macOS local | Sim | Não | Sim | Sim | Emergente/2026 | Alta |
| DeepSeek-TUI | Terminal coding agent | B/K | Local | Sim | Não | Sim | Sim | Emergente/2026 | Média |
| OPENDEV | Terminal coding agent research | B/J/K | Local | Sim | Não | Parcial | Sim | Research/2026 | Alta |
| ShellTeam | Remote coding-agent cockpit | I/H | VPS/self-host + web/mobile | Sim | Sim | Parcial | Sim | Emergente/2026 | Alta |
| CloudCLI | Web/mobile UI for CLI agents | I/H | Local/remoto + browser | Sim | Sim | Parcial | Sim | Ativo | Alta |
| Agentastic | Multi-agent terminal IDE | I/K | Local/worktrees | Sim | Parcial | Parcial | Não verificado | Emergente | Média |
| Agents CLI (Phoenix Labs) | Meta-harness/orchestrator | I/K | Local | Sim | Parcial | Sim | Sim | Emergente/2026 | Alta |
| scritty | Shared memory / terminal agent context | I/K | Local | Parcial | Parcial | Sim | Não verificado | Emergente/2026 | Alta |
| OpenAI Computer Use | Computer-use model/tool | F/J | Ambiente fornecido pelo desenvolvedor | Não nativo | Sim | Não | Não | Oficial/production | Alta |
| Claude Computer Use | Computer-use tool | F/J | Ambiente do desenvolvedor | Não nativo | Sim | Não | Não | Oficial | Alta |
| Gemini Computer Use | Computer-use tool | F/J | Browser/mobile/desktop environments | Não nativo | Sim | Não | Não | Oficial | Alta |
| Playwright MCP | Browser automation MCP | C/F/K | Local/browser | Não | Browser | Sim | Sim | Ativo/official Microsoft | Alta |
| Chrome DevTools MCP | Browser/devtools MCP | C/F/K | Chrome local | Parcial via page/devtools | Browser | Sim | Sim | Ativo | Alta |
| Browser Use | Browser agent framework | B/F/K/L | Local/cloud browser | Parcial | Browser | Parcial | Sim | Ativo/maduro | Alta |
| Hyperbrowser | Browser infrastructure | E/F/L | Cloud browsers | Parcial | Browser | Sim | Parcial | Production | Alta |
| Browserbase | Browser infrastructure | E/F/L | Cloud browsers | Não | Browser | Parcial | Parcial | Production | Alta |
| Skyvern | Browser agent | B/F/L | Cloud/self-host browser | Parcial | Browser | Parcial | Sim | Ativo | Alta |
| BrowserForge | Browser agent platform | B/F/L | Cloud browser | Não | Browser | Não verificado | Não verificado | Emergente | Média |
| Asteroid | Computer-use builder | F/L | Browser/Linux/Windows cloud | Parcial | Sim | Parcial | Não | Ativo | Alta |
| Compuser.ai | Browser computer-use agent | F/L | Browser | Não | Browser | Não | Não | Ativo | Alta |
| Clevrr Computer | Open-source computer use | F/K | Local | Parcial | Sim | Não verificado | Sim | Experimental | Alta |
| UseDesktop | CUA environments/evals | E/J/L | Cloud/benchmark | Parcial | Sim | Não verificado | Parcial | Emergente/2026 | Alta |
| Invisible Playwright MCP | Browser automation MCP | C/F/K | Local/browser | Não | Browser | Sim | Sim | Ativo | Alta |
| browser-control-mcp | Browser control MCP | C/F/K | Local/browser | Não | Browser | Sim | Sim | Ativo | Alta |
| Worktable | Agent visualization canvas | J/K | Localhost/browser canvas | Não | Sim | Sim | Sim | Emergente/2026 | Alta |
| OpenAI Sandbox Agents | Agent sandbox | E/J/L | Cloud isolated container | Sim | Não | Parcial | Não | Oficial/2026 | Alta |
| E2B | Cloud sandbox | E/L | Cloud microVM/sandbox | Sim | Parcial | Parcial | Parcial | Production | Alta |
| Daytona | Agent sandbox platform | E/L | Cloud/local sandbox depending deployment | Sim | Sim | Parcial | Sim | Production | Alta |
| Modal Sandbox | Cloud sandbox | E/L | Cloud isolated container | Sim | Não | Não nativo | Não | Production | Alta |
| Vercel Sandbox | Cloud sandbox | E/L | Cloud ephemeral compute | Sim | Não | Parcial | Parcial | Production | Alta |
| Cloudflare Sandbox | Cloud sandbox | E/L | Cloud containers | Sim | Não | Parcial | Parcial | Production/2026 | Alta |
| Railway Sandboxes | Cloud coding sandbox | E/L | Cloud workspace | Sim | Parcial | Parcial | Não | Production/2026 | Alta |
| Microsandbox | MicroVM sandbox | E/K/L | Local/cloud microVM | Sim | Não | Parcial | Sim | Ativo | Alta |
| Fly Sprites / Machines | Agent compute | E/L | Cloud VMs | Sim | Parcial | Não nativo | Não | Production | Alta |
| GitHub Codespaces | Cloud dev environment | E/L | Cloud devcontainer | Sim | Sim | Parcial | Não | Production | Alta |
| Gitpod | Cloud dev environment | E/L | Cloud workspace | Sim | Sim | Parcial | Parcial | Production | Alta |
| DevPod | Devcontainer workspace manager | E/H/K | Local/SSH/cloud providers | Sim | Parcial | Não nativo | Sim | Production | Alta |
| Docker MCP Toolkit | MCP/tool container manager | C/E/K | Local Docker | Parcial | Não | Sim | Parcial | Official/active | Alta |
| Docker MCP Gateway | MCP gateway | A/C/E/K | Local | Parcial | Não | Sim | Sim | Official/active | Alta |
| Kubernetes MCP Server | Kubernetes control | C/H | Cluster remoto/local kubeconfig | Parcial | Não | Sim | Sim | Ativo | Alta |
| agent-infra/sandbox | Agent sandbox toolkit | E/K/L | Local/cloud | Sim | Parcial | Parcial | Sim | Ativo | Alta |
| Pydantic Monty | In-process Python sandbox | E/J/K | Local/in-process restricted runtime | Não host shell | Não | Não | Sim | Ativo/2026 | Alta |
| Pydantic ModalSandbox | Cloud sandbox integration | E/L | Modal cloud | Sim | Não | Parcial | Sim | Ativo | Alta |
| GitHub Actions | CI/CD executor | G/L | Cloud/self-hosted runners | Sim | Não | Parcial | Não | Production | Alta |
| GitLab CI/CD | CI/CD executor | G/L | Cloud/self-hosted runners | Sim | Não | Parcial | Parcial | Production | Alta |
| CircleCI | CI/CD executor | G/L | Cloud/self-hosted runners | Sim | Não | Não nativo | Não | Production | Alta |
| Jenkins | CI/CD executor | G/K/H | Self-host | Sim | Web | Via plugins/custom | Sim | Production/mature | Alta |
| Buildkite | CI/CD executor | G/H | Self-hosted agents + cloud control plane | Sim | Web | Não nativo | Parcial | Production | Alta |
| Azure DevOps Pipelines | CI/CD executor | G/L | Cloud/self-hosted agents | Sim | Web | Parcial | Não | Production | Alta |
| Bitbucket Pipelines | CI/CD executor | G/L | Cloud/self-hosted runners | Sim | Web | Parcial | Não | Production | Alta |

## 10. Cobertura e auditoria
- Candidatos normalizados: **181**
- Confiança: {'Alta': 129, 'Média': 48, 'Baixa': 4}
- Fontes efetivamente utilizadas: busca web; GitHub nativo; documentação oficial; Glama MCP Registry; npm; PyPI; Product Hunt; Hacker News; Reddit; LinkedIn indexado; arXiv/OpenReview/Hugging Face.
- GitLab: pesquisado via web/indexação; retornos úteis foram menores que GitHub.
- Codeberg: bloqueado por robots.txt nesta sessão.
- X/Twitter: buscas tentadas, sem cobertura confiável suficiente para alegar exploração integral.
- Discord/Slack privados: não acessados.
- YouTube: consultas tentadas, mas sem cobertura suficiente para alegar auditoria integral da plataforma.
- Baidu/Yandex/Kagi/Startpage: o ambiente de pesquisa não oferece seleção garantida de cada mecanismo individual; não alegado como pesquisado diretamente.

## 11. Amostra de famílias de queries
- `MCP terminal filesystem`, `MCP remote desktop`, `computer use MCP`, `SSH MCP server`, `Docker MCP server`, `Kubernetes MCP server`
- `AI coding agent terminal`, `coding agent local terminal`, `ChatGPT local computer`, `Claude local shell`, `Gemini terminal`
- `site:linkedin.com/posts MCP terminal coding agent`, `site:reddit.com Desktop Commander`, `site:news.ycombinator.com Show HN coding agent`
- `site:npmjs.com MCP terminal filesystem`, `site:pypi.org MCP terminal filesystem`, `site:arxiv.org coding agents terminal benchmark`

## 12. Fontes primárias/índices-chave
- OpenAI RDC: https://openai.com/business/plugins/remote-desktop-commander/
- Desktop Commander MCP: https://github.com/wonderwhy-er/DesktopCommanderMCP
- Glama MCP Directory: https://glama.ai/mcp/servers
- Filesystem MCP: https://www.npmjs.com/package/@modelcontextprotocol/server-filesystem
- Gemini CLI: https://github.com/google-gemini/gemini-cli
- Cline: https://github.com/cline/cline
- Roo Code: https://github.com/RooCodeInc/Roo-Code
- OpenHands: https://github.com/All-Hands-AI/OpenHands
- E2B: https://e2b.dev/
- Daytona: https://www.daytona.io/

## 13. Nota sobre o catálogo CSV/JSON
O CSV/JSON contém campos de arquitetura, compatibilidade, execução, filesystem, terminal, GUI, browser, Git, testes, MCP, open source, self-hosting, pricing, autenticação/plano, quota, maturidade, aderência Java/Spring, segurança, confiança e fonte. Campos `Parcial`, `Não verificado` e confiança `Média/Baixa` foram mantidos deliberadamente quando a evidência não justificava uma afirmação forte.