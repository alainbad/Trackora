import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim() as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() as string | undefined

async function nativeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const cap = (window as any).Capacitor
  const isNative = !!(cap?.isNativePlatform?.() ?? cap?.isNative)

  if (!isNative) {
    return fetch(input, init)
  }

  // Pre-convert headers to a plain object.
  // Capacitor's patched fetch (and Supabase JS internals) throw TypeError
  // when they call `new Headers(existingHeaders)` in WKWebView — converting
  // to a plain object first avoids the constructor call entirely.
  const headers: Record<string, string> = {}
  if (init?.headers) {
    const h = init.headers
    if (typeof (h as any).forEach === 'function') {
      try { (h as Headers).forEach((v, k) => { headers[k] = v }) } catch {}
    } else {
      Object.entries(h as Record<string, string>).forEach(([k, v]) => {
        if (v != null) headers[k] = String(v)
      })
    }
  }
  // Belt-and-suspenders: ensure auth headers are always present
  if (key && !headers['apikey']) headers['apikey'] = key
  if (key && !headers['Authorization']) headers['Authorization'] = `Bearer ${key}`

  console.log('[TK] isNative:', isNative, 'method:', init?.method, 'bodyType:', typeof init?.body)

  // Pass only the options Capacitor's native HTTP bridge supports.
  // Spreading the full `init` causes TypeError because Capacitor's patched
  // fetch doesn't handle AbortSignal, mode, credentials, or other options.
  return fetch(input, {
    method: init?.method ?? 'GET',
    headers,
    body: init?.body as BodyInit | undefined,
  })
}

function makeClient() {
  if (!url || !key) {
    console.warn('[Trackora] Supabase env vars missing — auth features are disabled.\nAdd VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local')
    return null
  }
  try {
    return createClient(url, key, { global: { fetch: nativeFetch } })
  } catch (err) {
    console.error('[Trackora] Failed to initialise Supabase client — check VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY values:', err)
    return null
  }
}

export const supabase = makeClient()
