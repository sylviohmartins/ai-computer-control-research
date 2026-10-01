# ADR-0003: Make Local Device Policy Authoritative

- **Status:** Proposed
- **Date:** 2026-10-01

## Context

A hosted service or AI client may be compromised, misconfigured or affected by prompt injection. The remote control plane must not be able to silently expand a device's maximum permissions.

## Proposed decision

The local agent enforces the final permission ceiling. Cloud/account/session policy may further restrict actions but may not grant permissions beyond the locally configured boundary.

## Consequences

- compromise of the hosted control plane has a smaller blast radius;
- local configuration and recovery paths become security-critical;
- enterprise policy synchronization must preserve this precedence model or explicitly supersede this ADR.
