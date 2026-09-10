// Supabase Edge Function — iOS auth proxy
// Forwards auth requests from Capacitor iOS (which cannot set custom headers)
// to Supabase Auth, adding the apikey header server-side where nothing strips it.
//
// Deploy: supabase functions deploy auth-proxy --no-verify-jwt
// JWT verification must be OFF — unauthenticated clients call this.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }

  // Path after /functions/v1/auth-proxy → forward to Supabase Auth
  // e.g. /functions/v1/auth-proxy/token?grant_type=password
  //   →  SUPABASE_URL/auth/v1/token?grant_type=password
  const url = new URL(req.url)
  const subpath = url.pathname.replace(/^\/functions\/v1\/auth-proxy/, '') || '/'
  const targetUrl = `${SUPABASE_URL}/auth/v1${subpath}${url.search}`

  const body = req.method !== 'GET' ? await req.arrayBuffer() : undefined

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: body ?? null,
  })

  const responseBody = await upstream.text()

  return new Response(responseBody, {
    status: upstream.status,
    headers: {
      ...CORS,
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
    },
  })
})
