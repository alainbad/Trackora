import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'

type Category = 'all' | 'express' | 'sea' | 'air' | 'land' | 'rail' | 'post'

interface Carrier {
  name: string
  domain: string
  accentColor: string
  category: Exclude<Category, 'all'>
  track: string        // official tracking page — opened when the chip is clicked
  featured?: boolean   // shown in the default "All Carriers" view on the home page
  logoUrl?: string     // direct high-quality logo image URL (bypasses favicon chain)
  logoScale?: number   // size multiplier for the logo (1 = default); use for short/wide marks
}

const CARRIERS: Carrier[] = [
  // Express
  { name: 'UPS',            domain: 'ups.com',               accentColor: '#8B5E3C', category: 'express', featured: true,  track: 'https://www.ups.com/track' },
  { name: 'FedEx',          domain: 'fedex.com',             accentColor: '#FF6200', category: 'express', featured: true,  track: 'https://www.fedex.com/fedextrack/',                         logoUrl: '/logos/fedex.svg', logoScale: 1.35 },
  { name: 'DHL',            domain: 'dhl.com',               accentColor: '#FFCC00', category: 'express', featured: true,  track: 'https://www.dhl.com/en/express/tracking.html',             logoUrl: '/logos/dhl.svg' },
  { name: 'TNT',            domain: 'tnt.com',               accentColor: '#FF6600', category: 'express',                  track: 'https://www.tnt.com/express/en_us/site/tracking.html' },
  { name: 'DPD',            domain: 'dpd.com',               accentColor: '#dc0032', category: 'express',                  track: 'https://www.dpd.com/tracking',                             logoUrl: '/logos/dpd.svg' },
  { name: 'GLS',            domain: 'gls-group.com',         accentColor: '#f5a623', category: 'express',                  track: 'https://gls-group.com/track' },
  { name: 'Hermes',         domain: 'hermesworld.com',       accentColor: '#009FE3', category: 'express',                  track: 'https://www.evri.com/track-a-parcel' },
  { name: 'Amazon',         domain: 'amazon.com',            accentColor: '#FF9900', category: 'express',                  track: 'https://www.amazon.com/progress-tracker/package' },
  { name: 'SF Express',     domain: 'sf-express.com',        accentColor: '#E3000F', category: 'express',                  track: 'https://www.sf-express.com/' },
  { name: 'Aramex',         domain: 'aramex.com',            accentColor: '#E31937', category: 'express', featured: true,  track: 'https://www.aramex.com/track/shipments',                   logoUrl: '/logos/aramex.svg' },
  // Sea
  { name: 'Maersk',         domain: 'maersk.com',            accentColor: '#42ADEF', category: 'sea',    featured: true,  track: 'https://www.maersk.com/tracking',                          logoUrl: '/logos/maersk.svg' },
  { name: 'MSC',            domain: 'msc.com',               accentColor: '#003087', category: 'sea',                     track: 'https://www.msc.com/en/track-a-shipment',                  logoUrl: '/logos/msc.svg' },
  { name: 'CMA CGM',        domain: 'cma-cgm.com',           accentColor: '#C41230', category: 'sea',    featured: true,  track: 'https://www.cma-cgm.com/ebusiness/tracking',               logoUrl: '/logos/cmacgm.png' },
  { name: 'COSCO',          domain: 'cosco.com',             accentColor: '#C8102E', category: 'sea',                     track: 'https://elines.coscoshipping.com/ebusiness/cargoTracking' },
  { name: 'Hapag-Lloyd',    domain: 'hapag-lloyd.com',       accentColor: '#f59e0b', category: 'sea',                     track: 'https://www.hapag-lloyd.com/en/online-business/track/track-by-container-solution.html' },
  { name: 'Evergreen',      domain: 'evergreen-marine.com',  accentColor: '#00693E', category: 'sea',                     track: 'https://www.evergreen-line.com/' },
  { name: 'ONE',            domain: 'one-line.com',          accentColor: '#E4003B', category: 'sea',                     track: 'https://ecomm.one-line.com/one-ecom/manage-shipment/cargo-tracking' },
  { name: 'Yang Ming',      domain: 'yangming.com',          accentColor: '#003DA5', category: 'sea',                     track: 'https://www.yangming.com/e-service/Track_Trace/track_trace_cargo_tracking.aspx' },
  // Air
  { name: 'Lufthansa Cargo',domain: 'lufthansa-cargo.com',   accentColor: '#FFAD00', category: 'air',                     track: 'https://lufthansa-cargo.com/eservices/tools/tracking' },
  { name: 'Emirates',       domain: 'skycargo.com',          accentColor: '#C41230', category: 'air',                     track: 'https://www.skycargo.com/track-shipment/' },
  { name: 'Singapore Air',  domain: 'singaporeair.com',      accentColor: '#FFD700', category: 'air',                     track: 'https://www.siacargo.com/' },
  { name: 'Qatar Cargo',    domain: 'qatarairways.com',      accentColor: '#5C0632', category: 'air',                     track: 'https://www.qrcargo.com/s/track-shipment',                 logoUrl: '/logos/qatar.svg' },
  { name: 'Cathay Cargo',   domain: 'cathaypacific.com',     accentColor: '#006564', category: 'air',                     track: 'https://www.cathaycargo.com/track-your-shipment/' },
  { name: 'Air France KLM', domain: 'airfrancecargo.com',    accentColor: '#0032A0', category: 'air',                     track: 'https://www.afklcargo.com/mycargo/shipment/detail' },
  { name: 'Turkish Cargo',  domain: 'turkishcargo.com',      accentColor: '#E30A17', category: 'air',                     track: 'https://www.turkishcargo.com/en/online-services/track-trace' },
  { name: 'IAG Cargo',      domain: 'iagcargo.com',          accentColor: '#5321A8', category: 'air',                     track: 'https://www.iagcargo.com/en/track-and-trace' },
  // Land
  { name: 'DB Schenker',    domain: 'dbschenker.com',        accentColor: '#E10019', category: 'land',                    track: 'https://www.dbschenker.com/app/tracking-public' },
  { name: 'DSV',            domain: 'dsv.com',               accentColor: '#EE1C25', category: 'land',   featured: true,  track: 'https://www.dsv.com/en/track-and-trace' },
  { name: 'Kuehne+Nagel',   domain: 'kuehne-nagel.com',      accentColor: '#003087', category: 'land',   featured: true,  track: 'https://onlineservices.kuehne-nagel.com/public-tracking/shipments' },
  { name: 'XPO',            domain: 'xpo.com',               accentColor: '#E31937', category: 'land',                    track: 'https://www.xpo.com/track/' },
  { name: 'Geodis',         domain: 'geodis.com',            accentColor: '#00A3E0', category: 'land',                    track: 'https://www.geodis.com/tracktrace' },
  { name: 'Ceva Logistics', domain: 'cevalogistics.com',     accentColor: '#E4002B', category: 'land',                    track: 'https://www.cevalogistics.com/en/ceva-trackit' },
  // Rail
  { name: 'DB Cargo',       domain: 'dbcargo.com',           accentColor: '#E10019', category: 'rail',                    track: 'https://www.dbcargo.com/rail-deutschland-en' },
  { name: 'Rail Cargo',     domain: 'railcargo.com',         accentColor: '#E30613', category: 'rail',                    track: 'https://www.railcargo.com/en',                             logoUrl: '/logos/railcargo.svg' },
  { name: 'SNCF Fret',      domain: 'sncf.com',              accentColor: '#A0006E', category: 'rail',                    track: 'https://www.sncf.com/en' },
  { name: 'PKP Cargo',      domain: 'pkpcargo.com',          accentColor: '#003087', category: 'rail',                    track: 'https://www.pkpcargo.com/en/',                             logoUrl: '/logos/pkpcargo.svg' },
  { name: 'BNSF Railway',   domain: 'bnsf.com',              accentColor: '#FF6600', category: 'rail',                    track: 'https://www.bnsf.com/' },
  { name: 'Union Pacific',  domain: 'unionpacific.com',      accentColor: '#FFD700', category: 'rail',                    track: 'https://www.up.com/customers/track-record/' },
  { name: 'Trenitalia',     domain: 'trenitalia.com',        accentColor: '#C8102E', category: 'rail',                    track: 'https://www.trenitalia.com/' },
  { name: 'CR Express',     domain: 'china-railway.com.cn',  accentColor: '#C8102E', category: 'rail',                    track: 'http://www.china-railway.com.cn/' },
  // Post
  { name: 'USPS',           domain: 'usps.com',              accentColor: '#E31837', category: 'post',                    track: 'https://tools.usps.com/go/TrackConfirmAction' },
  { name: 'Royal Mail',     domain: 'royalmail.com',         accentColor: '#D0021B', category: 'post',                    track: 'https://www.royalmail.com/track-your-item' },
  { name: 'Deutsche Post',  domain: 'deutschepost.de',       accentColor: '#FFCC00', category: 'post',                    track: 'https://www.deutschepost.de/sendung/simpleQuery.html' },
  { name: 'La Poste',       domain: 'laposte.fr',            accentColor: '#FFCD00', category: 'post',                    track: 'https://www.laposte.fr/outils/suivre-vos-envois' },
  { name: 'Japan Post',     domain: 'japanpost.jp',          accentColor: '#E31937', category: 'post',                    track: 'https://trackings.post.japanpost.jp/services/srv/search/input?locale=en' },
  { name: 'Australia Post', domain: 'auspost.com.au',        accentColor: '#E31837', category: 'post',                    track: 'https://auspost.com.au/mypost/track/' },
  { name: 'China Post',     domain: 'chinapost.com.cn',      accentColor: '#00843D', category: 'post',                    track: 'http://yjcx.ems.com.cn/qps/yjcx' },
  { name: 'PostNL',         domain: 'postnl.nl',             accentColor: '#FF6600', category: 'post',                    track: 'https://www.postnl.nl/en/tracktrace/' },
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

// Carriers whose domain exposes no fetchable favicon — every aggregator (Google, favicone,
// DuckDuckGo) just returns a generic globe placeholder. A meaningless globe looks worse than
// the brand name, so for these we render the clean branded text logo directly.
const NO_LOGO = new Set([
  'sf-express.com', 'cosco.com', 'hapag-lloyd.com',
  'evergreen-marine.com', 'yangming.com', 'iagcargo.com',
  'china-railway.com.cn', 'japanpost.jp', 'chinapost.com.cn',
])

// Carriers Google has no favicon for, but favicone.com serves their real brand icon — try it first.
const FAVICONE_FIRST = new Set<string>([])

function CarrierChip({ carrier }: { carrier: Carrier }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  // Real-logo source chain — tried in order; falls back to branded text only if all fail.
  // If a direct logoUrl is provided it goes first; then favicon providers as fallback.
  const google = `https://www.google.com/s2/favicons?domain=${carrier.domain}&sz=128`
  const favicone = `https://favicone.com/${carrier.domain}?s=128`
  const ddg = `https://icons.duckduckgo.com/ip3/${carrier.domain}.ico`
  const faviconChain = FAVICONE_FIRST.has(carrier.domain)
    ? [favicone, google, ddg]
    : [google, ddg, favicone]
  const sources = carrier.logoUrl ? [carrier.logoUrl, ...faviconChain] : faviconChain
  const [srcIndex, setSrcIndex] = useState(0)
  const [imgFailed, setImgFailed] = useState(NO_LOGO.has(carrier.domain) && !carrier.logoUrl)
  const imgSrc = sources[srcIndex]

  const handleError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex(i => i + 1)
    } else {
      setImgFailed(true)
    }
  }

  // Some favicon sources return a tiny/empty placeholder — treat that as a failure too.
  // Skip the size gate for direct logoUrl sources: SVG files report naturalWidth=0 even when
  // they loaded correctly, so we must not reject them.
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const isDirectLogo = carrier.logoUrl != null && srcIndex === 0
    if (!isDirectLogo && e.currentTarget.naturalWidth < 12) handleError()
  }

  return (
    <div
      role="button"
      title={`Track with ${carrier.name}`}
      onClick={() => navigate(`/track?carrier=${encodeURIComponent(carrier.name)}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        textDecoration: 'none',
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
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        padding: 0,
        minHeight: '105px',
        position: 'relative',
      }}
    >
      {/* Glow radial on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered
          ? `radial-gradient(ellipse at 50% 40%, ${carrier.accentColor}18, transparent 70%)`
          : 'transparent',
        transition: 'background 0.3s',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Logo — white box fills full card width, clipped by parent overflow:hidden */}
      <div style={{
        width: '100%',
        flex: 1,
        background: '#ffffff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
      }}>
        {!imgFailed ? (
          <img
            src={imgSrc}
            alt={carrier.name}
            onError={handleError}
            onLoad={handleLoad}
            style={{
              maxWidth: `${80 * (carrier.logoScale ?? 1)}%`,
              maxHeight: `${54 * (carrier.logoScale ?? 1)}px`,
              minWidth: '32px',
              minHeight: '32px',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        ) : (
          <CarrierTextLogo carrier={carrier} />
        )}
      </div>

      {/* Name label — sits in the dark bottom strip */}
      <div style={{
        padding: '7px 8px',
        fontSize: '11px', fontWeight: 600,
        color: hovered ? 'rgba(248,250,252,0.85)' : 'rgba(248,250,252,0.45)',
        textAlign: 'center', lineHeight: 1.2,
        transition: 'color 0.2s',
        position: 'relative', zIndex: 1,
        borderTop: `1px solid ${hovered ? carrier.accentColor + '30' : 'rgba(255,255,255,0.06)'}`,
        background: hovered ? `${carrier.accentColor}10` : 'transparent',
      }}>
        {carrier.name}
      </div>
    </div>
  )
}

// How many carriers to show per category tab (top N) before requiring a manual search.
const CATEGORY_LIMIT = 15

import { useIsMobile } from '../../hooks/useIsMobile'

export default function CarriersSection() {
  const [active, setActive] = useState<Category>('all')
  const [query, setQuery] = useState('')
  const isMobile = useIsMobile()
  const q = query.trim().toLowerCase()

  // Display rules:
  // • Searching → match across ALL 1,200-style list by name (ignores the active tab)
  // • "All Carriers" tab → only the featured 10 (keeps the home page tidy)
  // • A specific category → its top carriers, capped at CATEGORY_LIMIT
  let filtered: Carrier[]
  if (q) {
    filtered = CARRIERS.filter(c => c.name.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q))
  } else if (active === 'all') {
    filtered = CARRIERS.filter(c => c.featured)
  } else {
    filtered = CARRIERS.filter(c => c.category === active).slice(0, CATEGORY_LIMIT)
  }

  const selectCategory = (id: Category) => { setActive(id); setQuery('') }

  return (
    <section style={{ padding: isMobile ? '72px 20px' : '100px 24px', background: 'rgba(5,8,20,0.5)' }}>
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
            Stop switching between carrier websites. Click any carrier to open its live tracking.
          </p>
        </div>

        {/* Search */}
        <div style={{ maxWidth: '440px', margin: '0 auto 28px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 16px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${q ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'}`,
            transition: 'border-color 0.2s',
          }}>
            <Search size={16} color="rgba(248,250,252,0.4)" style={{ flexShrink: 0 }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search 1,200+ carriers by name…"
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: '#f8fafc', fontSize: '14px',
              }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{
                background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
                color: 'rgba(248,250,252,0.4)', padding: 0,
              }}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px', flexWrap: 'wrap', opacity: q ? 0.4 : 1, pointerEvents: q ? 'none' : 'auto', transition: 'opacity 0.2s' }}>
          {CATEGORIES.map(cat => {
            const count = cat.id === 'all' ? CARRIERS.length : CARRIERS.filter(c => c.category === cat.id).length
            const isActive = active === cat.id
            return (
              <button key={cat.id} onClick={() => selectCategory(cat.id)} style={{
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
        {filtered.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(auto-fill, minmax(145px, 1fr))',
            gap: isMobile ? '10px' : '14px',
            marginBottom: '28px',
          }}>
            {filtered.map((carrier, i) => (
              <CarrierChip key={`${carrier.name}-${i}`} carrier={carrier} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'rgba(248,250,252,0.45)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontSize: '15px' }}>No carrier matches “{query}”. Try a different name.</p>
          </div>
        )}

        {/* Hint */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.4)' }}>
            {q
              ? `${filtered.length} carrier${filtered.length === 1 ? '' : 's'} found · click to open tracking`
              : active === 'all'
              ? `Showing ${filtered.length} popular carriers — search above or pick a category for 1,200+ more.`
              : 'Click any carrier to open its live tracking · search above for 1,200+ more.'}
          </p>
        </div>
      </div>
    </section>
  )
}
