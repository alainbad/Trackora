import { useSEO } from '../hooks/useSEO'
import { FileText, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DocumentGenerator() {
  useSEO({
    title: 'Document Generator — Commercial Invoice, Packing List & More | Trackora',
    description: 'Generate commercial invoices, packing lists, and shipping instructions instantly. Pro feature — upgrade to Trackora Pro to access.',
    canonical: 'https://www.track-ora.com/document-generator',
  })

  return (
    <div style={{ background: '#0a0f1e', color: '#f8fafc', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{
        padding: '100px 24px 72px',
        background: 'linear-gradient(180deg, rgba(34,211,238,0.06) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-block', marginBottom: '20px',
            padding: '6px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
            letterSpacing: '1.2px', textTransform: 'uppercase',
            background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee',
          }}>
            Pro Feature
          </span>

          <h1 style={{ fontSize: 'clamp(26px, 5vw, 44px)', fontWeight: 800, lineHeight: 1.15, marginBottom: '18px' }}>
            Logistics Document Generator
          </h1>

          <p style={{ fontSize: '18px', color: 'rgba(248,250,252,0.6)', lineHeight: 1.7, marginBottom: '40px' }}>
            Generate professional commercial invoices, packing lists, and shipping instructions in seconds — ready to send to your forwarder or customs broker.
          </p>
        </div>
      </section>

      {/* Pro gate */}
      <section style={{ padding: '64px 24px 80px', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          padding: '48px 40px', borderRadius: '20px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(34,211,238,0.15)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Lock size={28} color="#22d3ee" />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc' }}>
            Upgrade to Pro to Unlock
          </h2>

          <p style={{ fontSize: '15px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.7, maxWidth: '460px' }}>
            The Document Generator is available on the Trackora Pro plan. Generate unlimited commercial invoices, packing lists, and shipping instructions with your company branding.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', margin: '4px 0' }}>
            {[
              'Commercial Invoice',
              'Packing List',
              'Shipping Instructions',
              'Certificate of Origin',
              'Bill of Lading Draft',
            ].map(doc => (
              <span key={doc} style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '7px 14px', borderRadius: '999px', fontSize: '13px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(248,250,252,0.7)',
              }}>
                <FileText size={13} color="#22d3ee" />
                {doc}
              </span>
            ))}
          </div>

          <Link to="/plans" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '14px 32px', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: 'white', fontWeight: 700, fontSize: '16px', textDecoration: 'none',
            boxShadow: '0 4px 18px rgba(99,102,241,0.35)',
          }}>
            View Pro Plans
          </Link>

          <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.35)' }}>
            Already on Pro? <Link to="/dashboard" style={{ color: '#818cf8', textDecoration: 'none' }}>Go to Dashboard</Link>
          </p>
        </div>
      </section>

    </div>
  )
}
