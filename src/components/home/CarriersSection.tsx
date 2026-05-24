import { useState, useRef } from 'react'
import { ChevronRight } from 'lucide-react'

type Category = 'all' | 'express' | 'sea' | 'air' | 'land' | 'rail' | 'post'

interface Carrier {
  name: string
  domain: string
  accentColor: string
  category: Exclude<Category, 'all'>
}

const CARRIERS: Carrier[] = [
  // Express
  { name: 'UPS',            domain: 'ups.com',               accentColor: '#8B5E3C', category: 'express' },
  { name: 'FedEx',          domain: 'fedex.com',             accentColor: '#FF6200', category: 'express' },
  { name: 'DHL',            domain: 'dhl.com',               accentColor: '#FFCC00', category: 'express' },
  { name: 'TNT',            domain: 'tnt.com',               accentColor: '#FF6600', category: 'express' },
  { name: 'DPD',            domain: 'dpd.com',               accentColor: '#dc0032', category: 'express' },
  { name: 'GLS',            domain: 'gls-group.com',         accentColor: '#f5a623', category: 'express' },
  { name: 'Hermes',         domain: 'hermesworld.com',       accentColor: '#009FE3', category: 'express' },
  { name: 'Amazon',         domain: 'amazon.com',            accentColor: '#FF9900', category: 'express' },
  { name: 'SF Express',     domain: 'sf-express.com',        accentColor: '#E3000F', category: 'express' },
  { name: 'Aramex',         domain: 'aramex.com',            accentColor: '#E31937', category: 'express' },
  // Sea
  { name: 'Maersk',         domain: 'maersk.com',            accentColor: '#42ADEF', category: 'sea' },
  { name: 'MSC',            domain: 'msc.com',               accentColor: '#003087', category: 'sea' },
  { name: 'CMA CGM',        domain: 'cma-cgm.com',           accentColor: '#C41230', category: 'sea' },
  { name: 'COSCO',          domain: 'cosco.com',             accentColor: '#C8102E', category: 'sea' },
  { name: 'Hapag-Lloyd',    domain: 'hapag-lloyd.com',       accentColor: '#f59e0b', category: 'sea' },
  { name: 'Evergreen',      domain: 'evergreen-marine.com',  accentColor: '#00693E', category: 'sea' },
  { name: 'ONE',            domain: 'one-line.com',          accentColor: '#E4003B', category: 'sea' },
  { name: 'Yang Ming',      domain: 'yangming.com',          accentColor: '#003DA5', category: 'sea' },
  // Air
  { name: 'Lufthansa Cargo',domain: 'lufthansa-cargo.com',   accentColor: '#FFAD00', category: 'air' },
  { name: 'Emirates',       domain: 'skycargo.com',          accentColor: '#C41230', category: 'air' },
  { name: 'Singapore Air',  domain: 'singaporeair.com',      accentColor: '#FFD700', category: 'air' },
  { name: 'Qatar Cargo',    domain: 'qatarairways.com',      accentColor: '#5C0632', category: 'air' },
  { name: 'Cathay Cargo',   domain: 'cathaypacific.com',     accentColor: '#006564', category: 'air' },
  { name: 'Air France KLM', domain: 'airfrancecargo.com',    accentColor: '#0032A0', category: 'air' },
  { name: 'Turkish Cargo',  domain: 'turkishcargo.com',      accentColor: '#E30A17', category: 'air' },
  { name: 'IAG Cargo',      domain: 'iagcargo.com',          accentColor: '#5321A8', category: 'air' },
  // Land
  { name: 'DB Schenker',    domain: 'dbschenker.com',        accentColor: '#E10019', category: 'land' },
  { name: 'DSV',            domain: 'dsv.com',               accentColor: '#EE1C25', category: 'land' },
  { name: 'Kuehne+Nagel',   domain: 'kuehne-nagel.com',      accentColor: '#003087', category: 'land' },
  { name: 'XPO',            domain: 'xpo.com',               accentColor: '#E31937', category: 'land' },
  { name: 'Geodis',         domain: 'geodis.com',            accentColor: '#00A3E0', category: 'land' },
  { name: 'Ceva Logistics', domain: 'cevalogistics.com',     accentColor: '#E4002B', category: 'land' },
  // Rail
  { name: 'DB Cargo',       domain: 'dbcargo.com',           accentColor: '#E10019', category: 'rail' },
  { name: 'Rail Cargo',     domain: 'railcargo.com',         accentColor: '#E30613', category: 'rail' },
  { name: 'SNCF Fret',      domain: 'sncf.com',              accentColor: '#A0006E', category: 'rail' },
  { name: 'PKP Cargo',      domain: 'pkpcargo.com',          accentColor: '#003087', category: 'rail' },
  { name: 'BNSF Railway',   domain: 'bnsf.com',              accentColor: '#FF6600', category: 'rail' },
  { name: 'Union Pacific',  domain: 'unionpacific.com',      accentColor: '#FFD700', category: 'rail' },
  { name: 'Trenitalia',     domain: 'trenitalia.com',        accentColor: '#C8102E', category: 'rail' },
  { name: 'CR Express',     domain: 'china-railway.com.cn',  accentColor: '#C8102E', category: 'rail' },
  // Post
  { name: 'USPS',           domain: 'usps.com',              accentColor: '#E31837', category: 'post' },
  { name: 'Royal Mail',     domain: 'royalmail.com',         accentColor: '#D0021B', category: 'post' },
  { name: 'Deutsche Post',  domain: 'deutschepost.de',       accentColor: '#FFCC00', category: 'post' },
  { name: 'La Poste',       domain: 'laposte.fr',            accentColor: '#FFCD00', category: 'post' },
  { name: 'Japan Post',     domain: 'japanpost.jp',          accentColor: '#E31937', category: 'post' },
  { name: 'Australia Post', domain: 'auspost.com.au',        accentColor: '#E31837', category: 'post' },
  { name: 'China Post',     domain: 'chinapost.com.cn',      accentColor: '#00843D', category: 'post' },
  { name: 'PostNL',         domain: 'postnl.nl',             accentColor: '#FF6600', category: 'post' },
]

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: 'all',     label: 'All Carriers',  emoji: '🌐' },
  { id: 'express', label: 'Express',       emoji: '⚡' },
  { id: 'sea',     label: 'Sea Freight',   emoji: '🚢' },
  { id: 'air',     label: 'Air Cargo',     emoji: '✈️' },
  { id: 'land',    label: 'Land Freight',  emoji: '🚛' },
  { id: 'rail',    label: 'Rail Freight',  emoji: '🚂' },
  { id: 'post',    label: 'Post / EMS',    emoji: '📮' },
]

function CarrierTextLogo({ carrier }: { carrier: Carrier }) {
  const short = carrier.name.length <= 5
  return (
    <span style={{
      fontSize: short ? '17px' : carrier.name.length <= 9 ? '12px' : '10px',
      fontWeight: 900,
      color: carrier.accentColor,
      textAlign: 'center',
      lineHeight: 1.1,
      padding: '0 5px',
      letterSpacing: short ? '1.5px' : '0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {carrier.name}
    </span>
  )
}

function CarrierChip({ carrier }: { carrier: Carrier }) {
  const [hovered, setHovered] = useState(false)
  const attempt = useRef(0)
  const [imgSrc, setImgSrc] = useState(`https://logo.clearbit.com/${carrier.domain}`)
  const [imgFailed, setImgFailed] = useState(false)
  const isFavicon = imgSrc.includes('google.com')

  const handleError = () => {
    if (attempt.current === 0) {
      attempt.current = 1
      setImgSrc(`https://www.google.com/s2/favicons?domain=${carrier.domain}&sz=64`)
    } else {
      setImgFailed(true)
    }
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '14px',
        overflow: 'hidden',
        border: `1px solid ${hovered ? carrier.accentColor + '55' : 'rgba(255,255,255,0.08)'}`,
        transition: 'all 0.25s ease',
        transform: hovered ? 'translateY(-5px) scale(1.04)' : 'none',
        boxShadow: hovered
          ? `0 0 0 1px ${carrier.accentColor}30, 0 16px 40px ${carrier.accentColor}25, 0 0 30px ${carrier.accentColor}15`
          : 'none',
        cursor: 'pointer',
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 10px 12px',
        minHeight: '105px',
        position: 'relative',
        gap: '8px',
      }}
    >
      {/* Brand accent bar at top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: carrier.accentColor,
        opacity: hovered ? 1 : 0.55,
        transition: 'opacity 0.25s',
      }} />

      {/* Glow radial on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered
          ? `radial-gradient(ellipse at 50% 30%, ${carrier.accentColor}18, transparent 70%)`
          : 'transparent',
        transition: 'background 0.3s',
        pointerEvents: 'none',
        borderRadius: '14px',
      }} />

      {/* Logo in white pill */}
      <div style={{
        width: '84px', height: '42px',
        background: '#ffffff',
        borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: hovered
          ? `0 4px 20px ${carrier.accentColor}50`
          : '0 2px 8px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.25s',
        position: 'relative',
        zIndex: 1,
      }}>
        {!imgFailed ? (
          <img
            src={imgSrc}
            alt={carrier.name}
            onError={handleError}
            style={{
              width: isFavicon ? '34px' : '76px',
              height: isFavicon ? '34px' : '36px',
              objectFit: 'contain',
            }}
          />
        ) : (
          <CarrierTextLogo carrier={carrier} />
        )}
      </div>

      {/* Name label */}
      <div style={{
        fontSize: '11px', fontWeight: 600,
        color: hovered ? 'rgba(248,250,252,0.85)' : 'rgba(248,250,252,0.45)',
        textAlign: 'center', lineHeight: 1.2,
        transition: 'color 0.2s',
        position: 'relative', zIndex: 1,
      }}>
        {carrier.name}
      </div>
    </div>
  )
}

export default function CarriersSection() {
  const [active, setActive] = useState<Category>('all')
  const filtered = active === 'all' ? CARRIERS : CARRIERS.filter(c => c.category === active)

  return (
    <section style={{ padding: '100px 24px', background: 'rgba(5,8,20,0.5)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800,
            letterSpacing: '-1.5px', color: '#f8fafc', marginBottom: '12px', lineHeight: 1.1,
          }}>
            1,200+ Carriers in{' '}
            <span style={{
              background: 'linear-gradient(135deg, #22d3ee, #6366f1)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>one place</span>
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(248,250,252,0.5)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
            Stop switching between carrier websites. Every major forwarder, one search.
          </p>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => {
            const count = cat.id === 'all' ? CARRIERS.length : CARRIERS.filter(c => c.category === cat.id).length
            const isActive = active === cat.id
            return (
              <button key={cat.id} onClick={() => setActive(cat.id)} style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '9px 18px', borderRadius: '100px',
                border: `1px solid ${isActive ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.08)'}`,
                background: isActive
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(34,211,238,0.08))'
                  : 'rgba(255,255,255,0.03)',
                color: isActive ? '#a5b4fc' : 'rgba(248,250,252,0.55)',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 0 20px rgba(99,102,241,0.2)' : 'none',
              }}>
                <span style={{ fontSize: '15px' }}>{cat.emoji}</span>
                {cat.label}
                <span style={{
                  padding: '2px 8px', borderRadius: '100px',
                  background: isActive ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.08)',
                  fontSize: '10px', fontWeight: 700,
                  color: isActive ? '#c7d2fe' : 'rgba(248,250,252,0.4)',
                }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Carrier Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))',
          gap: '14px',
          marginBottom: '36px',
        }}>
          {filtered.map((carrier, i) => (
            <CarrierChip key={`${carrier.name}-${i}`} carrier={carrier} />
          ))}
        </div>

        {/* View all */}
        <div style={{ textAlign: 'center' }}>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '11px 28px', borderRadius: '12px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.25)',
            color: '#818cf8', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
          }}>
            View all 1,200+ supported carriers <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
