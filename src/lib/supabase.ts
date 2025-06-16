import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: string;
  device_id: string;
  name: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: 'online' | 'offline' | 'maintenance';
  battery_level: number;
  fill_level: number;
  last_emptied: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  device_id?: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  device?: Device;
}

export interface WasteCollection {
  id: string;
  device_id: string;
  collected_by?: string;
  weight_kg: number;
  waste_type: 'general' | 'recyclable' | 'organic' | 'hazardous';
  collection_date: string;
  notes?: string;
  created_at: string;
  device?: Device;
  collector?: UserProfile;
}

export interface UserWasteStats {
  id: string;
  user_id: string;
  month: string;
  total_waste_kg: number;
  recycled_kg: number;
  co2_saved_kg: number;
  trees_saved: number;
  created_at: string;
  updated_at: string;
}