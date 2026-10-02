export type DeviceStatusFilter = "online" | "offline" | "all";

export interface ListDevicesInput {
  status?: DeviceStatusFilter;
}

export interface GetDeviceInput {
  device_id: string;
}

export interface PublicDeviceSummary {
  device_id: string;
  name: string;
  status: "online" | "offline";
  os: string;
  arch: string;
  agent_version: string;
  last_seen: string | null;
}

export interface PublicDeviceDetail extends PublicDeviceSummary {
  capabilities: string[];
  policy_summary: null;
}

interface DeviceRow {
  id: string;
  display_name: string;
  os: string;
  arch: string;
  agent_version: string;
  last_seen_at: string | null;
}

interface Presence {
  online: boolean;
  capabilities: string[];
}

export class DeviceToolsError extends Error {
  constructor(
    public readonly code: "NOT_FOUND" | "INTERNAL_ERROR",
    message: string,
  ) {
    super(message);
    this.name = "DeviceToolsError";
  }
}

export class DeviceToolsService {
  constructor(
    private readonly db: D1Database,
    private readonly coordinators: DurableObjectNamespace,
  ) {}

  async listDevices(
    userId: string,
    input: ListDevicesInput,
  ): Promise<{ devices: PublicDeviceSummary[] }> {
    const status = input.status ?? "all";
    if (!["online", "offline", "all"].includes(status)) {
      throw new DeviceToolsError("INTERNAL_ERROR", "invalid status filter");
    }

    const result = await this.db
      .prepare(
        `SELECT id, display_name, os, arch, agent_version, last_seen_at
         FROM devices
         WHERE user_id = ? AND revoked_at IS NULL
         ORDER BY created_at ASC
         LIMIT 250`,
      )
      .bind(userId)
      .all<DeviceRow>();

    const summaries: PublicDeviceSummary[] = [];
    const batchSize = 16;
    for (let index = 0; index < result.results.length; index += batchSize) {
      const batch = result.results.slice(index, index + batchSize);
      summaries.push(
        ...(await Promise.all(
          batch.map(async (row) => {
            const presence = await this.presence(row.id);
            return this.summary(row, presence.online);
          }),
        )),
      );
    }

    return {
      devices:
        status === "all"
          ? summaries
          : summaries.filter((device) => device.status === status),
    };
  }

  async getDevice(
    userId: string,
    input: GetDeviceInput,
  ): Promise<PublicDeviceDetail> {
    const row = await this.db
      .prepare(
        `SELECT id, display_name, os, arch, agent_version, last_seen_at
         FROM devices
         WHERE id = ? AND user_id = ? AND revoked_at IS NULL`,
      )
      .bind(input.device_id, userId)
      .first<DeviceRow>();

    if (!row) {
      throw new DeviceToolsError("NOT_FOUND", "device not found");
    }

    const presence = await this.presence(row.id);
    return {
      ...this.summary(row, presence.online),
      capabilities: presence.capabilities,
      policy_summary: null,
    };
  }

  private summary(row: DeviceRow, online: boolean): PublicDeviceSummary {
    return {
      device_id: row.id,
      name: row.display_name,
      status: online ? "online" : "offline",
      os: row.os,
      arch: row.arch,
      agent_version: row.agent_version,
      last_seen: row.last_seen_at,
    };
  }

  private async presence(deviceId: string): Promise<Presence> {
    try {
      const id = this.coordinators.idFromName(deviceId);
      const response = await this.coordinators
        .get(id)
        .fetch("https://device-coordinator/internal/presence");
      if (!response.ok) {
        return { online: false, capabilities: [] };
      }
      const body = (await response.json()) as {
        data?: {
          online?: unknown;
          capabilities?: unknown;
        };
      };
      return {
        online: body.data?.online === true,
        capabilities: Array.isArray(body.data?.capabilities)
          ? body.data.capabilities.filter(
              (value): value is string => typeof value === "string",
            )
          : [],
      };
    } catch {
      return { online: false, capabilities: [] };
    }
  }
}
