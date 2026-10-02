import type { Env } from "./env";
import { failure, success } from "./http";
import { PROJECT_PHASE, SERVICE_VERSION } from "./meta";

export class DeviceCoordinator {
  constructor(
    private readonly state: DurableObjectState,
    private readonly env: Env,
  ) {
    void this.state;
    void this.env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return success({
        component: "device-coordinator",
        status: "skeleton",
        phase: PROJECT_PHASE,
        version: SERVICE_VERSION,
        realtime: false,
      });
    }

    return failure("ROUTE_NOT_FOUND", "Route not found", 404);
  }
}
