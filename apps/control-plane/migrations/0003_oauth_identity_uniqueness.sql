CREATE UNIQUE INDEX idx_users_identity_subject
  ON users(identity_provider, provider_subject_hash);
