import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, Package, Clock, ChevronDown, Zap, LogIn } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'
import { useRateQuota } from '../hooks/useRateQuota'
import { useAuth } from '../contexts/AuthContext'
import { calcRates, COUNTRIES, type RateResult, type CarrierKey } from '../data/shippingRates'
import { getCities } from '../data/shippingCities'
import AdUnit from '../components/ui/AdUnit'
import AuthModal from '../components/auth/AuthModal'

const CARRIER_META: Record<CarrierKey, { primary: string; bg: string; border: string; slug: string }> = {
  DHL:    { primary: '#FFCC00', bg: 'rgba(255,204,0,0.07)',   border: 'rgba(255,204,0,0.2)',  slug: 'dhl'    },
  FedEx:  { primary: '#FF6200', bg: 'rgba(255,98,0,0.07)',    border: 'rgba(255,98,0,0.2)',   slug: 'fedex'  },
  UPS:    { primary: '#C8960C', bg: 'rgba(200,150,12,0.07)',  border: 'rgba(200,150,12,0.2)', slug: 'ups'    },
  Aramex: { primary: '#E8412C', bg: 'rgba(232,65,44,0.07)',   border: 'rgba(232,65,44,0.2)',  slug: 'aramex' },
}

const LOGO_BASE = 'https://assets.aftership.com/couriers/svg'

// ── Generic searchable dropdown ───────────────────────────────────────────────
interface SelectOption { value: string; label: string }

function SearchSelect({
  value, onChange, options, placeholder, searchPlaceholder = 'Search…', disabled = false,
}: {
  value: string
  onChange: (v: string) => void
  options: SelectOption[]
  placeholder: string
  searchPlaceholder?: string
  disabled?: boolean
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen]   = useState(false)

  const filtered = useMemo(() =>
    options.filter(o => o.label.toLowerCase().includes(query.toLowerCase())).slice(0, 80),
    [options, query]
  )
  const selected = options.find(o => o.value === value)

  function pick(v: string) { onChange(v); setQuery(''); setOpen(false) }

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => { if (!disabled) setOpen(o => !o) }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', borderRadius: '10px',
          cursor: disabled ? 'default' : 'pointer',
          background: disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: selected ? '#f8fafc' : 'rgba(248,250,252,0.3)', fontSize: '14px',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.label : placeholder}
        </span>
        {!disabled && (
          <ChevronDown size={14} color="rgba(248,250,252,0.4)" style={{ flexShrink: 0, marginLeft: '8px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
        )}
      </div>
      {open && (
        <div style={{
          position: 'absolute', zIndex: 200, top: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#0f1629', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.7)', overflow: 'hidden',
        }}>
          <div style={{ padding: '8px' }}>
            <input
              autoFocus value={query} onChange={e => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '13px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f8fafc', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {filtered.map(o => (
              <div key={o.value} onClick={() => pick(o.value)}
                style={{
                  padding: '9px 14px', fontSize: '14px', cursor: 'pointer',
                  color: o.value === value ? '#818cf8' : 'rgba(248,250,252,0.8)',
                  background: o.value === value ? 'rgba(99,102,241,0.1)' : 'transparent',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = o.value === value ? 'rgba(99,102,241,0.1)' : 'transparent' }}
              >
                {o.label}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '14px', fontSize: '13px', color: 'rgba(248,250,252,0.35)', textAlign: 'center' }}>No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Carrier logo ──────────────────────────────────────────────────────────────
function CarrierLogo({ carrier, size = 36 }: { carrier: CarrierKey; size?: number }) {
  const [ok, setOk] = useState(true)
  const meta = CARRIER_META[carrier]
  if (!ok) return (
    <div style={{
      width: size, height: size, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: meta.bg, border: `1px solid ${meta.border}`, fontSize: '10px', fontWeight: 700, color: meta.primary,
    }}>
      {carrier.slice(0, 3)}
    </div>
  )
  return (
    <img
      src={`${LOGO_BASE}/${meta.slug}.svg`} alt={carrier}
      onError={() => setOk(false)}
      style={{ width: size, height: size, objectFit: 'contain', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', padding: '5px', boxSizing: 'border-box', flexShrink: 0 }}
    />
  )
}

// ── Result group: one carrier, two services ───────────────────────────────────
function CarrierGroup({ carrier, services }: { carrier: CarrierKey; services: RateResult[] }) {
  const meta = CARRIER_META[carrier]
  return (
    <div style={{
      borderRadius: '18px', overflow: 'hidden',
      border: `1px solid ${meta.border}`,
      background: meta.bg,
    }}>
      {/* Carrier header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: `1px solid ${meta.border}` }}>
        <CarrierLogo carrier={carrier} size={36} />
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>{carrier}</span>
      </div>

      {/* Service rows */}
      {services.map((r, i) => (
        <div key={r.serviceCode} style={{
          padding: '14px 20px',
          borderBottom: i < services.length - 1 ? `1px solid ${meta.border}` : 'none',
          display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
        }}>
          {/* Service name + transit */}
          <div style={{ flex: 1, minWidth: '160px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
              {r.serviceName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'rgba(248,250,252,0.45)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={11} /> {r.transitDays}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Package size={11} />
                {r.chargeableKg.toFixed(1)} kg
                {r.volKg > r.actualKg && (
                  <span style={{ color: 'rgba(248,250,252,0.3)' }}>(vol)</span>
                )}
              </span>
            </div>
          </div>

          {/* Price */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '19px', fontWeight: 800, color: meta.primary, whiteSpace: 'nowrap' }}>
              ~${r.low}–${r.high}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(248,250,252,0.35)', marginTop: '2px' }}>USD estimate</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Rates() {
  useSEO({
    title: 'Shipping Rate Calculator — DHL, FedEx, UPS, Aramex Estimates | Trackora',
    description: 'Free international shipping rate calculator for DHL Express, FedEx, UPS, and Aramex. Get instant estimated rates based on weight, dimensions, origin, and destination.',
    canonical: 'https://www.track-ora.com/rates',
  })

  const isMobile = useIsMobile()
  const { user } = useAuth()
  const { remaining, isLimited, isPro, consume } = useRateQuota()
  const [authModal, setAuthModal] = useState<'signin' | 'signup' | null>(null)

  const [originCountry, setOriginCountry]   = useState('')
  const [originCity,    setOriginCity]      = useState('')
  const [destCountry,   setDestCountry]     = useState('')
  const [destCity,      setDestCity]        = useState('')
  const [weight,        setWeight]          = useState('')
  const [unit,          setUnit]            = useState<'kg' | 'lbs'>('kg')
  const [dimL,          setDimL]            = useState('')
  const [dimW,          setDimW]            = useState('')
  const [dimH,          setDimH]            = useState('')
  const [carriers,      setCarriers]        = useState<CarrierKey[]>(['DHL', 'FedEx', 'UPS', 'Aramex'])
  const [results,       setResults]         = useState<RateResult[] | null>(null)
  const [error,         setError]           = useState('')
  const [loading,       setLoading]         = useState(false)

  const originCities = useMemo(() => getCities(originCountry), [originCountry])
  const destCities   = useMemo(() => getCities(destCountry),   [destCountry])

  const countryOptions: SelectOption[] = COUNTRIES.map(c => ({ value: c.iso, label: c.name }))

  function handleOriginCountry(iso: string) { setOriginCountry(iso); setOriginCity('') }
  function handleDestCountry(iso: string)   { setDestCountry(iso);   setDestCity('')   }

  function toggleCarrier(c: CarrierKey) {
    setCarriers(prev => prev.includes(c) ? (prev.length > 1 ? prev.filter(x => x !== c) : prev) : [...prev, c])
  }

  function calculate() {
    setError('')
    if (!user) { setAuthModal('signup'); return }
    if (!originCountry) return setError('Please select an origin country.')
    if (!destCountry)   return setError('Please select a destination country.')
    const w = parseFloat(weight)
    if (!weight || isNaN(w) || w <= 0) return setError('Enter a valid weight.')
    const kg = unit === 'lbs' ? w * 0.453592 : w
    const l  = parseFloat(dimL) || 0
    const ww = parseFloat(dimW) || 0
    const h  = parseFloat(dimH) || 0
    setLoading(true)
    setTimeout(() => {
      setResults(calcRates(originCountry, destCountry, kg, l, ww, h, carriers))
      consume()
      setLoading(false)
    }, 400)
  }

  // Group results by carrier
  const grouped = useMemo(() => {
    if (!results) return []
    const map = new Map<CarrierKey, RateResult[]>()
    for (const r of results) {
      if (!map.has(r.carrier)) map.set(r.carrier, [])
      map.get(r.carrier)!.push(r)
    }
    return Array.from(map.entries())
  }, [results])

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#f8fafc', outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '11px', color: 'rgba(248,250,252,0.45)', fontWeight: 600,
    display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px',
  }

  const formPanel = (
    <div style={{
      padding: isMobile ? '20px' : '28px', borderRadius: '20px',
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      boxSizing: 'border-box', width: '100%',
    }}>
      <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '18px' }}>
        Shipment Details
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Origin country + city */}
        <div>
          <label style={labelStyle}>Origin</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <SearchSelect
              value={originCountry} onChange={handleOriginCountry}
              options={countryOptions} placeholder="Select country…" searchPlaceholder="Search country…"
            />
            {originCountry && originCities.length > 0 && (
              <SearchSelect
                value={originCity} onChange={setOriginCity}
                options={originCities.map(c => ({ value: c.code, label: c.label }))}
                placeholder="Select city / airport (optional)" searchPlaceholder="Search city…"
              />
            )}
          </div>
        </div>

        {/* Destination country + city */}
        <div>
          <label style={labelStyle}>Destination</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <SearchSelect
              value={destCountry} onChange={handleDestCountry}
              options={countryOptions} placeholder="Select country…" searchPlaceholder="Search country…"
            />
            {destCountry && destCities.length > 0 && (
              <SearchSelect
                value={destCity} onChange={setDestCity}
                options={destCities.map(c => ({ value: c.code, label: c.label }))}
                placeholder="Select city / airport (optional)" searchPlaceholder="Search city…"
              />
            )}
          </div>
        </div>

        {/* Weight */}
        <div>
          <label style={labelStyle}>Weight</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number" min="0.1" step="0.1" value={weight}
              onChange={e => setWeight(e.target.value)} placeholder="e.g. 2.5"
              style={{ ...inputStyle, flex: 1, width: 'auto' }}
            />
            <div style={{ display: 'flex', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
              {(['kg', 'lbs'] as const).map(u => (
                <button key={u} onClick={() => setUnit(u)} style={{
                  padding: '10px 13px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: unit === u ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)',
                  color: unit === u ? '#818cf8' : 'rgba(248,250,252,0.5)',
                }}>
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label style={labelStyle}>
            Dimensions (cm) <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, opacity: 0.6 }}>— optional</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {[{ val: dimL, set: setDimL, ph: 'Length' }, { val: dimW, set: setDimW, ph: 'Width' }, { val: dimH, set: setDimH, ph: 'Height' }].map(({ val, set, ph }) => (
              <input key={ph} type="number" min="0" step="0.1"
                value={val} onChange={e => set(e.target.value)} placeholder={ph}
                style={{ ...inputStyle, textAlign: 'center', padding: '10px 6px' }}
              />
            ))}
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(248,250,252,0.3)', margin: '6px 0 0' }}>
            Vol. weight = L × W × H ÷ 5000. Chargeable = higher, rounded up to 0.5 kg.
          </p>
        </div>

        {/* Carriers */}
        <div>
          <label style={labelStyle}>Carriers</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {(['DHL', 'FedEx', 'UPS', 'Aramex'] as CarrierKey[]).map(c => {
              const meta = CARRIER_META[c]
              const active = carriers.includes(c)
              return (
                <button key={c} onClick={() => toggleCarrier(c)} style={{
                  padding: '8px 10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', border: '1px solid', display: 'flex', alignItems: 'center', gap: '8px',
                  borderColor: active ? meta.primary + '50' : 'rgba(255,255,255,0.08)',
                  background: active ? meta.bg : 'rgba(255,255,255,0.02)',
                  color: active ? meta.primary : 'rgba(248,250,252,0.35)',
                }}>
                  <img src={`${LOGO_BASE}/${meta.slug}.svg`} alt={c}
                    style={{ width: '20px', height: '20px', objectFit: 'contain', opacity: active ? 1 : 0.4 }}
                    onError={e => { (e.currentTarget as HTMLElement).style.display = 'none' }}
                  />
                  {c}
                </button>
              )
            })}
          </div>
        </div>

        {error && <p style={{ fontSize: '13px', color: '#f87171', margin: 0 }}>{error}</p>}

        {/* CTA — three states: guest / quota-exceeded / normal */}
        {!user ? (
          <div style={{ padding: '20px', borderRadius: '14px', textAlign: 'center', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <LogIn size={22} color="#818cf8" style={{ marginBottom: '10px' }} />
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>Sign up to get rates</p>
            <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)', marginBottom: '16px' }}>
              Free account — takes 10 seconds. 30 rate searches/month included.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setAuthModal('signup')} style={{
                flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: 700,
                cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white', boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
              }}>Create free account</button>
              <button onClick={() => setAuthModal('signin')} style={{
                flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                cursor: 'pointer', border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.04)', color: 'rgba(248,250,252,0.75)',
              }}>Sign in</button>
            </div>
          </div>
        ) : isLimited ? (
          <div style={{ padding: '18px', borderRadius: '14px', textAlign: 'center', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>Monthly limit reached</p>
            <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)', marginBottom: '14px' }}>
              Free accounts get 30 rate searches/month. Upgrade to Pro for unlimited.
            </p>
            <Link to="/plans" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 22px', borderRadius: '10px', textDecoration: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontSize: '14px', fontWeight: 700 }}>
              <Zap size={14} /> Upgrade to Pro
            </Link>
          </div>
        ) : (
          <>
            <button onClick={calculate} disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: '12px', fontSize: '15px', fontWeight: 700,
              cursor: loading ? 'default' : 'pointer', border: 'none',
              background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              {loading
                ? <span style={{ display: 'inline-flex', gap: '4px' }}>{[0,1,2].map(i => <span key={i} style={{ width:'5px', height:'5px', borderRadius:'50%', background:'white', animation:'pulse 1s ease-in-out infinite', animationDelay:`${i*0.2}s` }} />)}</span>
                : <><Calculator size={16} /> Calculate Rates</>}
            </button>
            {!isPro && (
              <p style={{ fontSize: '12px', color: 'rgba(248,250,252,0.3)', textAlign: 'center', margin: 0 }}>
                {remaining === Infinity ? 'Unlimited' : `${remaining} of 30`} free searches remaining this month
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )

  const resultsPanel = (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      {grouped.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {grouped.map(([carrier, services]) => (
            <CarrierGroup key={carrier} carrier={carrier} services={services} />
          ))}

          <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '12px', color: 'rgba(248,250,252,0.35)', lineHeight: 1.7, margin: 0 }}>
              Estimates include a ~20% fuel surcharge and are based on 2024 published rate cards.
              Actual charges may vary. Contact the carrier directly for a binding quote.
            </p>
          </div>

          <div style={{ padding: '20px', borderRadius: '14px', textAlign: 'center', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.6)', marginBottom: '12px' }}>Already shipped? Track it in real time.</p>
            <Link to="/track" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 22px', borderRadius: '10px', textDecoration: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontSize: '14px', fontWeight: 700 }}>
              Track a shipment →
            </Link>
          </div>
        </div>
      ) : (
        <div style={{ minHeight: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', borderRadius: '20px', gap: '14px', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <Calculator size={24} color="#6366f1" />
          </div>
          <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.4)', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
            Fill in the shipment details and click<br />"Calculate Rates" to see estimates
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1020px', margin: '0 auto', padding: isMobile ? '40px 20px' : '60px 24px' }}>

        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '100px', marginBottom: '16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', fontSize: '11px', color: '#818cf8', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
            <Calculator size={11} /> Rate Calculator
          </div>
          <h1 style={{ fontSize: isMobile ? '28px' : '44px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-1.5px', marginBottom: '14px', lineHeight: 1.1 }}>
            Shipping Rate Calculator
          </h1>
          <p style={{ fontSize: isMobile ? '15px' : '18px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
            Instant estimated rates across all services — DHL, FedEx, UPS, and Aramex.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '400px 1fr', gap: '24px', alignItems: 'start', width: '100%' }}>
          <div style={{ minWidth: 0, width: '100%' }}>{formPanel}</div>
          <div style={{ minWidth: 0, width: '100%' }}>{resultsPanel}</div>
        </div>

        <AdUnit slot="5988077434" style={{ marginTop: '48px' }} />
      </div>

      {authModal && (
        <AuthModal
          initialMode={authModal}
          onClose={() => setAuthModal(null)}
          guestLimitMessage="Create a free account to access the shipping rate calculator."
        />
      )}
    </div>
  )
}
