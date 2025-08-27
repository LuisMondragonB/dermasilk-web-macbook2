/*
  Harden RLS policies for production

  - Restrict clients and memberships to authenticated role only
  - Keep rewards_transactions for authenticated only
  - Remove anon access
*/

-- Clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations for admin" ON clients;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable all operations for anon users" ON clients;

CREATE POLICY "clients_authenticated_all"
  ON clients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Memberships
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all operations for admin" ON memberships;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON memberships;

CREATE POLICY "memberships_authenticated_all"
  ON memberships
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Rewards transactions already handled in other migrations for authenticated
ALTER TABLE rewards_transactions ENABLE ROW LEVEL SECURITY;
-- No changes needed here beyond ensuring anon isn't granted

