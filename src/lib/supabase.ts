import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'donation' | 'volunteer' | 'inquiry' | 'partnership' | 'helper' | 'needer';
  message: string | null;
  location: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type DonationRequest = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  amount: string;
  donation_method: string;
  allocation: string | null;
  privacy_agreed: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes: string | null;
  created_at: string;
};

export type VolunteerRequest = {
  id: string;
  full_name: string;
  age: string;
  email: string;
  phone: string;
  region: string;
  skills: string;
  availability: string;
  volunteer_type: string;
  notes: string;
  terms_agreed: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  admin_notes: string | null;
  created_at: string;
};
