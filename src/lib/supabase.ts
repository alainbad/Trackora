import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim() as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() as string | undefined

// On iOS, Capacitor's patched window.fetch throws TypeError on every call.
// XHR works fine (Bing analytics proves it). Use XHR with the apikey baked
// into the URL query param since Capacitor's XHR also drops custom headers.
function xhrFetch(reqUrl: string, init?: RequestInit): Promise<Response> {
  return new Promise((resolve, reject) => {
    const sep = reqUrl.includes('?') ? '&' : '?'
    const fullUrl = key ? `${reqUrl}${sep}apikey=${encodeURIComponent(key)}` : reqUrl

    const xhr = new XMLHttpRequest()
    xhr.open(init?.method ?? 'GET', fullUrl)

    // Attempt to set these even if Capacitor drops them
    try { xhr.setRequestHeader('Content-Type', 'application/json') } catch {}
    try { xhr.setRequestHeader('Authorization', `Bearer ${key}`) } catch {}

    xhr.onload = () => resolve(new Response(xhr.responseText, { status: xhr.status }))
    xhr.onerror = () => reject(new TypeError('XHR network error'))
    xhr.ontimeout = () => reject(new TypeError('XHR timeout'))

    xhr.send(typeof init?.body === 'string' ? init.body : null)
  })
}

async function nativeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const cap = (window as any).Capacitor
  const isNative = !!(cap?.isNativePlatform?.() ?? cap?.isNative)

  if (!isNative) {
    return fetch(input, init)
  }

  const reqUrl = typeof input === 'string' ? input
    : input instanceof URL ? input.href
    : (input as Request).url

  console.log('[TK] XHR:', init?.method, reqUrl.substring(0, 60))
  return xhrFetch(reqUrl, init)
}

export const supabase = (() => {
  if (!url || !key) {
    console.warn('[Trackora] Supabase env vars missing — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local')
    return null
  }
  try {
    return createClient(url, key, { global: { fetch: nativeFetch } })
  } catch (err) {
    console.error('[Trackora] Failed to initialise Supabase client:', err)
    return null
  }
})()
