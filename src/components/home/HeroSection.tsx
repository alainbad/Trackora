import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronRight, Upload } from 'lucide-react'
import { useIsMobile } from '../../hooks/useIsMobile'
import { WORLD_DOTS } from '../../data/worldDots'

const SAMPLE_IDS = ['1Z999AA10123456784', 'MAD3456789', 'MAWB001-12345678', 'CNTR8872341']
const CARRIERS = ['Maersk', 'DHL', 'UPS', 'Emirates SkyCargo', 'MSC', 'FedEx']

const AMBER = '#f0a868'
const TEAL  = '#5ec8c8'
const CYAN  = '#22d3ee'

// ── Globe: stippled world map clipped to a sphere, with warm rim-light and
//    two animated trade-lane arcs lifting off the surface. Pure SVG. ──────────
// Each arc carries a live-event chip anchored above its apex (foreignObject),
// so the chip scales and stays locked to the route as the globe resizes.
function LaneChip({ x, y, color, id, status }: { x: number; y: number; color: string; id: string; status: string }) {
  return (
    <foreignObject x={x} y={y} width={300} height={70} style={{ overflow: 'visible' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '10px',
        padding: '10px 14px', borderRadius: '13px',
        background: 'rgba(16,22,40,0.85)',
        border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px', color: '#f8fafc' }}>{id}</div>
          <div style={{ fontSize: '11px', color: 'rgba(248,250,252,0.45)', marginTop: '2px' }}>{status}</div>
        </div>
      </div>
    </foreignObject>
  )
}

function GlobeHero() {
  return (
    <svg viewBox="0 0 1000 1000" style={{ width: '100%', height: '100%', overflow: 'visible' }} aria-hidden="true">
      <defs>
        <radialGradient id="globeBody" cx="42%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="#1a2440" />
          <stop offset="78%"  stopColor="#111a30" />
          <stop offset="100%" stopColor="#0b1124" />
        </radialGradient>
        <radialGradient id="globeRim" cx="50%" cy="50%" r="50%">
          <stop offset="92%"  stopColor="rgba(240,168,104,0)" />
          <stop offset="100%" stopColor="rgba(240,168,104,0.5)" />
        </radialGradient>
        <clipPath id="globeClip"><circle cx="500" cy="500" r="440" /></clipPath>
      </defs>

      {/* Sphere body */}
      <circle cx="500" cy="500" r="440" fill="url(#globeBody)" />

      {/* Land dots, clipped to the sphere */}
      <g clipPath="url(#globeClip)" opacity="0.55">
        <g transform="translate(120,150) scale(0.78)">
          {WORLD_DOTS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.9" fill="#5a6a88" opacity="0.9" />
          ))}
        </g>
      </g>

      {/* Rim light + edge */}
      <circle cx="500" cy="500" r="440" fill="url(#globeRim)" />
      <circle cx="500" cy="500" r="440" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* Trade lane 1 — amber (air) */}
      <path d="M 360 250 Q 560 60 760 240" fill="none" stroke={AMBER} strokeWidth="2.4"
        strokeDasharray="2 7" strokeLinecap="round">
        <animate attributeName="stroke-dashoffset" values="0;-90" dur="6s" repeatCount="indefinite" />
      </path>
      <circle cx="360" cy="250" r="6" fill={AMBER} />
      <circle cx="760" cy="240" r="6" fill={AMBER} />
      <circle cx="760" cy="240" r="6" fill="none" stroke={AMBER} strokeWidth="1.4">
        <animate attributeName="r" values="6;18;6" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2.6s" repeatCount="indefinite" />
      </circle>

      {/* Trade lane 2 — teal (sea) */}
      <path d="M 360 380 Q 525 285 700 360" fill="none" stroke={TEAL} strokeWidth="2.4"
        strokeDasharray="2 7" strokeLinecap="round">
        <animate attributeName="stroke-dashoffset" values="0;-90" dur="7.5s" repeatCount="indefinite" />
      </path>
      <circle cx="360" cy="380" r="6" fill={TEAL} />
      <circle cx="700" cy="360" r="6" fill={TEAL} />
      <circle cx="700" cy="360" r="6" fill="none" stroke={TEAL} strokeWidth="1.4">
        <animate attributeName="r" values="6;18;6" dur="3s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Live-event chips, one per lane, anchored above each arc's apex */}
      <LaneChip x={415} y={70}  color={AMBER} id="176-22536813" status="Departed Dubai · 18m ago" />
      <LaneChip x={360} y={200} color={TEAL}  id="MSKU7620114"  status="Loaded Shanghai · 2h ago" />
    </svg>
  )
}

export default function HeroSection() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) navigate(`/track/${encodeURIComponent(query.trim())}`)
  }

  return (
    <section style={{
      position: 'relative',
      minHeight: isMobile ? 'auto' : '100vh',
      display: 'flex', alignItems: 'center',
      overflow: 'hidden',
      background: '#0a0f1e',
    }}>
      {/* Subtle warm wash, top-right */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 78% 8%, rgba(240,168,104,0.08), transparent 55%)' }} />

      {/* ── Globe (desktop only) ── */}
      {!isMobile && (
        <div style={{
          position: 'absolute', right: '120px', bottom: '-220px',
          width: '1180px', height: '1180px', zIndex: 1,
        }}>
          <GlobeHero />
        </div>
      )}

      {/* ── Left editorial column ── */}
      <div style={{
        position: 'relative', zIndex: 5,
        width: '100%', maxWidth: isMobile ? '100%' : '680px',
        padding: isMobile ? '110px 20px 64px' : '0 0 0 96px',
        textAlign: isMobile ? 'center' : 'left',
      }}>
        {/* Live counter */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '9px',
          padding: '7px 15px', borderRadius: '100px',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '13px', color: 'rgba(248,250,252,0.7)', fontWeight: 500, marginBottom: '26px',
        }}>
          <span style={{ position: 'relative', width: '8px', height: '8px', display: 'inline-block' }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#34d399' }} />
            <span style={{ position: 'absolute', inset: '-3px', borderRadius: '50%', border: '1px solid #34d399', opacity: 0.5 }} />
          </span>
          <b style={{ fontWeight: 700, color: '#34d399' }}>2,418</b>
          <span style={{ opacity: 0.85 }}>shipments moving right now</span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: isMobile ? '44px' : 'clamp(52px, 6vw, 76px)',
          fontWeight: 800, lineHeight: 1.03,
          letterSpacing: isMobile ? '-1.5px' : '-2.5px',
          color: '#f8fafc', margin: '0 0 22px',
        }}>
          Track every<br />shipment.<br />
          <span style={{ position: 'relative', whiteSpace: 'nowrap' }}>
            In real time.
            <span style={{
              position: 'absolute', left: 0, bottom: '5px', width: '100%', height: '11px',
              background: 'rgba(240,168,104,0.32)', borderRadius: '3px', zIndex: -1,
            }} />
          </span>
        </h1>

        <p style={{
          fontSize: isMobile ? '16px' : '19px',
          color: 'rgba(248,250,252,0.6)', lineHeight: 1.6,
          maxWidth: '520px', margin: isMobile ? '0 auto 32px' : '0 0 34px',
        }}>
          One place for air, sea, land freight &amp; express couriers. Paste any tracking
          number, AWB, B/L or container ID — we find it in seconds.
        </p>

        {/* Search */}
        <form onSubmit={handleTrack} style={{ maxWidth: '600px', margin: isMobile ? '0 auto' : '0' }}>
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '14px', padding: '6px 16px' }}>
                <Search size={18} color="rgba(248,250,252,0.4)" style={{ flexShrink: 0 }} />
                <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Enter tracking number…"
                  style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#f8fafc', fontSize: '15px', padding: '8px 0' }} />
              </div>
              <button type="submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '14px', background: CYAN, border: 'none', color: '#06222a', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
                Track Now <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '16px', padding: '7px 7px 7px 22px', alignItems: 'center', boxShadow: '0 18px 50px rgba(0,0,0,0.35)' }}>
              <Search size={20} color="rgba(248,250,252,0.35)" style={{ flexShrink: 0 }} />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Enter tracking number, AWB, B/L or container ID…"
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#f8fafc', fontSize: '17px', padding: '13px 16px' }} />
              <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '14px 28px', borderRadius: '11px', background: CYAN, border: 'none', color: '#06222a', fontSize: '16px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Track <ChevronRight size={16} />
              </button>
            </div>
          )}
        </form>

        {/* Upload + demo row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-start', gap: '16px', margin: '14px 0 30px', flexWrap: 'wrap', paddingLeft: isMobile ? 0 : '4px' }}>
          <button onClick={() => navigate('/track')} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'none', border: 'none', color: 'rgba(248,250,252,0.55)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            <Upload size={14} /> Upload AWB / B/L PDF
          </button>
          <span style={{ color: 'rgba(248,250,252,0.2)' }}>|</span>
          <span style={{ fontSize: '13px', color: 'rgba(248,250,252,0.4)' }}>
            Try:{' '}
            <button onClick={() => navigate(`/track/${encodeURIComponent(SAMPLE_IDS[1])}`)}
              style={{ fontFamily: 'monospace', color: AMBER, background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', padding: 0 }}>
              {SAMPLE_IDS[1]}
            </button>
          </span>
        </div>

        {/* Carrier trust strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-start', gap: '11px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: 'rgba(248,250,252,0.35)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Works with</span>
          {CARRIERS.map((c, i) => (
            <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: '11px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(248,250,252,0.42)' }}>{c}</span>
              {i < CARRIERS.length - 1 && <span style={{ color: 'rgba(248,250,252,0.18)' }}>·</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
