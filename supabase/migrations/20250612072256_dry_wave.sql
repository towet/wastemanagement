/*
  # Notifications System

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `device_id` (uuid, references devices, optional)
      - `type` (enum: alert, warning, info, success)
      - `title` (text)
      - `message` (text)
      - `read` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `notifications` table
    - Add policies for users to read their own notifications
    - Add policies for admins to create system notifications
*/

-- Create enum for notification types
CREATE TYPE notification_type AS ENUM ('alert', 'warning', 'info', 'success');

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  device_id uuid REFERENCES devices(id) ON DELETE SET NULL,
  type notification_type DEFAULT 'info',
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can read all notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to create system notifications
CREATE OR REPLACE FUNCTION create_system_notification(
  p_type notification_type,
  p_title text,
  p_message text,
  p_device_id uuid DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- Create notification for all users
  INSERT INTO notifications (user_id, device_id, type, title, message)
  SELECT id, p_device_id, p_type, p_title, p_message
  FROM user_profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;