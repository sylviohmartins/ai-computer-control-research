# Product Vision

## One-line concept

A secure, auditable action layer that lets authorized AI clients operate authorized computers and executable environments without being tied to a single model provider.

## Problem

AI tools increasingly need filesystem, process, Git, browser and computer-use capabilities, but these capabilities are fragmented across provider-specific agents, MCP servers, remote desktop products and cloud sandboxes. Users often have to choose between convenience, portability and safety.

## Intended value

Provide one execution layer that can be reused by multiple AI clients while centralizing device identity, permissions, approvals, auditability, revocation and later sandboxing.

## Initial jobs to be done

- connect an authorized AI client to one of the user's authorized machines;
- safely list/read/write files inside explicitly permitted roots;
- run and observe bounded or long-running development processes;
- inspect Git status/diffs without silently publishing changes;
- revoke a device or session centrally;
- understand what the AI did through an auditable activity timeline.

## Non-goals for the first implementation

- building a new LLM;
- replacing full RMM/MDM platforms;
- silent privilege escalation;
- unrestricted remote administration by default;
- full-screen remote desktop streaming in the MVP;
- autonomous deployment to production without explicit policy and approval.
