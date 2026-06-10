// Supabase Edge Function — email status-change notifications
// Called by GitHub Actions cron (every hour).
// For every shipment with email_notify=true whose status has changed
// since the last notification, sends an email via Resend and updates
// last_notified_status.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY       = Deno.env.get('RESEND_API_KEY')!
const TRACK_FN_URL         = `${SUPABASE_URL}/functions/v1/track-shipment`

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── Human-readable status labels ─────────────────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
  picked_up:        'Picked Up',
  in_transit:       'In Transit',
  out_for_delivery: 'Out for Delivery',
  customs:          'In Customs',
  delayed:          'Delayed',
  delivered:        'Delivered',
}

function statusLabel(s: string) { return STATUS_LABEL[s] ?? s.replace(/_/g, ' ') }

// ── Status badge colours (hex, for inline email CSS) ─────────────────────────
const STATUS_COLOR: Record<string, { bg: string; fg: string }> = {
  delivered:        { bg: '#0d3321', fg: '#34d399' },
  out_for_delivery: { bg: '#0d3321', fg: '#34d399' },
  in_transit:       { bg: '#1a1f4e', fg: '#818cf8' },
  picked_up:        { bg: '#0a2540', fg: '#38bdf8' },
  customs:          { bg: '#2d1f0a', fg: '#f59e0b' },
  delayed:          { bg: '#2d0a0a', fg: '#f87171' },
}

function statusColors(s: string) {
  return STATUS_COLOR[s] ?? { bg: '#1a1f4e', fg: '#818cf8' }
}

// ── Email HTML template ────────────────────────────────────────────────────────
function buildEmail(opts: {
  trackingNumber: string
  carrier:        string
  oldStatus:      string
  newStatus:      string
  origin:         string
  destination:    string
  eta:            string
}): string {
  const { trackingNumber, carrier, oldStatus, newStatus, origin, destination, eta } = opts
  const { bg, fg } = statusColors(newStatus)
  const trackUrl   = `https://www.track-ora.com/track/${encodeURIComponent(trackingNumber)}`

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Shipment Update</title></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;min-height:100vh;">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="padding-bottom:28px;text-align:center;">
          <span style="font-size:22px;font-weight:800;letter-spacing:-0.5px;">
            <span style="color:#f8fafc;">Track</span><span style="color:#6366f1;">ora</span>
          </span>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:32px;">

          <!-- Icon + headline -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td width="48" valign="top" style="padding-right:16px;">
                <div style="width:48px;height:48px;border-radius:14px;background:rgba(99,102,241,0.15);text-align:center;line-height:48px;font-size:22px;">📦</div>
              </td>
              <td valign="middle">
                <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(248,250,252,0.4);">Shipment Status Update</p>
                <h1 style="margin:0;font-size:20px;font-weight:800;color:#f8fafc;letter-spacing:-0.3px;">Your shipment moved</h1>
              </td>
            </tr>
          </table>

          <!-- Status pill -->
          <div style="text-align:center;margin-bottom:28px;">
            <span style="display:inline-block;padding:8px 24px;border-radius:100px;background:${bg};color:${fg};font-size:15px;font-weight:700;letter-spacing:0.3px;">
              ${statusLabel(newStatus)}
            </span>
          </div>

          <!-- Tracking number + carrier row -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;margin-bottom:20px;">
            <tr>
              <td style="padding:14px 18px;border-right:1px solid rgba(255,255,255,0.07);" width="50%">
                <p style="margin:0 0 3px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:rgba(248,250,252,0.35);">Tracking #</p>
                <p style="margin:0;font-size:13px;font-weight:700;color:#f8fafc;font-family:monospace;">${trackingNumber}</p>
              </td>
              <td style="padding:14px 18px;" width="50%">
                <p style="margin:0 0 3px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:rgba(248,250,252,0.35);">Carrier</p>
                <p style="margin:0;font-size:13px;font-weight:700;color:#f8fafc;">${carrier}</p>
              </td>
            </tr>
          </table>

          <!-- Route row -->
          ${(origin || destination) ? `
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            <tr>
              <td style="text-align:center;">
                <p style="margin:0;font-size:13px;color:rgba(248,250,252,0.5);">
                  <strong style="color:#f8fafc;">${origin || '—'}</strong>
                  <span style="margin:0 8px;color:rgba(248,250,252,0.3);">→</span>
                  <strong style="color:#f8fafc;">${destination || '—'}</strong>
                </p>
              </td>
            </tr>
          </table>` : ''}

          <!-- Previous status -->
          <p style="margin:0 0 20px;text-align:center;font-size:12px;color:rgba(248,250,252,0.35);">
            Previous status: <span style="color:rgba(248,250,252,0.55);">${statusLabel(oldStatus)}</span>
          </p>

          ${eta && eta !== 'TBD' ? `
          <!-- ETA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:12px;margin-bottom:24px;">
            <tr><td style="padding:12px 18px;text-align:center;">
              <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:rgba(248,250,252,0.4);">Estimated Delivery</p>
              <p style="margin:4px 0 0;font-size:17px;font-weight:800;color:#818cf8;">${eta}</p>
            </td></tr>
          </table>` : ''}

          <!-- CTA button -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${trackUrl}" style="display:inline-block;padding:13px 32px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:white;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.2px;">
                View Full Tracking →
              </a>
            </td></tr>
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:28px;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;color:rgba(248,250,252,0.25);">
            You're receiving this because you enabled alerts for this shipment.
          </p>
          <p style="margin:0;font-size:12px;color:rgba(248,250,252,0.25);">
            To stop notifications, visit the tracking page and turn off Alerts.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── Main handler ─────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // 1a. Fetch ALL shipments stale for >2 hours — re-track + update status silently
    //     (no email unless email_notify = true)
    const staleThreshold = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    const { data: staleRows } = await supabase
      .from('shipments')
      .select('user_id, tracking_number, status, updated_at')
      .eq('email_notify', false)
      .lt('updated_at', staleThreshold)
      .not('status', 'eq', 'delivered')   // skip already-delivered — they won't change
      .limit(30)                           // cap to avoid rate limits

    if (staleRows && staleRows.length > 0) {
      for (const stale of staleRows) {
        try {
          const r = await fetch(TRACK_FN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_SERVICE_KEY },
            body: JSON.stringify({ trackingNumber: stale.tracking_number }),
          })
          if (r.ok) {
            const { data } = await r.json() as { data?: Record<string, unknown> }
            if (data?.status) {
              const o = data.origin      as Record<string, string> | undefined
              const d = data.destination as Record<string, string> | undefined
              await supabase.from('shipments').update({
                status:       data.status as string,
                est_delivery: (data.estimatedDelivery as string) ?? null,
                origin_city:  o?.city ?? null,
                dest_city:    d?.city ?? null,
                updated_at:   new Date().toISOString(),
              }).eq('user_id', stale.user_id).eq('tracking_number', stale.tracking_number)
            }
          }
        } catch { /* skip on error */ }
      }
    }

    // 1b. Fetch all shipments with email_notify = true for email alerts
    const { data: rows, error: fetchErr } = await supabase
      .from('shipments')
      .select('user_id, tracking_number, carrier_name, status, last_notified_status, origin_city, dest_city, est_delivery')
      .eq('email_notify', true)

    if (fetchErr) throw fetchErr

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ message: 'No email-subscribed shipments.', checked: 0, stale_synced: staleRows?.length ?? 0 }), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    const results: { tn: string; action: string; reason?: string }[] = []

    for (const row of rows) {
      const { tracking_number: tn, carrier_name: carrier, user_id } = row

      // 2. Re-track to get a fresh status
      let freshStatus: string | null = null
      let freshEta = row.est_delivery ?? 'TBD'
      let freshOrigin = row.origin_city ?? ''
      let freshDest   = row.dest_city   ?? ''

      try {
        const trackResp = await fetch(TRACK_FN_URL, {
          method:  'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey':        SUPABASE_SERVICE_KEY,
          },
          body: JSON.stringify({ trackingNumber: tn }),
        })
        if (trackResp.ok) {
          const { data } = await trackResp.json() as { data?: Record<string, unknown> }
          if (data?.status)        freshStatus = data.status as string
          if (data?.estimatedDelivery) freshEta = data.estimatedDelivery as string
          const o = data?.origin      as Record<string, string> | undefined
          const d = data?.destination as Record<string, string> | undefined
          if (o?.city) freshOrigin = o.city
          if (d?.city) freshDest   = d.city
        }
      } catch {
        // Use stored status as fallback
      }

      const currentStatus  = freshStatus ?? row.status
      const previousNotify = row.last_notified_status ?? null

      // 3. Skip if status hasn't changed since last notification
      if (previousNotify === currentStatus) {
        results.push({ tn, action: 'skipped', reason: 'no change' })
        continue
      }

      // 4. Look up user email via admin API
      const { data: { user }, error: userErr } = await supabase.auth.admin.getUserById(user_id)
      if (userErr || !user?.email) {
        results.push({ tn, action: 'skipped', reason: 'no user email' })
        continue
      }

      // 5. Send email via Resend
      const emailResp = await fetch('https://api.resend.com/emails', {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          from:    'Trackora <no-reply@track-ora.com>',
          to:      [user.email],
          subject: `${statusLabel(currentStatus)} — ${tn}`,
          html:    buildEmail({
            trackingNumber: tn,
            carrier:        carrier ?? 'Unknown',
            oldStatus:      previousNotify ?? row.status,
            newStatus:      currentStatus,
            origin:         freshOrigin,
            destination:    freshDest,
            eta:            freshEta,
          }),
        }),
      })

      if (!emailResp.ok) {
        const body = await emailResp.text()
        results.push({ tn, action: 'email_failed', reason: body })
        continue
      }

      // 6. Update last_notified_status (and fresh status/ETA) in DB
      await supabase
        .from('shipments')
        .update({
          last_notified_status: currentStatus,
          status:               currentStatus,
          est_delivery:         freshEta,
          origin_city:          freshOrigin || row.origin_city,
          dest_city:            freshDest   || row.dest_city,
          updated_at:           new Date().toISOString(),
        })
        .eq('user_id',         user_id)
        .eq('tracking_number', tn)

      results.push({ tn, action: 'notified' })
    }

    const notified = results.filter(r => r.action === 'notified').length
    return new Response(
      JSON.stringify({ checked: rows.length, notified, stale_synced: staleRows?.length ?? 0, results }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return new Response(JSON.stringify({ error: msg }), {
      status:  500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
