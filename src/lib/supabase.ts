import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim() as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() as string | undefined

async function nativeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const cap = (window as any).Capacitor
  const plugin = cap?.Plugins?.CapacitorHttp ?? cap?.Plugins?.Http
  console.log('[TK] cap:', !!cap, 'plugin:', !!plugin, 'request:', typeof plugin?.request)

  if (!plugin?.request) {
    console.log('[TK] falling back to fetch')
    return fetch(input, init)
  }

  const reqUrl = typeof input === 'string' ? input
    : input instanceof URL ? input.href
    : (input as Request).url

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
  // Ensure apikey is always present using the module-level key
  if (key && !headers['apikey']) headers['apikey'] = key
  if (key && !headers['Authorization']) headers['Authorization'] = `Bearer ${key}`

  // Capacitor CapacitorHttp drops non-standard headers (like apikey) in URLSession.
  // Supabase accepts apikey as a query parameter as a fallback.
  let finalUrl = reqUrl
  if (key && url && reqUrl.startsWith(url)) {
    const sep = reqUrl.includes('?') ? '&' : '?'
    finalUrl = `${reqUrl}${sep}apikey=${encodeURIComponent(key)}`
  }
  console.log('[TK] finalUrl includes apikey param:', finalUrl.includes('apikey='))

  try {
    const res = await plugin.request({
      url: finalUrl,
      method: (init?.method ?? 'GET').toUpperCase(),
      headers,
      data: typeof init?.body === 'string' ? init.body : undefined,
    })
    console.log('[TK] plugin.request status:', res?.status)
    const body = typeof res.data === 'string' ? res.data : JSON.stringify(res.data)
    return new Response(body, { status: res.status, headers: res.headers ?? {} })
  } catch (e) {
    console.error('[TK] plugin.request threw:', e)
    throw e
  }
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
