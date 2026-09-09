import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim() as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() as string | undefined

async function nativeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (!(window as any).Capacitor) return fetch(input, init)

  const reqUrl = typeof input === 'string' ? input
    : input instanceof URL ? input.href
    : (input as Request).url

  // Build header map
  const headers: Record<string, string> = {}
  if (init?.headers) {
    try {
      new Headers(init.headers).forEach((v, k) => { headers[k] = v })
      console.log('[TK] headers built:', Object.keys(headers).join(','))
    } catch (e) {
      console.error('[TK] headers build failed:', e)
    }
  }

  // Try XHR without setting any headers — just open + send
  console.log('[TK] Trying XHR no-headers to:', reqUrl.substring(0, 50))
  const result = await new Promise<Response>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    try { xhr.open(init?.method?.toUpperCase() ?? 'GET', reqUrl) } catch (e) { console.error('[TK] open failed:', e); reject(e); return }
    console.log('[TK] opened ok')

    xhr.onload = () => {
      console.log('[TK] onload status:', xhr.status)
      resolve(new Response(xhr.responseText, { status: xhr.status }))
    }
    xhr.onerror = (e) => { console.error('[TK] onerror:', e); reject(new TypeError('Network request failed')) }
    xhr.ontimeout = () => reject(new TypeError('Network request timed out'))

    try { xhr.send(typeof init?.body === 'string' ? init.body : null) } catch (e) { console.error('[TK] send failed:', e); reject(e) }
    console.log('[TK] send ok')
  })

  console.log('[TK] XHR result status:', result.status)
  return result
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
