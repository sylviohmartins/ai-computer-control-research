import {
  DEVICE_PROTOCOL_VERSION,
  HEARTBEAT_INTERVAL_SECONDS,
  MAX_FRAME_BYTES,
  DeviceProtocolError,
  parseAgentFrame,
  serverEnvelope,
} from "./device-protocol";
import type { Env } from "./env";
import { failure, success } from "./http";
import { PROJECT_PHASE, SERVICE_VERSION } from "./meta";

const MAX_RECENT_MESSAGE_IDS = 32;
const MAX_RECENT_CREDENTIALS = 128;
const REPLACED_CLOSE_CODE = 4001;
const PROTOCOL_CLOSE_CODE = 4002;
const REVOKED_CLOSE_CODE = 4003;

interface ConnectionAttachment {
  deviceId: string;
  deviceKeyId: string;
  credentialJti: string;
  connectionNonce: string;
  connectionId: string;
  helloReceived: boolean;
  lastInboundSequence: number;
  nextOutboundSequence: number;
  recentMessageIds: string[];
  lastHeartbeatAt: string | null;
  capabilities: string[];
}

function requiredHeader(request: Request, name: string): string {
  const value = request.headers.get(name);
  if (!value) {
    throw new Error(`missing internal header: ${name}`);
  }
  return value;
}

export class DeviceCoordinator {
  constructor(
    private readonly state: DurableObjectState,
    private readonly env: Env,
  ) {
    void this.env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return success({
        component: "device-coordinator",
        status: "ready",
        phase: PROJECT_PHASE,
        version: SERVICE_VERSION,
        realtime: true,
        active_connections: this.state.getWebSockets("active").length,
      });
    }

    if (request.method === "GET" && url.pathname === "/internal/presence") {
      const sockets = this.state.getWebSockets("active");
      const attachment = sockets[0]?.deserializeAttachment() as
        ConnectionAttachment | undefined;
      return success({
        online: sockets.some((socket) => socket.readyState === WebSocket.OPEN),
        connection_id: attachment?.connectionId ?? null,
        last_heartbeat_at: attachment?.lastHeartbeatAt ?? null,
        capabilities: attachment?.capabilities ?? [],
      });
    }

    if (request.method === "POST" && url.pathname === "/internal/revoke") {
      const expectedDeviceId = requiredHeader(request, "x-telechir-device-id");
      for (const socket of this.state.getWebSockets()) {
        const attachment =
          socket.deserializeAttachment() as ConnectionAttachment | null;
        if (!attachment || attachment.deviceId === expectedDeviceId) {
          socket.close(REVOKED_CLOSE_CODE, "device revoked");
        }
      }
      await this.state.storage.put("revoked", true);
      return success({ revoked: true, active_connections: 0 });
    }

    if (request.method === "GET" && url.pathname === "/connect") {
      return this.acceptConnection(request);
    }

    const commandMatch = /^\/internal\/commands\/([^/]+)$/u.exec(url.pathname);
    if (commandMatch && request.method === "GET") {
      const state = await this.state.storage.get(`command:${commandMatch[1]!}`);
      return state
        ? success(state)
        : failure("NOT_FOUND", "Command correlation not found", 404);
    }

    return failure("ROUTE_NOT_FOUND", "Route not found", 404);
  }
  async webSocketMessage(
    socket: WebSocket,
    message: string | ArrayBuffer,
  ): Promise<void> {
    if (typeof message !== "string") {
      socket.close(PROTOCOL_CLOSE_CODE, "binary frames unsupported");
      return;
    }
    if (new TextEncoder().encode(message).byteLength > MAX_FRAME_BYTES) {
      socket.close(1009, "frame exceeds negotiated limit");
      return;
    }

    let frame;
    try {
      frame = parseAgentFrame(message);
    } catch (error) {
      const reason =
        error instanceof DeviceProtocolError
          ? error.message
          : "invalid protocol frame";
      socket.close(PROTOCOL_CLOSE_CODE, reason.slice(0, 120));
      return;
    }

    const attachment =
      socket.deserializeAttachment() as ConnectionAttachment | null;
    if (!attachment) {
      socket.close(PROTOCOL_CLOSE_CODE, "missing connection attachment");
      return;
    }

    if (frame.device_id !== attachment.deviceId) {
      socket.close(PROTOCOL_CLOSE_CODE, "device_id mismatch");
      return;
    }
    if (frame.sequence <= attachment.lastInboundSequence) {
      socket.close(PROTOCOL_CLOSE_CODE, "non-monotonic sequence");
      return;
    }
    if (attachment.recentMessageIds.includes(frame.message_id)) {
      socket.close(PROTOCOL_CLOSE_CODE, "duplicate message_id");
      return;
    }

    attachment.lastInboundSequence = frame.sequence;
    attachment.recentMessageIds.push(frame.message_id);
    if (attachment.recentMessageIds.length > MAX_RECENT_MESSAGE_IDS) {
      attachment.recentMessageIds.shift();
    }

    if (!attachment.helloReceived) {
      if (frame.message_type !== "agent.hello") {
        socket.close(PROTOCOL_CLOSE_CODE, "agent.hello required first");
        return;
      }
      const hello = frame.payload;
      if (
        hello.device_public_id !== attachment.deviceId ||
        hello.device_key_id !== attachment.deviceKeyId ||
        hello.connection_nonce !== attachment.connectionNonce
      ) {
        socket.close(PROTOCOL_CLOSE_CODE, "agent.hello identity mismatch");
        return;
      }
      const versions = hello.supported_protocol_versions as string[];
      if (!versions.includes(DEVICE_PROTOCOL_VERSION)) {
        socket.close(PROTOCOL_CLOSE_CODE, "unsupported protocol version");
        return;
      }

      attachment.helloReceived = true;
      attachment.capabilities = hello.capabilities as string[];
      this.send(socket, attachment, "agent.hello_ack", frame.message_id, {
        connection_id: attachment.connectionId,
        selected_protocol_version: DEVICE_PROTOCOL_VERSION,
        server_time: new Date().toISOString(),
        heartbeat_interval_seconds: HEARTBEAT_INTERVAL_SECONDS,
        limits: {
          max_frame_bytes: MAX_FRAME_BYTES,
          max_output_chunk_bytes: 64 * 1024,
          process_ring_buffer_bytes: 4 * 1024 * 1024,
          max_inline_result_bytes: 256 * 1024,
        },
        policy_revision: null,
      });
      socket.serializeAttachment(attachment);
      return;
    }

    switch (frame.message_type) {
      case "heartbeat":
        attachment.lastHeartbeatAt = new Date().toISOString();
        this.send(socket, attachment, "heartbeat_ack", frame.message_id, {
          server_time: new Date().toISOString(),
          last_received_sequence: frame.sequence,
        });
        break;
      case "capabilities.changed":
        attachment.capabilities = frame.payload.capabilities as string[];
        break;
      case "command.accepted":
      case "command.chunk":
      case "command.completed":
      case "command.failed":
      case "command.cancelled":
      case "approval.request": {
        const commandId = frame.payload.command_id as string;
        await this.state.storage.put(`command:${commandId}`, {
          command_id: commandId,
          message_type: frame.message_type,
          message_id: frame.message_id,
          sequence: frame.sequence,
          received_at: new Date().toISOString(),
        });
        break;
      }
      case "protocol.error":
        break;
      default:
        socket.close(PROTOCOL_CLOSE_CODE, "unsupported agent message");
        return;
    }

    socket.serializeAttachment(attachment);
  }
  webSocketClose(socket: WebSocket, code: number, reason: string): void {
    void socket;
    void code;
    void reason;
  }

  webSocketError(socket: WebSocket, error: unknown): void {
    void error;
    socket.close(1011, "realtime channel error");
  }

  private async acceptConnection(request: Request): Promise<Response> {
    if (request.headers.get("upgrade")?.toLowerCase() !== "websocket") {
      return failure("INVALID_ARGUMENT", "WebSocket upgrade required", 426);
    }
    if (await this.state.storage.get<boolean>("revoked")) {
      return failure("DEVICE_REVOKED", "Device is revoked", 403);
    }

    let deviceId: string;
    let deviceKeyId: string;
    let connectionNonce: string;
    let credentialJti: string;
    let credentialExpiresAt: string;
    try {
      deviceId = requiredHeader(request, "x-telechir-device-id");
      deviceKeyId = requiredHeader(request, "x-telechir-device-key-id");
      connectionNonce = requiredHeader(request, "x-telechir-connection-nonce");
      credentialJti = requiredHeader(request, "x-telechir-credential-jti");
      credentialExpiresAt = requiredHeader(
        request,
        "x-telechir-credential-expires-at",
      );
    } catch {
      return failure("UNAUTHENTICATED", "Internal identity missing", 401);
    }

    const now = Date.now();
    const expiresAt = Date.parse(credentialExpiresAt);
    if (!Number.isFinite(expiresAt) || now >= expiresAt) {
      return failure("UNAUTHENTICATED", "Credential expired", 401);
    }

    const used =
      (await this.state.storage.get<Record<string, number>>(
        "used_credentials",
      )) ?? {};
    for (const [jti, expiry] of Object.entries(used)) {
      if (expiry <= now) {
        delete used[jti];
      }
    }
    if (used[credentialJti] !== undefined) {
      return failure("CONFLICT", "Credential replay detected", 409);
    }
    if (Object.keys(used).length >= MAX_RECENT_CREDENTIALS) {
      return failure(
        "RATE_LIMITED",
        "Too many recent connection credentials",
        429,
      );
    }
    used[credentialJti] = expiresAt;
    await this.state.storage.put("used_credentials", used);

    for (const existing of this.state.getWebSockets("active")) {
      if (existing.readyState === WebSocket.OPEN) {
        existing.close(REPLACED_CLOSE_CODE, "connection replaced");
      }
    }

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    const attachment: ConnectionAttachment = {
      deviceId,
      deviceKeyId,
      credentialJti,
      connectionNonce,
      connectionId: `conn_${crypto.randomUUID()}`,
      helloReceived: false,
      lastInboundSequence: -1,
      nextOutboundSequence: 0,
      recentMessageIds: [],
      lastHeartbeatAt: null,
      capabilities: [],
    };
    server.serializeAttachment(attachment);
    this.state.acceptWebSocket(server, ["active"]);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  private send(
    socket: WebSocket,
    attachment: ConnectionAttachment,
    messageType: string,
    correlationId: string | null,
    payload: Record<string, unknown>,
  ): void {
    const sequence = attachment.nextOutboundSequence;
    attachment.nextOutboundSequence += 1;
    socket.send(
      JSON.stringify(
        serverEnvelope({
          messageType,
          deviceId: attachment.deviceId,
          connectionId: attachment.connectionId,
          sequence,
          correlationId,
          payload,
        }),
      ),
    );
  }
}
