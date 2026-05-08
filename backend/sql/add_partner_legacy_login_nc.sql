-- Production: если synchronize отключён.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS partner_legacy_login VARCHAR(255) UNIQUE;

ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS nc_ref VARCHAR(255),
  ADD COLUMN IF NOT EXISTS nc_coment TEXT;
