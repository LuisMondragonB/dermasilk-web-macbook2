/*
  # Fix RLS policy for rewards_transactions table

  1. Security
    - Update RLS policy to allow INSERT operations for authenticated users
    - Ensure authenticated users can add reward transactions
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON rewards_transactions;

-- Create new policy that allows all operations for authenticated users
CREATE POLICY "Enable all operations for authenticated users"
  ON rewards_transactions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);