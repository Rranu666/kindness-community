// Supabase configuration — set these in your .env file
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are read directly by the Supabase client
// in src/api/base44Client.js via import.meta.env

export const appParams = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};
