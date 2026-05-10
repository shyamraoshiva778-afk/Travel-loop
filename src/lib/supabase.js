import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create client only if both values exist
let supabase

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co') {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionRetry: {
        count: 3,
        interval: 1000
      }
    }
  })
  console.log('✅ Supabase client initialized')
} else {
  console.warn('⚠️ Missing Supabase environment variables!')
  console.warn('Please add these in Vercel:')
  console.warn('- VITE_SUPABASE_URL')
  console.warn('- VITE_SUPABASE_ANON_KEY')
}

// Export a safe client that won't crash even if not configured
export const safeSupabase = supabase || {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
    signOut: () => Promise.resolve({ error: null })
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) })
  })
}

export { supabase }