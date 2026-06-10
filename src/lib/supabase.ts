import { createClient } from '@supabase/supabase-js'

// Trim to guard against stray whitespace/newlines pasted into env vars / CI secrets
const url = import.meta.env.VITE_SUPABASE_URL?.trim() as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() as string | undefined

function makeClient() {
  if (!url || !key) {
    console.warn('[Trackora] Supabase env vars missing — auth features are disabled.\nAdd VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local')
    return null
  }
  try {
    return createClient(url, key)
  } catch (err) {
    // A malformed URL/key must never white-screen the whole app
    console.error('[Trackora] Failed to initialise Supabase client — check VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY values:', err)
    return null
  }
}

// null when env vars are absent/invalid so the rest of the app degrades gracefully
export const supabase = makeClient()
