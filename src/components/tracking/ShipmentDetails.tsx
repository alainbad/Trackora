import type { Shipment } from '../../data/mockShipments'
import { Plane, Ship, Truck, Package, Leaf, Weight, Box, Hash, Calendar, Brain, TrendingUp } from 'lucide-react'

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
    { icon: Hash, label: 'Tracking Number', value: shipment.trackingNumber },
    { icon: TypeIcon, label: 'Carrier', value: `${shipment.carrier} · ${shipment.service}` },
    { icon: Calendar, label: 'Est. Delivery', value: shipment.estimatedDelivery },
    { icon: Weight, label: 'Weight', value: shipment.weight },
    { icon: Box, label: 'Dimensions', value: shipment.dimensions },
    { icon: Box, label: 'Pieces', value: String(shipment.pieces) },
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
        {/* Type + Status */}
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
              {shipment.origin.code}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.5)' }}>
              {shipment.origin.city}, {shipment.origin.country}
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
              {shipment.destination.code}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.5)' }}>
              {shipment.destination.city}, {shipment.destination.country}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: 'rgba(248,250,252,0.45)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: type.color, display: 'inline-block' }} />
          Currently: {shipment.currentLocation.city}, {shipment.currentLocation.country}
        </div>
      </div>

      {/* AI ETA Card */}
      <div style={{
        padding: '20px 24px',
        borderRadius: '16px',
        background: 'rgba(99,102,241,0.08)',
        border: '1px solid rgba(99,102,241,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Brain size={16} color="#818cf8" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#818cf8' }}>AI Predicted ETA</span>
          <div style={{
            marginLeft: 'auto',
            padding: '2px 8px', borderRadius: '100px',
            background: 'rgba(16,185,129,0.15)',
            fontSize: '11px', fontWeight: 600, color: '#10b981',
          }}>
            {shipment.etaConfidence}% confidence
          </div>
        </div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>{shipment.aiEta}</div>
        <div style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(248,250,252,0.4)' }}>Confidence</span>
            <span style={{ fontSize: '11px', color: 'rgba(248,250,252,0.4)' }}>{shipment.etaConfidence}%</span>
          </div>
          <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${shipment.etaConfidence}%`,
              background: shipment.etaConfidence >= 85 ? '#10b981' : shipment.etaConfidence >= 70 ? '#f59e0b' : '#ef4444',
              borderRadius: '2px',
              transition: 'width 1s ease',
            }} />
          </div>
        </div>
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

      {/* Carbon Card */}
      <div style={{
        padding: '18px 24px',
        borderRadius: '16px',
        background: 'rgba(52,211,153,0.06)',
        border: '1px solid rgba(52,211,153,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={16} color="#34d399" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#34d399' }}>Carbon Footprint</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc' }}>{shipment.carbonKg} kg CO₂</div>
          </div>
        </div>
        <button style={{
          padding: '8px 16px', borderRadius: '10px',
          background: 'rgba(52,211,153,0.12)',
          border: '1px solid rgba(52,211,153,0.25)',
          color: '#34d399', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <TrendingUp size={12} />
          Offset
        </button>
      </div>
    </div>
  )
}
