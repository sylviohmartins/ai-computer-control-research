import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

import type { Env } from "../src/env";

describe("D1 conceptual model migration", () => {
  it("materializes every Phase 0 entity", async () => {
    const bindings = env as unknown as Env;
    const result = await bindings.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table'",
    ).all<{ name: string }>();

    const names = new Set(result.results.map((row) => row.name));
    const expected = [
      "users",
      "devices",
      "device_keys",
      "pairings",
      "workspaces",
      "policy_restrictions",
      "sessions",
      "approvals",
      "commands",
      "processes",
      "artifacts",
      "audit_events",
    ];

    for (const table of expected) {
      expect(names.has(table), `missing table: ${table}`).toBe(true);
    }
  });

  it("materializes every mandatory conceptual index", async () => {
    const bindings = env as unknown as Env;
    const result = await bindings.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'index'",
    ).all<{ name: string }>();

    const names = new Set(result.results.map((row) => row.name));
    const expected = [
      "idx_devices_user_revoked",
      "idx_device_keys_device_revoked",
      "idx_pairings_code_expiry",
      "idx_sessions_user_started",
      "idx_commands_device_requested",
      "idx_commands_session_requested",
      "idx_approvals_device_expiry_consumed",
      "idx_audit_events_device_created",
      "idx_artifacts_user_created",
    ];

    for (const index of expected) {
      expect(names.has(index), `missing index: ${index}`).toBe(true);
    }
  });
});
