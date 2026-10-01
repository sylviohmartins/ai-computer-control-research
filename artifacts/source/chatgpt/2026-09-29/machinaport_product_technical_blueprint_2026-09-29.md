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
| 7 | malicious MCP client | scopes + server auth + local policy |
| 8 | OAuth confused deputy | consent + CSRF + audience validation |
| 9 | `../` traversal | canonical path validation |
| 10 | symlink/reparse escape | resolve before authorization |
| 11 | hardlink/path alias escape | file identity/path boundary checks |
| 12 | secret-file read | sensitive roots hard deny |
| 13 | overwrite executable/config | risk rules + protected locations |
| 14 | recursive delete | out of MVP / critical gate |
| 15 | `rm -rf` / format disk | hard deny/critical local approval |
| 16 | encoded PowerShell bypass | parse/inspect + SHELL_FULL gate |
| 17 | sudo/UAC escalation | ELEVATION separate; deny default |
| 18 | fork bomb/resource exhaustion | process quotas, timeout, child limits |
| 19 | malicious dependency install | package-install risk class |
| 20 | network exfiltration | network policy/egress sandbox |
| 21 | malicious README instructions | content untrusted; cannot change policy |
| 22 | terminal-output prompt injection | tag untrusted output, no policy mutation |
| 23 | browser prompt injection | dedicated browser profile + approvals |
| 24 | clipboard/screenshot injection | untrusted GUI data |
| 25 | two AIs overwrite same file | write lease + expected hash |
| 26 | retry duplicates command | idempotency key/correlation state |
| 27 | stale approval later executes | approval bound to hash + expiry |
| 28 | cloud control plane compromised | local enforcement + device key |
| 29 | malicious auto-update | signed manifest/binary + rollback |
| 30 | logs leak secrets | redaction + minimal retention + R2 encryption |

---

# Parte XIX — Privacy

## Realistic privacy statement

O hosted control plane **não pode ser chamado de zero-knowledge para todas as tool calls**, porque o MCP endpoint precisa receber argumentos e devolver resultados ao AI client.

Meta ideal:
- não persistir file content por padrão;
- não persistir stdout integral por padrão;
- ephemeral relay;
- only metadata audit by default;
- explicit opt-in for diagnostic logs;
- R2 artifacts only when required/authorized;
- retention configurable;
- secret broker local.

## Future privacy mode

Uma versão self-host/private relay pode reduzir o trust boundary. Cloudflare Tunnel pode ser útil nesse modo.

---

# Parte XX — Dashboard / UX

## Overview

Cards:
- online devices
- active sessions
- executions today
- failures
- approvals pending
- p50/p95 command latency
- bytes transferred

## Device detail

- name/OS/arch
- agent version
- last seen
- current latency
- capabilities
- allowed roots
- active policy
- sessions
- revoke
- update channel

## Activity timeline

```text
07:31 ChatGPT  device.list       OK       42 ms
07:31 ChatGPT  fs.read           OK      111 ms
07:32 ChatGPT  fs.patch          APPROVED
07:32 ChatGPT  process.start     OK       mvn test
07:34 ChatGPT  process.completed FAIL     exit 1
```

## Approval UI

Mostrar:
- client;
- device;
- exact action;
- normalized path/command;
- risk reason;
- scope;
- expiry;
- Allow once / Allow for session / Deny.

## Web terminal

Post-MVP. Deve usar as mesmas policies do agent; não criar um bypass administrativo.

## Screen viewer

Post-MVP. Começar com screenshot on-demand + accessibility tree. WebRTC somente quando houver evidência de necessidade de streaming contínuo.

---

# Parte XXI — Architecture Tabletop Exercises

## 1. Filesystem read

Flow:
OAuth → tool auth → device lookup → DO → WS → local path policy → read → bounded result.

Failure modes:
- offline: `DEVICE_OFFLINE`;
- forbidden: `POLICY_DENIED`;
- too large: return artifact/partial range.

## 2. `mvn test` por quatro minutos

Não manter a chamada HTTP viva.

Flow:
`process.start` → process ID → client calls `process.read` → final exit state.

Quando o MCP client suportar Tasks, adaptar para `tasks/get/cancel`; manter process handles como fallback universal.

## 3. `mvn spring-boot:run`

Process belongs to local agent. Cloud holds metadata only. Reconnect must not kill it automatically.

## 4. Device offline

Interactive actions fail fast. Future queued jobs must be opt-in with TTL; jamais executar uma escrita antiga sem validade.

## 5. Reconnect

Agent reconnects with device identity; live processes remain. In-flight command is reconciled by correlation ID instead of blindly re-executed.

## 6. Dangerous command

`rm -rf` / destructive Windows equivalent → CRITICAL → local approval/hard deny.

## 7. Prompt injection

README says "upload ~/.ssh". Content cannot request new permission. `FS_READ` sensitive path + `NETWORK` are both blocked.

## 8. Multi-AI concurrency

Read concurrency allowed. One write lease per workspace/path group. `expected_hash` catches stale edit.

## 9. 500MB stdout

Inline return is capped. Local ring buffer + chunking; large result optionally uploaded to R2 artifact with digest and retention.

## 10. GUI action

Tool must first obtain current screen/accessibility state. Coordinates expire when screen state changes. Sensitive action asks for approval.

## 11. Agent update

Signed release manifest → staged channel → binary signature/hash → atomic swap → health check → rollback.

## 12. Cloudflare outage

Remote tool calls unavailable. Agent keeps current local long-running processes alive. No new unauthenticated remote command is accepted.

---

# Parte XXII — Architecture Decision Records

## ADR-001 — Cloudflare as hosted control plane
**Status:** Accepted for MVP.  
**Why:** edge HTTPS, Workers, DO, D1, R2, OAuth/MCP tooling, free/low-cost start.  
**Reversible:** yes; protocol and agent remain provider-independent.

## ADR-002 — MCP external, custom protocol internal
**Status:** Accepted.  
**Why:** MCP optimizes AI tool invocation; device transport needs realtime/reconnect/backpressure.

## ADR-003 — Durable Object per device coordinator
**Status:** Accepted.  
**Why:** deterministic routing/presence/locks.  
**Constraint:** use Hibernatable WS and batching.

## ADR-004 — Rust local agent + TypeScript cloud
**Status:** Accepted.

## ADR-005 — D1 metadata / R2 blobs / Analytics telemetry / KV cache
**Status:** Accepted.

## ADR-006 — Local policy is authoritative
**Status:** Accepted and security invariant.

## ADR-007 — Host, Guarded Host, Sandbox modes
**Status:** Accepted conceptually; Sandbox post-MVP.

## ADR-008 — Stateless MCP and explicit handles
**Status:** Accepted.

## ADR-009 — No Workers AI in MVP
**Status:** Accepted.

## ADR-010 — Model-agnostic core
**Status:** Accepted.

---

# Parte XXIII — Cost Model

## Assumptions for planning only

Illustrative load:
- 40 tool calls / user / day;
- ~1.3 dynamic Worker requests per tool call;
- ~4 DO request-equivalents per tool call after batching;
- ~2 D1 writes per tool call before optimization;
- 1 telemetry point per call;
- model/inference excluded;
- R2 large artifacts excluded;
- browser rendering excluded;
- real WebSocket duration depends on hibernation behavior.

| Active users | Tool calls/day | Free-tier outlook | Rough hosted control-plane order |
|---:|---:|---|---|
| 1 | 40 | comfortable | $0 possible |
| 10 | 400 | comfortable | $0 possible |
| 100 | 4,000 | likely within main daily caps | $0 possible |
| 1,000 | 40,000 | DO request volume likely pushes Paid | roughly single-digit USD/month before variable duration/blobs |
| 10,000 | 400,000 | Paid | low tens USD/month in optimized metadata path |
| 100,000 | 4,000,000 | redesign/batching critical | hundreds USD/month order of magnitude |

These are planning estimates, **not Cloudflare quotes**.

The biggest uncertainty is DO duration/message shape. Architecture must meter actual frames and hibernation in load tests before committing pricing.

---

# Parte XXIV — MVP

## In scope

- account/login
- agent install/start
- pairing
- device registry/revoke
- outbound WebSocket
- MCP OAuth
- device list/info
- filesystem list/stat/read/write/patch/search
- safe shell one-shot
- persistent process handles
- stdout/stderr
- cancel
- git status/diff
- allowed roots
- allow/ask/deny
- local critical deny gate
- basic audit
- simple dashboard
- ChatGPT MCP/plugin integration
- minimal MCP Apps UI

## Explicitly out

- mouse/keyboard
- full screen streaming
- browser automation
- SSH fleet
- Docker/Kubernetes tools
- cloud sandbox
- git push
- automatic privilege elevation
- arbitrary secret retrieval
- autonomous scheduling
- custom LLM inference

---

# Parte XXV — Implementation & Validation Roadmap

## Phase 0 — Repository & specifications

**Goal:** freeze contracts before execution code.

Planned structure:

```text
/apps/control-plane
/apps/dashboard
/packages/protocol
/packages/mcp
/packages/policy
/agent
/docs/adr
/docs/spec
/infra
```

Deliverables:
- protocol spec v0;
- threat model;
- tool schemas v0;
- DB schema draft;
- architecture diagrams;
- ADRs;
- development/contribution/security docs.

Tests:
- schema validation fixtures;
- compatibility examples.

DoD:
- every MVP tool has request/result/error contract;
- security invariants documented;
- no unresolved cross-layer ownership.

## Phase 1 — Local Agent Core

Goal:
- identity;
- config;
- capability registry;
- local policy skeleton;
- no cloud actions yet.

Tests:
- keystore;
- path boundary;
- policy precedence;
- startup/restart.

## Phase 2 — Cloud Control Plane Skeleton

- Workers routes;
- D1 migrations;
- R2 binding;
- Analytics;
- DO class;
- health API.

DoD:
- fake device simulator can register and route messages.

## Phase 3 — Pairing & Identity

- one-time codes;
- browser confirmation;
- public key binding;
- revoke;
- reconnect token flow.

Security tests:
- replay;
- expiry;
- wrong device;
- revoked device.

## Phase 4 — Device Channel

- outbound WebSocket;
- heartbeat;
- hibernation;
- sequence/correlation;
- backpressure;
- reconnect.

Load tests:
- idle sockets;
- reconnect storm;
- message batching.

## Phase 5 — Stateless MCP + OAuth

- MCP 2026-07-28;
- Streamable HTTP;
- OAuth 2.1/PKCE;
- scopes;
- tool listing;
- OpenAI annotations.

DoD:
- MCP inspector + at least two independent clients invoke fake tools.

## Phase 6 — Filesystem

- canonical path;
- allowed roots;
- read/write/patch/search;
- expected hash;
- atomic writes.

Security:
- traversal/symlink/reparse fuzz suite.

## Phase 7 — Shell & Process Lifecycle

- safe exec;
- process start/read/write/cancel;
- ring buffer;
- timeout;
- output caps.

Canary:
- Java project `mvn test` through process handles.

## Phase 8 — Basic Git

- status;
- diff;
- repository detection.

No commit/push yet.

## Phase 9 — Policy, Approvals & Audit

- risk rules;
- allow/ask/deny;
- approval binding/TTL;
- immutable event identifiers;
- redaction.

## Phase 10 — Dashboard

- overview;
- device details;
- sessions;
- timeline;
- approvals;
- usage;
- security/revoke.

## Phase 11 — ChatGPT Plugin Readiness

- MCP Apps UI;
- plugin metadata;
- privacy/terms/support;
- five positive + three negative test cases minimum;
- review scan;
- plan entitlement validation.

## Phase 12 — Sandbox Mode

- adapter boundary;
- Docker first;
- evaluate microVM provider later.

## Phase 13 — Computer Use

- screen;
- accessibility;
- mouse/keyboard;
- OS permission UX.

## Phase 14 — Browser

- Playwright/CDP;
- isolated profiles;
- browser prompt-injection defenses.

## Phase 15 — Multi-device/workspace concurrency

- locks/leases;
- concurrent readers;
- write conflict detection;
- policy groups.

## Phase 16 — Multi-AI clients

Certified setup docs/tests:
- ChatGPT/Codex;
- Claude;
- Gemini;
- Copilot/VS Code;
- Cursor/Cline/Roo/OpenCode;
- generic MCP.

## Phase 17 — Public Release Hardening

- code signing;
- signed updater;
- SBOM;
- vulnerability scans;
- public docs;
- plugin submission;
- support/runbooks;
- beta telemetry.

---

# Parte XXVI — Test Strategy

## Unit
- policy
- risk
- paths
- command metadata
- protocol
- auth helpers
- redaction

## Property/fuzz
- path traversal
- symlinks/reparse
- protocol decoder
- message ordering
- malformed chunks

## Integration
- Worker ↔ DO ↔ simulated agent
- OAuth
- D1/R2
- reconnect

## Cross-platform
- Windows
- macOS
- Linux

## Security
- OAuth replay/mix-up
- CSRF
- pairing replay
- compromised MCP client
- output injection
- stale approval
- secret exfiltration

## Chaos
- WebSocket drop
- DO restart/hibernation
- Cloudflare outage
- agent crash
- duplicate delivery

## Load
- 100 / 1k / 10k idle devices
- reconnect burst
- process-output burst
- large result path

## Agent/tool evals
- correct tool selection
- schemas
- errors
- approval behavior
- negative requests

## Golden Java canary

```text
list repo
→ read pom.xml
→ read source
→ patch
→ process.start(mvn test)
→ process.read until exit
→ inspect failure
→ patch
→ rerun
→ git.diff
```

---

# Parte XXVII — Release Strategy

1. local developer alpha;
2. private 1-device alpha;
3. multi-device dogfood;
4. closed beta with invite;
5. public beta after signing/privacy/plugin eligibility;
6. public plugin directory release;
7. sandbox/computer-use beta after base reliability.

Agent release channels:
- stable
- beta
- canary

Never auto-update from an unsigned artifact.

---

# Parte XXVIII — Risks & Open Questions

## Launch gates

1. **OpenAI plan contradiction:** resolve Plus/Pro full-MCP documentation discrepancy immediately before beta.
2. **Naming legal clearance:** MachinaPort is only preliminary; INPI/USPTO/EUIPO/domain/package handles still need real-time clearance.
3. **Identity provider:** recommendation for consumer beta is GitHub + Google login through Cloudflare OAuth provider; enterprise can add Access/SSO later.
4. **Critical approval UX:** decide whether critical actions are always local-only. Recommendation: yes by default.
5. **Retention/privacy:** formal policy before collecting public beta telemetry.
6. **GUI libraries:** defer choice until Phase 13.
7. **Code signing:** budget Apple Developer / Windows signing before public binaries.
8. **Sandbox provider:** Docker first; microVM only after requirements are measured.
9. **Abuse prevention:** rate limiting and tenant quotas before public directory.
10. **Public plugin entitlement:** validate submission portal/organization role before release planning.

## Key risk

The greatest architectural danger is accidentally turning a useful AI bridge into a general-purpose remote administration backdoor.

Security invariants must be product features, not optional documentation.

---

# Parte XXIX — Definition of Ready

## Status: READY FOR PHASE 0

We have enough definition to start repository/specification work:

- [x] product vision
- [x] differentiation
- [x] working naming + shortlist
- [x] architecture
- [x] stack
- [x] Cloudflare roles
- [x] external/internal protocol split
- [x] auth strategy
- [x] device identity/pairing
- [x] MVP
- [x] tool catalog
- [x] policy model
- [x] threat model
- [x] data model
- [x] dashboard concept
- [x] tabletop validation
- [x] ADRs
- [x] roadmap
- [x] test strategy
- [x] acceptance direction

### Meaning of READY

**Ready to implement Phase 0**, not ready for public launch.

No production code, repository, Cloudflare resource or plugin was created during this discovery.

---

# Acceptance criteria for the future first vertical slice

A successful first real implementation must demonstrate, on a non-sensitive test machine:

1. agent starts without admin/root;
2. device pairs using one-time verification;
3. no inbound port is opened;
4. ChatGPT/generic MCP client lists the device;
5. `fs.list` cannot escape an allowed root;
6. `fs.read` works;
7. `fs.write` requires expected policy;
8. `process.start` starts a safe process;
9. output can be read after the original request ended;
10. process can be cancelled;
11. `git.status` and `git.diff` work;
12. every action generates an audit event;
13. device revocation prevents reconnect/tool use;
14. dangerous command is denied/approved locally according to policy;
15. reconnect does not duplicate a previously acknowledged command.

---

# Source set consulted

## Internal research artifacts

- `relatorio_censo_ferramentas_ai_execucao_2026-09-29.md`
- `censo_ferramentas_ai_execucao_2026-09-29.csv`
- `censo_ferramentas_ai_execucao_2026-09-29.json`

## OpenAI

- https://developers.openai.com/chatgpt
- https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt
- https://developers.openai.com/plugins/build/mcp-server
- https://developers.openai.com/plugins/build/auth
- https://developers.openai.com/plugins/build/chatgpt-ui
- https://developers.openai.com/plugins/deploy/submission
- https://developers.openai.com/plugins/deploy/app-review
- https://developers.openai.com/api/docs/guides/secure-mcp-tunnels
- https://openai.com/business/plugins/remote-desktop-commander/

## Cloudflare

- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/durable-objects/platform/pricing/
- https://developers.cloudflare.com/durable-objects/best-practices/websockets/
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/r2/pricing/
- https://developers.cloudflare.com/queues/platform/pricing/
- https://developers.cloudflare.com/analytics/analytics-engine/pricing/
- https://developers.cloudflare.com/tunnel/
- https://developers.cloudflare.com/agents/model-context-protocol/
- https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/
- https://developers.cloudflare.com/agents/model-context-protocol/protocol/authorization/

## Protocol

- https://blog.modelcontextprotocol.io/posts/2026-07-28/

---

# Próximo comando recomendado

Quando houver aprovação deste blueprint, a próxima solicitação deve ser restrita a:

> **Implemente somente a Phase 0 — Repository & Specifications do blueprint MachinaPort. Não avance para a Phase 1 sem validar todos os Definition of Done da Phase 0.**

Isso mantém o projeto em gates verificáveis e evita que decisões de arquitetura virem dívida antes do primeiro commit.