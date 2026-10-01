# ADR-0002: Treat the ChatGPT Plugin as Distribution and Remote MCP as an Integration Backend

- **Status:** Proposed
- **Date:** 2026-10-01

## Context

A primary target user may have ChatGPT Plus and may not have access to manually register a full custom MCP server with write/modify capabilities. Remote Desktop Commander demonstrates a published-plugin experience backed by a remote MCP service.

## Proposed decision

For ChatGPT, treat a **published plugin/app** as the user-facing distribution mechanism and a **remote MCP server** as the tool backend. Do not require end users to manually configure a custom MCP server.

The core runtime remains usable through direct MCP integration for other compatible AI clients.

## Trade-offs

- improves onboarding for ChatGPT users;
- keeps the core multi-AI;
- introduces OpenAI review/eligibility constraints;
- exact Plus availability and write/process capability must be validated before acceptance.

## Acceptance gate

This ADR cannot move to Accepted until an end-to-end Plus test verifies the required public-plugin behavior on the intended ChatGPT surface.
