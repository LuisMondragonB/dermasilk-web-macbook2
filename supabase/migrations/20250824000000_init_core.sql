/*
  Initial core tables required by the app

  - clients
  - rewards_catalog
  - rewards_transactions

  Note: Subsequent migrations in this repo adjust RLS policies for these tables.
*/

-- Enable pgcrypto if needed for gen_random_uuid()
-- (Supabase usually has this enabled by default)
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  points integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Uniqueness and lookup indexes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'clients_email_unique'
  ) THEN
    CREATE UNIQUE INDEX clients_email_unique ON clients (email);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'clients_phone_idx'
  ) THEN
    CREATE INDEX clients_phone_idx ON clients (phone);
  END IF;
END $$;

-- Rewards catalog table
CREATE TABLE IF NOT EXISTS rewards_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  points_required integer NOT NULL CHECK (points_required > 0),
  category text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Rewards transactions table
CREATE TABLE IF NOT EXISTS rewards_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  points integer NOT NULL CHECK (points > 0),
  transaction_type text NOT NULL CHECK (transaction_type IN ('earned','redeemed')),
  reason text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Helpful index for querying transactions by client
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'rewards_transactions_client_id_idx'
  ) THEN
    CREATE INDEX rewards_transactions_client_id_idx ON rewards_transactions (client_id);
  END IF;
END $$;

-- Enable RLS (policies are defined in later migrations in this repo)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_transactions ENABLE ROW LEVEL SECURITY;


