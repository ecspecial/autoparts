-- Email уникален в рамках города: один и тот же адрес может быть на ekb и spb отдельно.
-- Run once: sudo -u postgres psql -d autoparts_db -f add_users_email_city_unique.sql

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE users DROP CONSTRAINT IF EXISTS "UQ_users_email";

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_city
  ON users (LOWER(TRIM(email)), city)
  WHERE email IS NOT NULL;
