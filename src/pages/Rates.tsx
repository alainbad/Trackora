import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, Package, Clock, ChevronDown, Zap, LogIn, Plane, Ship, Plus, X } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'
import { useRateQuota } from '../hooks/useRateQuota'
import { useAuth } from '../contexts/AuthContext'
import { calcRates, COUNTRIES, type RateResult, type CarrierKey } from '../data/shippingRates'
import { calcAirRates, AIR_CARRIER_META, type AirCarrier, type AirRateResult, type CommodityType } from '../data/airFreightRates'
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

// Module-level constants
const COUNTRY_OPTIONS: SelectOption[] = COUNTRIES.map(c => ({ value: c.iso, label: c.name }))

const INPUT_STYLE: React.CSSProperties = {
  padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#f8fafc', outline: 'none', width: '100%', boxSizing: 'border-box',
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: '11px', color: 'rgba(248,250,252,0.45)', fontWeight: 600,
  display: 'block', marginBottom: '6px', textTransform: 'uppercase' as const, letterSpacing: '0.5px',
}

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

// ── City combobox — dropdown suggestions + free-text input ────────────────────
function CityCombobox({
  value, onChange, options, placeholder = 'City / airport (optional)',
}: {
  value: string
  onChange: (v: string) => void
  options: SelectOption[]
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [inputVal, setInputVal] = useState(value)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Keep inputVal in sync when value changes externally (e.g. postal auto-fill)
  useEffect(() => { setInputVal(value) }, [value])

  const filtered = useMemo(() =>
    inputVal.trim()
      ? options.filter(o => o.label.toLowerCase().includes(inputVal.toLowerCase())).slice(0, 60)
      : options.slice(0, 60),
    [options, inputVal]
  )

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function handleInput(v: string) {
    setInputVal(v)
    onChange(v)
    setOpen(true)
  }

  function pick(opt: SelectOption) {
    const label = opt.label.split(' (')[0] // strip "(IATA)" suffix for display
    setInputVal(label)
    onChange(label)
    setOpen(false)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <input
        type="text"
        value={inputVal}
        onChange={e => handleInput(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        style={{ ...INPUT_STYLE, paddingRight: '14px' }}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', zIndex: 200, top: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#0f1629', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.7)', maxHeight: '220px', overflowY: 'auto',
        }}>
          {filtered.map(o => (
            <div key={o.value} onMouseDown={() => pick(o)} style={{
              padding: '9px 14px', cursor: 'pointer', fontSize: '13px', color: '#f8fafc',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >{o.label}</div>
          ))}
        </div>
      )}
    </div>
  )
}


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

// ── Air carrier logos ─────────────────────────────────────────────────────────
// AfterShip slug for carriers that have one; others fall back to favicon chain
const AIR_AFTERSHIP_SLUG: Partial<Record<AirCarrier, string>> = {
  DHLGlobal:  'dhl',
  FedExCargo: 'fedex',
}
const AIR_LOGO_DOMAIN: Partial<Record<AirCarrier, string>> = {
  Emirates:  'emirates.com',
  Lufthansa: 'lufthansa.com',
  Qatar:     'qatarairways.com',
  Turkish:   'turkishairlines.com',
  Etihad:    'etihad.com',
  Cargolux:  'cargolux.com',
  OmanAir:   'omanair.com',
}
const AIR_LOGO_ABBR: Record<AirCarrier, string> = {
  Emirates:'EK', Lufthansa:'LH', Qatar:'QR', Turkish:'TK', Etihad:'EY',
  Cargolux:'CV', OmanAir:'WY', MEA:'ME', DHLGlobal:'DHL', FedExCargo:'FDX',
}

const LOGO_STYLE = (size: number): React.CSSProperties => ({
  width: size, height: size, objectFit: 'contain', borderRadius: '0',
  background: 'rgba(255,255,255,0.06)', padding: '0', boxSizing: 'border-box', flexShrink: 0,
})

function AirCarrierLogo({ carrier, size = 36 }: { carrier: AirCarrier; size?: number }) {
  const meta = AIR_CARRIER_META[carrier]
  const [idx, setIdx] = useState(0)
  const [failed, setFailed] = useState(false)


  const slug = AIR_AFTERSHIP_SLUG[carrier]
  const domain = AIR_LOGO_DOMAIN[carrier]

  const sources: string[] = slug
    ? [`${LOGO_BASE}/${slug}.svg`]
    : carrier === 'MEA'
      ? ['/logos/mea.svg']
      : domain
        ? [
            `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
            `https://icons.duckduckgo.com/ip3/${domain}.ico`,
          ]
        : []

  function handleError() {
    if (idx < sources.length - 1) setIdx(i => i + 1)
    else setFailed(true)
  }
  function handleLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (e.currentTarget.naturalWidth < 12) handleError()
  }

  if (failed || sources.length === 0) return (
    <div style={{
      width: size, height: size, borderRadius: '0', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: meta.bg, border: `1px solid ${meta.border}`,
      fontSize: size <= 28 ? '9px' : '11px', fontWeight: 800, color: meta.primary,
    }}>{AIR_LOGO_ABBR[carrier]}</div>
  )
  return (
    <img key={sources[idx]} src={sources[idx]} alt={carrier}
      onError={handleError} onLoad={handleLoad}
      style={LOGO_STYLE(size)}
    />
  )
}

// ── Package item type ─────────────────────────────────────────────────────────
interface PkgItem { id: number; weight: string; dimL: string; dimW: string; dimH: string }
let _pkgId = 0
function newPkg(): PkgItem { return { id: ++_pkgId, weight: '', dimL: '', dimW: '', dimH: '' } }

// ── PackagesInput component ───────────────────────────────────────────────────
function PackagesInput({
  packages, onChange, unit, onUnit, divisor,
}: {
  packages: PkgItem[]
  onChange: (pkgs: PkgItem[]) => void
  unit: 'kg' | 'lbs'
  onUnit: (u: 'kg' | 'lbs') => void
  divisor: number
}) {
  function update(id: number, field: keyof PkgItem, val: string) {
    onChange(packages.map(p => p.id === id ? { ...p, [field]: val } : p))
  }
  function remove(id: number) {
    if (packages.length > 1) onChange(packages.filter(p => p.id !== id))
  }
  function add() { onChange([...packages, newPkg()]) }

  const totalChargeable = packages.reduce((sum, p) => {
    const actual = (parseFloat(p.weight) || 0) * (unit === 'lbs' ? 0.453592 : 1)
    if (actual <= 0) return sum
    const l = parseFloat(p.dimL) || 0, w = parseFloat(p.dimW) || 0, h = parseFloat(p.dimH) || 0
    const vol = (l > 0 && w > 0 && h > 0) ? (l * w * h) / divisor : 0
    return sum + Math.ceil(Math.max(actual, vol) * 2) / 2
  }, 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label style={LABEL_STYLE}>Packages / Pallets</label>
        <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          {(['kg', 'lbs'] as const).map(u => (
            <button key={u} onClick={() => onUnit(u)} style={{
              padding: '5px 10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none',
              background: unit === u ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)',
              color: unit === u ? '#818cf8' : 'rgba(248,250,252,0.5)',
            }}>{u}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {packages.map((p, i) => (
          <div key={p.id} style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            {packages.length > 1 && (
              <span style={{ fontSize: '11px', color: 'rgba(248,250,252,0.3)', minWidth: '16px', flexShrink: 0 }}>#{i + 1}</span>
            )}
            <input
              type="number" min="0.1" step="0.1" value={p.weight}
              onChange={e => update(p.id, 'weight', e.target.value)}
              placeholder={`Wt (${unit})`} autoComplete="off"
              style={{ ...INPUT_STYLE, flex: '1.4', width: 'auto', minWidth: 0 }}
            />
            {(['dimL', 'dimW', 'dimH'] as const).map((f, fi) => (
              <input
                key={f} type="number" min="0" step="1" value={p[f]}
                onChange={e => update(p.id, f, e.target.value)}
                placeholder={['L', 'W', 'H'][fi]} autoComplete="off"
                style={{ ...INPUT_STYLE, flex: 1, width: 'auto', minWidth: 0, textAlign: 'center', padding: '10px 4px', fontSize: '13px' }}
              />
            ))}
            {packages.length > 1 ? (
              <button onClick={() => remove(p.id)} style={{
                padding: '8px 7px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)', cursor: 'pointer', color: 'rgba(248,250,252,0.4)',
                flexShrink: 0, display: 'flex', alignItems: 'center',
              }}>
                <X size={12} />
              </button>
            ) : <div style={{ width: '30px', flexShrink: 0 }} />}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
        <button onClick={add} style={{
          display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px',
          borderRadius: '8px', fontSize: '12px', fontWeight: 600,
          cursor: 'pointer', border: '1px dashed rgba(255,255,255,0.15)',
          background: 'transparent', color: 'rgba(248,250,252,0.45)',
        }}>
          <Plus size={12} /> Add box / pallet
        </button>
        {totalChargeable > 0 && (
          <span style={{ fontSize: '11px', color: 'rgba(248,250,252,0.4)' }}>
            Total: <strong style={{ color: '#818cf8' }}>{totalChargeable.toFixed(1)} kg</strong>
          </span>
        )}
      </div>
      <p style={{ fontSize: '11px', color: 'rgba(248,250,252,0.25)', margin: '4px 0 0' }}>
        Dims in cm. Vol. = L×W×H÷{divisor}. Chargeable = higher value, rounded to 0.5 kg.
      </p>
    </div>
  )
}

// ── State / region → primary airport fallback for postal code lookup ─────────
const STATE_AIRPORT: Record<string, Record<string, string>> = {
  DE: {
    'Bayern': 'MUC', 'Bavaria': 'MUC',
    'Baden-Württemberg': 'STR',
    'Nordrhein-Westfalen': 'CGN', 'North Rhine-Westphalia': 'CGN',
    'Hessen': 'FRA', 'Hesse': 'FRA',
    'Hamburg': 'HAM', 'Bremen': 'BRE',
    'Berlin': 'BER', 'Brandenburg': 'BER',
    'Sachsen': 'DRS', 'Saxony': 'DRS',
    'Sachsen-Anhalt': 'LEJ', 'Thüringen': 'LEJ', 'Thuringia': 'LEJ',
    'Niedersachsen': 'HAJ', 'Lower Saxony': 'HAJ',
    'Schleswig-Holstein': 'HAM', 'Mecklenburg-Vorpommern': 'HAM',
    'Rheinland-Pfalz': 'FRA', 'Saarland': 'FRA',
  },
  US: {
    'California': 'LAX', 'New York': 'JFK', 'Texas': 'DFW', 'Florida': 'MIA',
    'Illinois': 'ORD', 'Georgia': 'ATL', 'Washington': 'SEA', 'Massachusetts': 'BOS',
    'Colorado': 'DEN', 'Nevada': 'LAS', 'Arizona': 'PHX', 'Michigan': 'DTW',
    'Pennsylvania': 'PHL', 'North Carolina': 'CLT', 'Missouri': 'STL',
    'Maryland': 'BWI', 'Virginia': 'IAD', 'Oregon': 'PDX', 'Minnesota': 'MSP',
    'Tennessee': 'BNA', 'Louisiana': 'MSY', 'Utah': 'SLC', 'Ohio': 'CMH',
    'Indiana': 'IND', 'Wisconsin': 'MKE', 'Oklahoma': 'OKC', 'Kansas': 'MCI',
    'Nebraska': 'OMA', 'New Mexico': 'ABQ', 'Hawaii': 'HNL', 'Alaska': 'ANC',
  },
  GB: {
    'England': 'LHR', 'Scotland': 'EDI', 'Wales': 'CWL', 'Northern Ireland': 'BHD',
    'Greater London': 'LHR', 'West Midlands': 'BHX', 'Greater Manchester': 'MAN',
    'West Yorkshire': 'LBA', 'Merseyside': 'LPL', 'Tyne and Wear': 'NCL',
    'South Yorkshire': 'MAN', 'Lothian': 'EDI', 'Strathclyde': 'GLA',
  },
  FR: {
    'Île-de-France': 'CDG', 'Auvergne-Rhône-Alpes': 'LYS',
    "Provence-Alpes-Côte d'Azur": 'MRS', 'Occitanie': 'TLS',
    'Nouvelle-Aquitaine': 'BOD', 'Pays de la Loire': 'NTE',
    'Hauts-de-France': 'LIL', 'Grand Est': 'SXB', 'Bretagne': 'RNS',
    'Normandie': 'CDG',
  },
  IT: {
    'Lazio': 'FCO', 'Lombardia': 'MXP', 'Veneto': 'VCE', 'Campania': 'NAP',
    'Emilia-Romagna': 'BLQ', 'Toscana': 'FLR', 'Piemonte': 'TRN',
    'Sicilia': 'CTA', 'Puglia': 'BRI', 'Liguria': 'GOA',
  },
  ES: {
    'Madrid': 'MAD', 'Cataluña': 'BCN', 'Andalucía': 'AGP',
    'Comunidad Valenciana': 'VLC', 'País Vasco': 'BIO', 'Aragón': 'ZAZ',
    'Galicia': 'SCQ', 'Asturias': 'OVD', 'Canarias': 'ACE',
  },
  AU: {
    'New South Wales': 'SYD', 'Victoria': 'MEL', 'Queensland': 'BNE',
    'Western Australia': 'PER', 'South Australia': 'ADL',
    'Australian Capital Territory': 'CBR', 'Tasmania': 'HBA', 'Northern Territory': 'DRW',
  },
  CA: {
    'Ontario': 'YYZ', 'British Columbia': 'YVR', 'Quebec': 'YUL',
    'Alberta': 'YYC', 'Manitoba': 'YWG', 'Saskatchewan': 'YQR',
    'Nova Scotia': 'YHZ', 'New Brunswick': 'YQM',
  },
  IN: {
    'Maharashtra': 'BOM', 'Delhi': 'DEL', 'Karnataka': 'BLR',
    'Tamil Nadu': 'MAA', 'West Bengal': 'CCU', 'Telangana': 'HYD',
    'Gujarat': 'AMD', 'Rajasthan': 'JAI', 'Uttar Pradesh': 'LKO',
    'Punjab': 'ATQ', 'Kerala': 'COK',
  },
}

function lookupStateAirport(country: string, state: string, cities: { code: string; label: string }[]) {
  const map = STATE_AIRPORT[country]
  if (!map || !state) return null
  // exact match first, then partial
  let code = map[state]
  if (!code) {
    const entry = Object.entries(map).find(([k]) =>
      state.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(state.toLowerCase())
    )
    code = entry?.[1] ?? ''
  }
  return code ? (cities.find(c => c.code === code) ?? null) : null
}

// ── LocationField component ───────────────────────────────────────────────────
function LocationField({
  label, country, onCountry, city, onCity, cities,
}: {
  label: string
  country: string
  onCountry: (v: string) => void
  city: string
  onCity: (v: string) => void
  cities: { code: string; label: string }[]
}) {
  const [postal, setPostal] = useState('')
  const [looking, setLooking] = useState(false)
  const [hint, setHint] = useState('')

  async function handlePostal(code: string) {
    setPostal(code)
    setHint('')
    if (!country || code.replace(/\s/g, '').length < 3) return
    setLooking(true)

    let place = ''
    let state = ''

    try {
      // Primary: zippopotam.us
      const res = await fetch(`https://api.zippopotam.us/${country.toLowerCase()}/${encodeURIComponent(code.trim())}`)
      if (res.ok) {
        const data = await res.json()
        place = data.places?.[0]?.['place name'] ?? ''
        state = data.places?.[0]?.['state'] ?? ''
      }
    } catch { /* ignore */ }

    // Fallback: OpenStreetMap Nominatim (broader country coverage)
    if (!place) {
      try {
        const countryCode = country.toLowerCase()
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(code.trim())}&countrycodes=${countryCode}&format=json&limit=1&addressdetails=1`
        )
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            const addr = data[0].address ?? {}
            place = addr.city || addr.town || addr.village || addr.municipality || addr.county || ''
            state = addr.state || addr.region || addr['state_district'] || ''
            // If place is still empty, parse from display_name
            if (!place && data[0].display_name) {
              place = data[0].display_name.split(',')[0].trim()
            }
          }
        }
      } catch { /* ignore */ }
    }

    if (place) {
      const placeLower = place.toLowerCase()
      let match = cities.find(c => {
        const cityName = c.label.toLowerCase().split(' (')[0]
        return c.label.toLowerCase().includes(placeLower.split(' ')[0]) ||
               placeLower.includes(cityName)
      })
      if (!match && state) match = lookupStateAirport(country, state, cities) ?? undefined
      if (!match && cities.length > 0) match = cities[0]

      if (match) {
        const cityDisplay = match.label.split(' (')[0]
        onCity(cityDisplay)
        setHint(place.toLowerCase() === cityDisplay.toLowerCase() ? place : `${place} → ${cityDisplay}`)
      } else {
        onCity(place)
        setHint(place)
      }
    }

    setLooking(false)
  }

  return (
    <div>
      <label style={LABEL_STYLE}>{label}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <SearchSelect
          value={country}
          onChange={v => { onCountry(v); setPostal(''); setHint('') }}
          options={COUNTRY_OPTIONS}
          placeholder="Select country…"
          searchPlaceholder="Search country…"
        />
        {country && (
          <CityCombobox
            value={city}
            onChange={onCity}
            options={cities.map(c => ({ value: c.code, label: c.label }))}
            placeholder="City / airport (optional)"
          />
        )}
        {country && (
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={postal}
              onChange={e => handlePostal(e.target.value)}
              placeholder="Postal code (optional — auto-fills city)"
              style={{ ...INPUT_STYLE, paddingRight: hint || looking ? '120px' : '14px', fontSize: '13px' }}
            />
            {looking && (
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: 'rgba(248,250,252,0.35)' }}>
                Looking up…
              </span>
            )}
            {hint && !looking && (
              <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#4ade80', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {hint}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Air freight result group ──────────────────────────────────────────────────
function AirCarrierGroup({ carrier, services }: { carrier: AirCarrier; services: AirRateResult[] }) {
  const meta = AIR_CARRIER_META[carrier]
  const displayName = carrier === 'DHLGlobal' ? 'DHL Global Forwarding' : carrier === 'FedExCargo' ? 'FedEx Air Cargo' : carrier === 'OmanAir' ? 'Oman Air Cargo' : carrier
  return (
    <div style={{ borderRadius: '18px', overflow: 'hidden', border: `1px solid ${meta.border}`, background: meta.bg }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: `1px solid ${meta.border}` }}>
        <AirCarrierLogo carrier={carrier} size={36} />
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>{displayName}</span>
      </div>

      {services.map((r, i) => (
        <div key={r.serviceCode} style={{
          padding: '14px 20px',
          borderBottom: i < services.length - 1 ? `1px solid ${meta.border}` : 'none',
          display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{r.serviceName}</span>
              {r.minChargeApplied && (
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24', letterSpacing: '0.3px' }}>
                  min. charge
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'rgba(248,250,252,0.45)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={11} /> {r.transitDays}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Package size={11} />
                {r.chargeableKg.toFixed(1)} kg
                {r.volKg > r.actualKg && <span style={{ color: 'rgba(248,250,252,0.3)' }}>(vol)</span>}
              </span>
              <span style={{ color: 'rgba(248,250,252,0.35)' }}>~${r.ratePerKgLow.toFixed(2)}–${r.ratePerKgHigh.toFixed(2)}/kg</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '19px', fontWeight: 800, color: meta.primary, whiteSpace: 'nowrap' }}>
              ~${r.totalLow}–${r.totalHigh}
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
    title: 'Shipping Rate Calculator — DHL, FedEx, UPS & Aramex Instant Estimates | Trackora',
    description: 'Calculate international shipping rates instantly. Compare DHL Express, FedEx International Priority & Economy, UPS Worldwide Express & Expedited, and Aramex — by weight, dimensions, origin and destination. Free to use.',
    canonical: 'https://www.track-ora.com/rates',
  })

  const isMobile = useIsMobile()
  const { user } = useAuth()
  const { remaining, isLimited, isPro, consume } = useRateQuota()
  const [authModal, setAuthModal] = useState<'signin' | 'signup' | null>(null)

  // ── Restore form from localStorage cache ──────────────────────────────────
  const CACHE_KEY = 'trackora_rates_v1'
  function loadCache() {
    try {
      const c = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
      // Re-assign fresh IDs to cached packages so they don't collide with _pkgId counter
      if (c.pkgs?.length)    c.pkgs    = c.pkgs.map((p: PkgItem)    => ({ ...p, id: ++_pkgId }))
      if (c.airPkgs?.length) c.airPkgs = c.airPkgs.map((p: PkgItem) => ({ ...p, id: ++_pkgId }))
      return c
    } catch { return {} }
  }
  const _c = loadCache()

  const [freightTab, setFreightTab] = useState<'express' | 'air'>(_c.freightTab ?? 'express')

  // Express courier state
  const [originCountry, setOriginCountry] = useState<string>(_c.originCountry ?? '')
  const [originCity,    setOriginCity]    = useState<string>(_c.originCity    ?? '')
  const [destCountry,   setDestCountry]   = useState<string>(_c.destCountry   ?? '')
  const [destCity,      setDestCity]      = useState<string>(_c.destCity      ?? '')
  const [unit,          setUnit]          = useState<'kg' | 'lbs'>(_c.unit    ?? 'kg')
  const [pkgs,          setPkgs]          = useState<PkgItem[]>(_c.pkgs?.length ? _c.pkgs : [newPkg()])
  const [carriers,      setCarriers]      = useState<CarrierKey[]>(_c.carriers ?? ['DHL', 'FedEx', 'UPS', 'Aramex'])
  const [results,       setResults]       = useState<RateResult[] | null>(null)
  const [error,         setError]         = useState('')
  const [loading,       setLoading]       = useState(false)

  // Air freight state
  const [airOriginCountry, setAirOriginCountry] = useState<string>(_c.airOriginCountry ?? '')
  const [airOriginCity,    setAirOriginCity]    = useState<string>(_c.airOriginCity    ?? '')
  const [airDestCountry,   setAirDestCountry]   = useState<string>(_c.airDestCountry   ?? '')
  const [airDestCity,      setAirDestCity]      = useState<string>(_c.airDestCity      ?? '')
  const [airUnit,          setAirUnit]          = useState<'kg' | 'lbs'>(_c.airUnit    ?? 'kg')
  const [airPkgs,          setAirPkgs]          = useState<PkgItem[]>(_c.airPkgs?.length ? _c.airPkgs : [newPkg()])
  const [commodity,        setCommodity]        = useState<CommodityType>(_c.commodity  ?? 'general')
  const [airCarriers,      setAirCarriers]      = useState<AirCarrier[]>(_c.airCarriers ?? ['Emirates', 'Lufthansa', 'Qatar', 'Turkish', 'Etihad', 'Cargolux', 'OmanAir', 'MEA', 'DHLGlobal', 'FedExCargo'])
  const [airResults,       setAirResults]       = useState<AirRateResult[] | null>(null)
  const [airError,         setAirError]         = useState('')
  const [airLoading,       setAirLoading]       = useState(false)

  // ── Persist form to localStorage whenever inputs change ───────────────────
  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        freightTab,
        originCountry, originCity, destCountry, destCity, unit, pkgs, carriers,
        airOriginCountry, airOriginCity, airDestCountry, airDestCity,
        airUnit, airPkgs, commodity, airCarriers,
      }))
    } catch { /* storage full or private mode */ }
  }, [freightTab, originCountry, originCity, destCountry, destCity, unit, pkgs, carriers,
      airOriginCountry, airOriginCity, airDestCountry, airDestCity, airUnit, airPkgs, commodity, airCarriers])

  const airOriginCities = useMemo(() => getCities(airOriginCountry), [airOriginCountry])
  const airDestCities   = useMemo(() => getCities(airDestCountry),   [airDestCountry])

  const originCities = useMemo(() => getCities(originCountry), [originCountry])
  const destCities   = useMemo(() => getCities(destCountry),   [destCountry])

  function toggleCarrier(c: CarrierKey) {
    setCarriers(prev => prev.includes(c) ? (prev.length > 1 ? prev.filter(x => x !== c) : prev) : [...prev, c])
  }

  function sumChargeableKg(items: PkgItem[], u: 'kg' | 'lbs', divisor: number): number {
    let total = 0
    for (const p of items) {
      const actual = (parseFloat(p.weight) || 0) * (u === 'lbs' ? 0.453592 : 1)
      if (actual <= 0) continue
      const l = parseFloat(p.dimL) || 0, w = parseFloat(p.dimW) || 0, h = parseFloat(p.dimH) || 0
      const vol = (l > 0 && w > 0 && h > 0) ? l * w * h / divisor : 0
      total += Math.ceil(Math.max(actual, vol) * 2) / 2
    }
    return total
  }

  function calculate() {
    setError('')
    if (!user) { setAuthModal('signup'); return }
    if (!originCountry) return setError('Please select an origin country.')
    if (!destCountry)   return setError('Please select a destination country.')
    const totalKg = sumChargeableKg(pkgs, unit, 5000)
    if (totalKg <= 0) return setError('Enter a valid weight for at least one package.')
    setLoading(true)
    setTimeout(() => {
      setResults(calcRates(originCountry, destCountry, totalKg, 0, 0, 0, carriers))
      consume()
      setLoading(false)
    }, 400)
  }

  function calculateAir() {
    setAirError('')
    if (!user) { setAuthModal('signup'); return }
    if (!airOriginCountry) return setAirError('Please select an origin country.')
    if (!airDestCountry)   return setAirError('Please select a destination country.')
    const totalKg = sumChargeableKg(airPkgs, airUnit, 6000)
    if (totalKg <= 0) return setAirError('Enter a valid weight for at least one package.')
    setAirLoading(true)
    setTimeout(() => {
      setAirResults(calcAirRates(airOriginCountry, airDestCountry, totalKg, 0, 0, 0, airCarriers, commodity))
      consume()
      setAirLoading(false)
    }, 400)
  }

  function toggleAirCarrier(c: AirCarrier) {
    setAirCarriers(prev => prev.includes(c) ? (prev.length > 1 ? prev.filter(x => x !== c) : prev) : [...prev, c])
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

  const airGrouped = useMemo(() => {
    if (!airResults) return []
    const map = new Map<AirCarrier, AirRateResult[]>()
    for (const r of airResults) {
      if (!map.has(r.carrier)) map.set(r.carrier, [])
      map.get(r.carrier)!.push(r)
    }
    return Array.from(map.entries())
  }, [airResults])

  const airFormPanel = (
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
        <LocationField
          label="Origin"
          country={airOriginCountry}
          onCountry={v => { setAirOriginCountry(v); setAirOriginCity('') }}
          city={airOriginCity}
          onCity={setAirOriginCity}
          cities={airOriginCities}
        />

        {/* Destination */}
        <LocationField
          label="Destination"
          country={airDestCountry}
          onCountry={v => { setAirDestCountry(v); setAirDestCity('') }}
          city={airDestCity}
          onCity={setAirDestCity}
          cities={airDestCities}
        />

        {/* Packages */}
        <PackagesInput
          packages={airPkgs}
          onChange={setAirPkgs}
          unit={airUnit}
          onUnit={setAirUnit}
          divisor={6000}
        />

        {/* Commodity type */}
        <div>
          <label style={LABEL_STYLE}>Commodity Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {([
              { value: 'general',    label: 'General',    desc: 'Standard cargo' },
              { value: 'perishable', label: 'Perishables', desc: '+15% surcharge' },
              { value: 'dangerous',  label: 'Dangerous',  desc: '+25% surcharge' },
            ] as { value: CommodityType; label: string; desc: string }[]).map(opt => (
              <button key={opt.value} onClick={() => setCommodity(opt.value)} style={{
                padding: '9px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', border: '1px solid',
                borderColor: commodity === opt.value ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)',
                background: commodity === opt.value ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)',
                color: commodity === opt.value ? '#818cf8' : 'rgba(248,250,252,0.4)',
                textAlign: 'center',
              }}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Air carriers */}
        <div>
          <label style={LABEL_STYLE}>Carriers</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {(['Emirates', 'Lufthansa', 'Qatar', 'Turkish', 'Etihad', 'Cargolux', 'OmanAir', 'MEA', 'DHLGlobal', 'FedExCargo'] as AirCarrier[]).map(c => {
              const active = airCarriers.includes(c)
              const displayName = c === 'OmanAir' ? 'Oman Air' : c === 'DHLGlobal' ? 'DHL Global' : c === 'FedExCargo' ? 'FedEx Cargo' : c
              return (
                <button key={c} onClick={() => toggleAirCarrier(c)} style={{
                  padding: '8px 10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', border: '1px solid', display: 'flex', alignItems: 'center', gap: '8px',
                  borderColor: active ? 'rgba(34,197,94,0.45)' : 'rgba(255,255,255,0.08)',
                  background: active ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.02)',
                  color: active ? '#4ade80' : 'rgba(248,250,252,0.35)',
                  minWidth: 0,
                }}>
                  <div style={{ opacity: active ? 1 : 0.4, flexShrink: 0 }}>
                    <AirCarrierLogo carrier={c} size={22} />
                  </div>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</span>
                </button>
              )
            })}
          </div>
        </div>

        {airError && <p style={{ fontSize: '13px', color: '#f87171', margin: 0 }}>{airError}</p>}

        {!user ? (
          <div style={{ padding: '20px', borderRadius: '14px', textAlign: 'center', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <LogIn size={22} color="#818cf8" style={{ marginBottom: '10px' }} />
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>Sign up to get rates</p>
            <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)', marginBottom: '16px' }}>Free account — takes 10 seconds. 30 rate searches/month included.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setAuthModal('signup')} style={{ flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', boxShadow: '0 4px 14px rgba(99,102,241,0.3)' }}>Create free account</button>
              <button onClick={() => setAuthModal('signin')} style={{ flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'rgba(248,250,252,0.75)' }}>Sign in</button>
            </div>
          </div>
        ) : isLimited ? (
          <div style={{ padding: '18px', borderRadius: '14px', textAlign: 'center', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>Monthly limit reached</p>
            <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)', marginBottom: '14px' }}>Free accounts get 30 rate searches/month. Upgrade to Pro for unlimited.</p>
            <Link to="/plans" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 22px', borderRadius: '10px', textDecoration: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', fontSize: '14px', fontWeight: 700 }}>
              <Zap size={14} /> Upgrade to Pro
            </Link>
          </div>
        ) : (
          <>
            <button onClick={calculateAir} disabled={airLoading} style={{
              width: '100%', padding: '13px', borderRadius: '12px', fontSize: '15px', fontWeight: 700,
              cursor: airLoading ? 'default' : 'pointer', border: 'none',
              background: airLoading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              {airLoading
                ? <span style={{ display: 'inline-flex', gap: '4px' }}>{[0,1,2].map(i => <span key={i} style={{ width:'5px', height:'5px', borderRadius:'50%', background:'white', animation:'pulse 1s ease-in-out infinite', animationDelay:`${i*0.2}s` }} />)}</span>
                : <><Plane size={16} /> Calculate Air Rates</>}
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

  const airResultsPanel = (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      {airGrouped.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {airGrouped.map(([carrier, services]) => (
            <AirCarrierGroup key={carrier} carrier={carrier} services={services} />
          ))}
          <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '12px', color: 'rgba(248,250,252,0.35)', lineHeight: 1.7, margin: 0 }}>
              Estimates include a ~30% fuel surcharge and are based on IATA zone-based rate guidance.
              Perishables and dangerous goods carry additional surcharges. Contact the airline for a binding quote.
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
            <Plane size={24} color="#6366f1" />
          </div>
          <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.4)', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
            Fill in the shipment details and click<br />"Calculate Air Rates" to see estimates
          </p>
        </div>
      )}
    </div>
  )

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
        <LocationField
          label="Origin"
          country={originCountry}
          onCountry={v => { setOriginCountry(v); setOriginCity('') }}
          city={originCity}
          onCity={setOriginCity}
          cities={originCities}
        />

        {/* Destination */}
        <LocationField
          label="Destination"
          country={destCountry}
          onCountry={v => { setDestCountry(v); setDestCity('') }}
          city={destCity}
          onCity={setDestCity}
          cities={destCities}
        />

        {/* Packages */}
        <PackagesInput
          packages={pkgs}
          onChange={setPkgs}
          unit={unit}
          onUnit={setUnit}
          divisor={5000}
        />

        {/* Carriers */}
        <div>
          <label style={LABEL_STYLE}>Carriers</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {(['DHL', 'FedEx', 'UPS', 'Aramex'] as CarrierKey[]).map(c => {
              const meta = CARRIER_META[c]
              const active = carriers.includes(c)
              return (
                <button key={c} onClick={() => toggleCarrier(c)} style={{
                  padding: '8px 10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', border: '1px solid', display: 'flex', alignItems: 'center', gap: '8px',
                  borderColor: active ? 'rgba(34,197,94,0.45)' : 'rgba(255,255,255,0.08)',
                  background: active ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.02)',
                  color: active ? '#4ade80' : 'rgba(248,250,252,0.35)',
                }}>
                  <img src={`${LOGO_BASE}/${meta.slug}.svg`} alt={c}
                    style={{ width: '20px', height: '20px', objectFit: 'contain', opacity: active ? 1 : 0.35 }}
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
            Instant estimated rates across express courier and air freight services.
          </p>
        </div>

        {/* Freight type tab bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {([
            { key: 'express', icon: <Calculator size={14} />, label: 'Express Courier', disabled: false },
            { key: 'air',     icon: <Plane size={14} />,      label: 'Air Freight',     disabled: false },
            { key: 'sea',     icon: <Ship size={14} />,       label: 'Sea Freight',     disabled: true  },
          ] as { key: string; icon: React.ReactNode; label: string; disabled: boolean }[]).map(tab => (
            <div key={tab.key} style={{ position: 'relative' }}>
              <button
                onClick={() => !tab.disabled && setFreightTab(tab.key as 'express' | 'air')}
                title={tab.disabled ? 'Coming soon' : undefined}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '9px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
                  cursor: tab.disabled ? 'not-allowed' : 'pointer', border: '1px solid',
                  borderColor: freightTab === tab.key && !tab.disabled ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)',
                  background: freightTab === tab.key && !tab.disabled ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                  color: tab.disabled ? 'rgba(248,250,252,0.25)' : freightTab === tab.key ? '#818cf8' : 'rgba(248,250,252,0.55)',
                  opacity: tab.disabled ? 0.6 : 1,
                }}
              >
                {tab.icon}
                {tab.label}
                {tab.disabled && (
                  <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.07)', color: 'rgba(248,250,252,0.35)', marginLeft: '2px' }}>
                    Soon
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '400px 1fr', gap: '24px', alignItems: 'start', width: '100%' }}>
          {freightTab === 'express' ? (
            <>
              <div style={{ minWidth: 0, width: '100%' }}>{formPanel}</div>
              <div style={{ minWidth: 0, width: '100%' }}>{resultsPanel}</div>
            </>
          ) : (
            <>
              <div style={{ minWidth: 0, width: '100%' }}>{airFormPanel}</div>
              <div style={{ minWidth: 0, width: '100%' }}>{airResultsPanel}</div>
            </>
          )}
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

      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            '@id': 'https://www.track-ora.com/rates#app',
            name: 'Trackora Shipping Rate Calculator',
            url: 'https://www.track-ora.com/rates',
            description: 'Free international shipping rate calculator. Compare DHL, FedEx, UPS, and Aramex rates by weight, dimensions, origin and destination.',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free rate estimates with a free Trackora account' },
            featureList: [
              'DHL Express Worldwide and DHL Express Easy rates',
              'FedEx International Priority and Economy rates',
              'UPS Worldwide Express and Expedited rates',
              'Aramex Express and Deferred International rates',
              'Volumetric weight calculation',
              'Fuel surcharge included',
              'Transit time estimates per service',
            ],
            publisher: { '@type': 'Organization', name: 'Trackora', url: 'https://www.track-ora.com' },
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How do I calculate international shipping rates?',
                acceptedAnswer: { '@type': 'Answer', text: 'Enter your origin country, destination country, package weight, and optional dimensions on the Trackora Rate Calculator. We instantly compare DHL, FedEx, UPS, and Aramex rates including fuel surcharges.' },
              },
              {
                '@type': 'Question',
                name: 'What is volumetric weight in shipping?',
                acceptedAnswer: { '@type': 'Answer', text: 'Volumetric (dimensional) weight = Length × Width × Height (cm) ÷ 5000. Carriers charge whichever is higher — actual weight or volumetric weight — rounded up to the nearest 0.5 kg.' },
              },
              {
                '@type': 'Question',
                name: 'What is the difference between FedEx International Priority and Economy?',
                acceptedAnswer: { '@type': 'Answer', text: 'FedEx International Priority delivers in 1–5 business days depending on zone. FedEx International Economy is 20–30% cheaper but takes 2–14 business days. Both are available on the Trackora rate calculator.' },
              },
              {
                '@type': 'Question',
                name: 'Is DHL Express cheaper than FedEx International Priority?',
                acceptedAnswer: { '@type': 'Answer', text: 'Rates vary by route, weight, and zone. DHL is often cheaper for Middle East and Asia lanes, while FedEx can be more competitive for US routes. Use the Trackora calculator to compare both instantly.' },
              },
              {
                '@type': 'Question',
                name: 'Are these shipping rates accurate?',
                acceptedAnswer: { '@type': 'Answer', text: 'The estimates are based on 2024 published carrier rate cards and include a ~20% fuel surcharge. They are indicative estimates — actual charges may vary based on remote area surcharges and current carrier rates. Contact the carrier for a binding quote.' },
              },
            ],
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.track-ora.com/' },
              { '@type': 'ListItem', position: 2, name: 'Shipping Rate Calculator', item: 'https://www.track-ora.com/rates' },
            ],
          },
        ],
      }) }} />
    </div>
  )
}
