// Supabase Edge Function — Gumroad webhook handler
// Listens for sale, refund, subscription_cancelled, subscription_ended events
// and updates plan_tier in the profiles table accordingly.
//
// Deploy:  supabase functions deploy gumroad-webhook
// Env var: WEBHOOK_SECRET  (set in Supabase Dashboard → Edge Functions → Secrets)
//          SUPABASE_URL    (auto-injected)
//          SUPABASE_SERVICE_ROLE_KEY (auto-injected)
//
// Gumroad setup: Dashboard → Settings → Advanced → Webhooks
//   URL: https://<project-ref>.supabase.co/functions/v1/gumroad-webhook?secret=<WEBHOOK_SECRET>
//   Events: sale, refund, subscription_cancelled, subscription_ended

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Map Gumroad product permalinks → plan tiers
const PRODUCT_PLAN: Record<string, 'pro' | 'business'> = {
  impejho: 'pro',      // Pro plan  — $9.99/month
  rconap:  'business', // Business plan — $29.99/month
}

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    // Verify secret token in query string
    const url = new URL(req.url)
    const secret = url.searchParams.get('secret')
    const expectedSecret = Deno.env.get('WEBHOOK_SECRET')
    if (!expectedSecret || secret !== expectedSecret) {
      console.error('Invalid webhook secret')
      return new Response('Unauthorized', { status: 401 })
    }

    // Gumroad sends application/x-www-form-urlencoded
    const contentType = req.headers.get('content-type') ?? ''
    let params: URLSearchParams

    if (contentType.includes('application/json')) {
      const json = await req.json()
      params = new URLSearchParams(Object.entries(json).map(([k, v]) => [k, String(v)]))
    } else {
      const text = await req.text()
      params = new URLSearchParams(text)
    }

    const eventType     = params.get('resource_name') // 'sale' | 'refund' | 'subscription_cancelled' | 'subscription_ended'
    const buyerEmail    = params.get('email')?.toLowerCase().trim()
    const permalink     = params.get('permalink') ?? params.get('short_product_id') ?? ''
    const refunded      = params.get('refunded') === 'true'

    console.log(`Gumroad event: ${eventType} | email: ${buyerEmail} | permalink: ${permalink} | refunded: ${refunded}`)

    if (!buyerEmail) {
      return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400, headers: CORS })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Determine the new plan tier
    let newTier: 'free' | 'pro' | 'business' | null = null

    if (eventType === 'sale' && !refunded) {
      newTier = PRODUCT_PLAN[permalink] ?? null
    } else if (
      eventType === 'refund' ||
      eventType === 'subscription_cancelled' ||
      eventType === 'subscription_ended' ||
      (eventType === 'sale' && refunded)
    ) {
      newTier = 'free'
    }

    if (!newTier) {
      console.log(`No action for event: ${eventType}, permalink: ${permalink}`)
      return new Response(JSON.stringify({ ok: true, action: 'ignored' }), { headers: CORS })
    }

    // Look up the user by email in auth.users
    const { data: users, error: listErr } = await supabase.auth.admin.listUsers()
    if (listErr) throw listErr

    const user = users.users.find(u => u.email?.toLowerCase() === buyerEmail)

    if (!user) {
      // User hasn't signed up yet — store the pending upgrade so it applies on first login
      console.log(`No Supabase user found for ${buyerEmail} — storing pending upgrade`)
      const { error: pendingErr } = await supabase
        .from('pending_plan_upgrades')
        .upsert({ email: buyerEmail, plan_tier: newTier, updated_at: new Date().toISOString() })
      if (pendingErr) console.error('pending_plan_upgrades error:', pendingErr)
      return new Response(JSON.stringify({ ok: true, action: 'pending', email: buyerEmail, tier: newTier }), { headers: CORS })
    }

    // Update plan_tier in profiles
    const { error: updateErr } = await supabase
      .from('profiles')
      .upsert({
        id:         user.id,
        plan_tier:  newTier,
        updated_at: new Date().toISOString(),
      })

    if (updateErr) throw updateErr

    console.log(`Updated ${buyerEmail} (${user.id}) → plan_tier: ${newTier}`)
    return new Response(
      JSON.stringify({ ok: true, action: 'updated', email: buyerEmail, userId: user.id, tier: newTier }),
      { headers: CORS }
    )

  } catch (err) {
    console.error('gumroad-webhook error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: CORS })
  }
})
