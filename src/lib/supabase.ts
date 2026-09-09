import { createClient } from '@supabase/supabase-js'

// Trim to guard against stray whitespace/newlines pasted into env vars / CI secrets
const url = import.meta.env.VITE_SUPABASE_URL?.trim() as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() as string | undefined

// On iOS (Capacitor/WKWebView), cross-origin fetch is blocked by CORS policy.
// We route all Supabase HTTP calls through the native URLSession via the
// Capacitor bridge, which bypasses WKWebView's CORS restrictions.
async function nativeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const cap = (window as any).Capacitor
  const plugin = cap?.Plugins?.CapacitorHttp ?? cap?.Plugins?.Http
  if (!plugin?.request) return fetch(input, init)

  const reqUrl = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url
  const headers: Record<string, string> = {}
  if (init?.headers) {
    new Headers(init.headers).forEach((v, k) => { headers[k] = v })
  }

  let data: string | undefined = undefined
  if (init?.body && typeof init.body === 'string') {
    data = init.body
  }

  const res = await plugin.request({
    url: reqUrl,
    method: (init?.method ?? 'GET').toUpperCase(),
    headers,
    data,
  })

  const body = typeof res.data === 'string' ? res.data : JSON.stringify(res.data)
  return new Response(body, { status: res.status, headers: res.headers })
}

function makeClient() {
  if (!url || !key) {
    console.warn('[Trackora] Supabase env vars missing — auth features are disabled.\nAdd VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local')
    return null
  }
  try {
    // Always pass nativeFetch — it falls back to global fetch when Capacitor is absent
    return createClient(url, key, { global: { fetch: nativeFetch } })
  } catch (err) {
    // A malformed URL/key must never white-screen the whole app
    console.error('[Trackora] Failed to initialise Supabase client — check VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY values:', err)
    return null
  }
}

// null when env vars are absent/invalid so the rest of the app degrades gracefully
export const supabase = makeClient()
