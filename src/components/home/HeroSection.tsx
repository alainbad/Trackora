import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plane, Ship, Truck, Package, ChevronRight, Sparkles } from 'lucide-react'
import WorldMap from '../tracking/WorldMap'

const FREIGHT_TYPES = [
  { icon: Plane, label: 'Air Freight', color: '#22d3ee' },
  { icon: Ship, label: 'Sea Freight', color: '#6366f1' },
  { icon: Truck, label: 'Land Freight', color: '#10b981' },
  { icon: Package, label: 'Express', color: '#f59e0b' },
]

const SAMPLE_IDS = ['1Z999AA10123456784', 'MAD3456789', 'MAWB001-12345678', 'CNTR8872341']

export default function HeroSection() {
  const [query, setQuery] = useState('')
  const [activeType, setActiveType] = useState(0)
  const navigate = useNavigate()

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) navigate(`/track/${encodeURIComponent(query.trim())}`)
  }

  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: '#0a0f1e' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(at 20% 40%, rgba(99,102,241,0.2) 0px, transparent 55%), radial-gradient(at 80% 20%, rgba(6,182,212,0.15) 0px, transparent 55%), radial-gradient(at 55% 80%, rgba(139,92,246,0.12) 0px, transparent 55%)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}><WorldMap animated /></div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '900px', margin: '0 auto', padding: '120px 24px 80px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', borderRadius: '100px',
          background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
          marginBottom: '28px', fontSize: '13px', color: '#818cf8', fontWeight: 500,
        }}>
          <Sparkles size={14} />
          AI-Powered Global Shipment Intelligence
        </div>

        <h1 style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-2px', marginBottom: '24px', color: '#f8fafc' }}>
          Track Every{' '}
          <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #6366f1, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Shipment
          </span>
          <br />Across the Globe
        </h1>

        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(248,250,252,0.6)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.6 }}>
          One platform for air, sea, land freight &amp; express couriers. Real-time tracking, AI predictions, and carrier-level insights — all in one place.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {FREIGHT_TYPES.map((type, i) => {
            const Icon = type.icon
            return (
              <button key={i} onClick={() => setActiveType(i)} style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px',
                border: `1px solid ${activeType === i ? type.color : 'rgba(255,255,255,0.1)'}`,
                background: activeType === i ? `${type.color}18` : 'rgba(255,255,255,0.04)',
                color: activeType === i ? type.color : 'rgba(248,250,252,0.6)',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
              }}>
                <Icon size={14} />{type.label}
              </button>
            )
          })}
        </div>

        <form onSubmit={handleTrack} style={{ maxWidth: '680px', margin: '0 auto 28px' }}>
          <div style={{
            display: 'flex', gap: '0',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '16px', padding: '6px 6px 6px 20px',
            boxShadow: '0 0 60px rgba(99,102,241,0.2)', backdropFilter: 'blur(20px)', alignItems: 'center',
          }}>
            <Search size={20} color="rgba(248,250,252,0.4)" style={{ flexShrink: 0 }} />
            <input
              type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Enter tracking number, AWB, BOL, or container ID…"
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#f8fafc', fontSize: '16px', padding: '10px 16px' }}
            />
            <button type="submit" style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', color: 'white',
              fontSize: '15px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.4)', flexShrink: 0,
            }}>
              Track Now <ChevronRight size={16} />
            </button>
          </div>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: 'rgba(248,250,252,0.4)' }}>Try demo:</span>
          {SAMPLE_IDS.map(id => (
            <button key={id} onClick={() => { setQuery(id); navigate(`/track/${encodeURIComponent(id)}`) }} style={{
              padding: '4px 12px', borderRadius: '6px',
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
              color: '#818cf8', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer',
            }}>{id}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', marginTop: '64px', background: 'rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          {[{ value: '500M+', label: 'Shipments Tracked' }, { value: '1,200+', label: 'Carriers Supported' }, { value: '195', label: 'Countries Covered' }, { value: '99.9%', label: 'Uptime SLA' }].map((stat, i) => (
            <div key={i} style={{ padding: '20px', background: 'rgba(10,15,30,0.6)', textAlign: 'center' }}>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.5px' }}>{stat.value}</div>
              <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.45)', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
