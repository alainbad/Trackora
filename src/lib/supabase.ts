import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim() as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() as string | undefined

function parseXHRHeaders(raw: string): Headers {
  const h = new Headers()
  raw.trim().split('\r\n').forEach(line => {
    const i = line.indexOf(': ')
    if (i > 0) h.append(line.substring(0, i), line.substring(i + 2))
  })
  return h
}

async function nativeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (!(window as any).Capacitor) return fetch(input, init)

  return new Promise((resolve, reject) => {
    try {
      const reqUrl = typeof input === 'string' ? input
        : input instanceof URL ? input.href
        : (input as Request).url

      console.log('[TK] XHR start:', init?.method, reqUrl.substring(0, 60))
      const xhr = new XMLHttpRequest()
      console.log('[TK] XHR created')

      xhr.open(init?.method?.toUpperCase() ?? 'GET', reqUrl)
      console.log('[TK] XHR opened')

      if (init?.headers) {
        new Headers(init.headers).forEach((v, k) => {
          console.log('[TK] header:', k)
          xhr.setRequestHeader(k, v)
        })
      }
      console.log('[TK] headers set')

      xhr.onload = () => {
        console.log('[TK] onload status:', xhr.status)
        try {
          resolve(new Response(xhr.responseText, {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: parseXHRHeaders(xhr.getAllResponseHeaders()),
          }))
        } catch (e) {
          console.error('[TK] Response build error:', e)
          reject(e)
        }
      }

      xhr.onerror = (e) => { console.error('[TK] onerror', e); reject(new TypeError('Network request failed')) }
      xhr.ontimeout = () => reject(new TypeError('Network request timed out'))

      console.log('[TK] sending body type:', typeof init?.body)
      xhr.send(typeof init?.body === 'string' ? init.body : null)
      console.log('[TK] sent')
    } catch (e) {
      console.error('[TK] caught synchronous error:', e)
      fetch(input, init).then(resolve, reject)
    }
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
