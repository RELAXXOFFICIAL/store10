import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Ensure environment variables are defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please click "Connect to Supabase" to configure your project.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);