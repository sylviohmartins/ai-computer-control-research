import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

import type { Env } from "../src/env";

describe("DeviceCoordinator skeleton", () => {
  it("exists as a local coordination boundary without realtime", async () => {
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
      status: "skeleton",
      realtime: false,
    });
  });

  it("does not expose WebSocket behavior yet", async () => {
    const bindings = env as unknown as Env;
    const id = bindings.DEVICE_COORDINATOR.idFromName("phase2-no-ws");
    const coordinator = bindings.DEVICE_COORDINATOR.get(id);

    const response = await coordinator.fetch("https://coordinator.test/ws", {
      headers: { Upgrade: "websocket" },
    });

    expect(response.status).toBe(404);
  });
});
