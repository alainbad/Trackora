import { ExternalLink, Loader2 } from 'lucide-react'
import type { DetectedCarrier } from '../../data/carrierDetect'
import { useIsMobile } from '../../hooks/useIsMobile'

interface Props {
  carrier:      DetectedCarrier
  trackingNumber: string
  filledUrl:    string
  loading?:     boolean   // true while inline API fetch is in progress
}

const CATEGORY_LABEL: Record<string, string> = {
  express: 'Express / Parcel',
  sea:     'Sea Freight',
  air:     'Air Cargo',
  post:    'Postal / EMS',
  land:    'Land Freight',
}

const CATEGORY_EMOJI: Record<string, string> = {
  express: '⚡', sea: '🚢', air: '✈️', post: '📮', land: '🚛',
}

export default function CarrierRedirectCard({ carrier, trackingNumber, filledUrl, loading }: Props) {
  const isMobile = useIsMobile()

  return (
    <div style={{
      maxWidth: '600px', margin: '0 auto',
      borderRadius: '20px', overflow: 'hidden',
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${carrier.accentColor}35`,
      boxShadow: `0 0 50px ${carrier.accentColor}15`,
    }}>

      {/* Header */}
      <div style={{
        padding: isMobile ? '20px 20px 16px' : '26px 28px 20px',
        background: `linear-gradient(135deg, ${carrier.accentColor}20, transparent 70%)`,
        borderBottom: `1px solid ${carrier.accentColor}20`,
        display: 'flex', alignItems: 'center', gap: '16px',
      }}>
        {/* Logo / colour swatch */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '14px', flexShrink: 0,
          background: carrier.logoUrl ? '#fff' : `${carrier.accentColor}25`,
          border: `1px solid ${carrier.accentColor}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {carrier.logoUrl ? (
            <img src={carrier.logoUrl} alt={carrier.name}
              style={{ maxWidth: '80%', maxHeight: '38px', objectFit: 'contain' }} />
          ) : (
            <span style={{ fontSize: '24px' }}>{CATEGORY_EMOJI[carrier.category] ?? '📦'}</span>
          )}
        </div>

        <div style={{ minWidth: 0 }}>
          <p style={{
            margin: '0 0 3px', fontSize: '11px', fontWeight: 700,
            letterSpacing: '1.2px', textTransform: 'uppercase',
            color: `${carrier.accentColor}cc`,
          }}>
            {CATEGORY_LABEL[carrier.category] ?? carrier.category}
            {carrier.hint ? ` · ${carrier.hint}` : ''}
          </p>
          <h2 style={{
            margin: 0, fontSize: isMobile ? '20px' : '22px',
            fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.3px',
          }}>
            {carrier.name}
          </h2>
        </div>

        {/* Confidence badge */}
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, padding: '4px 10px',
            borderRadius: '100px', letterSpacing: '0.5px', textTransform: 'uppercase',
            background: carrier.confidence === 'high'
              ? 'rgba(52,211,153,0.15)' : 'rgba(245,158,11,0.15)',
            color: carrier.confidence === 'high' ? '#34d399' : '#f59e0b',
            border: `1px solid ${carrier.confidence === 'high' ? 'rgba(52,211,153,0.3)' : 'rgba(245,158,11,0.3)'}`,
          }}>
            {carrier.confidence === 'high' ? '✓ Identified' : '~ Likely'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: isMobile ? '20px' : '24px 28px' }}>

        {/* Tracking number pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '9px 16px', borderRadius: '10px', marginBottom: '22px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(248,250,252,0.35)' }}>
            Tracking #
          </span>
          <span style={{
            fontFamily: 'monospace', fontSize: '15px', letterSpacing: '1.5px',
            color: '#f8fafc', fontWeight: 700,
          }}>
            {trackingNumber}
          </span>
        </div>

        {/* Status while loading inline data */}
        {loading && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '10px', marginBottom: '18px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            fontSize: '13px', color: 'rgba(248,250,252,0.6)',
          }}>
            <Loader2 size={14} style={{ animation: 'spin 0.9s linear infinite', flexShrink: 0 }} />
            Fetching inline tracking data…
          </div>
        )}

        {/* Instruction */}
        <p style={{
          margin: '0 0 22px', fontSize: '14px',
          color: 'rgba(248,250,252,0.55)', lineHeight: 1.65,
        }}>
          Click below to open{' '}
          <strong style={{ color: 'rgba(248,250,252,0.85)' }}>{carrier.name}</strong>'s
          official tracking page — your tracking number is pre-filled and results
          will load instantly.
        </p>

        {/* Primary CTA */}
        <a
          href={filledUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '9px', padding: '14px 28px', borderRadius: '13px',
            textDecoration: 'none', width: '100%', boxSizing: 'border-box',
            background: `linear-gradient(135deg, ${carrier.accentColor}, ${carrier.accentColor}bb)`,
            color: 'white', fontSize: '15px', fontWeight: 700,
            boxShadow: `0 6px 24px ${carrier.accentColor}40`,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <ExternalLink size={17} />
          Track on {carrier.name}
        </a>

        {carrier.confidence === 'medium' && (
          <p style={{
            margin: '12px 0 0', fontSize: '12px', textAlign: 'center',
            color: 'rgba(248,250,252,0.35)', lineHeight: 1.5,
          }}>
            Not the right carrier? Use the search to track with a different one.
          </p>
        )}
      </div>
    </div>
  )
}
