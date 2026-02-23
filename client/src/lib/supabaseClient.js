import { createClient } from '@supabase/supabase-js';

// Supabase client for the SkillSwap frontend.
// Configure these in client/.env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase URL or anon key is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client/.env'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

