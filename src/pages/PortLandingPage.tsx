import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PORT_DATA } from '../data/portData'
import type { PortConfig } from '../data/portData'
import { AIRPORT_DATA } from '../data/airportData'
import type { AirportConfig } from '../data/airportData'
import { useSEO } from '../hooks/useSEO'

interface Props {
  type: 'port' | 'airport'
  slug: string
}

export default function PortLandingPage({ type, slug }: Props) {
  const config: PortConfig | AirportConfig | undefined =
    type === 'port' ? PORT_DATA[slug] : AIRPORT_DATA[slug]

  const navigate = useNavigate()
  const [trackingValue, setTrackingValue] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useSEO({
    title: config ? config.seoTitle : 'Page Not Found | Trackora',
    description: config ? config.seoDescription : '',
    canonical: config ? `https://www.track-ora.com/${type === 'port' ? 'ports' : 'airports'}/${slug}` : undefined,
  })

  if (!config) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0f1e' }}>
        <div style={{ textAlign: 'center', color: '#f8fafc' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Page Not Found</h1>
          <p style={{ color: 'rgba(248,250,252,0.5)', marginBottom: '24px' }}>
            We couldn't find data for <strong>{slug}</strong>.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#6366f1', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '15px' }}
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  function handleTrack() {
    const v = trackingValue.trim()
    if (v) navigate(`/track/${encodeURIComponent(v)}`)
  }

  return (
    <div style={{ background: '#0a0f1e', color: '#f8fafc', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{
        padding: '100px 24px 72px',
        background: 'linear-gradient(180deg, rgba(99,102,241,0.08) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {/* Badge */}
          <span style={{
            display: 'inline-block', marginBottom: '20px',
            padding: '6px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
            letterSpacing: '1.2px', textTransform: 'uppercase',
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8',
          }}>
            {config.badge}
          </span>

          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.15, marginBottom: '18px' }}>
            {config.h1}
          </h1>

          <p style={{ fontSize: '18px', color: 'rgba(248,250,252,0.6)', lineHeight: 1.7, marginBottom: '40px' }}>
            {config.subtitle}
          </p>

          {/* Tracking form */}
          <div style={{ display: 'flex', gap: '10px', maxWidth: '560px', margin: '0 auto', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={trackingValue}
              onChange={e => setTrackingValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
              placeholder={type === 'port' ? 'Container No. · B/L · Booking Ref' : 'AWB · Waybill · Tracking No.'}
              style={{
                flex: 1, minWidth: '220px',
                padding: '14px 18px', borderRadius: '10px', fontSize: '15px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#f8fafc', outline: 'none',
              }}
            />
            <button
              onClick={handleTrack}
              style={{
                padding: '14px 28px', borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(99,102,241,0.35)', whiteSpace: 'nowrap',
              }}
            >
              Track Shipment
            </button>
          </div>
        </div>
      </section>

      {/* ── Facts card ── */}
      <section style={{ padding: '64px 24px', maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', color: '#f8fafc' }}>
          {type === 'port' ? 'Port' : 'Airport'} Facts &amp; Figures
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {config.facts.map((fact, i) => (
            <div key={i} style={{
              padding: '20px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                {fact.label}
              </div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>
                {fact.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How-to steps ── */}
      <section style={{ padding: '0 24px 64px', maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', color: '#f8fafc' }}>
          How to Track Your {type === 'port' ? 'Port' : 'Airport'} Shipment
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {config.howSteps.map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: '18px', alignItems: 'flex-start',
              padding: '22px 24px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{
                flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '15px', color: 'white',
              }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px', color: '#f8fafc' }}>{step.title}</div>
                <div style={{ color: 'rgba(248,250,252,0.6)', fontSize: '14px', lineHeight: 1.65 }}>{step.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ accordion ── */}
      <section style={{ padding: '0 24px 64px', maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', color: '#f8fafc' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {config.faqs.slice(0, 5).map((faq, i) => (
            <div key={i} style={{
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
            }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left', padding: '18px 22px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '15px', color: '#f8fafc' }}>{faq.q}</span>
                <span style={{
                  flexShrink: 0, width: '22px', height: '22px', borderRadius: '50%',
                  background: openFaq === i ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: openFaq === i ? '#818cf8' : 'rgba(248,250,252,0.5)',
                  fontSize: '16px', lineHeight: 1, fontWeight: 700,
                  transition: 'all 0.2s',
                }}>
                  {openFaq === i ? '−' : '+'}
                </span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0 22px 18px', color: 'rgba(248,250,252,0.65)', fontSize: '14px', lineHeight: 1.75 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Related links ── */}
      <section style={{ padding: '0 24px 80px', maxWidth: '960px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#f8fafc' }}>
          Related Resources
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {config.relatedLinks.map((link, i) => (
            <a key={i} href={link.href} style={{
              padding: '8px 16px', borderRadius: '999px', fontSize: '14px', fontWeight: 500,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(248,250,252,0.7)', textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
              {link.label}
            </a>
          ))}
        </div>
      </section>

    </div>
  )
}
