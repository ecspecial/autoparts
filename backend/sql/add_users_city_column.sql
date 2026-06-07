-- Город регистрации клиента (ekb | spb)
-- Run once: sudo -u postgres psql -d autoparts_db -f add_users_city_column.sql

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS city VARCHAR(10) DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_users_city ON users(city);
