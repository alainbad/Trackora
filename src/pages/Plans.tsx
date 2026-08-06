import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'
import { useIsNativeApp } from '../hooks/useIsNativeApp'
import PricingSection from '../components/home/PricingSection'
import IAPPaywall from '../components/ui/IAPPaywall'

const features = [
  { label: 'Shipment tracking (express & land)', free: true, pro: true, business: true },
  { label: 'Air freight MAWB tracking', free: false, pro: true, business: true },
  { label: 'Sea freight full timeline', free: false, pro: true, business: true },
  { label: 'Saved shipments', free: '10', pro: 'Unlimited', business: 'Unlimited' },
  { label: 'Email status alerts', free: false, pro: true, business: true },
  { label: 'Advanced analytics', free: false, pro: true, business: true },
  { label: 'AI insights', free: false, pro: false, business: true },
  { label: 'PDF label scanner', free: true, pro: true, business: true },
  { label: 'Multi-user seats', free: '1', pro: '1', business: '10' },
  { label: 'API & webhook access', free: false, pro: false, business: true },
  { label: 'Priority support', free: false, pro: false, business: true },
]

const billingFAQ = [
  {
    q: 'Can I change plans?',
    a: 'Yes. You can upgrade or downgrade your plan at any time from your Gumroad account. Changes take effect at the start of your next billing period.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'We do not offer a time-limited trial, but the Free plan is available forever with no credit card required so you can explore Trackora before upgrading.',
  },
  {
    q: 'How do I cancel?',
    a: 'Log in to your Gumroad account, find your Trackora subscription, and click Cancel. Your Pro access continues until the end of the current billing period.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express) and PayPal through our Gumroad checkout.',
  },
  {
    q: 'Do you offer annual billing?',
    a: 'Annual billing is not available yet but is on our roadmap. Subscribe to our newsletter to be notified when it launches.',
  },
]

function Check() {
  return <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '16px' }}>✓</span>
}

function Dash() {
  return <span style={{ color: 'rgba(248,250,252,0.25)', fontSize: '16px' }}>—</span>
}

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <Check />
  if (value === false) return <Dash />
  return <span style={{ fontSize: '13px', color: 'rgba(248,250,252,0.7)', fontWeight: 500 }}>{value}</span>
}

export default function Plans() {
  useSEO({
    title: 'Plans & Pricing | Trackora',
    description: 'Compare Trackora Free, Pro, and Business plans. Transparent pricing for shipment tracking — express, sea freight, air freight MAWB, and more.',
    canonical: 'https://www.track-ora.com/plans',
  })

  const isMobile = useIsMobile()
  const isNative = useIsNativeApp()
  const [openIdx, setOpenIdx] = useState<number | null>(null)

if (isNative) return <IAPPaywall onClose={() => window.history.back()} />
  return (
    <div style={{ minHeight: '100vh' }}>
      <PricingSection />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '0 20px 80px' : '0 24px 80px' }}>

        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px', marginBottom: '10px' }}>
            Compare Plans
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(248,250,252,0.5)' }}>
            Every feature, side by side.
          </p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', overflow: 'hidden',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: isMobile ? '2fr 1fr 1fr 1fr' : '3fr 1fr 1fr 1fr',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ padding: '16px', fontSize: '12px', color: 'rgba(248,250,252,0.35)', textTransform: 'uppercase', letterSpacing: '1px' }}>Feature</div>
            {['Free', 'Pro', 'Business'].map(col => (
              <div key={col} style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: 700, color: col === 'Pro' ? '#818cf8' : '#f8fafc' }}>
                {col}
              </div>
            ))}
          </div>
          {features.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: 'grid', gridTemplateColumns: isMobile ? '2fr 1fr 1fr 1fr' : '3fr 1fr 1fr 1fr',
                borderBottom: i < features.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
              }}
            >
              <div style={{ padding: '14px 16px', fontSize: '14px', color: 'rgba(248,250,252,0.75)' }}>{row.label}</div>
              <div style={{ padding: '14px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CellValue value={row.free} />
              </div>
              <div style={{ padding: '14px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CellValue value={row.pro} />
              </div>
              <div style={{ padding: '14px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CellValue value={row.business} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '64px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            Billing Questions
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.45)', marginBottom: '24px' }}>
            Common questions about payments, upgrades, and cancellations.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {billingFAQ.map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px', overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px', cursor: 'pointer', background: 'transparent', border: 'none',
                  }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc', paddingRight: '16px' }}>
                    {item.q}
                  </span>
                  <span style={{ fontSize: '20px', color: '#6366f1', flexShrink: 0, lineHeight: 1 }}>
                    {openIdx === i ? '−' : '+'}
                  </span>
                </button>
                {openIdx === i && (
                  <div style={{ padding: '0 18px 18px', color: 'rgba(248,250,252,0.65)', fontSize: '14px', lineHeight: 1.8 }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          marginTop: '48px',
          background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '16px', padding: isMobile ? '28px 20px' : '36px 40px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '10px' }}>
            Still have questions?
          </h3>
          <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.55)', marginBottom: '24px' }}>
            Browse our full FAQ or reach out to the support team directly.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/faq"
              style={{
                padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                textDecoration: 'none', boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
              }}
            >
              Browse FAQ
            </Link>
            <a
              href="mailto:support@track-ora.com"
              style={{
                padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(248,250,252,0.8)', textDecoration: 'none',
              }}
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
