-- Production: если synchronize отключён.
CREATE TABLE IF NOT EXISTS cookie_consent_logs (
  id SERIAL PRIMARY KEY,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  consent_version VARCHAR(64) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_cookie_consent_logs_accepted_at ON cookie_consent_logs (accepted_at);
