import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim() as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() as string | undefined

// On iOS/Capacitor, new Headers(init.headers) throws TypeError in the patched
// environment. Use Object.entries() to iterate headers without that constructor.
async function nativeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (!(window as any).Capacitor) return fetch(input, init)

  const reqUrl = typeof input === 'string' ? input
    : input instanceof URL ? input.href
    : (input as Request).url

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(init?.method?.toUpperCase() ?? 'GET', reqUrl)

    if (init?.headers) {
      const h = init.headers
      try {
        // Avoid new Headers() constructor — it throws in Capacitor's patched env.
        // Use Object.entries() for plain objects, or the native forEach for Headers instances.
        if (typeof (h as any).forEach === 'function') {
          (h as Headers).forEach((v, k) => { try { xhr.setRequestHeader(k, v) } catch {} })
        } else {
          Object.entries(h as Record<string, string>).forEach(([k, v]) => {
            if (v != null) try { xhr.setRequestHeader(k, String(v)) } catch {}
          })
        }
      } catch {}
    }

    xhr.onload = () => {
      const responseHeaders: Record<string, string> = {}
      xhr.getAllResponseHeaders().trim().split('\r\n').forEach(line => {
        const i = line.indexOf(': ')
        if (i > 0) responseHeaders[line.substring(0, i).toLowerCase()] = line.substring(i + 2)
      })
      resolve(new Response(xhr.responseText, {
        status: xhr.status,
        statusText: xhr.statusText,
      }))
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
