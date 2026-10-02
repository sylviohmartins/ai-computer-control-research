export interface Env {
  DB: D1Database;
  DEVICE_COORDINATOR: DurableObjectNamespace;
  ARTIFACTS?: R2Bucket;
  TELEMETRY?: AnalyticsEngineDataset;
  ASYNC_TASKS?: Queue;
}

export interface BindingStatus {
  d1: boolean;
  durableObjects: boolean;
  r2: boolean;
  analyticsEngine: boolean;
  queues: boolean;
}

export function bindingStatus(env: Env): BindingStatus {
  return {
    d1: env.DB !== undefined,
    durableObjects: env.DEVICE_COORDINATOR !== undefined,
    r2: env.ARTIFACTS !== undefined,
    analyticsEngine: env.TELEMETRY !== undefined,
    queues: env.ASYNC_TASKS !== undefined,
  };
}
export function coreBindingsReady(status: BindingStatus): boolean {
  return status.d1 && status.durableObjects;
}
