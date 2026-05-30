/**
 * SeaFreightTracker
 * Dedicated sea freight tracking UI.
 *
 * Flow:
 * 1. User picks reference type  (Container | B/L | Booking)
 * 2. User picks carrier          (auto-detected from number when possible)
 * 3. User enters number
 * 4. "Track" → opens carrier portal with number pre-filled
 */
import { useState, useEffect } from 'react'
import { Search, ExternalLink, Anchor } from 'lucide-react'
import { SEA_CARRIERS, REF_TYPE_LABELS, buildSeaUrl, type SeaCarrier, type SeaRefType } from '../../data/seaCarriers'
import { useIsMobile } from '../../hooks/useIsMobile'

// ── Auto-detection ────────────────────────────────────────────────────────────
// ISO 6346 owner code (first 3 chars) → carrier slug
const OWNER3: Record<string, string> = {
  MAE:'maersk', MSK:'maersk', APM:'maersk', SUD:'hamburg-sud',
  MSC:'msc', MSD:'msc', MEU:'msc', GES:'msc',
  CMA:'cma-cgm', APR:'cma-cgm',
  HLC:'hapag-lloyd', HLX:'hapag-lloyd',
  COS:'cosco', CBH:'cosco',
  EIT:'evergreen-line', EGL:'evergreen-line',
  ONE:'one', ONY:'one',
  YML:'yang-ming', YMJ:'yang-ming',
  ZIM:'zim',
  HMM:'hmm', SIT:'hmm',
  PIL:'pil',
  WHL:'wan-hai',
}
// 4-char SCAC B/L prefix → carrier slug
const SCAC4: Record<string, string> = {
  MAEU:'maersk', MSKI:'maersk', SEAU:'maersk',
  MSCU:'msc', MSCD:'msc', MEDU:'msc', GESU:'msc',
  HLCU:'hapag-lloyd', HLXU:'hapag-lloyd',
  COSU:'cosco', CBHU:'cosco',
  CMAU:'cma-cgm', APHU:'cma-cgm',
  EITU:'evergreen-line', EGHU:'evergreen-line',
  ONEY:'one', ONEU:'one',
  YMLU:'yang-ming', YMJU:'yang-ming',
  ZIMU:'zim',
}

function autoDetect(val: string): { refType: SeaRefType; carrierSlug: string | null } | null {
  const upper = val.trim().toUpperCase().replace(/\s/g, '')
  if (!upper) return null

  // ISO 6346 container: [A-Z]{3}[UJZ]\d{7}
  if (/^[A-Z]{3}[UJZ]\d{7}$/.test(upper)) {
    return { refType: 'container', carrierSlug: OWNER3[upper.slice(0, 3)] ?? null }
  }
  // SCAC4 B/L prefix
  if (/^[A-Z]{4}/.test(upper) && upper.length >= 9 && !/^[A-Z]{3}[UJZ]\d{7}$/.test(upper)) {
    const slug = SCAC4[upper.slice(0, 4)] ?? null
    if (slug) return { refType: 'bl', carrierSlug: slug }
  }
  return null
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SeaFreightTracker() {
  const isMobile = useIsMobile()

  const [refType,   setRefType]   = useState<SeaRefType>('bl')
  const [carrier,   setCarrier]   = useState<SeaCarrier | null>(null)
  const [number,    setNumber]    = useState('')
  const [autoHint,  setAutoHint]  = useState<string | null>(null)

  // Auto-detect carrier + type from number
  useEffect(() => {
    const d = autoDetect(number)
    if (d) {
      setRefType(d.refType)
      if (d.carrierSlug) {
        const found = SEA_CARRIERS.find(c => c.slug === d.carrierSlug)
        if (found) { setCarrier(found); setAutoHint(found.name) }
        else setAutoHint(null)
      } else {
        setAutoHint(null)
      }
    } else {
      setAutoHint(null)
    }
  }, [number])

  const url = carrier ? buildSeaUrl(carrier, refType, number) : null
  const canTrack = !!carrier && !!number.trim()

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px', overflow: 'hidden',
      boxShadow: '0 0 60px rgba(66,173,239,0.08)',
    }}>

      {/* Header */}
      <div style={{
        padding: isMobile ? '16px 18px' : '20px 24px',
        background: 'linear-gradient(135deg, rgba(66,173,239,0.12), transparent)',
        borderBottom: '1px solid rgba(66,173,239,0.15)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <Anchor size={18} color="#42ADEF" />
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>Sea Freight Tracker</span>
        <span style={{ fontSize: '12px', color: 'rgba(248,250,252,0.4)' }}>· Container · B/L · Booking</span>
      </div>

      <div style={{ padding: isMobile ? '18px' : '24px' }}>

        {/* ── Step 1: Reference type ─────────────────────────────────────── */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(248,250,252,0.4)', marginBottom: '10px' }}>
            1 · Reference Type
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(Object.keys(REF_TYPE_LABELS) as SeaRefType[]).map(rt => {
              const info = REF_TYPE_LABELS[rt]
              const active = refType === rt
              return (
                <button
                  key={rt}
                  onClick={() => setRefType(rt)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '10px', cursor: 'pointer',
                    background: active ? 'rgba(66,173,239,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? 'rgba(66,173,239,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    color: active ? '#42ADEF' : 'rgba(248,250,252,0.6)',
                    fontSize: '13px', fontWeight: 600, transition: 'all 0.15s',
                  }}
                >
                  <span>{info.emoji}</span>
                  <span>{info.short}</span>
                </button>
              )
            })}
          </div>
          <p style={{ fontSize: '11px', color: 'rgba(248,250,252,0.35)', marginTop: '8px' }}>
            {REF_TYPE_LABELS[refType].hint}
          </p>
        </div>

        {/* ── Step 2: Carrier ────────────────────────────────────────────── */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(248,250,252,0.4)', marginBottom: '10px' }}>
            2 · Carrier
            {autoHint && (
              <span style={{ marginLeft: '8px', fontWeight: 600, letterSpacing: 0, color: '#34d399', textTransform: 'none', fontSize: '11px' }}>
                ✓ auto-detected: {autoHint}
              </span>
            )}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {SEA_CARRIERS.filter(c => c.urls[refType] !== undefined).map(c => {
              const active = carrier?.slug === c.slug
              return (
                <button
                  key={c.slug}
                  onClick={() => setCarrier(active ? null : c)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                    background: active ? `${c.accentColor}25` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? c.accentColor + '60' : 'rgba(255,255,255,0.08)'}`,
                    color: active ? c.accentColor : 'rgba(248,250,252,0.7)',
                    fontSize: '13px', fontWeight: 600, transition: 'all 0.15s',
                    boxShadow: active ? `0 0 12px ${c.accentColor}20` : 'none',
                  }}
                >
                  {c.logoUrl
                    ? <img src={c.logoUrl} alt="" style={{ height: '16px', width: 'auto', maxWidth: '36px', objectFit: 'contain', background: '#fff', borderRadius: '3px', padding: '1px 3px' }} />
                    : <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.accentColor, display: 'inline-block', flexShrink: 0 }} />
                  }
                  {c.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Step 3: Number input ───────────────────────────────────────── */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(248,250,252,0.4)', marginBottom: '10px' }}>
            3 · {REF_TYPE_LABELS[refType].short} Number
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 16px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: number ? '0 0 0 2px rgba(66,173,239,0.2)' : 'none',
            transition: 'box-shadow 0.2s',
          }}>
            <Search size={15} color="rgba(248,250,252,0.3)" style={{ flexShrink: 0 }} />
            <input
              value={number}
              onChange={e => setNumber(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && canTrack && url) window.open(url, '_blank') }}
              placeholder={REF_TYPE_LABELS[refType].hint}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: '#f8fafc', fontSize: '15px', fontFamily: number.length > 4 ? 'monospace' : 'inherit',
                letterSpacing: number.length > 4 ? '1px' : 'normal',
              }}
            />
            {number && (
              <button
                onClick={() => { setNumber(''); setCarrier(null) }}
                style={{ background: 'none', border: 'none', color: 'rgba(248,250,252,0.3)', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* ── Track button ───────────────────────────────────────────────── */}
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '13px 24px', borderRadius: '12px',
              textDecoration: 'none', width: '100%', boxSizing: 'border-box',
              background: `linear-gradient(135deg, ${carrier!.accentColor}, ${carrier!.accentColor}cc)`,
              color: 'white', fontSize: '15px', fontWeight: 700,
              boxShadow: `0 6px 24px ${carrier!.accentColor}40`,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <ExternalLink size={16} />
            Track on {carrier!.name}
          </a>
        ) : (
          <button
            disabled
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '13px 24px', borderRadius: '12px',
              width: '100%', boxSizing: 'border-box', cursor: 'not-allowed',
              background: 'rgba(66,173,239,0.15)',
              border: '1px solid rgba(66,173,239,0.2)',
              color: 'rgba(66,173,239,0.4)', fontSize: '15px', fontWeight: 700,
            }}
          >
            <Anchor size={16} />
            {!carrier && !number ? 'Select carrier and enter number'
              : !carrier ? 'Select a carrier above'
              : !number ? 'Enter your reference number'
              : 'Track Now'}
          </button>
        )}

        {/* MSC note (no deep-link support) */}
        {carrier?.slug === 'msc' && (
          <div style={{
            marginTop: '12px', padding: '10px 14px', borderRadius: '10px',
            background: 'rgba(0,48,135,0.15)', border: '1px solid rgba(0,48,135,0.3)',
            fontSize: '12px', color: 'rgba(248,250,252,0.5)', lineHeight: 1.6,
          }}>
            💡 MSC's portal doesn't support pre-filling — after clicking, paste your number <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{number || '...'}</strong> into their search box.
          </div>
        )}

        {/* Quick tips */}
        <div style={{
          marginTop: '16px', padding: '12px 16px', borderRadius: '10px',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 700, color: 'rgba(248,250,252,0.3)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Quick reference</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { ex: 'MSCU1234567',   label: 'Container — auto-detected (MSC)' },
              { ex: 'MAEU265525152', label: 'B/L — auto-detected (Maersk)' },
              { ex: 'HLCU1234567890',label: 'B/L — auto-detected (Hapag-Lloyd)' },
              { ex: '70528270',      label: 'B/L → select CMA CGM above' },
              { ex: '550600041386',  label: 'B/L → select Evergreen above' },
              { ex: '10250467',      label: 'B/L → select Turkon above' },
            ].map(({ ex, label }) => (
              <button
                key={ex}
                onClick={() => setNumber(ex)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '2px 0', textAlign: 'left',
                }}
              >
                <code style={{ fontSize: '11px', color: '#818cf8', fontFamily: 'monospace', letterSpacing: '0.5px' }}>{ex}</code>
                <span style={{ fontSize: '11px', color: 'rgba(248,250,252,0.25)' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
