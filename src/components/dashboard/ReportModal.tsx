import { X, Download } from 'lucide-react'
import * as XLSX from 'xlsx'
import { useIsMobile } from '../../hooks/useIsMobile'

interface DashboardShipment {
  id: string
  trackingNumber: string
  carrier: string
  freightType: 'air' | 'sea' | 'land' | 'express'
  status: string
  estimatedDelivery: string
}

interface ReportModalProps {
  shipments: DashboardShipment[]
  onClose: () => void
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  in_transit:       { label: 'In Transit',       color: '#6366f1' },
  delivered:        { label: 'Delivered',         color: '#10b981' },
  out_for_delivery: { label: 'Out for Delivery',  color: '#22d3ee' },
  delayed:          { label: 'Delayed',           color: '#f87171' },
  customs:          { label: 'In Customs',        color: '#f0a868' },
  picked_up:        { label: 'Picked Up',         color: '#38bdf8' },
}

const FREIGHT_META: Record<string, { label: string; color: string }> = {
  express: { label: 'Express Courier', color: '#f59e0b' },
  air:     { label: 'Air Freight',     color: '#22d3ee' },
  sea:     { label: 'Sea Freight',     color: '#818cf8' },
  land:    { label: 'Land Freight',    color: '#10b981' },
}

const CARRIER_COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f59e0b', '#f87171', '#818cf8']

function groupCount<T>(arr: T[], key: (item: T) => string): { label: string; count: number; raw: string }[] {
  const map: Record<string, number> = {}
  arr.forEach(item => {
    const k = key(item)
    map[k] = (map[k] || 0) + 1
  })
  return Object.entries(map)
    .map(([raw, count]) => ({ raw, count, label: raw }))
    .sort((a, b) => b.count - a.count)
}

// Build SVG donut path segments
function buildSegments(data: { count: number; color: string }[], total: number, r = 60) {
  const circumference = 2 * Math.PI * r
  const gap = 3 // px gap between segments
  let offset = circumference * 0.25 // start from top

  return data.map(({ count, color }) => {
    const pct = count / total
    const dash = Math.max(0, circumference * pct - gap)
    const space = circumference - dash
    const seg = { color, dash, space, offset: -offset + circumference }
    offset += circumference * pct
    return seg
  })
}

interface ChartData { label: string; count: number; color: string; pct: string }

function DonutChart({ title, data, total }: { title: string; data: ChartData[]; total: number }) {
  const segments = buildSegments(data.map(d => ({ count: d.count, color: d.color })), total)

  return (
    <div style={{
      background: 'rgba(255,255,255,0.028)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '20px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top shimmer line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)',
      }} />

      <div style={{
        fontSize: '11px', fontWeight: 700,
        color: 'rgba(248,250,252,0.35)',
        textTransform: 'uppercase', letterSpacing: '1.2px',
        marginBottom: '20px',
      }}>
        {title}
      </div>

      {/* Donut */}
      <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 20px' }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* Track */}
          <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="18" />
          {segments.map((s, i) => (
            <circle
              key={i}
              cx="80" cy="80" r="60"
              fill="none"
              stroke={s.color}
              strokeWidth="18"
              strokeDasharray={`${s.dash} ${s.space}`}
              strokeDashoffset={s.offset}
              strokeLinecap="round"
            />
          ))}
        </svg>
        {/* Center label */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc', lineHeight: 1, letterSpacing: '-1px' }}>
            {total}
          </div>
          <div style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(248,250,252,0.3)', textTransform: 'uppercase', letterSpacing: '1.2px', marginTop: '4px' }}>
            Total
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '16px' }} />

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.map((row, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '7px 10px', borderRadius: '8px',
            background: 'rgba(255,255,255,0)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '3px', height: '32px', borderRadius: '2px',
                background: row.color, flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(248,250,252,0.8)' }}>
                  {row.label}
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(248,250,252,0.3)', marginTop: '2px' }}>
                  {row.pct}%
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc' }}>{row.count}</div>
              <div style={{ fontSize: '10px', color: 'rgba(248,250,252,0.3)' }}>shipments</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ReportModal({ shipments, onClose }: ReportModalProps) {
  const isMobile = useIsMobile()
  const total = shipments.length
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  // ── Status data ───────────────────────────────────────────────────────────
  const statusGroups = groupCount(shipments, s => s.status)
  const statusData: ChartData[] = statusGroups.map(g => ({
    label: STATUS_META[g.raw]?.label ?? g.raw,
    count: g.count,
    color: STATUS_META[g.raw]?.color ?? '#818cf8',
    pct:   ((g.count / total) * 100).toFixed(1),
  }))

  // ── Freight data ──────────────────────────────────────────────────────────
  const freightGroups = groupCount(shipments, s => s.freightType)
  const freightData: ChartData[] = freightGroups.map(g => ({
    label: FREIGHT_META[g.raw]?.label ?? g.raw,
    count: g.count,
    color: FREIGHT_META[g.raw]?.color ?? '#818cf8',
    pct:   ((g.count / total) * 100).toFixed(1),
  }))

  // ── Carrier data (top 5 + Other) ──────────────────────────────────────────
  const carrierGroups = groupCount(shipments, s => s.carrier)
  const top5 = carrierGroups.slice(0, 5)
  const otherCount = carrierGroups.slice(5).reduce((sum, g) => sum + g.count, 0)
  const carrierData: ChartData[] = [
    ...top5.map((g, i) => ({
      label: g.label,
      count: g.count,
      color: CARRIER_COLORS[i],
      pct:   ((g.count / total) * 100).toFixed(1),
    })),
    ...(otherCount > 0 ? [{
      label: 'Other',
      count: otherCount,
      color: 'rgba(248,250,252,0.2)',
      pct:   ((otherCount / total) * 100).toFixed(1),
    }] : []),
  ]

  // ── Excel export ─────────────────────────────────────────────────────────
  function handleExport() {
    const wb = XLSX.utils.book_new()

    const toSheet = (data: ChartData[]) =>
      XLSX.utils.aoa_to_sheet([
        ['Category', 'Count', 'Percentage'],
        ...data.map(r => [r.label, r.count, `${r.pct}%`]),
      ])

    XLSX.utils.book_append_sheet(wb, toSheet(statusData),  'Status')
    XLSX.utils.book_append_sheet(wb, toSheet(freightData), 'Freight Type')
    XLSX.utils.book_append_sheet(wb, toSheet(carrierData), 'Carriers')

    const date = new Date().toISOString().slice(0, 10)
    XLSX.writeFile(wb, `trackora-report-${date}.xlsx`)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '16px' : '32px',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '980px',
          background: '#0d1229',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: isMobile ? '24px 16px' : '36px',
          position: 'relative',
          boxShadow: '0 40px 120px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '16px',
          marginBottom: '32px',
        }}>
          <div>
            <h2 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px', marginBottom: '4px' }}>
              Shipment Analysis Report
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.4)' }}>
              {total} tracked shipment{total !== 1 ? 's' : ''} · Generated {today}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleExport}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '12px', cursor: 'pointer',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none', color: '#fff',
                fontSize: '13px', fontWeight: 700,
                boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
              }}
            >
              <Download size={15} />
              Export to Excel
            </button>
            <button
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '38px', height: '38px', borderRadius: '10px', cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(248,250,252,0.6)',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Charts grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '16px',
        }}>
          <DonutChart title="By Status"       data={statusData}  total={total} />
          <DonutChart title="By Freight Type" data={freightData} total={total} />
          <DonutChart title="Top Carriers"    data={carrierData} total={total} />
        </div>
      </div>
    </div>
  )
}
