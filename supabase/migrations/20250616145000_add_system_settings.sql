-- Create the system_settings table to hold configuration for the Node.js bridge
CREATE TABLE IF NOT EXISTS public.system_settings (
  id BIGINT PRIMARY KEY DEFAULT 1, -- Using a fixed ID to ensure only one row of settings
  com_port TEXT NOT NULL DEFAULT 'COM5', -- The COM port for the HC-05 module
  target_device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL, -- The device to update
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT single_row_check CHECK (id = 1)
);

-- Enable Row Level Security
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow admins to read and write settings.
CREATE POLICY "Allow admins full access" ON public.system_settings
FOR ALL
TO authenticated
USING (
  (SELECT role FROM public.user_profiles WHERE user_id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM public.user_profiles WHERE user_id = auth.uid()) = 'admin'
);

-- Insert the default settings row if it doesn't exist.
INSERT INTO public.system_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Trigger function to automatically update the timestamp on any change.
CREATE OR REPLACE FUNCTION public.handle_system_settings_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function on update.
CREATE TRIGGER on_system_settings_update
BEFORE UPDATE ON public.system_settings
FOR EACH ROW
EXECUTE PROCEDURE public.handle_system_settings_update();
