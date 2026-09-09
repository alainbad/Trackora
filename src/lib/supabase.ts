import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim() as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() as string | undefined

async function nativeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (!(window as any).Capacitor) return fetch(input, init)

  const reqUrl = typeof input === 'string' ? input
    : input instanceof URL ? input.href
    : (input as Request).url

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(init?.method?.toUpperCase() ?? 'GET', reqUrl)

    const h = init?.headers
    console.log('[TK] headers type:', typeof h, h instanceof Headers ? 'Headers' : Array.isArray(h) ? 'array' : typeof h === 'object' ? 'object' : 'other')
    if (h) {
      const entries: [string, string][] = []
      if (h instanceof Headers) {
        h.forEach((v, k) => entries.push([k, v]))
      } else if (Array.isArray(h)) {
        (h as [string, string][]).forEach(pair => entries.push(pair))
      } else {
        Object.entries(h as Record<string, string>).forEach(([k, v]) => { if (v != null) entries.push([k, String(v)]) })
      }
      console.log('[TK] header keys:', entries.map(([k]) => k).join(','))
      entries.forEach(([k, v]) => {
        try {
          xhr.setRequestHeader(k, v)
          console.log('[TK] header set ok:', k)
        } catch (e) {
          console.error('[TK] header FAILED:', k, String(e))
        }
      })
    }

    xhr.onload = () => {
      console.log('[TK] onload status:', xhr.status, 'body:', xhr.responseText.substring(0, 80))
      resolve(new Response(xhr.responseText, { status: xhr.status, statusText: xhr.statusText }))
    }
    xhr.onerror = () => reject(new TypeError('Network request failed'))
    xhr.ontimeout = () => reject(new TypeError('Network request timed out'))
    try { xhr.send(typeof init?.body === 'string' ? init.body : null) } catch (e) { reject(e) }
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
