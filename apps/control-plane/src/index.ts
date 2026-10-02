import type { Env } from "./env";
import { bindingStatus, coreBindingsReady } from "./env";
import { failure, success } from "./http";
import { PROJECT_PHASE, SERVICE_NAME, SERVICE_VERSION } from "./meta";

export { DeviceCoordinator } from "./device-coordinator";

function route(request: Request, env: Env): Response {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/health") {
    return success({
      service: SERVICE_NAME,
      status: "ok",
      phase: PROJECT_PHASE,
      version: SERVICE_VERSION,
    });
  }

  if (request.method === "GET" && url.pathname === "/ready") {
    const bindings = bindingStatus(env);
    const ready = coreBindingsReady(bindings);

    return success(
      {
        service: SERVICE_NAME,
        status: ready ? "ready" : "not_ready",
        bindings,
      },
      ready ? 200 : 503,
    );
  }

  if (request.method === "GET" && url.pathname === "/version") {
    return success({
      service: SERVICE_NAME,
      version: SERVICE_VERSION,
      phase: PROJECT_PHASE,
    });
  }

  return failure("ROUTE_NOT_FOUND", "Route not found", 404);
}

export default {
  fetch(request: Request, env: Env): Response {
    return route(request, env);
  },
} satisfies ExportedHandler<Env>;
