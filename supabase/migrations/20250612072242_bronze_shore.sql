/*
  # Smart Dustbin Devices Management

  1. New Tables
    - `devices`
      - `id` (uuid, primary key)
      - `device_id` (text, unique identifier)
      - `name` (text, device name)
      - `location` (text, physical location)
      - `latitude` (decimal, optional)
      - `longitude` (decimal, optional)
      - `status` (enum: online, offline, maintenance)
      - `battery_level` (integer, 0-100)
      - `fill_level` (integer, 0-100)
      - `last_emptied` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `devices` table
    - Add policies for authenticated users to read devices
    - Add policies for admins to manage devices
*/

-- Create enum for device status
CREATE TYPE device_status AS ENUM ('online', 'offline', 'maintenance');

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text UNIQUE NOT NULL,
  name text NOT NULL,
  location text NOT NULL,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  status device_status DEFAULT 'offline',
  battery_level integer DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  fill_level integer DEFAULT 0 CHECK (fill_level >= 0 AND fill_level <= 100),
  last_emptied timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read devices"
  ON devices
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert devices"
  ON devices
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update devices"
  ON devices
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete devices"
  ON devices
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_devices_updated_at
  BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample devices
INSERT INTO devices (device_id, name, location, latitude, longitude, status, battery_level, fill_level) VALUES
  ('D001', 'Main Street Dustbin', 'Main Street & 1st Ave', 40.7128, -74.0060, 'online', 85, 45),
  ('D002', 'Park Avenue Dustbin', 'Central Park Entrance', 40.7829, -73.9654, 'online', 92, 78),
  ('D003', 'Central Plaza Dustbin', 'Downtown Plaza', 40.7589, -73.9851, 'offline', 23, 89),
  ('D004', 'North District Dustbin', 'North Shopping Center', 40.7831, -73.9712, 'online', 67, 34),
  ('D005', 'South Mall Dustbin', 'South Mall Food Court', 40.7282, -74.0776, 'online', 88, 92);