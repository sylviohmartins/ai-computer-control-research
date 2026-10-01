# ChatGPT Plus, Public Plugins and Remote MCP — Feasibility Gate

**Research date:** 2026-10-01
**Status:** unresolved launch gate

## Why this matters

A target user may have ChatGPT Plus only. The product must therefore avoid assuming that the user can manually create/register a full custom MCP app with write/modify permissions.

## Confirmed current facts

1. OpenAI's current Help Center states that **full MCP support, including write/modify actions, is currently available to Business and Enterprise/Edu**, while Pro can connect MCPs with read/fetch permissions in developer mode. Plus is not listed as having full custom-MCP developer mode.
2. OpenAI's current plugin documentation says public plugins are published to a **universal directory shared by ChatGPT and Codex** and that a plugin may include an MCP server, skills, or both.
3. The plugin directory itself is available across ChatGPT plans, but **a specific plugin's availability and capabilities still depend on plan, surface, account, workspace, region and included capabilities**.
4. The current Remote Desktop Commander listing explicitly says it reaches an authorized computer's filesystem and terminal from ChatGPT through Desktop Commander's **Remote MCP**, including commands, processes and file edits.
5. OpenAI's public-plugin submission flow explicitly supports plugins backed by remote MCP servers and requires review, metadata/tool scanning and verified publisher identity.

## Architectural implication

For ChatGPT distribution, the product should treat the **public plugin as the user-facing distribution package** and the **remote MCP service as the backend integration**. The user should not have to manually configure a custom full MCP server.

Conceptually:

```text
ChatGPT Plus user
      | installs (if eligible)
      v
public plugin
      | remote MCP
      v
hosted control plane
      | outbound device channel
      v
local agent
```

## What remains unproven

OpenAI documentation does **not** establish that our future public plugin with write/process actions will necessarily be available to Plus on every intended ChatGPT surface. Directory availability is broad, but individual-plugin capability remains conditional.

The following must be tested before Blueprint v2 can declare the path fully viable:

- published-plugin eligibility for a Plus account;
- write/file modification capability in the intended ChatGPT surface;
- process/terminal execution capability through the reviewed plugin;
- confirmation/approval UX for high-impact actions;
- whether the plugin is primarily surfaced in normal ChatGPT, Work, Codex, or multiple surfaces;
- quota/metering behavior for tool use on the target surface.

## Release gates

### OPENAI-PLUS-001
A Plus account can install/use the reviewed public plugin without manually registering a custom MCP server.

### OPENAI-PLUS-002
The reviewed plugin can invoke the minimum required write/process tool set on the target ChatGPT surface.

### OPENAI-PLUS-003
Quota/metering behavior is measured and documented rather than inferred from authentication method.

## Primary sources

- https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt
- https://help.openai.com/en/articles/20001256-plugins-in-chatgpt
- https://developers.openai.com/plugins/concepts/plugins
- https://developers.openai.com/plugins/build/plugins
- https://developers.openai.com/plugins/deploy/submission
- https://developers.openai.com/plugins/deploy/app-review
- https://openai.com/business/plugins/remote-desktop-commander/
