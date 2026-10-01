# Current Architecture Direction

**Status:** discovery / proposed architecture. This is not an implementation specification yet.

## Product boundary

The future product is intended to be a **model-agnostic execution/control layer** between authorized AI clients and authorized machines. It should not become another LLM provider or a coding agent that owns the reasoning loop.

## Current direction

```text
AI clients
(ChatGPT / Codex / Claude / Gemini / Copilot / MCP clients)
        |
        | public plugin/app or direct remote-MCP integration
        v
Hosted integration / control plane
(Cloudflare is the leading candidate)
        |
        | device-scoped realtime channel
        v
Secure local agent
        |
        +-- filesystem
        +-- processes / terminal
        +-- Git
        +-- future browser / GUI / sandbox adapters
```

## Important correction to the archived v1 blueprint

The original blueprint used **MachinaPort** as a working name. That name has since been rejected. The archived artifact is intentionally preserved unchanged for traceability.

A second correction is distribution strategy: the project must **not depend on a ChatGPT Plus user manually registering a custom full MCP server**. The intended OpenAI path is a published plugin/app whose backend can expose a remote MCP service, subject to current OpenAI review and plan/surface constraints.

## Invariants under consideration

- local device policy should be authoritative;
- device connectivity should be outbound-first;
- typed tools should be preferred over a single unrestricted remote-command API;
- long-running work should use explicit process/task handles rather than keeping one request open indefinitely;
- hosted control-plane components must not execute user workloads themselves;
- host, guarded-host and sandbox execution must be described honestly as different security levels.

## Pending validation

- exact ChatGPT Plus behavior for a published plugin with write/process actions;
- quota/metering behavior for that surface;
- final product naming;
- Cloudflare cost/limit validation under realistic websocket traffic;
- local-agent language decision after a dedicated implementation ADR is accepted.
