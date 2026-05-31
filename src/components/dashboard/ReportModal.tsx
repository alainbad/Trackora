import { X, Download, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'
import ExcelJS from 'exceljs'
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

function groupCount<T>(arr: T[], key: (item: T) => string) {
  const map: Record<string, number> = {}
  arr.forEach(item => { const k = key(item); map[k] = (map[k] || 0) + 1 })
  return Object.entries(map)
    .map(([raw, count]) => ({ raw, count }))
    .sort((a, b) => b.count - a.count)
}

function buildSegments(data: { count: number; color: string }[], total: number, r = 60) {
  const circumference = 2 * Math.PI * r
  const gap = 3
  let offset = circumference * 0.25
  return data.map(({ count, color }) => {
    const dash = Math.max(0, circumference * (count / total) - gap)
    const seg = { color, dash, space: circumference - dash, offset: -offset + circumference }
    offset += circumference * (count / total)
    return seg
  })
}

interface ChartData { label: string; count: number; color: string; pct: string }

// Convert an SVG element to a base64 PNG string via Canvas
async function svgToBase64Png(svgEl: SVGSVGElement): Promise<string> {
  const svgStr = new XMLSerializer().serializeToString(svgEl)
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = 2 // render at 2x for crisp images in Excel
      const canvas = document.createElement('canvas')
      canvas.width  = svgEl.width.baseVal.value  * scale
      canvas.height = svgEl.height.baseVal.value * scale
      const ctx = canvas.getContext('2d')!
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      // strip "data:image/png;base64," prefix
      resolve(canvas.toDataURL('image/png').split(',')[1])
    }
    img.onerror = reject
    img.src = url
  })
}

function DonutChart({
  title, data, total, svgRef,
}: {
  title: string; data: ChartData[]; total: number; svgRef: React.RefObject<SVGSVGElement | null>
}) {
  const segments = buildSegments(data.map(d => ({ count: d.count, color: d.color })), total)
  return (
    <div style={{
      background: 'rgba(255,255,255,0.028)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '20px', padding: '24px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)',
      }} />
      <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(248,250,252,0.35)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '20px' }}>
        {title}
      </div>
      <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 20px' }}>
        <svg ref={svgRef} width="160" height="160" viewBox="0 0 160 160" style={{ display: 'block' }}>
          <rect width="160" height="160" fill="#0d1229" />
          <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="18" />
          {segments.map((s, i) => (
            <circle key={i} cx="80" cy="80" r="60" fill="none"
              stroke={s.color} strokeWidth="18"
              strokeDasharray={`${s.dash} ${s.space}`}
              strokeDashoffset={s.offset} strokeLinecap="round"
            />
          ))}
          <text x="80" y="74" textAnchor="middle" fill="#f8fafc" fontSize="26" fontWeight="800" fontFamily="Inter,system-ui,sans-serif">{total}</text>
          <text x="80" y="90" textAnchor="middle" fill="rgba(248,250,252,0.35)" fontSize="9" fontWeight="600" fontFamily="Inter,system-ui,sans-serif" letterSpacing="1.5">TOTAL</text>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }} />
      </div>
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '16px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 10px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '3px', height: '32px', borderRadius: '2px', background: row.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(248,250,252,0.8)' }}>{row.label}</div>
                <div style={{ fontSize: '10px', color: 'rgba(248,250,252,0.3)', marginTop: '2px' }}>{row.pct}%</div>
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
  const [exporting, setExporting] = useState(false)
  const total  = shipments.length
  const today  = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const svgStatus  = useRef<SVGSVGElement>(null)
  const svgFreight = useRef<SVGSVGElement>(null)
  const svgCarrier = useRef<SVGSVGElement>(null)

  // Status
  const statusData: ChartData[] = groupCount(shipments, s => s.status).map(g => ({
    label: STATUS_META[g.raw]?.label ?? g.raw,
    count: g.count, color: STATUS_META[g.raw]?.color ?? '#818cf8',
    pct: ((g.count / total) * 100).toFixed(1),
  }))

  // Freight
  const freightData: ChartData[] = groupCount(shipments, s => s.freightType).map(g => ({
    label: FREIGHT_META[g.raw]?.label ?? g.raw,
    count: g.count, color: FREIGHT_META[g.raw]?.color ?? '#818cf8',
    pct: ((g.count / total) * 100).toFixed(1),
  }))

  // Carriers (top 5 + Other)
  const carrierGroups = groupCount(shipments, s => s.carrier)
  const otherCount    = carrierGroups.slice(5).reduce((s, g) => s + g.count, 0)
  const carrierData: ChartData[] = [
    ...carrierGroups.slice(0, 5).map((g, i) => ({
      label: g.raw, count: g.count, color: CARRIER_COLORS[i],
      pct: ((g.count / total) * 100).toFixed(1),
    })),
    ...(otherCount > 0 ? [{ label: 'Other', count: otherCount, color: 'rgba(248,250,252,0.2)', pct: ((otherCount / total) * 100).toFixed(1) }] : []),
  ]

  async function handleExport() {
    if (!svgStatus.current || !svgFreight.current || !svgCarrier.current) return
    setExporting(true)
    try {
      const [pngStatus, pngFreight, pngCarrier] = await Promise.all([
        svgToBase64Png(svgStatus.current),
        svgToBase64Png(svgFreight.current),
        svgToBase64Png(svgCarrier.current),
      ])

      const wb = new ExcelJS.Workbook()
      wb.creator  = 'Trackora'
      wb.created  = new Date()

      const CHART_W = 7   // columns wide
      const CHART_H = 14  // rows tall
      const TABLE_START_ROW = CHART_H + 2

      const sheets: { name: string; data: ChartData[]; png: string }[] = [
        { name: 'Status',       data: statusData,  png: pngStatus  },
        { name: 'Freight Type', data: freightData, png: pngFreight },
        { name: 'Carriers',     data: carrierData, png: pngCarrier },
      ]

      for (const { name, data, png } of sheets) {
        const ws = wb.addWorksheet(name)

        ws.getColumn(1).width = 28
        ws.getColumn(2).width = 12
        ws.getColumn(3).width = 14

        const imgId = wb.addImage({ base64: png, extension: 'png' })
        ws.addImage(imgId, {
          tl: { col: 0, row: 0 } as ExcelJS.Anchor,
          br: { col: CHART_W, row: CHART_H } as ExcelJS.Anchor,
        })

        const headerRow = ws.getRow(TABLE_START_ROW)
        headerRow.height = 20
        const headers = ['Category', 'Count', 'Percentage']
        headers.forEach((h, i) => {
          const cell = headerRow.getCell(i + 1)
          cell.value = h
          cell.font  = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }
          cell.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6366F1' } }
          cell.alignment = { vertical: 'middle', horizontal: i === 0 ? 'left' : 'center' }
          cell.border = {
            bottom: { style: 'thin', color: { argb: 'FF4F46E5' } },
          }
        })

        data.forEach((row, idx) => {
          const r = ws.getRow(TABLE_START_ROW + 1 + idx)
          r.height = 18
          const isEven = idx % 2 === 0
          const bgColor = isEven ? 'FFF0F0FF' : 'FFFFFFFF'

          const c1 = r.getCell(1)
          c1.value = row.label
          c1.font  = { size: 10, color: { argb: 'FF1E1B4B' } }
          c1.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
          c1.alignment = { vertical: 'middle', horizontal: 'left' }

          const c2 = r.getCell(2)
          c2.value = row.count
          c2.font  = { size: 10, bold: true, color: { argb: 'FF1E1B4B' } }
          c2.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
          c2.alignment = { vertical: 'middle', horizontal: 'center' }

          const c3 = r.getCell(3)
          c3.value = `${row.pct}%`
          c3.font  = { size: 10, color: { argb: 'FF4F46E5' } }
          c3.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
          c3.alignment = { vertical: 'middle', horizontal: 'center' }
        })

        const totalRow = ws.getRow(TABLE_START_ROW + 1 + data.length)
        totalRow.height = 20
        const t1 = totalRow.getCell(1)
        t1.value = 'Total'
        t1.font  = { bold: true, size: 10, color: { argb: 'FF1E1B4B' } }
        t1.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } }
        t1.alignment = { vertical: 'middle', horizontal: 'left' }

        const t2 = totalRow.getCell(2)
        t2.value = total
        t2.font  = { bold: true, size: 10, color: { argb: 'FF4F46E5' } }
        t2.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } }
        t2.alignment = { vertical: 'middle', horizontal: 'center' }

        const t3 = totalRow.getCell(3)
        t3.value = '100%'
        t3.font  = { bold: true, size: 10, color: { argb: 'FF4F46E5' } }
        t3.fill  = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } }
        t3.alignment = { vertical: 'middle', horizontal: 'center' }
      }

      const buf      = await wb.xlsx.writeBuffer()
      const blob     = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url      = URL.createObjectURL(blob)
      const a        = document.createElement('a')
      a.href         = url
      a.download     = `trackora-report-${new Date().toISOString().slice(0, 10)}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '16px' : '32px', overflowY: 'auto',
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
          boxShadow: '0 40px 120px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '16px', marginBottom: '32px',
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
              disabled={exporting}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '12px', cursor: exporting ? 'default' : 'pointer',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none', color: '#fff', fontSize: '13px', fontWeight: 700,
                boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
                opacity: exporting ? 0.7 : 1,
              }}
            >
              {exporting
                ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Exporting…</>
                : <><Download size={15} /> Export to Excel</>
              }
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

        {/* Charts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '16px',
        }}>
          <DonutChart title="By Status"       data={statusData}  total={total} svgRef={svgStatus}  />
          <DonutChart title="By Freight Type" data={freightData} total={total} svgRef={svgFreight} />
          <DonutChart title="Top Carriers"    data={carrierData} total={total} svgRef={svgCarrier} />
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}
