# Product & Technical Blueprint — Plataforma universal de controle de computadores por IA

**Data do discovery:** 29/09/2026  
**Status:** Discovery/arquitetura concluídos; nenhuma implementação ou deploy foi realizado.  
**Working name:** **MachinaPort**  
**Descriptor de descoberta:** **AI Computer Control & MCP Agent Bridge**  
**Objetivo da próxima etapa:** implementar somente a Phase 0 do roadmap após aprovação do blueprint.

---

# Parte I — Executive Summary

## Decisão de produto

O produto não deve ser concebido como "mais um remote desktop". A categoria mais defensável é:

> **uma camada universal, model-agnostic e policy-first que permite que IAs autorizadas operem computadores reais, sandboxes e servidores por ferramentas tipadas, com filesystem, processos, Git e, futuramente, GUI/browser.**

O Remote Desktop Commander é um benchmark importante, mas o levantamento anterior mostrou que a capacidade total é formada por várias famílias independentes: bridges/MCP, coding agents, computer-use, sandboxes e CI/CD. O catálogo de origem contém 181 candidatos materialmente relevantes e permite compor um produto mais coerente do que simplesmente clonar um concorrente.

## Proposta de valor

**MachinaPort** deve ser:

1. **Multi-AI by design** — ChatGPT, Codex, Claude, Gemini, Copilot e qualquer cliente MCP compatível.
2. **Model-independent** — nenhuma inferência precisa ocorrer no control plane.
3. **Outbound-only no dispositivo** — nenhuma porta precisa ser aberta na máquina.
4. **Policy-first** — a última palavra sobre permissão fica no agente local, não na nuvem nem no modelo.
5. **Typed-tools first** — filesystem/process/Git específicos em vez de depender de uma ferramenta genérica `execute_anything`.
6. **Task/process aware** — processos long-running são objetos explícitos e canceláveis.
7. **Multi-device** — o usuário pode ter workstation, notebook, VPS e servidor numa mesma conta.
8. **Auditável** — timeline de tool calls, approvals, latência, erros e artefatos.
9. **Sandbox-ready** — Host, Guarded Host e Sandbox como modos progressivos.
10. **Cloudflare-first, mas não Cloudflare-locked** — control plane barato no edge com protocolo interno versionado.

## Arquitetura recomendada

```text
ChatGPT / Codex / Claude / Gemini / Copilot / Cursor / Cline / Roo / outros
                                │
                     MCP 2026-07-28 / HTTPS
                                │
                                ▼
                    ┌──────────────────────┐
                    │ Public MCP Gateway   │
                    │ Cloudflare Workers   │
                    │ OAuth 2.1 + PKCE     │
                    └──────────┬───────────┘
                               │
                ┌──────────────┼─────────────────┐
                │              │                 │
                ▼              ▼                 ▼
              D1          Durable Object         R2
        metadata/policies  per device/presence   artifacts
                               │
                          WebSocket TLS
                       device initiated only
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Secure Local Agent   │
                    │ Rust                 │
                    │ local policy engine  │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼──────────────────┐
             ▼                 ▼                  ▼
         Filesystem        PTY/processes        Git/system
             │                 │                  │
             └──────────── guarded host ──────────┘
                               │
                     future optional adapters
                  GUI / Browser / Container / VM
```

## Stack recomendada

- **Local agent:** Rust.
- **Cloud control plane:** TypeScript + Cloudflare Workers.
- **Realtime/presence:** Durable Objects + Hibernatable WebSockets.
- **Metadata:** D1.
- **Large artifacts:** R2.
- **Metrics:** Workers Analytics Engine.
- **Queues:** apenas workloads assíncronos/retries/audit pipeline; não no caminho síncrono básico.
- **KV:** feature flags/cache de dados não críticos.
- **Dashboard:** TypeScript/React; framework leve compatível com Workers.
- **ChatGPT UI:** MCP Apps UI para cartões compactos; dashboard completo separado.
- **External protocol:** MCP 2026-07-28, Streamable HTTP, stateless.
- **Internal cloud↔device protocol:** protocolo próprio versionado sobre WebSocket TLS.
- **Authentication:** OAuth 2.1/PKCE para MCP + identidade própria do device baseada em chave assimétrica.
- **Device key:** Ed25519 ou algoritmo equivalente moderno suportado de forma consistente nas plataformas; chave privada protegida pelo keystore do SO.
- **Repository:** monorepo.

## MVP recomendado

O MVP deliberadamente **não** terá controle de mouse/teclado.

Vertical slice:

```text
instalar agente
→ parear dispositivo
→ conectar ChatGPT/MCP
→ listar dispositivos
→ listar diretório permitido
→ ler arquivo
→ escrever arquivo temporário
→ executar comando permitido
→ acompanhar processo/output
→ git status/diff
→ visualizar audit timeline
→ revogar dispositivo
```

GUI, browser, WebRTC/VNC, sandbox cloud e Git push ficam fora do primeiro release.

---

# Parte II — Análise dos artefatos anteriores

Os três artefatos obrigatórios foram utilizados:

- `relatorio_censo_ferramentas_ai_execucao_2026-09-29.md`
- `censo_ferramentas_ai_execucao_2026-09-29.csv`
- `censo_ferramentas_ai_execucao_2026-09-29.json`

O censo normalizou 181 candidatos, incluindo bridges/MCPs, coding agents, computer-use/browser, sandboxes e CI/CD.

Os aprendizados estruturais mais importantes para este produto são:

- Remote Desktop Commander/QuickDesk/Windows-MCP mostram a utilidade da ponte IA↔máquina.
- Cline/Roo/OpenCode/Claude Code/Gemini CLI mostram que o fluxo de software engineering precisa de filesystem + processo + feedback, não somente GUI.
- Playwright/Chrome DevTools mostram que browser merece um adapter próprio.
- E2B/Daytona/Microsandbox mostram que host real e sandbox são produtos semanticamente diferentes e devem ser explicitamente selecionáveis.
- Strands Shell/agents-terminal mostram que "dar Bash" não precisa significar shell irrestrito.
- Devolutions e ferramentas enterprise mostram valor de auditoria, PAM, JIT e identity boundaries.
- Os agentes de computer-use reforçam que GUI deve complementar APIs estruturadas, não substituí-las.

---

# Parte III — Capability Universe

## 1. Device & fleet

**Core**
- device list/info
- OS/arch/agent version
- online/offline/last seen
- reconnect
- revoke
- per-device key identity
- multi-device selection
- latency and health

**Advanced**
- labels/tags
- device groups
- fleet policy inheritance
- maintenance mode
- remote update channels
- enterprise inventory

## 2. Filesystem

**Core**
- list
- stat
- read
- write/replace
- patch
- search/glob/grep
- canonical-path checks
- allowed roots
- file size/type metadata

**Important**
- append
- move/copy/rename
- checksums
- optimistic precondition (`expected_hash`)
- encoding handling

**Advanced**
- watch
- semantic search
- content indexing
- snapshot/rollback

**Not MVP**
- recursive delete
- unrestricted home-directory access

## 3. Shell & processes

**Core**
- one-shot safe command
- process start
- PTY/session ID
- stdout/stderr chunks
- stdin
- cancel/kill
- timeout
- working directory
- exit code

**Important**
- background processes
- signals
- env allowlist
- bounded output/ring buffer
- detached process lifecycle

**Advanced**
- shell profiles
- process tree
- resource quotas
- jailed execution
- remote SSH/WinRM adapters

## 4. Git

**MVP**
- status
- diff

**Important**
- log
- branch
- worktree
- add

**Advanced / gated**
- commit
- merge/rebase
- pull
- push
- PR/MR

`git push` deve nascer como ação high-risk e approval-required.

## 5. Software engineering

- build
- lint
- format
- typecheck
- tests
- long-running test jobs
- artifact collection
- structured diagnostics
- stacktrace extraction
- retry loop orchestration by the AI client

O control plane não deve tentar ser o coding agent. Ele fornece os instrumentos; a IA decide o loop.

## 6. Computer Use

**Future**
- screenshot
- display inventory
- accessibility tree
- OCR
- mouse
- keyboard
- clipboard
- window enumeration
- app launch/focus
- native UI Automation

Preferir semantic accessibility targets a coordenadas absolutas.

## 7. Browser

**Future**
- dedicated browser profile
- Playwright adapter
- CDP/DevTools adapter
- DOM inspection
- network/console
- screenshots
- auth-session isolation

## 8. Sandboxing

Três execution modes:

1. **HOST:** comando no SO com policy local.
2. **GUARDED_HOST:** policy + resource limits + env/secrets broker + hardened shell.
3. **SANDBOX:** container/VM/microVM explícita.

Nunca chamar HOST de "sandbox".

## 9. Remote infrastructure

- SSH
- WinRM
- containers
- Docker
- Kubernetes
- cloud VMs
- CI/CD
- workspace runners

Devem entrar por adapters, não contaminando o core protocol.

## 10. Observability

- immutable-ish audit event stream
- tool execution state
- client/provider identity
- device
- duration
- bytes
- approval state
- result status
- process lifecycle
- reconnects
- errors
- artifact references

## 11. Policy/security

- allow / ask / deny
- per tool
- per device
- per workspace/path
- per command class
- per client
- temporary grants
- local critical gate
- network permission
- secret reference permission

---

# Parte IV — Competitive Feature Mining

| Referência | Ideia que deve ser absorvida | O que não copiar cegamente |
|---|---|---|
| Remote Desktop Commander | pairing simples, multi-device, dashboard, chat→máquina | confiança ampla no host sem sandbox forte |
| Desktop Commander MCP | filesystem + shell pragmáticos | tool surface excessivamente poderosa sem boundary externo |
| QuickDesk | remote desktop + structured UI state/OCR | GUI como mecanismo primário para tarefas que têm APIs melhores |
| Windows-MCP | UI Automation e computer-use nativo | plataforma única como arquitetura core |
| Open Computer Use | cross-platform computer-use por MCP | acoplamento entre UI automation e protocolo principal |
| smart-terminal-mcp | PTY persistente | terminal como única abstração |
| Strands Shell | VFS, allowlists, secret injection | assumir VFS lógico como equivalente a isolamento kernel |
| Cline/Roo/OpenCode | approvals e loop real de programação | incorporar raciocínio/model billing ao nosso control plane |
| OpenHands | runtime/sandbox | transformar o produto inteiro em coding agent |
| Playwright MCP | browser tools semânticas | utilizar perfil de browser pessoal por padrão |
| E2B/Daytona/Microsandbox | isolamento descartável | obrigar sandbox cloud para toda tarefa local |
| Devolutions RDM | auditoria/PAM/JIT | complexidade enterprise no MVP |

## Diferenciação proposta

A vantagem não será "tem terminal", porque dezenas de ferramentas já têm. A diferenciação deve ser o conjunto:

**universal + model-agnostic + multi-device + local-policy + auditable + sandbox-ready + typed tools + low-cost edge control plane**.

---

# Parte V — Product Vision

## Problema

IAs diferentes operam em silos: cada coding agent possui seus próprios limites, terminal, permissions e ambientes. Usuários que querem que ChatGPT/Claude/Gemini operem a mesma máquina precisam instalar bridges distintos ou entregar acesso amplo demais.

## Job to be done

> "Quando eu estiver conversando com qualquer IA autorizada, quero que ela consiga operar o ambiente certo, com o menor privilégio necessário, e que eu consiga ver, controlar, aprovar e revogar exatamente o que aconteceu."

## Usuários iniciais

1. desenvolvedor individual;
2. power user com múltiplos computadores;
3. equipe técnica pequena;
4. DevOps/SRE com servidores controlados;
5. posteriormente enterprise com PAM/auditoria.

## Non-goals iniciais

- RMM corporativo completo;
- substituto de AnyDesk/TeamViewer;
- serviço de inferência de LLM;
- agente autônomo próprio;
- streaming de desktop cinematográfico;
- gestão MDM;
- acesso administrativo silencioso.

---

# Parte VI — Diferenciação

## vs Remote Desktop Commander

- protocolo/local agent auditáveis;
- multi-AI first-class;
- policy local não alterável pelo agente;
- modes Host/Guarded/Sandbox;
- secret broker;
- task/process handles;
- locking/concurrency;
- adapter architecture.

## vs Windows-MCP

- cross-platform e fleet/control-plane nativos.

## vs QuickDesk

- primariamente tool-runtime seguro e tipado; remote GUI é adapter futuro, não fundamento.

## vs Cline/Claude Code/Codex

- não compete com o modelo/agente; é a camada de execução reutilizável por todos eles.

## vs filesystem MCP + shell MCP manual

- pairing, identity, policy, audit, multi-device, process lifecycle, approvals e observability integrados.

---

# Parte VII — Naming & SEO Research

## Termos semanticamente úteis

A pesquisa encontrou como terminologia estável/descritiva:

- AI computer control
- computer use
- AI desktop agent
- AI terminal
- AI computer agent
- remote MCP
- MCP terminal
- MCP filesystem
- AI remote desktop
- agent bridge

Não foi possível obter volume/dificuldade confiável por keyword no ambiente de pesquisa; portanto **nenhum número de volume foi inventado**.

## Estratégia recomendada

Não colocar todas as keywords na marca. Usar:

> **marca curta + descriptor descritivo + páginas SEO por caso de uso**

Exemplo:

**MachinaPort — AI Computer Control & MCP Agent Bridge**

Futuras landing pages:

- `/ai-computer-control`
- `/ai-remote-desktop`
- `/chatgpt-computer-control`
- `/mcp-terminal`
- `/mcp-filesystem`
- `/ai-computer-agent`
- `/claude-computer-control`
- `/gemini-computer-control`

---

# Parte VIII — Naming Shortlist

## 50 candidatos brutos considerados

MachineRelay, DeskVector, MachinaPort, MachinaBridge, MachinaLink, RemotePulse, CommandBridge, AgentBridge, HostBridge, DeviceBridge, MachineBridge, DeskBridge, RelayForge, ControlForge, HostForge, DeskForge, AgentForge, MachineMesh, DeviceMesh, HostMesh, CommandMesh, ControlMesh, DeskMesh, AgentMesh, MachinePort, AgentPort, HostPort, ControlPort, DevicePort, DeskPort, MachineLink, AgentLink, HostLink, DeskLink, ControlLink, NodeRelay, DeviceRelay, HostRelay, AgentRelay, CommandRelay, ControlRelay, DeskRelay, NodePilot, HostPilot, DevicePilot, AgentPilot, CommandPilot, DeskPilot, ControlPilot, MachinePilot.

## Eliminações relevantes

- AgentRelay: já ocupado.
- AgentPort: já ocupado por projetos MCP/agent infrastructure.
- RelayForge: produto de IA ativo.
- DeskForge: produto de desktop apps ativo.
- DeskPilot: múltiplos produtos, inclusive remote control com AI.
- AgentDock: extremamente ocupado.
- AgentHarbor: ocupado.
- AgentReach: ocupado.
- ControlMesh/DeskMesh: colisões.
- DeskVector: `deskvector.com` apareceu como domínio recém-registrado em setembro/2026.
- MachinePort: empresa existente.
- MachineRelay: sem repo exato na busca nativa, mas "Machine Relay Protocol" já existe no ecossistema agentic, o que reduz clareza futura.

## Finalistas

| Nome | Clareza | Brandabilidade | Colisão preliminar | SEO por descriptor | Status |
|---|---:|---:|---:|---:|---|
| **MachinaPort** | 8/10 | 9/10 | baixa na busca preliminar | alta | **working name recomendado** |
| MachinaBridge | 9/10 | 8/10 | baixa, mas há ruído por “Machinabridge” | alta | backup |
| MachinaLink | 8/10 | 8/10 | GitHub contém `MachinalinkIo` | alta | backup com cautela |
| MachineRelay | 9/10 | 8/10 | conflito semântico com Machine Relay Protocol | alta | não preferido |
| DeskVector | 7/10 | 8/10 | domínio .com aparentemente já registrado | média | descartar |

### Importante

Isto é **clearance preliminar**, não pesquisa legal de marca. Antes de registro/lançamento é obrigatório verificar:
- INPI;
- USPTO/EUIPO se houver ambição global;
- registrador de domínio em tempo real;
- GitHub org;
- npm;
- PyPI;
- redes sociais.

## Identidade provisória

**Brand:** MachinaPort  
**Tagline:** *One secure port for AI to operate your machines.*  
**Descriptor:** *AI Computer Control & MCP Agent Bridge*  
**CLI:** `machinaport`  
**Agent:** `machinaport-agent`  
**MCP package:** `machinaport-mcp`  
**Cloud:** `cloud.machinaport.*`  
**MCP endpoint:** `mcp.machinaport.*/mcp`

---

# Parte IX — Arquiteturas candidatas

## A — Relay stateless sem Durable Objects

Worker recebe tool call e procura um device por polling/queue.

**Prós:** barato e simples.  
**Contras:** latência, cancelamento e realtime ruins.  
**Decisão:** rejeitar como arquitetura principal.

## B — Cloudflare Worker + Durable Object por device + outbound WebSocket

**Prós:** presence, routing, locks, correlação, low latency, hibernation.  
**Contras:** WebSocket messages entram no pricing do DO; requer disciplina de batching.  
**Decisão:** **recomendada**.

## C — Cloudflare Tunnel por device

**Prós:** outbound-only, maduro.  
**Contras:** daemon extra, onboarding mais complexo, menos adequado a uma plataforma SaaS multi-device como primitive principal.  
**Decisão:** modo opcional/self-host/private.

## D — WebRTC P2P

**Prós:** baixa latência e menor relay de dados.  
**Contras:** signaling, NAT/TURN, complexidade, browser/desktop semantics.  
**Decisão:** estudar para screen streaming futuro, não para tool transport do MVP.

---

# Parte X — Cloudflare Research

## Workers

Uso:
- MCP endpoint stateless;
- OAuth endpoints;
- REST/dashboard API;
- routing e validação.

Free tier pesquisado em 29/09/2026:
- 100.000 requests/dia;
- 10ms CPU por invocation;
- 128MB memory;
- 50 subrequests/request.

Paid:
- mínimo de US$5/mês;
- 10M requests/mês incluídos;
- 30M CPU-ms/mês incluídos.

**Conclusão:** muito adequado ao gateway, desde que processos reais nunca executem no Worker.

## Durable Objects

Uso:
- um logical coordinator por device;
- WebSocket server;
- presence;
- active write lease;
- pending correlations;
- bounded session state.

A API de WebSocket Hibernation é a opção recomendada pela Cloudflare e permite manter clients conectados enquanto o DO dorme.

**Observação de custo:** mensagens WebSocket contam para requests do DO. Batching é requisito de arquitetura, não otimização opcional.

## D1

Uso:
- users
- devices
- pairings
- public keys
- policies
- sessions metadata
- approvals metadata
- artifact indexes
- release channels

Free:
- 5M rows read/dia;
- 100k rows write/dia;
- 5GB total.

Não armazenar stdout volumoso em D1.

## KV

Uso permitido:
- feature flags;
- cache;
- plugin configuration pública.

Não usar para:
- online/offline presence;
- locks;
- audit source of truth.

O free tier de writes é relativamente baixo e a consistência não atende ao core state.

## R2

Uso:
- outputs grandes;
- screenshots;
- diagnostics bundles;
- diffs gigantes;
- exported audit bundles.

Free:
- 10GB-month;
- 1M Class A;
- 10M Class B;
- egress sem cobrança.

## Queues

Uso:
- audit fanout assíncrono;
- cleanup;
- telemetry;
- opcionalmente jobs offline explícitos.

Não colocar cada tool call síncrono na Queue.

Free:
- 10k operations/dia;
- retenção máxima free 24h.

## Analytics Engine

Uso:
- latency
- tool count
- bytes
- result/status
- client/device dimensions

Free:
- 100k data points/dia;
- 10k read queries/dia.

## Browser Rendering

Não é requisito de MVP.

Pode suportar um **cloud browser adapter** futuro.

Free: 10 minutos/dia e 3 concurrent browsers no snapshot pesquisado.

## Workers AI

Não usar no MVP.

A inteligência já vem do cliente (ChatGPT/Claude/Gemini/etc.). Introduzir Workers AI no core reduziria a neutralidade e adicionaria billing desnecessário.

## Cloudflare Tunnel

Modo futuro:
- self-hosted gateway;
- enterprise/private site;
- SSH/RDP/private services.

Não é necessário para o local agent, que pode estabelecer diretamente seu WebSocket outbound.

---

# Parte XI — Arquitetura recomendada

## Regra principal

**MCP externamente; protocolo próprio internamente.**

MCP 2026-07-28 migrou para um core stateless. Isso combina com o gateway: cada tool call é autossuficiente e estados long-running são expressos por handles visíveis.

O protocolo cloud↔agent precisa de necessidades diferentes:
- reconnect;
- sequence;
- process output streaming;
- cancellation;
- device heartbeat;
- binary chunks;
- backpressure;
- version negotiation.

Logo, não há razão para forçar MCP nessa camada.

## Envelope conceitual interno

```json
{
  "protocolVersion": "1",
  "type": "command.request",
  "messageId": "...",
  "correlationId": "...",
  "deviceId": "...",
  "sessionId": "...",
  "tool": "fs.read",
  "deadline": "...",
  "payload": {}
}
```

Respostas:
- `command.accepted`
- `command.chunk`
- `command.completed`
- `command.failed`
- `command.cancelled`

Este é um contrato conceitual, não uma implementação.

---

# Parte XII — Local Agent

## Stack

### Rust — recomendado

**Razões:**
- memory safety;
- single binary;
- baixo footprint;
- bom controle de processos;
- bom suporte a async I/O;
- FFI para APIs nativas;
- reduz dependência de runtime instalado.

### Go — segunda opção

Mais simples para networking/concurrency e cross-compilation, mas Rust oferece vantagem para uma ferramenta com fronteira de segurança e integração nativa profunda.

### .NET

Excelente Windows; não recomendado como core cross-platform único.

### Node

Excelente protótipo/MCP, porém runtime, footprint e dependency surface são piores para um daemon de segurança.

### Tauri

Usar futuramente como **UI/tray**, mantendo Rust core independente.

## Módulos previstos

```text
agent/
  identity/
  transport/
  protocol/
  policy/
  filesystem/
  process/
  git/
  secrets/
  audit/
  updater/
  platform/
    windows/
    macos/
    linux/
  adapters/
    sandbox/
    browser/
    ui/
```

---

# Parte XIII — Cloud Control Plane

## Entidades

- User
- Identity
- Device
- DeviceKey
- Pairing
- ClientConnection
- Session
- Workspace
- PermissionPolicy
- PolicyRule
- ToolExecution
- ProcessRef
- Approval
- AuditEvent
- Artifact
- ReleaseChannel

## Fonte de verdade

- D1: identidade e metadata durável.
- DO: estado realtime e locks.
- R2: blobs.
- Analytics Engine: métricas agregáveis.
- Agent: processos e enforcement local.

---

# Parte XIV — MCP / ChatGPT Integration

## Interface

- HTTPS public endpoint;
- MCP Streamable HTTP;
- stateless request handling;
- OAuth 2.1;
- PKCE;
- scopes;
- server-side authorization em toda chamada.

## UI

Usar MCP Apps UI somente onde traz valor:

- device picker;
- device health card;
- approval card;
- process/task card;
- result/artifact summary.

O plugin continua funcional sem UI.

## Publicação

O diretório atual da OpenAI aceita plugin com remote MCP, skills ou ambos. Publicação exige endpoint HTTPS estável, organização/identidade verificada, metadata correta, tool annotations, privacy/terms/support URLs e test cases.

## Risco de plano atual

Há documentação oficial conflitante em 29/09/2026:
- a landing page de developers diz que developer mode oferece full MCP read/write em Plus e Pro;
- o Help Center diz que full MCP é Business/Enterprise/Edu e Pro fica em read/fetch.

**Launch gate:** testar na conta-alvo e confirmar com documentação/portal imediatamente antes do beta. Não arquitetar o produto supondo uma resposta.

---

# Parte XV — Tool Catalog

## MVP tools

| Tool | Efeito | Risk default | Observação |
|---|---|---|---|
| `device.list` | read | LOW | devices autorizados |
| `device.info` | read | LOW | health/capabilities |
| `fs.list` | read | LOW | allowed root |
| `fs.stat` | read | LOW | metadata |
| `fs.read` | read | LOW/MEDIUM | secrets policy |
| `fs.write` | write | MEDIUM | atomic write + expected hash |
| `fs.patch` | write | MEDIUM | preferred for source code |
| `fs.search` | read | LOW | bounded results |
| `shell.exec` | write-ish | policy-derived | only bounded one-shot |
| `process.start` | write-ish | policy-derived | returns process ID |
| `process.read` | read | LOW | bounded chunks |
| `process.write` | write | MEDIUM | stdin |
| `process.cancel` | destructive | MEDIUM | process-scoped |
| `process.list` | read | LOW | agent-owned by default |
| `git.status` | read | LOW | |
| `git.diff` | read | LOW | |
| `system.metrics` | read | LOW | coarse machine data |
| `artifact.get` | read | LOW | signed short-lived access |

## Post-MVP

- `fs.move/copy/delete`
- `git.log/branch/worktree/add/commit/pull/push`
- `screen.capture`
- `ui.inspect/click/type`
- `browser.*`
- `sandbox.*`
- `ssh.*`
- `docker.*`
- `k8s.*`

---

# Parte XVI — Permissions & Approvals

## Permission domains

```text
FS_READ
FS_WRITE
FS_DELETE
SHELL_SAFE
SHELL_FULL
PROCESS_CONTROL
NETWORK
GIT_WRITE
GIT_REMOTE_WRITE
SCREEN_READ
INPUT_CONTROL
BROWSER
SECRET_USE
ELEVATION
ADMIN
```

## Policy result

- `ALLOW`
- `ASK`
- `DENY`

## Precedência

```text
hard deny local
> local device policy
> account/workspace policy
> session temporary grant
> client requested scope
```

A nuvem não pode aumentar permissões além do teto definido localmente.

## Risco

- LOW: leitura/diagnóstico benigno.
- MEDIUM: alterações reversíveis/localizadas.
- HIGH: network writes, commit/push, package installs, broad mutations.
- CRITICAL: privilege elevation, mass delete, disk/credential/system modifications.

**Critical:** local confirmation obrigatória ou deny.

---

# Parte XVII — Security Architecture

## Device identity

1. primeiro start gera keypair;
2. private key vai para OS credential store;
3. usuário inicia pairing;
4. cloud gera nonce/código de uso único;
5. browser e agent exibem/verificam o mesmo binding;
6. agent assina challenge;
7. cloud registra public key;
8. sessions usam tokens curtos e challenge/reconnect.

## Filesystem boundary

Antes de qualquer operação:

1. normalize;
2. canonicalize;
3. resolve symlink/reparse point;
4. compare canonical result com allowed root;
5. apply sensitive path deny;
6. apply operation policy;
7. execute.

## Secrets broker

A IA referencia:

`secret://github/token-build`

O cloud recebe apenas o identificador. O agent resolve localmente, injeta como env/file descriptor temporário e tenta redigir output.

Não devolver secret ao modelo.

## Network

Network e shell são permissões diferentes. Um comando permitido não deve ganhar egress irrestrito automaticamente em Guarded/Sandbox mode.

---

# Parte XVIII — Threat Model / 30 Abuse Cases

| # | Abuse case | Mitigação principal |
|---:|---|---|
| 1 | OAuth token roubado | short TTL, audience/scope, revoke |
| 2 | device private key roubada | OS keystore, revoke, no plaintext |
| 3 | pairing-code phishing | code binding + browser/device match |
| 4 | pairing replay | nonce one-shot + expiry |
| 5 | session hijack | TLS, rotating tokens, correlation |
| 6 | revoked device reconnect | revocation check before acceptance |