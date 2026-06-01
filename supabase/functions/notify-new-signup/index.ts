// Supabase Edge Function — notify owner when a new user signs up
// Triggered by a Database Webhook on auth.users INSERT
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const OWNER_EMAIL    = 'badranalain87@gmail.com'
const FROM_EMAIL     = 'no-reply@track-ora.com'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const payload = await req.json()

    const record = payload.record ?? payload
    const email  = record.email ?? record.new?.email ?? 'Unknown'
    const userId = record.id    ?? record.new?.id    ?? 'Unknown'
    const signedUpAt = record.created_at ?? new Date().toISOString()

    const formattedDate = new Date(signedUpAt).toLocaleString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
    }) + ' UTC'

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Inter,system-ui,sans-serif;background:#0a0f1e;margin:0;padding:32px;">
  <div style="max-width:520px;margin:0 auto;background:#111827;border:1px solid rgba(99,102,241,0.3);border-radius:16px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:24px 32px;">
      <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">⚡ Trackora</div>
      <div style="font-size:14px;color:rgba(255,255,255,0.7);margin-top:4px;">New user signed up</div>
    </div>
    <div style="padding:32px;">
      <p style="color:#e2e8f0;font-size:15px;margin:0 0 24px;">A new user just created a Trackora account:</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;color:rgba(226,232,240,0.5);font-size:13px;width:120px;">Email</td>
          <td style="padding:10px 0;color:#818cf8;font-size:14px;font-weight:600;">${email}</td>
        </tr>
        <tr style="border-top:1px solid rgba(255,255,255,0.06);">
          <td style="padding:10px 0;color:rgba(226,232,240,0.5);font-size:13px;">User ID</td>
          <td style="padding:10px 0;color:#e2e8f0;font-size:13px;font-family:monospace;">${userId}</td>
        </tr>
        <tr style="border-top:1px solid rgba(255,255,255,0.06);">
          <td style="padding:10px 0;color:rgba(226,232,240,0.5);font-size:13px;">Signed up</td>
          <td style="padding:10px 0;color:#e2e8f0;font-size:13px;">${formattedDate}</td>
        </tr>
      </table>
      <div style="margin-top:28px;">
        <a href="https://supabase.com/dashboard/project/uosefhniaxtyjaweuqbo/auth/users"
           style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;font-size:14px;font-weight:600;border-radius:10px;text-decoration:none;">
          View in Supabase →
        </a>
      </div>
    </div>
    <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.06);color:rgba(226,232,240,0.3);font-size:12px;">
      Trackora · track-ora.com
    </div>
  </div>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    `Trackora <${FROM_EMAIL}>`,
        to:      [OWNER_EMAIL],
        subject: `🆕 New signup: ${email}`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ error: err }), { status: 500, headers: CORS })
    }

    console.log(`Signup notification sent for ${email}`)
    return new Response(JSON.stringify({ ok: true }), { headers: CORS })

  } catch (err) {
    console.error('notify-new-signup error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: CORS })
  }
})
