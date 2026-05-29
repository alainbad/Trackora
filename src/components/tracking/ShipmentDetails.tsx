import type { Shipment } from '../../data/mockShipments'
import { Plane, Ship, Truck, Package, Navigation, Weight, Box, Hash, Calendar, ExternalLink } from 'lucide-react'
import { getCarrierTrackUrl } from '../../lib/trackingApi'
import { getContainerRedirect, getContainerRedirectByCarrier } from '../../data/containerRedirects'

/** Format an ETA value — handles ISO timestamps, date strings, and "TBD" */
function formatETA(eta: string | undefined): string {
  if (!eta || eta === 'TBD') return eta ?? 'TBD'
  try {
    const d = new Date(eta)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  } catch { /* fall through */ }
  return eta
}

/** IATA-style Dangerous Goods diamond badge */
function DGBadge({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 28 : 36
  const font = size === 'sm' ? 8 : 10
  return (
    <div title="Dangerous Goods (IATA/IMDG)" style={{ position: 'relative', width: dim, height: dim, flexShrink: 0 }}>
      {/* Outer diamond */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #f97316, #dc2626)',
        transform: 'rotate(45deg)',
        borderRadius: size === 'sm' ? '3px' : '4px',
        boxShadow: '0 0 8px rgba(249,115,22,0.5)',
      }} />
      {/* Inner white border */}
      <div style={{
        position: 'absolute', inset: '3px',
        border: '1.5px solid rgba(255,255,255,0.9)',
        transform: 'rotate(45deg)',
        borderRadius: '2px',
      }} />
      {/* DG text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '1px',
      }}>
        <span style={{ fontSize: font + 1, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.5px' }}>DG</span>
        <span style={{ fontSize: font - 2, fontWeight: 700, color: 'rgba(255,255,255,0.85)', lineHeight: 1, letterSpacing: '0.3px' }}>HAZMAT</span>
      </div>
    </div>
  )
}

export { DGBadge }

/** Great-circle distance between two lat/lng points in km (haversine). */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const TYPE_META = {
  air: { icon: Plane, label: 'Air Freight', color: '#22d3ee', bg: 'rgba(6,182,212,0.12)' },
  sea: { icon: Ship, label: 'Sea Freight', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  land: { icon: Truck, label: 'Land Freight', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  express: { icon: Package, label: 'Express Courier', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  in_transit: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', label: 'In Transit' },
  delivered: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'Delivered' },
  customs: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', label: 'Customs Hold' },
  delayed: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Delayed' },
  picked_up: { bg: 'rgba(6,182,212,0.15)', color: '#22d3ee', label: 'Picked Up' },
  out_for_delivery: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', label: 'Out for Delivery' },
}

interface Props {
  shipment: Shipment
}

export default function ShipmentDetails({ shipment }: Props) {
  const type = TYPE_META[shipment.freightType]
  const TypeIcon = type.icon
  const status = STATUS_STYLES[shipment.status]

  const details = [
    { icon: Hash,     label: 'Tracking Number', value: shipment.trackingNumber },
    { icon: TypeIcon, label: 'Carrier',          value: shipment.service && shipment.service !== shipment.carrier ? `${shipment.carrier} · ${shipment.service}` : shipment.carrier },
    { icon: Calendar, label: 'Est. Delivery',    value: formatETA(shipment.estimatedDelivery) },
    { icon: Weight,   label: 'Weight',           value: shipment.weight },
    // Only show dimensions when the carrier actually provides them
    ...(shipment.dimensions && shipment.dimensions !== '—' ? [{ icon: Box, label: 'Dimensions', value: shipment.dimensions }] : []),
    ...(shipment.pieces > 1 ? [{ icon: Box, label: 'Pieces', value: String(shipment.pieces) }] : []),
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Card */}
      <div style={{
        padding: '24px',
        borderRadius: '20px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        {/* Type + Status + DG */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', borderRadius: '100px',
            background: type.bg,
            border: `1px solid ${type.color}30`,
            fontSize: '13px', fontWeight: 600, color: type.color,
          }}>
            <TypeIcon size={14} />
            {type.label}
          </div>

          {/* DG diamond badge */}
          {shipment.dangerousGoods && <DGBadge />}
          <div style={{
            padding: '6px 14px', borderRadius: '100px',
            background: status.bg,
            fontSize: '13px', fontWeight: 600, color: status.color,
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: status.color,
              display: 'inline-block',
              animation: shipment.status !== 'delivered' ? 'ping 2s cubic-bezier(0,0,0.2,1) infinite' : 'none',
            }} />
            {status.label}
          </div>
        </div>

        {/* Route */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>
              {shipment.origin.code || '—'}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.5)' }}>
              {[shipment.origin.city, shipment.origin.country].filter(Boolean).join(', ') || 'Origin unknown'}
            </div>
          </div>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.08)' }} />
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: type.color, flexShrink: 0,
              margin: '0 2px',
            }} />
            <div style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.08)', borderStyle: 'dashed' }} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>
              {shipment.destination.code || '—'}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.5)' }}>
              {[shipment.destination.city, shipment.destination.country].filter(Boolean).join(', ') || 'Destination unknown'}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: 'rgba(248,250,252,0.45)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: type.color, display: 'inline-block' }} />
          {(() => {
            const parts = [shipment.currentLocation.city, shipment.currentLocation.country].filter(s => s && s !== 'Destination' && s !== 'Origin')
            return parts.length ? `Currently: ${parts.join(', ')}` : 'Location not yet available'
          })()}
        </div>
      </div>

      {/* ETA Card — shows carrier-provided estimate, no fake AI confidence */}
      <div style={{
        padding: '20px 24px',
        borderRadius: '16px',
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Calendar size={16} color="#818cf8" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#818cf8' }}>Estimated Delivery</span>
          <div style={{
            marginLeft: 'auto',
            padding: '2px 8px', borderRadius: '100px',
            background: 'rgba(255,255,255,0.06)',
            fontSize: '11px', fontWeight: 500, color: 'rgba(248,250,252,0.4)',
          }}>
            Carrier data
          </div>
        </div>
        {shipment.estimatedDelivery && shipment.estimatedDelivery !== 'TBD' ? (
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
            {formatETA(shipment.estimatedDelivery)}
          </div>
        ) : (
          <div style={{ fontSize: '14px', color: 'rgba(248,250,252,0.4)', fontStyle: 'italic' }}>
            Not yet provided by carrier
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div style={{
        padding: '20px 24px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(248,250,252,0.5)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
          Shipment Details
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {details.map((d, i) => {
            const Icon = d.icon
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(248,250,252,0.45)', fontSize: '13px' }}>
                  <Icon size={14} />
                  {d.label}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', textAlign: 'right', maxWidth: '55%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {d.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Route Distance Card */}
      {(() => {
        const { origin: o, destination: d, freightType: ft } = shipment
        const hasCoords = (o.lat !== 0 || o.lng !== 0) && (d.lat !== 0 || d.lng !== 0)
        const distKm = hasCoords ? Math.round(haversineKm(o.lat, o.lng, d.lat, d.lng)) : null
        const modeLabel = ft === 'air' ? 'Air route' : ft === 'sea' ? 'Sea route' : ft === 'land' ? 'Land route' : 'Express route'

        return (
          <div style={{
            padding: '18px 24px', borderRadius: '16px',
            background: 'rgba(52,211,153,0.06)',
            border: '1px solid rgba(52,211,153,0.15)',
            display: 'flex', alignItems: 'center', gap: '14px',
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
              background: 'rgba(52,211,153,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Navigation size={18} color="#34d399" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#34d399', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Route Distance
              </div>
              {distKm ? (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc' }}>
                    ~{distKm.toLocaleString()} km
                  </span>
                  <span style={{ fontSize: '12px', color: 'rgba(52,211,153,0.7)', fontWeight: 600 }}>
                    {modeLabel}
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: '14px', color: 'rgba(248,250,252,0.35)', fontStyle: 'italic' }}>
                  Route pending carrier data
                </div>
              )}
            </div>
          </div>
        )
      })()}

      {/* Track on carrier website — always-visible link at the bottom of the details card */}
      {(() => {
        const { trackingNumber: tn, carrier } = shipment
        const expressUrl = getCarrierTrackUrl(carrier, tn)
        const ctnRedir   = !expressUrl
          ? (getContainerRedirect(tn) ?? getContainerRedirectByCarrier(tn, carrier))
          : null
        const link = expressUrl
          ? { url: expressUrl, name: carrier }
          : ctnRedir
            ? { url: ctnRedir.trackUrl, name: ctnRedir.shippingLine }
            : null
        if (!link || carrier === 'Ocean Carrier') return null
        return (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '13px 20px', borderRadius: '14px',
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.25)',
              color: '#818cf8', fontSize: '14px', fontWeight: 600,
              textDecoration: 'none', transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(99,102,241,0.08)')}
          >
            <ExternalLink size={15} />
            Track on {link.name} website
          </a>
        )
      })()}
    </div>
  )
}
