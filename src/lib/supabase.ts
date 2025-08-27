import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are not configured
const isHttpsUrl = typeof supabaseUrl === 'string' && supabaseUrl.startsWith('https://');
const isLocalHttpUrl = typeof supabaseUrl === 'string' && /^(http:\/\/localhost|http:\/\/127\.0\.0\.1)/.test(supabaseUrl);

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseAnonKey.includes('your-anon-key') &&
  (
    isHttpsUrl ||
    // Allow local http only in development
    (import.meta?.env?.DEV && isLocalHttpUrl)
  )
);

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    })
  : null;

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => isConfigured;