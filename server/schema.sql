-- Запустите в psql или pgAdmin:
-- psql -U postgres -d apple_marketplace -f server/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  category    TEXT NOT NULL,
  condition   TEXT NOT NULL,
  price       NUMERIC NOT NULL,
  description TEXT,
  image_url   TEXT,
  seller_id   INTEGER REFERENCES users(id) ON DELETE CASCADE,
  seller_name TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id            SERIAL PRIMARY KEY,
  product_id    INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_title TEXT,
  product_image TEXT,
  product_price NUMERIC,
  seller_id     INTEGER,
  seller_name   TEXT,
  buyer_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
  buyer_name    TEXT,
  buyer_phone   TEXT,
  buyer_address TEXT,
  done          BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
