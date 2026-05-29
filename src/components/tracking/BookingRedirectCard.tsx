import { ExternalLink, Anchor, Plane, BookOpen } from 'lucide-react'
import type { BookingCarrier } from '../../data/bookingRedirects'
import { buildBookingUrl } from '../../data/bookingRedirects'
import { useIsMobile } from '../../hooks/useIsMobile'

interface Props {
  carrier:    BookingCarrier
  bookingRef: string
}

export default function BookingRedirectCard({ carrier, bookingRef }: Props) {
  const isMobile = useIsMobile()
  const url      = buildBookingUrl(carrier, bookingRef)

  return (
    <div style={{
      maxWidth: '640px', margin: '0 auto',
      borderRadius: '20px', overflow: 'hidden',
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${carrier.accentColor}30`,
      boxShadow: `0 0 40px ${carrier.accentColor}12`,
    }}>
      {/* Header bar */}
      <div style={{
        padding: isMobile ? '20px 20px 16px' : '24px 28px 20px',
        background: `linear-gradient(135deg, ${carrier.accentColor}18, transparent)`,
        borderBottom: `1px solid ${carrier.accentColor}20`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Category icon */}
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: `${carrier.accentColor}20`,
            border: `1px solid ${carrier.accentColor}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {carrier.category === 'air'
              ? <Plane    size={22} color={carrier.accentColor} />
              : <Anchor   size={22} color={carrier.accentColor} />
            }
          </div>

          <div style={{ minWidth: 0 }}>
            <p style={{
              margin: '0 0 3px',
              fontSize: '11px', fontWeight: 700, letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: `${carrier.accentColor}cc`,
            }}>
              {carrier.category === 'air' ? 'Air Freight' : 'Sea Freight'} · Booking Reference
            </p>
            <h2 style={{
              margin: 0,
              fontSize: isMobile ? '18px' : '20px', fontWeight: 800,
              color: '#f8fafc', letterSpacing: '-0.3px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {carrier.name}
            </h2>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: isMobile ? '20px' : '24px 28px' }}>

        {/* Booking ref pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '8px 16px', borderRadius: '10px', marginBottom: '18px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <BookOpen size={13} color="rgba(248,250,252,0.4)" />
          <span style={{
            fontFamily: 'monospace', fontSize: '14px', letterSpacing: '1px',
            color: '#f8fafc', fontWeight: 600,
          }}>
            {bookingRef}
          </span>
          <span style={{
            fontSize: '10px', fontWeight: 700,
            color: `${carrier.accentColor}cc`,
            textTransform: 'uppercase', letterSpacing: '0.8px',
          }}>
            {carrier.hint}
          </span>
        </div>

        {/* Explanation */}
        <p style={{
          margin: '0 0 20px',
          fontSize: '14px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.65,
        }}>
          {carrier.supportsDeepLink
            ? <>Booking references are tracked directly on <strong style={{ color: 'rgba(248,250,252,0.75)' }}>{carrier.name}</strong>'s portal.
               Click below to open your shipment — your booking number will be pre-filled.</>
            : <>Booking references for <strong style={{ color: 'rgba(248,250,252,0.75)' }}>{carrier.name}</strong> must be looked up directly on their portal.
               Click below and enter <code style={{ fontFamily: 'monospace', color: carrier.accentColor, background: `${carrier.accentColor}18`, padding: '1px 6px', borderRadius: '4px' }}>{bookingRef}</code> in the search field.</>
          }
        </p>

        {/* What's the difference info box */}
        <div style={{
          padding: '12px 16px', borderRadius: '12px', marginBottom: '20px',
          background: 'rgba(99,102,241,0.07)',
          border: '1px solid rgba(99,102,241,0.18)',
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(248,250,252,0.5)', lineHeight: 1.6 }}>
            <strong style={{ color: '#818cf8' }}>Booking # vs Tracking #: </strong>
            {carrier.category === 'sea'
              ? 'A booking reference is assigned when you reserve space on a vessel. Once cargo is loaded, you\'ll also receive a Bill of Lading (B/L) and container number for more detailed tracking.'
              : 'A booking reference is issued when you book cargo space with the airline. Once the shipment is processed, an Air Waybill (AWB) number is issued — you can track that directly on Trackora.'
            }
          </p>
        </div>

        {/* CTA button */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '13px 24px', borderRadius: '12px', textDecoration: 'none',
            background: `linear-gradient(135deg, ${carrier.accentColor}, ${carrier.accentColor}cc)`,
            color: 'white', fontSize: '15px', fontWeight: 700,
            boxShadow: `0 6px 24px ${carrier.accentColor}35`,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <ExternalLink size={16} />
          Track on {carrier.name}
        </a>
      </div>
    </div>
  )
}
