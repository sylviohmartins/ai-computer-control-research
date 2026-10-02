# Repository Layout — Boundaries da implementação futura

**Status:** especificação da Phase 0

O monorepo deve separar runtime local, control plane e integrações. A estrutura abaixo é o target de implementação; diretórios de código não devem ser criados apenas como placeholders.

```text
/
├── agent/                    # Rust: telechir-agent
├── apps/
│   ├── control-plane/        # TypeScript/Cloudflare Workers + Durable Objects
│   └── dashboard/            # TypeScript/React
├── packages/
│   └── mcp/                  # Adapter/server MCP público
├── specs/                    # Contratos cross-language, fonte de verdade
├── docs/                     # Documentação viva/ADRs
├── artifacts/                # Pesquisa, datasets, snapshots históricos
└── .github/
```

## Ownership

### `agent/`
Responsável por:
- device identity local;
- outbound transport;
- policy enforcement final;
- filesystem/process/Git;
- secret broker local;
- platform adapters;
- updater futuro.

### `apps/control-plane/`
Responsável por:
- HTTP/MCP ingress;
- OAuth/API;
- routing;
- Durable Objects;
- D1/R2 bindings;
- authorization remota que apenas restringe, nunca amplia policy local.

### `apps/dashboard/`
Responsável por:
- devices/sessions;
- approvals;
- audit timeline;
- usage/health;
- revogação.

Não deve possuir caminho privilegiado que bypassa o mesmo authorization/policy model das tools.

### `packages/mcp/`
Responsável por:
- metadata pública de tools;
- mapping MCP ↔ contratos internos;
- schemas e annotations;
- adaptação opcional de MCP Tasks.

Não contém lógica de acesso local ao sistema operacional.

### `specs/`
Fonte de verdade de:
- JSON Schemas;
- enumerações;
- error codes;
- message lifecycle;
- version negotiation;
- permissions/risk;
- state ownership.

Bindings Rust/TypeScript devem ser gerados ou validados contra esses contratos, evitando duas definições divergentes.

## Dependências permitidas

```text
dashboard ───────► control-plane
MCP adapter ─────► control-plane/application contracts
control-plane ───► specs/generated bindings
agent ───────────► specs/generated bindings

agent  ✗ não depende de dashboard
agent  ✗ não depende da implementação Worker
MCP    ✗ não executa comandos locais
```

## Regra de portabilidade

O protocolo cloud↔device não pode incorporar APIs proprietárias da Cloudflare em seu wire format. Cloudflare é deployment target; não é parte do contrato de device.
