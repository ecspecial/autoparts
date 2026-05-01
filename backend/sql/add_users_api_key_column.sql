-- Выполнить вручную в production, если TypeORM synchronize отключён.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS api_key VARCHAR(512) UNIQUE;
