import { useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, Package, Clock, ChevronDown, Zap, LogIn } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'
import { useRateQuota } from '../hooks/useRateQuota'
import { useAuth } from '../contexts/AuthContext'
import { calcRates, COUNTRIES, type RateResult } from '../data/shippingRates'
import AdUnit from '../components/ui/AdUnit'
import AuthModal from '../components/auth/AuthModal'

type Carrier = 'DHL' | 'FedEx' | 'UPS' | 'Aramex'

const CARRIER_META: Record<Carrier, { primary: string; bg: string; border: string; service: string; slug: string }> = {
  DHL:    { primary: '#FFCC00', bg: 'rgba(255,204,0,0.07)',   border: 'rgba(255,204,0,0.2)',  service: 'DHL Express Worldwide',           slug: 'dhl'    },
  FedEx:  { primary: '#FF6200', bg: 'rgba(255,98,0,0.07)',    border: 'rgba(255,98,0,0.2)',   service: 'FedEx International Priority',    slug: 'fedex'  },
  UPS:    { primary: '#C8960C', bg: 'rgba(200,150,12,0.07)',  border: 'rgba(200,150,12,0.2)', service: 'UPS Worldwide Express',           slug: 'ups'    },
  Aramex: { primary: '#E8412C', bg: 'rgba(232,65,44,0.07)',   border: 'rgba(232,65,44,0.2)',  service: 'Aramex Express International',   slug: 'aramex' },
}

const LOGO_BASE = 'https://assets.aftership.com/couriers/svg'

// Searchable country dropdown
function CountrySelect({
  value, onChange, placeholder,
}: { value: string; onChange: (iso: string) => void; placeholder: string }) {
  const [query, setQuery] = useState('')
  const [open, setOpen]   = useState(false)
  const ref               = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() =>
    COUNTRIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 80),
    [query]
  )
  const selected = COUNTRIES.find(c => c.iso === value)

  function pick(iso: string) {
    onChange(iso)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
          color: selected ? '#f8fafc' : 'rgba(248,250,252,0.35)', fontSize: '14px',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.name : placeholder}
        </span>
        <ChevronDown size={14} color="rgba(248,250,252,0.4)" style={{ flexShrink: 0, marginLeft: '8px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </div>
      {open && (
        <div style={{
          position: 'absolute', zIndex: 200, top: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#0f1629', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.7)', overflow: 'hidden',
        }}>
          <div style={{ padding: '8px' }}>
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search country…"
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '8px', fontSize: '13px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#f8fafc', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {filtered.map(c => (
              <div
                key={c.iso}
                onClick={() => pick(c.iso)}
                style={{
                  padding: '9px 14px', fontSize: '14px', cursor: 'pointer',
                  color: c.iso === value ? '#818cf8' : 'rgba(248,250,252,0.8)',
                  background: c.iso === value ? 'rgba(99,102,241,0.1)' : 'transparent',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = c.iso === value ? 'rgba(99,102,241,0.1)' : 'transparent' }}
              >
                {c.name}
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

function CarrierLogo({ carrier }: { carrier: Carrier }) {
  const [ok, setOk] = useState(true)
  const meta = CARRIER_META[carrier]
  if (!ok) return (
    <div style={{
      width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: meta.bg, border: `1px solid ${meta.border}`, fontSize: '11px', fontWeight: 700, color: meta.primary,
    }}>
      {carrier.slice(0, 3)}
    </div>
  )
  return (
    <img
      src={`${LOGO_BASE}/${meta.slug}.svg`}
      alt={carrier}
      onError={() => setOk(false)}
      style={{ width: '44px', height: '44px', objectFit: 'contain', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', padding: '6px', boxSizing: 'border-box' }}
    />
  )
}

function ResultCard({ result }: { result: RateResult }) {
  const meta = CARRIER_META[result.carrier as Carrier]
  return (
    <div style={{
      padding: '20px 22px', borderRadius: '16px',
      background: meta.bg, border: `1px solid ${meta.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
        <CarrierLogo carrier={result.carrier as Carrier} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>{result.carrier}</div>
          <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.45)', marginTop: '2px' }}>{meta.service}</div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: meta.primary, whiteSpace: 'nowrap' }}>
            ~${result.low}–${result.high}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(248,250,252,0.4)', marginTop: '2px' }}>USD estimate</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'rgba(248,250,252,0.5)', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Clock size={12} />
          {result.transitDays}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Package size={12} />
          {result.chargeableKg.toFixed(1)} kg chargeable
          {result.volKg > result.actualKg && (
            <span style={{ color: 'rgba(248,250,252,0.35)' }}>(vol: {result.volKg.toFixed(2)} kg)</span>
          )}
        </span>
      </div>
    </div>
  )
}

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

  const [origin,   setOrigin]   = useState('')
  const [dest,     setDest]     = useState('')
  const [weight,   setWeight]   = useState('')
  const [unit,     setUnit]     = useState<'kg' | 'lbs'>('kg')
  const [dimL,     setDimL]     = useState('')
  const [dimW,     setDimW]     = useState('')
  const [dimH,     setDimH]     = useState('')
  const [carriers, setCarriers] = useState<Carrier[]>(['DHL', 'FedEx', 'UPS', 'Aramex'])
  const [results,  setResults]  = useState<RateResult[] | null>(null)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  function toggleCarrier(c: Carrier) {
    setCarriers(prev =>
      prev.includes(c) ? (prev.length > 1 ? prev.filter(x => x !== c) : prev) : [...prev, c]
    )
  }

  function calculate() {
    setError('')
    if (!user) { setAuthModal('signup'); return }
    if (!origin) return setError('Please select an origin country.')
    if (!dest)   return setError('Please select a destination country.')
    const w = parseFloat(weight)
    if (!weight || isNaN(w) || w <= 0) return setError('Enter a valid weight.')

    const kg = unit === 'lbs' ? w * 0.453592 : w
    const l  = parseFloat(dimL) || 0
    const ww = parseFloat(dimW) || 0
    const h  = parseFloat(dimH) || 0

    setLoading(true)
    setTimeout(() => {
      const res = calcRates(origin, dest, kg, l, ww, h, carriers)
      setResults(res)
      consume()
      setLoading(false)
    }, 400)
  }

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#f8fafc', outline: 'none', width: '100%', boxSizing: 'border-box',
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
        {/* Origin */}
        <div>
          <label style={{ fontSize: '11px', color: 'rgba(248,250,252,0.45)', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Origin Country
          </label>
          <CountrySelect value={origin} onChange={setOrigin} placeholder="Select origin…" />
        </div>

        {/* Destination */}
        <div>
          <label style={{ fontSize: '11px', color: 'rgba(248,250,252,0.45)', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Destination Country
          </label>
          <CountrySelect value={dest} onChange={setDest} placeholder="Select destination…" />
        </div>

        {/* Weight */}
        <div>
          <label style={{ fontSize: '11px', color: 'rgba(248,250,252,0.45)', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Weight
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="number" min="0.1" step="0.1"
              value={weight} onChange={e => setWeight(e.target.value)}
              placeholder="e.g. 2.5"
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
          <label style={{ fontSize: '11px', color: 'rgba(248,250,252,0.45)', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Dimensions (cm) <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, opacity: 0.6 }}>— optional</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {[
              { val: dimL, set: setDimL, ph: 'Length' },
              { val: dimW, set: setDimW, ph: 'Width'  },
              { val: dimH, set: setDimH, ph: 'Height' },
            ].map(({ val, set, ph }) => (
              <input
                key={ph} type="number" min="0" step="0.1"
                value={val} onChange={e => set(e.target.value)} placeholder={ph}
                style={{ ...inputStyle, textAlign: 'center', padding: '10px 6px' }}
              />
            ))}
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(248,250,252,0.3)', marginTop: '6px', margin: '6px 0 0' }}>
            Volumetric weight = L × W × H ÷ 5000. Chargeable = higher of actual vs volumetric, rounded up to 0.5 kg.
          </p>
        </div>

        {/* Carriers */}
        <div>
          <label style={{ fontSize: '11px', color: 'rgba(248,250,252,0.45)', fontWeight: 600, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Carriers
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {(['DHL', 'FedEx', 'UPS', 'Aramex'] as Carrier[]).map(c => {
              const meta = CARRIER_META[c]
              const active = carriers.includes(c)
              return (
                <button
                  key={c}
                  onClick={() => toggleCarrier(c)}
                  style={{
                    padding: '8px 10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                    cursor: 'pointer', border: '1px solid', display: 'flex', alignItems: 'center', gap: '8px',
                    borderColor: active ? meta.primary + '50' : 'rgba(255,255,255,0.08)',
                    background: active ? meta.bg : 'rgba(255,255,255,0.02)',
                    color: active ? meta.primary : 'rgba(248,250,252,0.35)',
                  }}
                >
                  <img
                    src={`${LOGO_BASE}/${meta.slug}.svg`}
                    alt={c}
                    style={{ width: '20px', height: '20px', objectFit: 'contain', opacity: active ? 1 : 0.4 }}
                    onError={e => { (e.currentTarget as HTMLElement).style.display = 'none' }}
                  />
                  {c}
                </button>
              )
            })}
          </div>
        </div>

        {error && (
          <p style={{ fontSize: '13px', color: '#f87171', margin: 0 }}>{error}</p>
        )}

        {!user ? (
          <div style={{
            padding: '20px', borderRadius: '14px', textAlign: 'center',
            background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)',
          }}>
            <LogIn size={22} color="#818cf8" style={{ marginBottom: '10px' }} />
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
              Sign up to get rates
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)', marginBottom: '16px' }}>
              Free account — takes 10 seconds. 30 rate searches/month included.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setAuthModal('signup')}
                style={{
                  flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer', border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: 'white', boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                }}
              >
                Create free account
              </button>
              <button
                onClick={() => setAuthModal('signin')}
                style={{
                  flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                  cursor: 'pointer', border: '1px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.04)', color: 'rgba(248,250,252,0.75)',
                }}
              >
                Sign in
              </button>
            </div>
          </div>
        ) : isLimited ? (
          <div style={{
            padding: '18px', borderRadius: '14px', textAlign: 'center',
            background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)',
          }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
              Monthly limit reached
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)', marginBottom: '14px' }}>
              Free accounts get 30 rate searches/month. Upgrade to Pro for unlimited.
            </p>
            <Link
              to="/plans"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '10px 22px', borderRadius: '10px', textDecoration: 'none',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white', fontSize: '14px', fontWeight: 700,
              }}
            >
              <Zap size={14} /> Upgrade to Pro
            </Link>
          </div>
        ) : (
          <>
            <button
              onClick={calculate}
              disabled={loading}
              style={{
                width: '100%', padding: '13px', borderRadius: '12px', fontSize: '15px', fontWeight: 700,
                cursor: loading ? 'default' : 'pointer', border: 'none',
                background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white', boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? (
                <span style={{ display: 'inline-flex', gap: '4px' }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: '5px', height: '5px', borderRadius: '50%', background: 'white',
                      animation: 'pulse 1s ease-in-out infinite', animationDelay: `${i * 0.2}s`,
                    }} />
                  ))}
                </span>
              ) : (
                <><Calculator size={16} /> Calculate Rates</>
              )}
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
      {results ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {results.map(r => <ResultCard key={r.carrier} result={r} />)}

          <div style={{
            padding: '14px 16px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(248,250,252,0.35)', lineHeight: 1.7, margin: 0 }}>
              Estimates include a ~20% fuel surcharge and are based on 2024 published rate cards.
              Actual charges may vary based on remote area surcharges, additional services, and current carrier rates.
              Contact the carrier directly for a binding quote.
            </p>
          </div>

          <div style={{
            padding: '20px', borderRadius: '14px', textAlign: 'center',
            background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)',
          }}>
            <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.6)', marginBottom: '12px' }}>
              Already shipped? Track it in real time.
            </p>
            <Link
              to="/track"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '10px 22px', borderRadius: '10px', textDecoration: 'none',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white', fontSize: '14px', fontWeight: 700,
              }}
            >
              Track a shipment →
            </Link>
          </div>
        </div>
      ) : (
        <div style={{
          minHeight: '240px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '40px', borderRadius: '20px', gap: '14px',
          background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)',
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
          }}>
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

        {/* Header */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px', borderRadius: '100px', marginBottom: '16px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            fontSize: '11px', color: '#818cf8', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            <Calculator size={11} />
            Rate Calculator
          </div>
          <h1 style={{ fontSize: isMobile ? '28px' : '44px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-1.5px', marginBottom: '14px', lineHeight: 1.1 }}>
            Shipping Rate Calculator
          </h1>
          <p style={{ fontSize: isMobile ? '15px' : '18px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto' }}>
            Instant estimated rates for DHL, FedEx, UPS, and Aramex — based on weight, dimensions, and route.
          </p>
        </div>

        {/* Main layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '400px 1fr',
          gap: '24px',
          alignItems: 'start',
          width: '100%',
        }}>
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
