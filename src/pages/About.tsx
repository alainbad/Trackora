import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'
import { Link } from 'react-router-dom'
import { Globe2, Zap, ShieldCheck, Mail, MapPin } from 'lucide-react'

export default function About() {
  useSEO({
    title: 'About Trackora | Global Shipment Tracking Platform',
    description: 'Learn about Trackora — the team, mission, and technology behind the platform that tracks shipments across 1,200+ carriers worldwide.',
    canonical: 'https://www.track-ora.com/about',
  })

  const isMobile = useIsMobile()

  const values = [
    {
      icon: ShieldCheck, color: '#10b981',
      title: 'Accuracy over speed',
      body: 'We never show unverified data. If we can\'t confirm something, we redirect you to the official source. Your cargo decisions are too important for guesswork.',
    },
    {
      icon: Zap, color: '#6366f1',
      title: 'Universal coverage',
      body: 'From a DHL parcel to a 20-foot ocean container to an Emirates SkyCargo air waybill — one platform, one search box, every mode of freight.',
    },
    {
      icon: Globe2, color: '#06b6d4',
      title: 'Built for the world',
      body: 'Headquartered in Dubai — one of the world\'s busiest freight hubs — we understand logistics from every angle: import, export, transit, multimodal.',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: isMobile ? '40px 20px' : '60px 24px' }}>

        {/* Hero */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px', borderRadius: '100px', marginBottom: '16px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            fontSize: '11px', color: '#818cf8', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            About Us
          </div>
          <h1 style={{ fontSize: isMobile ? '30px' : '48px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-1.5px', marginBottom: '20px', lineHeight: 1.1 }}>
            One window into your{' '}
            <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              global supply chain
            </span>
          </h1>
          <p style={{ fontSize: isMobile ? '15px' : '18px', color: 'rgba(248,250,252,0.6)', lineHeight: 1.7, maxWidth: '640px' }}>
            Trackora was founded by logistics and technology professionals who were tired of switching between
            dozens of carrier portals to check the status of a single shipment. We built the platform we always
            wished existed.
          </p>
        </div>

        {/* Mission */}
        <div style={{
          padding: isMobile ? '24px' : '36px',
          borderRadius: '20px',
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.2)',
          marginBottom: '56px',
        }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#818cf8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px' }}>Our Mission</h2>
          <p style={{ fontSize: isMobile ? '17px' : '22px', fontWeight: 700, color: '#f8fafc', lineHeight: 1.5 }}>
            "Give every business — from solo importers to large 3PLs — real-time visibility into every shipment,
            on every carrier, in every country."
          </p>
        </div>

        {/* Values */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', marginBottom: '28px', letterSpacing: '-0.5px' }}>What we stand for</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
            {values.map(v => {
              const Icon = v.icon
              return (
                <div key={v.title} style={{
                  padding: '24px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px', marginBottom: '16px',
                    background: `${v.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} color={v.color} />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>{v.title}</h3>
                  <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.7 }}>{v.body}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '64px',
        }}>
          {[
            { num: '1,200+', label: 'Carriers Supported' },
            { num: '195',    label: 'Countries Covered' },
            { num: '500M+',  label: 'Shipments Tracked' },
            { num: '99.9%',  label: 'Uptime SLA' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '20px 16px', textAlign: 'center',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-1px', marginBottom: '4px' }}>{s.num}</div>
              <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.4)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{
          padding: isMobile ? '24px' : '36px',
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>Get in touch</h2>
          <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.5)', marginBottom: '24px' }}>
            Questions, partnerships, or carrier integrations — we'd love to hear from you.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
            <a href="mailto:support@track-ora.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: '#818cf8', textDecoration: 'none' }}>
              <Mail size={16} /> support@track-ora.com
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'rgba(248,250,252,0.45)' }}>
              <MapPin size={16} color="#6366f1" /> Business Bay, Dubai, UAE
            </div>
          </div>
          <Link
            to="/track"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px', textDecoration: 'none',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', fontSize: '14px', fontWeight: 700,
              boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
            }}
          >
            Start tracking for free →
          </Link>
        </div>

      </div>
    </div>
  )
}
