-- Add city column to delivery_methods for multi-city support
-- Run once on server: psql -U autoparts_user -d autoparts_db -f add_delivery_city_column.sql

ALTER TABLE delivery_methods
  ADD COLUMN IF NOT EXISTS city VARCHAR(10) NOT NULL DEFAULT 'ekb';

-- Mark existing rows as ekb (they were imported before multi-city support)
UPDATE delivery_methods SET city = 'ekb' WHERE city = '';

CREATE INDEX IF NOT EXISTS idx_delivery_methods_city ON delivery_methods(city);
