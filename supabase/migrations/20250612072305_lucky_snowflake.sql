/*
  # Waste Tracking and Analytics

  1. New Tables
    - `waste_collections`
      - `id` (uuid, primary key)
      - `device_id` (uuid, references devices)
      - `collected_by` (uuid, references user_profiles, optional)
      - `weight_kg` (decimal, weight in kilograms)
      - `waste_type` (enum: general, recyclable, organic, hazardous)
      - `collection_date` (timestamp)
      - `notes` (text, optional)
      - `created_at` (timestamp)

    - `user_waste_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `month` (date, first day of month)
      - `total_waste_kg` (decimal)
      - `recycled_kg` (decimal)
      - `co2_saved_kg` (decimal)
      - `trees_saved` (decimal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add appropriate policies for data access
*/

-- Create enum for waste types
CREATE TYPE waste_type AS ENUM ('general', 'recyclable', 'organic', 'hazardous');

-- Create waste collections table
CREATE TABLE IF NOT EXISTS waste_collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid REFERENCES devices(id) ON DELETE CASCADE NOT NULL,
  collected_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  weight_kg decimal(8, 2) NOT NULL CHECK (weight_kg > 0),
  waste_type waste_type DEFAULT 'general',
  collection_date timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create user waste statistics table
CREATE TABLE IF NOT EXISTS user_waste_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  month date NOT NULL,
  total_waste_kg decimal(10, 2) DEFAULT 0,
  recycled_kg decimal(10, 2) DEFAULT 0,
  co2_saved_kg decimal(10, 2) DEFAULT 0,
  trees_saved decimal(8, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month)
);

-- Enable RLS
ALTER TABLE waste_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_waste_stats ENABLE ROW LEVEL SECURITY;

-- Policies for waste_collections
CREATE POLICY "Authenticated users can read waste collections"
  ON waste_collections
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage waste collections"
  ON waste_collections
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for user_waste_stats
CREATE POLICY "Users can read own waste stats"
  ON user_waste_stats
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can read all waste stats"
  ON user_waste_stats
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can update waste stats"
  ON user_waste_stats
  FOR ALL
  TO authenticated
  USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_user_waste_stats_updated_at
  BEFORE UPDATE ON user_waste_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate environmental impact
CREATE OR REPLACE FUNCTION calculate_environmental_impact(
  p_weight_kg decimal,
  p_waste_type waste_type
)
RETURNS TABLE(co2_saved_kg decimal, trees_saved decimal) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN p_waste_type = 'recyclable' THEN p_weight_kg * 2.5  -- 2.5kg CO2 saved per kg recycled
      WHEN p_waste_type = 'organic' THEN p_weight_kg * 0.8    -- 0.8kg CO2 saved per kg composted
      ELSE p_weight_kg * 0.1                                  -- 0.1kg CO2 saved per kg general waste
    END as co2_saved_kg,
    CASE 
      WHEN p_waste_type = 'recyclable' THEN p_weight_kg * 0.02 -- 0.02 trees saved per kg recycled
      WHEN p_waste_type = 'organic' THEN p_weight_kg * 0.01    -- 0.01 trees saved per kg composted
      ELSE p_weight_kg * 0.002                                 -- 0.002 trees saved per kg general waste
    END as trees_saved;
END;
$$ LANGUAGE plpgsql;

-- Function to update user waste statistics
CREATE OR REPLACE FUNCTION update_user_waste_stats()
RETURNS trigger AS $$
DECLARE
  impact_data RECORD;
  current_month date;
  v_user_id uuid;
BEGIN
  current_month := date_trunc('month', NEW.collection_date)::date;
  
  -- Attempt to find a user_id
  v_user_id := COALESCE(NEW.collected_by, (SELECT id FROM user_profiles WHERE role = 'admin' LIMIT 1));
  
  -- Only proceed if a user_id was found
  IF v_user_id IS NOT NULL THEN
    -- Calculate environmental impact
    SELECT * INTO impact_data 
    FROM calculate_environmental_impact(NEW.weight_kg, NEW.waste_type);
    
    -- Insert or update user waste stats
    INSERT INTO user_waste_stats (
      user_id, 
      month, 
      total_waste_kg, 
      recycled_kg, 
      co2_saved_kg, 
      trees_saved
    )
    VALUES (
      v_user_id,
      current_month,
      NEW.weight_kg,
      CASE WHEN NEW.waste_type = 'recyclable' THEN NEW.weight_kg ELSE 0 END,
      impact_data.co2_saved_kg,
      impact_data.trees_saved
    )
    ON CONFLICT (user_id, month)
    DO UPDATE SET
      total_waste_kg = user_waste_stats.total_waste_kg + NEW.weight_kg,
      recycled_kg = user_waste_stats.recycled_kg + 
        CASE WHEN NEW.waste_type = 'recyclable' THEN NEW.weight_kg ELSE 0 END,
      co2_saved_kg = user_waste_stats.co2_saved_kg + impact_data.co2_saved_kg,
      trees_saved = user_waste_stats.trees_saved + impact_data.trees_saved,
      updated_at = now();
  END IF;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for waste collection statistics
CREATE TRIGGER update_waste_stats_trigger
  AFTER INSERT ON waste_collections
  FOR EACH ROW EXECUTE FUNCTION update_user_waste_stats();

-- Insert sample waste collection data
INSERT INTO waste_collections (device_id, weight_kg, waste_type, collection_date) 
SELECT 
  d.id,
  (random() * 50 + 10)::decimal(8,2),
  (ARRAY['general', 'recyclable', 'organic', 'hazardous'])[floor(random() * 4 + 1)]::waste_type,
  now() - (random() * interval '30 days')
FROM devices d, generate_series(1, 5) s;