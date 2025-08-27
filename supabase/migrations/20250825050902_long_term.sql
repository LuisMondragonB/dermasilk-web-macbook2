/*
  # Fix RLS policy for rewards_transactions table

  1. Security Changes
    - Drop existing restrictive policy
    - Create new policy allowing all operations for authenticated users
    - Ensure INSERT, SELECT, UPDATE, DELETE permissions for admins

  This fixes the "new row violates row-level security policy" error
  when adding or subtracting points from clients.
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON rewards_transactions;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON rewards_transactions;

-- Create a comprehensive policy for all operations
CREATE POLICY "Enable all CRUD operations for authenticated users"
  ON rewards_transactions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE rewards_transactions ENABLE ROW LEVEL SECURITY;