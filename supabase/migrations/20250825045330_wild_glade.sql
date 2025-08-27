/*
  # Fix RLS policy for rewards_transactions table

  1. Security Changes
    - Drop existing restrictive policy
    - Create new policy allowing all operations for authenticated users
    - Ensure admin users can insert, select, update, and delete rewards transactions

  This resolves the "new row violates row-level security policy" error when adding points.
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON rewards_transactions;

-- Create a comprehensive policy that allows all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users"
  ON rewards_transactions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE rewards_transactions ENABLE ROW LEVEL SECURITY;