import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim() as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() as string | undefined

async function nativeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const cap = (window as any).Capacitor
  const isNative = !!(cap?.isNativePlatform?.() ?? cap?.isNative)

  if (!isNative) {
    return fetch(input, init)
  }

  const reqUrl = typeof input === 'string' ? input
    : input instanceof URL ? input.href
    : (input as Request).url
  console.log('[TK] url:', reqUrl.substring(0, 70))

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
  if (key && !headers['apikey']) headers['apikey'] = key
  if (key && !headers['Authorization']) headers['Authorization'] = `Bearer ${key}`

  // Also extract body from a Request object if input is a Request
  const body = init?.body ?? (input instanceof Request ? undefined : undefined)
  console.log('[TK] method:', init?.method, 'input type:', typeof input, 'is Request:', input instanceof Request)

  // Always pass a plain URL string to avoid "Type error" from passing a
  // Request object (with a consumed body) alongside init.body to fetch().
  return fetch(reqUrl, {
    method: init?.method ?? (input instanceof Request ? (input as Request).method : 'GET'),
    headers,
    body: init?.body as BodyInit | undefined,
  }).catch((e: unknown) => {
    console.error('[TK] fetch error:', (e as Error)?.name, (e as Error)?.message)
    throw e
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
