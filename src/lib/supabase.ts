import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim() as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() as string | undefined

export const supabase = (() => {
  if (!url || !key) {
    console.warn('[Trackora] Supabase env vars missing — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local')
    return null
  }
  try {
    return createClient(url, key)
  } catch (err) {
    console.error('[Trackora] Failed to initialise Supabase client:', err)
    return null
  }
})()
