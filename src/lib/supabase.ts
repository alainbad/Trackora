import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim() as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() as string | undefined

// On iOS/Capacitor, cross-origin fetch is blocked by WKWebView CORS policy.
// Route all Supabase calls through CapacitorHttp.request() — the direct native
// plugin call that uses URLSession and forwards all custom headers correctly.
// Avoid new Headers() constructor — it throws in Capacitor's patched environment.
async function nativeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const cap = (window as any).Capacitor
  const plugin = cap?.Plugins?.CapacitorHttp ?? cap?.Plugins?.Http
  if (!plugin?.request) return fetch(input, init)

  const reqUrl = typeof input === 'string' ? input
    : input instanceof URL ? input.href
    : (input as Request).url

  // Build headers as plain object WITHOUT new Headers() (throws in Capacitor env)
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

  const res = await plugin.request({
    url: reqUrl,
    method: (init?.method ?? 'GET').toUpperCase(),
    headers,
    data: typeof init?.body === 'string' ? init.body : undefined,
  })

  const body = typeof res.data === 'string' ? res.data : JSON.stringify(res.data)
  return new Response(body, { status: res.status, headers: res.headers ?? {} })
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
