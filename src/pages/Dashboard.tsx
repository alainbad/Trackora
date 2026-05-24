import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Filter, Plane, Ship, Truck, Package, Brain, Leaf, TrendingUp, AlertTriangle, CheckCircle2, Clock, BarChart3, Zap } from 'lucide-react'
import { getAllShipments, type Shipment } from '../data/mockShipments'

const TYPE_META = {
  air: { icon: Plane, color: '#22d3ee', bg: 'rgba(6,182,212,0.12)' },
  sea: { icon: Ship, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  land: { icon: Truck, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  express: { icon: Package, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string; icon: typeof CheckCircle2 }> = {
  in_transit: { bg: 'rgba(99,102,241,0.12)', color: '#818cf8', label: 'In Transit', icon: Clock },
  delivered: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: 'Delivered', icon: CheckCircle2 },
  customs: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'Customs', icon: AlertTriangle },
  delayed: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'Delayed', icon: AlertTriangle },
  picked_up: { bg: 'rgba(6,182,212,0.12)', color: '#22d3ee', label: 'Picked Up', icon: Clock },
  out_for_delivery: { bg: 'rgba(16,185,129,0.12)', color: '#34d399', label: 'Delivering', icon: Truck },
}

function ShipmentCard({ shipment }: { shipment: Shipment }) {
  const navigate = useNavigate()
  const type = TYPE_META[shipment.freightType]
  const TypeIcon = type.icon
  const status = STATUS_STYLES[shipment.status]
  const StatusIcon = status.icon

  return (
    <div
      onClick={() => navigate(`/track/${shipment.trackingNumber}`)}
      style={{
        padding: '20px 24px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)'
        ;(e.currentTarget as HTMLDivElement).style.borderColor = `${type.color}30`
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
      }}
    >
      {/* Type Icon */}
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
        background: type.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <TypeIcon size={20} color={type.color} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', fontFamily: 'monospace' }}>
            {shipment.trackingNumber}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '2px 10px', borderRadius: '100px',
            background: status.bg, fontSize: '11px', fontWeight: 600, color: status.color,
          }}>
            <StatusIcon size={10} />
            {status.label}
          </span>
          {shipment.delayRisk !== 'low' && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '2px 10px', borderRadius: '100px',
              background: shipment.delayRisk === 'high' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
              fontSize: '11px', fontWeight: 600,
              color: shipment.delayRisk === 'high' ? '#ef4444' : '#f59e0b',
            }}>
              ⚠ Risk
            </span>
          )}
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)' }}>
          {shipment.carrier} · {shipment.origin.city} → {shipment.destination.city}
        </div>
      </div>

      {/* ETA */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.4)', marginBottom: '2px' }}>Est. delivery</div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>{shipment.estimatedDelivery}</div>
        <div style={{ fontSize: '11px', color: '#818cf8', marginTop: '2px' }}>AI: {shipment.etaConfidence}% conf.</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const shipments = getAllShipments()
  const [filter, setFilter] = useState<string>('all')
  const navigate = useNavigate()

  const filtered = filter === 'all' ? shipments : shipments.filter(s => s.freightType === filter || s.status === filter)

  const stats = [
    { label: 'Active Shipments', value: shipments.length, icon: Package, color: '#6366f1' },
    { label: 'On-Time Rate', value: '87%', icon: TrendingUp, color: '#10b981' },
    { label: 'CO₂ This Month', value: `${shipments.reduce((a, s) => a + s.carbonKg, 0).toLocaleString()} kg`, icon: Leaf, color: '#34d399' },
    { label: 'Delay Alerts', value: shipments.filter(s => s.delayRisk !== 'low').length, icon: AlertTriangle, color: '#f59e0b' },
  ]

  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px' }}>
      {/* Pro Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.08))',
        borderBottom: '1px solid rgba(99,102,241,0.2)',
        padding: '12px 24px',
        textAlign: 'center',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
      }}>
        <Zap size={14} color="#818cf8" />
        <span style={{ fontSize: '13px', color: 'rgba(248,250,252,0.7)' }}>
          You're on the <strong style={{ color: '#818cf8' }}>Free plan</strong>. Upgrade to Pro for unlimited shipments, AI predictions & more.
        </span>
        <button style={{
          padding: '4px 14px', borderRadius: '100px',
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          border: 'none', color: 'white', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
        }}>
          Upgrade →
        </button>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px', marginBottom: '4px' }}>
              Shipment Dashboard
            </h1>
            <p style={{ color: 'rgba(248,250,252,0.45)', fontSize: '14px' }}>
              Track and manage all your shipments in one place
            </p>
          </div>
          <button
            onClick={() => navigate('/track')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              border: 'none', color: 'white', fontSize: '14px', fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
            }}
          >
            <Plus size={16} />
            Add Shipment
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} style={{
                padding: '20px 24px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: `${stat.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={20} color={stat.color} />
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.45)' }}>{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* AI Insights Strip */}
        <div style={{
          padding: '16px 20px',
          borderRadius: '16px',
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.18)',
          display: 'flex', alignItems: 'center', gap: '14px',
          marginBottom: '24px', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <Brain size={18} color="#818cf8" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#818cf8' }}>AI Insights</span>
          </div>
          <div style={{ flex: 1, display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              '📦 MAD3456789 may arrive 1 day early due to favorable currents.',
              '⚠️ MAWB001-12345678 has a customs hold — document upload needed.',
              '🚛 CNTR8872341 is on time with 97% confidence for today.',
            ].map((insight, i) => (
              <span key={i} style={{ fontSize: '13px', color: 'rgba(248,250,252,0.65)' }}>{insight}</span>
            ))}
          </div>
        </div>

        {/* Filters + List */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0 12px' }}>
            <Search size={14} color="rgba(248,250,252,0.4)" />
            <input placeholder="Search shipments..." style={{ background: 'none', border: 'none', outline: 'none', color: '#f8fafc', fontSize: '13px', padding: '8px 4px', flex: 1 }} />
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { label: 'All', value: 'all' },
              { label: '✈ Air', value: 'air' },
              { label: '🚢 Sea', value: 'sea' },
              { label: '🚛 Land', value: 'land' },
              { label: '📦 Express', value: 'express' },
            ].map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)} style={{
                padding: '6px 14px', borderRadius: '8px',
                background: filter === f.value ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${filter === f.value ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: filter === f.value ? '#818cf8' : 'rgba(248,250,252,0.6)',
                fontSize: '12px', fontWeight: 500, cursor: 'pointer',
              }}>
                {f.label}
              </button>
            ))}
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(248,250,252,0.6)', fontSize: '12px', cursor: 'pointer' }}>
            <Filter size={13} />
            Sort
          </button>
        </div>

        {/* Shipment List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px' }}>
          {filtered.map(s => <ShipmentCard key={s.id} shipment={s} />)}
        </div>

        {/* Analytics Preview (locked) */}
        <div style={{
          padding: '40px',
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 30%, rgba(10,15,30,0.95))',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
            padding: '40px',
            zIndex: 2,
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <BarChart3 size={24} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>Advanced Analytics</h3>
            <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.5)', maxWidth: '360px', marginBottom: '20px', lineHeight: 1.6 }}>
              Carrier performance, on-time rates, cost analysis & CO₂ trends. Unlock with Pro.
            </p>
            <button style={{
              padding: '12px 28px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              border: 'none', color: 'white', fontSize: '14px', fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <Zap size={16} />
              Upgrade to Pro — $19/mo
            </button>
          </div>
          {/* Blurred chart mockup */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '120px', filter: 'blur(4px)' }}>
            {[60, 80, 45, 90, 75, 55, 88, 70, 95, 65, 78, 85].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '6px 6px 0 0', background: `rgba(99,102,241,${0.3 + i * 0.02})` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
