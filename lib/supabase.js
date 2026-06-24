import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ejklgkprvflarhsdpzjb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqa2xna3BydmZsYXJoc2RwempiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMzg0NTcsImV4cCI6MjA5NzgxNDQ1N30.sRHWQRT2qpc4gCmO8a_8hDos5AbItZS8s30Htd6zwx4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
