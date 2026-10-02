PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  identity_provider TEXT NOT NULL,
  provider_subject_hash TEXT NOT NULL,
  display_name TEXT,
  created_at TEXT NOT NULL,
  disabled_at TEXT
);

CREATE TABLE devices (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  os TEXT NOT NULL,
  arch TEXT NOT NULL,
  agent_version TEXT NOT NULL,
  status_hint TEXT NOT NULL,
  last_seen_at TEXT,
  created_at TEXT NOT NULL,
  revoked_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE device_keys (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
  algorithm TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  created_at TEXT NOT NULL,
  rotated_at TEXT,
  revoked_at TEXT,
  FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE TABLE pairings (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  device_key_id TEXT NOT NULL,
  state TEXT NOT NULL CHECK (
    state IN (
      'CREATED',
      'USER_VERIFIED',
      'DEVICE_PROVED_KEY',
      'ACTIVE',
      'EXPIRED',
      'REVOKED'
    )
  ),
  user_code_digest TEXT NOT NULL,
  challenge_digest TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  verified_at TEXT,
  activated_at TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (device_key_id) REFERENCES device_keys(id)
);

CREATE TABLE workspaces (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  archived_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (device_id) REFERENCES devices(id)
);

CREATE TABLE policy_restrictions (
  id TEXT PRIMARY KEY,
  scope_type TEXT NOT NULL CHECK (
    scope_type IN ('account', 'workspace', 'device', 'session')
  ),
  scope_id TEXT NOT NULL,
  permission TEXT NOT NULL,
  effect TEXT NOT NULL CHECK (effect IN ('ALLOW', 'ASK', 'DENY')),
  constraint_json TEXT NOT NULL DEFAULT '{}',
  revision TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  ai_client_type TEXT NOT NULL,
  client_instance_hash TEXT,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  last_seen_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE approvals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  command_id TEXT,
  permission TEXT NOT NULL,
  risk TEXT NOT NULL CHECK (risk IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  scope TEXT NOT NULL CHECK (scope IN ('once', 'session')),
  argument_digest TEXT NOT NULL,
  decision TEXT CHECK (decision IN ('APPROVE', 'DENY')),
  requested_at TEXT NOT NULL,
  decided_at TEXT,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (device_id) REFERENCES devices(id),
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE TABLE commands (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  idempotency_key_hash TEXT,
  argument_digest TEXT NOT NULL,
  risk TEXT NOT NULL CHECK (risk IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  state TEXT NOT NULL,
  requested_at TEXT NOT NULL,
  accepted_at TEXT,
  completed_at TEXT,
  error_code TEXT,
  artifact_id TEXT,
  FOREIGN KEY (device_id) REFERENCES devices(id),
  FOREIGN KEY (session_id) REFERENCES sessions(id)
);

CREATE TABLE processes (
  id TEXT PRIMARY KEY,
  device_id TEXT NOT NULL,
  command_id TEXT NOT NULL UNIQUE,
  state_hint TEXT NOT NULL,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  exit_code INTEGER,
  last_reconciled_at TEXT NOT NULL,
  FOREIGN KEY (device_id) REFERENCES devices(id),
  FOREIGN KEY (command_id) REFERENCES commands(id)
);

CREATE TABLE artifacts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  device_id TEXT,
  command_id TEXT,
  r2_key TEXT NOT NULL,
  mime_type TEXT,
  file_name TEXT,
  size_bytes INTEGER NOT NULL CHECK (size_bytes >= 0),
  sha256 TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT,
  deleted_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (device_id) REFERENCES devices(id),
  FOREIGN KEY (command_id) REFERENCES commands(id)
);

CREATE TABLE audit_events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  device_id TEXT,
  session_id TEXT,
  command_id TEXT,
  event_type TEXT NOT NULL,
  decision TEXT,
  risk TEXT,
  target_digest TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (device_id) REFERENCES devices(id),
  FOREIGN KEY (session_id) REFERENCES sessions(id),
  FOREIGN KEY (command_id) REFERENCES commands(id)
);

CREATE INDEX idx_devices_user_revoked
  ON devices(user_id, revoked_at);
CREATE INDEX idx_device_keys_device_revoked
  ON device_keys(device_id, revoked_at);

CREATE INDEX idx_pairings_code_expiry
  ON pairings(user_code_digest, expires_at);

CREATE INDEX idx_sessions_user_started
  ON sessions(user_id, started_at);

CREATE INDEX idx_commands_device_requested
  ON commands(device_id, requested_at);

CREATE INDEX idx_commands_session_requested
  ON commands(session_id, requested_at);

CREATE INDEX idx_approvals_device_expiry_consumed
  ON approvals(device_id, expires_at, consumed_at);

CREATE INDEX idx_audit_events_device_created
  ON audit_events(device_id, created_at);

CREATE INDEX idx_artifacts_user_created
  ON artifacts(user_id, created_at);
