-- Backfill users.city: все старые аккаунты → ekb
-- (до мультисайта регистрации были только на ЕКБ; на СПБ был один тестовый).
-- Сначала выполните add_users_city_column.sql, затем этот файл.
--
-- Run: sudo -u postgres psql -d autoparts_db -f backfill_users_city.sql

-- ── 0. Превью: сколько записей обновится ──────────────────────────────────
SELECT
  COUNT(*) AS users_without_city,
  MIN(created_at) AS oldest,
  MAX(created_at) AS newest
FROM users
WHERE city IS NULL;

SELECT id, email, full_name, created_at
FROM users
WHERE city IS NULL
ORDER BY created_at;

-- ── 1. Всем старым клиентам без city → ekb ────────────────────────────────
UPDATE users
SET city = 'ekb'
WHERE city IS NULL;

-- ── 2. Проверка ───────────────────────────────────────────────────────────
SELECT city, COUNT(*) AS cnt
FROM users
GROUP BY city
ORDER BY city;

-- Если нужно вручную пометить единственного тестового СПБ-клиента:
-- UPDATE users SET city = 'spb' WHERE id = ...;
