import { SELF } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";

import type { Env } from "../src/env";

import { publicKeyFingerprint, toBase64Url } from "../src/pairing-crypto";
import { connectionCredentialProofMessage } from "../src/realtime-crypto";
import { RealtimeService, revokeDeviceAndCloseRealtime } from "../src/realtime";

const bindings = env as unknown as Env;
const encoder = new TextEncoder();

interface ActiveIdentity {
  deviceId: string;
  deviceKeyId: string;
  privateKey: CryptoKey;
  publicKey: string;
  userId: string;
}

async function createActiveIdentity(): Promise<ActiveIdentity> {
  const pair = (await crypto.subtle.generateKey({ name: "Ed25519" }, true, [
    "sign",
    "verify",
  ])) as CryptoKeyPair;
  const publicBytes = new Uint8Array(
    await crypto.subtle.exportKey("raw", pair.publicKey),
  );
  const publicKey = toBase64Url(publicBytes);
  const fingerprint = await publicKeyFingerprint(publicKey);
  const userId = crypto.randomUUID();
  const deviceId = crypto.randomUUID();
  const deviceKeyId = crypto.randomUUID();
  const now = new Date().toISOString();

  await bindings.DB.batch([
    bindings.DB.prepare(
      `INSERT INTO users (
        id, identity_provider, provider_subject_hash, display_name,
        created_at, disabled_at
      ) VALUES (?, 'phase4-test', ?, 'Realtime User', ?, NULL)`,
    ).bind(userId, `subject-${userId}`, now),
    bindings.DB.prepare(
      `INSERT INTO devices (
        id, user_id, display_name, os, arch, agent_version,
        status_hint, last_seen_at, created_at, revoked_at
      ) VALUES (?, ?, 'Realtime Device', 'linux', 'x86_64', '0.1.0',
                'offline', NULL, ?, NULL)`,
    ).bind(deviceId, userId, now),
    bindings.DB.prepare(
      `INSERT INTO device_keys (
        id, device_id, public_key, algorithm, fingerprint,
        created_at, rotated_at, revoked_at
      ) VALUES (?, ?, ?, 'Ed25519', ?, ?, NULL, NULL)`,
    ).bind(deviceKeyId, deviceId, publicKey, fingerprint, now),
  ]);

  return {
    deviceId,
    deviceKeyId,
    privateKey: pair.privateKey,
    publicKey,
    userId,
  };
}

async function credential(
  identity: ActiveIdentity,
  nonce = `nonce_${crypto.randomUUID()}`,
): Promise<{ credential: string; nonce: string }> {
  const requestedAt = new Date().toISOString();
  const message = connectionCredentialProofMessage({
    deviceId: identity.deviceId,
    deviceKeyId: identity.deviceKeyId,
    connectionNonce: nonce,
    requestedAt,
  });
  const signature = toBase64Url(
    new Uint8Array(
      await crypto.subtle.sign(
        { name: "Ed25519" },
        identity.privateKey,
        encoder.encode(message),
      ),
    ),
  );

  const response = await SELF.fetch(
    `https://telechir.test/api/v1/devices/${identity.deviceId}/connection-credential`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        device_key_id: identity.deviceKeyId,
        connection_nonce: nonce,
        requested_at: requestedAt,
        signature,
      }),
    },
  );
  expect(response.status).toBe(201);
  const body = (await response.json()) as {
    data: { credential: string };
  };
  return { credential: body.data.credential, nonce };
}

function nextMessage(socket: WebSocket): Promise<MessageEvent> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("timed out waiting for WebSocket message")),
      2000,
    );
    socket.addEventListener(
      "message",
      (event) => {
        clearTimeout(timer);
        resolve(event);
      },
      { once: true },
    );
  });
}

function nextClose(socket: WebSocket): Promise<CloseEvent> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("timed out waiting for WebSocket close")),
      2000,
    );
    socket.addEventListener(
      "close",
      (event) => {
        clearTimeout(timer);
        resolve(event);
      },
      { once: true },
    );
  });
}
async function connect(
  identity: ActiveIdentity,
  issued: { credential: string; nonce: string },
): Promise<WebSocket> {
  const response = await SELF.fetch(
    `https://telechir.test/api/v1/devices/${identity.deviceId}/realtime`,
    {
      headers: {
        Upgrade: "websocket",
        Authorization: `Bearer ${issued.credential}`,
      },
    },
  );
  expect(response.status).toBe(101);
  expect(response.webSocket).not.toBeNull();
  const socket = response.webSocket!;
  socket.accept();
  return socket;
}

function frame(input: {
  identity: ActiveIdentity;
  nonce: string;
  sequence: number;
  messageType: string;
  payload: Record<string, unknown>;
  connectionId?: string | null;
}): string {
  return JSON.stringify({
    protocol_version: "0.1",
    message_type: input.messageType,
    message_id: `msg_${crypto.randomUUID()}`,
    correlation_id: null,
    device_id: input.identity.deviceId,
    session_id: null,
    connection_id: input.connectionId ?? null,
    sequence: input.sequence,
    sent_at: new Date().toISOString(),
    deadline_at: null,
    payload: input.payload,
  });
}

async function handshake(
  socket: WebSocket,
  identity: ActiveIdentity,
  nonce: string,
  versions = ["0.1"],
): Promise<Record<string, unknown>> {
  const incoming = nextMessage(socket);
  socket.send(
    frame({
      identity,
      nonce,
      sequence: 0,
      messageType: "agent.hello",
      payload: {
        device_public_id: identity.deviceId,
        device_key_id: identity.deviceKeyId,
        agent_version: "0.1.0",
        os: "linux",
        arch: "x86_64",
        supported_protocol_versions: versions,
        capabilities: [],
        connection_nonce: nonce,
      },
    }),
  );
  const event = await incoming;
  return JSON.parse(String(event.data)) as Record<string, unknown>;
}

describe("device realtime channel", () => {
  it("issues a short-lived credential and completes hello + heartbeat", async () => {
    const identity = await createActiveIdentity();
    const issued = await credential(identity);
    const socket = await connect(identity, issued);
    const ack = await handshake(socket, identity, issued.nonce);

    expect(ack.message_type).toBe("agent.hello_ack");
    const ackPayload = ack.payload as Record<string, unknown>;
    expect(ackPayload.selected_protocol_version).toBe("0.1");
    expect(ackPayload.heartbeat_interval_seconds).toBe(30);
    const connectionId = ackPayload.connection_id as string;

    const heartbeatAck = nextMessage(socket);
    socket.send(
      frame({
        identity,
        nonce: issued.nonce,
        sequence: 1,
        connectionId,
        messageType: "heartbeat",
        payload: {
          agent_time: new Date().toISOString(),
          last_received_sequence: 0,
        },
      }),
    );
    const heartbeat = JSON.parse(String((await heartbeatAck).data)) as Record<
      string,
      unknown
    >;
    expect(heartbeat.message_type).toBe("heartbeat_ack");

    const coordinator = bindings.DEVICE_COORDINATOR.get(
      bindings.DEVICE_COORDINATOR.idFromName(identity.deviceId),
    );
    const presenceResponse = await coordinator.fetch(
      "https://device-coordinator/internal/presence",
    );
    const presence = (await presenceResponse.json()) as {
      data: Record<string, unknown>;
    };
    expect(presence.data.online).toBe(true);
    expect(presence.data.connection_id).toBe(connectionId);
    expect(presence.data.last_heartbeat_at).toBeTypeOf("string");

    socket.close(1000, "test complete");
  });
  it("rejects credential replay and replaces the old connection with a fresh credential", async () => {
    const identity = await createActiveIdentity();
    const firstCredential = await credential(identity);
    const first = await connect(identity, firstCredential);
    const firstAck = await handshake(first, identity, firstCredential.nonce);
    const firstConnectionId = (firstAck.payload as Record<string, unknown>)
      .connection_id as string;

    const replay = await SELF.fetch(
      `https://telechir.test/api/v1/devices/${identity.deviceId}/realtime`,
      {
        headers: {
          Upgrade: "websocket",
          Authorization: `Bearer ${firstCredential.credential}`,
        },
      },
    );
    expect(replay.status).toBe(409);

    const closed = nextClose(first);
    const secondCredential = await credential(identity);
    const second = await connect(identity, secondCredential);
    const closeEvent = await closed;
    expect(closeEvent.code).toBe(4001);
    const secondAck = await handshake(second, identity, secondCredential.nonce);
    const secondConnectionId = (secondAck.payload as Record<string, unknown>)
      .connection_id as string;
    expect(secondConnectionId).not.toBe(firstConnectionId);
    second.close(1000, "test complete");
  });

  it("closes an active connection on durable revocation and blocks new credentials", async () => {
    const identity = await createActiveIdentity();
    const issued = await credential(identity);
    const socket = await connect(identity, issued);
    await handshake(socket, identity, issued.nonce);

    const closed = nextClose(socket);
    await revokeDeviceAndCloseRealtime(
      bindings,
      identity.userId,
      identity.deviceId,
    );
    const realtime = new RealtimeService(
      bindings.DB,
      bindings.REALTIME_SERVER_SECRET!,
    );
    expect((await closed).code).toBe(4003);

    const requestedAt = new Date().toISOString();
    const nonce = `nonce_${crypto.randomUUID()}`;
    const signature = toBase64Url(
      new Uint8Array(
        await crypto.subtle.sign(
          { name: "Ed25519" },
          identity.privateKey,
          encoder.encode(
            connectionCredentialProofMessage({
              deviceId: identity.deviceId,
              deviceKeyId: identity.deviceKeyId,
              connectionNonce: nonce,
              requestedAt,
            }),
          ),
        ),
      ),
    );

    await expect(
      realtime.issueCredential(identity.deviceId, {
        device_key_id: identity.deviceKeyId,
        connection_nonce: nonce,
        requested_at: requestedAt,
        signature,
      }),
    ).rejects.toMatchObject({ code: "DEVICE_REVOKED" });
  });
  it("correlates command lifecycle messages by command_id without executing host work", async () => {
    const identity = await createActiveIdentity();
    const issued = await credential(identity);
    const socket = await connect(identity, issued);
    const ack = await handshake(socket, identity, issued.nonce);
    const connectionId = (ack.payload as Record<string, unknown>)
      .connection_id as string;
    const commandId = `cmd_${crypto.randomUUID()}`;

    socket.send(
      frame({
        identity,
        nonce: issued.nonce,
        sequence: 1,
        connectionId,
        messageType: "command.accepted",
        payload: {
          command_id: commandId,
          accepted_at: new Date().toISOString(),
          process_id: null,
        },
      }),
    );

    const coordinator = bindings.DEVICE_COORDINATOR.get(
      bindings.DEVICE_COORDINATOR.idFromName(identity.deviceId),
    );

    let correlated: Response | undefined;
    for (let attempt = 0; attempt < 20; attempt++) {
      correlated = await coordinator.fetch(
        `https://device-coordinator/internal/commands/${commandId}`,
      );
      if (correlated.status === 200) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    expect(correlated?.status).toBe(200);
    const body = (await correlated!.json()) as {
      data: Record<string, unknown>;
    };
    expect(body.data).toMatchObject({
      command_id: commandId,
      message_type: "command.accepted",
    });

    socket.close(1000, "test complete");
  });

  it("fails closed on unsupported protocol and oversized frames", async () => {
    const identity = await createActiveIdentity();
    const unsupportedCredential = await credential(identity);
    const unsupported = await connect(identity, unsupportedCredential);
    const unsupportedClose = nextClose(unsupported);
    unsupported.send(
      frame({
        identity,
        nonce: unsupportedCredential.nonce,
        sequence: 0,
        messageType: "agent.hello",
        payload: {
          device_public_id: identity.deviceId,
          device_key_id: identity.deviceKeyId,
          agent_version: "0.1.0",
          os: "linux",
          arch: "x86_64",
          supported_protocol_versions: ["9.9"],
          capabilities: [],
          connection_nonce: unsupportedCredential.nonce,
        },
      }),
    );
    expect((await unsupportedClose).code).toBe(4002);

    const largeCredential = await credential(identity);
    const large = await connect(identity, largeCredential);
    const largeClose = nextClose(large);
    large.send("x".repeat(256 * 1024 + 1));
    expect((await largeClose).code).toBe(1009);
  });
});
