import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

import type { Env } from "../src/env";
import worker from "../src/index";

const bindings = env as unknown as Env;

function fetch(path: string): Promise<Response> | Response {
  return worker.fetch(new Request(`https://telechir.test${path}`), bindings);
}

describe("control-plane worker", () => {
  it("reports liveness without touching remote resources", async () => {
    const response = await fetch("/health");
    const body = (await response.json()) as {
      ok: boolean;
      data: Record<string, unknown>;
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data).toMatchObject({
      service: "telechir-control-plane",
      status: "ok",
      phase: "phase2-control-plane-skeleton",
      version: "0.1.0",
    });
  });

  it("reports readiness from configured core bindings", async () => {
    const response = await fetch("/ready");
    const body = (await response.json()) as {
      data: {
        status: string;
        bindings: Record<string, boolean>;
      };
    };

    expect(response.status).toBe(200);
    expect(body.data.status).toBe("ready");
    expect(body.data.bindings).toMatchObject({
      d1: true,
      durableObjects: true,
      r2: false,
      analyticsEngine: false,
      queues: false,
    });
  });

  it("reports the control-plane skeleton version", async () => {
    const response = await fetch("/version");
    const body = (await response.json()) as {
      data: Record<string, unknown>;
    };

    expect(response.status).toBe(200);
    expect(body.data).toEqual({
      service: "telechir-control-plane",
      version: "0.1.0",
      phase: "phase2-control-plane-skeleton",
    });
  });

  it("keeps future product routes closed in Phase 2", async () => {
    for (const route of ["/devices", "/pairing", "/ws", "/mcp"]) {
      const response = await fetch(route);
      expect(response.status).toBe(404);
    }
  });
});
