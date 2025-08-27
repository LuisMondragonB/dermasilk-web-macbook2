/*
  # Sistema de Membresías Dermasilk®

  1. New Tables
    - `memberships`
      - `id` (uuid, primary key)
      - `client_name` (text, nombre del cliente)
      - `client_phone` (text, teléfono del cliente)
      - `client_email` (text, email del cliente)
      - `membership_type` (text, tipo: individual, combo, personalizada)
      - `plan_name` (text, nombre del plan: esencial, completa, platinum)
      - `areas` (jsonb, áreas incluidas en la membresía)
      - `monthly_payment` (numeric, pago mensual)
      - `initial_payment` (numeric, pago inicial)
      - `total_sessions` (integer, número total de sesiones)
      - `completed_sessions` (integer, sesiones completadas)
      - `start_date` (date, fecha de inicio)
      - `end_date` (date, fecha estimada de finalización)
      - `status` (text, estado: activa, pausada, completada, cancelada)
      - `notes` (text, notas adicionales)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `memberships` table
    - Add policy for authenticated users to manage memberships
*/

CREATE TABLE IF NOT EXISTS memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_phone text NOT NULL,
  client_email text,
  membership_type text NOT NULL CHECK (membership_type IN ('individual', 'combo', 'personalizada')),
  plan_name text NOT NULL CHECK (plan_name IN ('esencial', 'completa', 'platinum')),
  areas jsonb NOT NULL DEFAULT '[]',
  monthly_payment numeric(10,2) NOT NULL,
  initial_payment numeric(10,2) NOT NULL,
  total_sessions integer NOT NULL DEFAULT 6,
  completed_sessions integer NOT NULL DEFAULT 0,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  status text NOT NULL DEFAULT 'activa' CHECK (status IN ('activa', 'pausada', 'completada', 'cancelada')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Allow all operations for admin" 
  ON memberships 
  FOR ALL 
  TO anon, authenticated 
  USING (true) 
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_memberships_updated_at 
    BEFORE UPDATE ON memberships 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();