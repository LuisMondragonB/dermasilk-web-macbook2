/*
  # Fix RLS policy for clients table

  1. Security Changes
    - Enable RLS on clients table if not already enabled
    - Add policy to allow all operations for authenticated users
    - Add policy to allow all operations for anon users (for admin functionality)

  2. Notes
    - This allows the admin panel to create, read, update, and delete clients
    - Uses both authenticated and anon roles for maximum compatibility
*/

-- Enable RLS on clients table
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON clients;
DROP POLICY IF EXISTS "Enable all operations for anon users" ON clients;
DROP POLICY IF EXISTS "Allow all operations for admin" ON clients;

-- Create comprehensive policy for all operations
CREATE POLICY "Allow all operations for admin" 
  ON clients 
  FOR ALL 
  TO anon, authenticated 
  USING (true) 
  WITH CHECK (true);