import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim() as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() as string | undefined

// Edge Function proxy URL — auth requests on iOS go here instead of Supabase Auth directly.
// The proxy adds apikey/Authorization headers server-side (Capacitor strips them client-side).
const AUTH_PROXY = url ? `${url}/functions/v1/auth-proxy` : undefined

// On iOS, Capacitor's patched window.fetch throws TypeError on every call.
// XHR works fine. Wrap XHR in a Promise<Response> compatible with Supabase's fetch interface.
function xhrFetch(reqUrl: string, init?: RequestInit): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(init?.method ?? 'GET', reqUrl)

    // Set Content-Type — may be dropped by Capacitor but worth trying
    try { xhr.setRequestHeader('Content-Type', 'application/json') } catch {}

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

  let reqUrl = typeof input === 'string' ? input
    : input instanceof URL ? input.href
    : (input as Request).url

  // Redirect auth requests through the Edge Function proxy so apikey header
  // is added server-side (Capacitor's XHR drops custom headers).
  if (AUTH_PROXY && reqUrl.includes('/auth/v1/')) {
    reqUrl = reqUrl.replace(`${url}/auth/v1`, AUTH_PROXY)
    console.log('[TK] proxy:', init?.method, reqUrl.substring(0, 80))
  } else {
    console.log('[TK] XHR:', init?.method, reqUrl.substring(0, 80))
  }

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
