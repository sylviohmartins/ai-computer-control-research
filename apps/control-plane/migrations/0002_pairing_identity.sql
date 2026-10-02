PRAGMA foreign_keys = OFF;

ALTER TABLE pairings RENAME TO pairings_phase0;

DROP INDEX IF EXISTS idx_pairings_code_expiry;

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
  public_key TEXT NOT NULL,
  algorithm TEXT NOT NULL CHECK (algorithm = 'Ed25519'),
  fingerprint TEXT NOT NULL,
  device_installation_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  os TEXT NOT NULL,
  arch TEXT NOT NULL,
  agent_version TEXT NOT NULL,
  user_code_digest TEXT NOT NULL,
  challenge_digest TEXT NOT NULL,
  challenge_used_at TEXT,
  verification_attempts INTEGER NOT NULL DEFAULT 0
    CHECK (verification_attempts >= 0),
  proof_attempts INTEGER NOT NULL DEFAULT 0
    CHECK (proof_attempts >= 0),
  expires_at TEXT NOT NULL,
  verified_at TEXT,
  proved_at TEXT,
  activated_at TEXT,
  activated_device_id TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (activated_device_id) REFERENCES devices(id)
);
INSERT INTO pairings (
  id,
  user_id,
  device_key_id,
  state,
  public_key,
  algorithm,
  fingerprint,
  device_installation_id,
  display_name,
  os,
  arch,
  agent_version,
  user_code_digest,
  challenge_digest,
  challenge_used_at,
  verification_attempts,
  proof_attempts,
  expires_at,
  verified_at,
  proved_at,
  activated_at,
  activated_device_id,
  created_at
)
SELECT
  p.id,
  p.user_id,
  p.device_key_id,
  p.state,
  k.public_key,
  k.algorithm,
  k.fingerprint,
  'legacy:' || p.id,
  d.display_name,
  d.os,
  d.arch,
  d.agent_version,
  p.user_code_digest,
  p.challenge_digest,
  CASE
    WHEN p.state IN ('DEVICE_PROVED_KEY', 'ACTIVE', 'REVOKED')
      THEN COALESCE(p.activated_at, p.verified_at)
    ELSE NULL
  END,
  0,
  0,
  p.expires_at,
  p.verified_at,
  CASE
    WHEN p.state IN ('DEVICE_PROVED_KEY', 'ACTIVE', 'REVOKED')
      THEN COALESCE(p.activated_at, p.verified_at)
    ELSE NULL
  END,
  p.activated_at,
  CASE
    WHEN p.state IN ('ACTIVE', 'REVOKED') THEN d.id
    ELSE NULL
  END,
  p.created_at
FROM pairings_phase0 p
JOIN device_keys k ON k.id = p.device_key_id
JOIN devices d ON d.id = k.device_id;

DROP TABLE pairings_phase0;
CREATE INDEX idx_pairings_code_expiry
  ON pairings(user_code_digest, expires_at);

CREATE INDEX idx_pairings_installation_state_created
  ON pairings(device_installation_id, state, created_at);

CREATE INDEX idx_pairings_device_key_state
  ON pairings(device_key_id, state);

CREATE UNIQUE INDEX idx_pairings_activated_device
  ON pairings(activated_device_id)
  WHERE activated_device_id IS NOT NULL;

PRAGMA foreign_keys = ON;
