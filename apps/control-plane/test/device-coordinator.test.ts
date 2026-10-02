import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

import type { Env } from "../src/env";

describe("DeviceCoordinator realtime boundary", () => {
  it("reports realtime coordination readiness", async () => {
    const bindings = env as unknown as Env;
    const id = bindings.DEVICE_COORDINATOR.idFromName("phase2-test-device");
    const coordinator = bindings.DEVICE_COORDINATOR.get(id);

    const response = await coordinator.fetch("https://coordinator.test/health");
    const body = (await response.json()) as {
      data: Record<string, unknown>;
    };

    expect(response.status).toBe(200);
    expect(body.data).toMatchObject({
      component: "device-coordinator",
      status: "ready",
      realtime: true,
    });
  });

  it("does not expose an arbitrary WebSocket path", async () => {
    const bindings = env as unknown as Env;
    const id = bindings.DEVICE_COORDINATOR.idFromName("phase2-no-ws");
    const coordinator = bindings.DEVICE_COORDINATOR.get(id);

    const response = await coordinator.fetch("https://coordinator.test/ws", {
      headers: { Upgrade: "websocket" },
    });

    expect(response.status).toBe(404);
  });
});
