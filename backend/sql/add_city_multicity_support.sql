-- Multi-city support migration
-- Run ONCE on production before deploying the new backend build.

-- 1. Add city column to products table (default 'ekb' for existing data)
ALTER TABLE products ADD COLUMN IF NOT EXISTS city VARCHAR(20) NOT NULL DEFAULT 'ekb';

-- 2. Drop old unique constraint on article alone
ALTER TABLE products DROP CONSTRAINT IF EXISTS "UQ_products_article";
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_article_key;

-- 3. Create composite unique index (article, city)
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_article_city ON products (article, city);

-- 4. Add city column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS city VARCHAR(20) DEFAULT NULL;
