import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import {
  Plus, Search, Plane, Ship, Truck, Package, Brain,
  TrendingUp, AlertTriangle, CheckCircle2, Clock,
  BarChart3, Zap, PackageSearch, Trash2, ChevronDown, FileBarChart2, Lock,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from '../components/auth/AuthModal'
import ReportModal from '../components/dashboard/ReportModal'
import { useIsMobile } from '../hooks/useIsMobile'
import { useIsNativeApp } from '../hooks/useIsNativeApp'

// ── Types ─────────────────────────────────────────────────────────────────────
interface DashboardShipment {
  id:               string
  trackingNumber:   string
  carrier:          string
  carrierSlug:      string
  freightType:      'air' | 'sea' | 'land' | 'express'
  status:           string
  origin:           { city: string }
  destination:      { city: string }
  estimatedDelivery: string
  delayRisk:        'low' | 'medium' | 'high'
  updatedAt:        string
}

type SortKey = 'newest' | 'oldest' | 'eta' | 'carrier' | 'status'

interface DbRow {
  id: string
  tracking_number: string
  carrier_name: string
  carrier_slug: string
  freight_type: string
  status: string
  origin_city: string
  dest_city: string
  est_delivery: string
  updated_at: string
}

/**
 * Known parcel-courier names that use a NNN-NNNNNNNN tracking format similar to
 * an air waybill (MAWB) but are ground/express shipments, not air cargo.
 * Used to avoid misclassifying e.g. BRT (Italian courier) or DHL domestic as air.
 */
const PARCEL_CARRIER_RE = /\b(fedex|ups|dhl|usps|aramex|brt|gls|dpd|hermes|evri|postnl|royal\s*mail|parcelforce|colissimo|correos|chronopost|laposte|yanwen|yun\s*express|4px|cainiao|sf\s*express)\b/i

/**
 * Infer freight type from DB row, correcting rows stored as 'express' before
 * the full airline-slug list was in place.
 *
 * Rule: MAWB format (NNN-NNNNNNNN) whose carrier is NOT a known parcel courier
 * → treat as air freight.  No keyword check needed: covers airlines like
 * "Saudia", "Turkish Cargo", "Ethiopian Airlines" whose names don't contain
 * the word "air" or "cargo".
 */
function inferFreightType(row: DbRow): DashboardShipment['freightType'] {
  const stored = (row.freight_type || 'express') as DashboardShipment['freightType']
  if (stored !== 'express') return stored          // sea / land / air already set — trust it

  const tn = (row.tracking_number || '').trim()
  if (!/^\d{3}-\d{8}$/.test(tn)) return stored    // not MAWB format — leave as express

  const carrier = (row.carrier_name || '').toLowerCase()
  if (PARCEL_CARRIER_RE.test(carrier)) return stored  // known parcel courier — keep express

  // MAWB format + non-parcel carrier → air cargo
  return 'air'
}

function fromDbRow(row: DbRow): DashboardShipment {
  const status      = row.status      || 'in_transit'
  const freightType = inferFreightType(row)
  return {
    id:               row.id,
    trackingNumber:   row.tracking_number,
    carrier:          row.carrier_name  || 'Unknown',
    carrierSlug:      row.carrier_slug  || '',
    freightType,
    status,
    origin:           { city: row.origin_city || '—' },
    destination:      { city: row.dest_city   || '—' },
    estimatedDelivery: row.est_delivery || 'TBD',
    delayRisk:        status === 'delayed' ? 'high' : status === 'customs' ? 'medium' : 'low',
    updatedAt:        row.updated_at,
  }
}

/**
 * AfterShip hosts carrier logos at this CDN.
 * If the DB row has no carrier_slug yet, derive one from the carrier name
 * (e.g. "Bpost international" → "bpost-international", "Dhl" → "dhl").
 */
function carrierLogoUrl(slug: string, carrierName: string): string {
  const resolved = slug || carrierName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  return resolved ? `https://assets.aftership.com/couriers/svg/${resolved}.svg` : ''
}

// ── Lookup maps ───────────────────────────────────────────────────────────────
const TYPE_META = {
  air:     { icon: Plane,   color: '#22d3ee', bg: 'rgba(6,182,212,0.12)'   },
  sea:     { icon: Ship,    color: '#6366f1', bg: 'rgba(99,102,241,0.12)'  },
  land:    { icon: Truck,   color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  express: { icon: Package, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string; icon: typeof CheckCircle2 }> = {
  in_transit:       { bg: 'rgba(99,102,241,0.12)',  color: '#818cf8', label: 'In Transit', icon: Clock       },
  delivered:        { bg: 'rgba(16,185,129,0.12)',  color: '#10b981', label: 'Delivered',  icon: CheckCircle2 },
  customs:          { bg: 'rgba(245,158,11,0.12)',  color: '#f59e0b', label: 'Customs',    icon: AlertTriangle},
  delayed:          { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444', label: 'Delayed',    icon: AlertTriangle},
  picked_up:        { bg: 'rgba(6,182,212,0.12)',   color: '#22d3ee', label: 'Picked Up',  icon: Clock       },
  out_for_delivery: { bg: 'rgba(16,185,129,0.12)',  color: '#34d399', label: 'Delivering', icon: Truck       },
}
const FALLBACK_STATUS = STATUS_STYLES['in_transit']

// ── ShipmentCard ──────────────────────────────────────────────────────────────
function ShipmentCard({
  shipment,
  onDelete,
}: {
  shipment: DashboardShipment
  onDelete: (id: string) => void
}) {
  const navigate   = useNavigate()
  const type       = TYPE_META[shipment.freightType] ?? TYPE_META.express
  const TypeIcon   = type.icon
  const status     = STATUS_STYLES[shipment.status] ?? FALLBACK_STATUS
  const StatusIcon = status.icon
  const [logoOk, setLogoOk]         = useState(true)  // attempt logo for every carrier; onError falls back
  const [deleting, setDeleting]     = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirmDel) { setConfirmDel(true); return }
    setDeleting(true)
    if (supabase) {
      await supabase.from('shipments').delete().eq('id', shipment.id)
    }
    onDelete(shipment.id)
  }

  function handleDeleteBlur() {
    // Reset confirmation if user moves away without confirming
    setTimeout(() => setConfirmDel(false), 200)
  }

  return (
    <div
      onClick={() => navigate(`/track/${shipment.trackingNumber}`)}
      style={{
        padding: '16px 20px', borderRadius: '16px',
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        cursor: 'pointer', transition: 'all 0.2s',
        display: 'flex', gap: '16px', alignItems: 'center',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.background  = 'rgba(255,255,255,0.06)'
        el.style.borderColor = `${type.color}30`
        el.style.transform   = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.background  = 'rgba(255,255,255,0.03)'
        el.style.borderColor = 'rgba(255,255,255,0.07)'
        el.style.transform   = 'translateY(0)'
      }}
    >
      {/* Carrier logo / freight-type icon */}
      {logoOk ? (
        <img
          src={carrierLogoUrl(shipment.carrierSlug, shipment.carrier)}
          alt={shipment.carrier}
          onError={() => setLogoOk(false)}
          style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0, borderRadius: '10px' }}
        />
      ) : (
        <div style={{
          width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
          background: type.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <TypeIcon size={20} color={type.color} />
        </div>
      )}

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', fontFamily: 'monospace' }}>
            {shipment.trackingNumber}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            padding: '2px 9px', borderRadius: '100px',
            background: status.bg, fontSize: '11px', fontWeight: 600, color: status.color,
          }}>
            <StatusIcon size={10} />
            {status.label}
          </span>
          {shipment.delayRisk !== 'low' && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '2px 9px', borderRadius: '100px',
              background: shipment.delayRisk === 'high' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
              fontSize: '11px', fontWeight: 600,
              color: shipment.delayRisk === 'high' ? '#ef4444' : '#f59e0b',
            }}>
              ⚠ Risk
            </span>
          )}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.45)' }}>
          {shipment.carrier}
          {(shipment.origin.city !== '—' || shipment.destination.city !== '—') && (
            <> · {shipment.origin.city} → {shipment.destination.city}</>
          )}
        </div>
      </div>

      {/* ETA */}
      <div style={{ textAlign: 'right', flexShrink: 0, marginRight: '4px' }}>
        <div style={{ fontSize: '11px', color: 'rgba(248,250,252,0.35)', marginBottom: '2px' }}>Est. delivery</div>
        <div style={{ fontSize: '13px', fontWeight: 700, color: shipment.estimatedDelivery === 'TBD' ? 'rgba(248,250,252,0.35)' : '#f8fafc' }}>
          {shipment.estimatedDelivery}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        onBlur={handleDeleteBlur}
        disabled={deleting}
        title={confirmDel ? 'Click again to confirm delete' : 'Remove shipment'}
        style={{
          flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: confirmDel ? '6px 10px' : '6px 8px',
          borderRadius: '8px', border: 'none', cursor: deleting ? 'wait' : 'pointer',
          background: confirmDel ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.05)',
          color: confirmDel ? '#ef4444' : 'rgba(248,250,252,0.35)',
          fontSize: '11px', fontWeight: 600,
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => {
          e.stopPropagation()
          if (!confirmDel) (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'
        }}
        onMouseLeave={e => {
          e.stopPropagation()
          if (!confirmDel) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(248,250,252,0.35)'
        }}
      >
        <Trash2 size={13} />
        {confirmDel && 'Confirm'}
      </button>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  useSEO({
    title:       'Shipment Dashboard — Monitor All Your Shipments | Trackora',
    description: 'View, manage, and monitor all your tracked shipments in one place. AI delay insights, real-time status updates, and carrier analytics across all your shipments.',
    canonical:   'https://www.track-ora.com/dashboard',
  })

  const { user } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const isNative = useIsNativeApp()

  const [shipments,   setShipments]  = useState<DashboardShipment[]>([])
  const [loading,     setLoading]    = useState(true)
  const [filter,      setFilter]     = useState('all')
  const [search,      setSearch]     = useState('')
  const [sort,        setSort]       = useState<SortKey>('newest')
  const [sortOpen,    setSortOpen]   = useState(false)
  const [showReport,  setShowReport] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  // ── Fetch from Supabase ───────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !supabase) { setLoading(false); return }

    setLoading(true)
    supabase
      .from('shipments')
      .select('id, tracking_number, carrier_name, carrier_slug, freight_type, status, origin_city, dest_city, est_delivery, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setShipments((data as DbRow[]).map(fromDbRow))
        setLoading(false)
      })
  }, [user])

  // Close sort dropdown on outside click
  useEffect(() => {
    if (!sortOpen) return
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [sortOpen])

  function handleDelete(id: string) {
    setShipments(prev => prev.filter(s => s.id !== id))
  }

  const [confirmClear, setConfirmClear] = useState(false)
  const [clearing,     setClearing]     = useState(false)

  async function handleClearAll() {
    if (!confirmClear) { setConfirmClear(true); return }
    if (!user) return
    setClearing(true)
    try {
      await supabase!.from('shipments').delete().eq('user_id', user.id)
      setShipments([])
    } finally {
      setClearing(false)
      setConfirmClear(false)
    }
  }

  // ── Derived data ──────────────────────────────────────────────────────────
  const STATUS_ORDER: Record<string, number> = { out_for_delivery: 0, in_transit: 1, customs: 2, picked_up: 3, delayed: 4, delivered: 5 }

  const filtered = shipments
    .filter(s => {
      const matchFilter = filter === 'all' || s.freightType === filter || s.status === filter
      const matchSearch = !search || s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
                          s.carrier.toLowerCase().includes(search.toLowerCase())
      return matchFilter && matchSearch
    })
    .sort((a, b) => {
      switch (sort) {
        case 'oldest':  return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        case 'eta':     return (a.estimatedDelivery === 'TBD' ? 1 : 0) - (b.estimatedDelivery === 'TBD' ? 1 : 0) ||
                               a.estimatedDelivery.localeCompare(b.estimatedDelivery)
        case 'carrier': return a.carrier.localeCompare(b.carrier)
        case 'status':  return (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)
        default:        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime() // newest
      }
    })

  const activeCount    = shipments.filter(s => s.status !== 'delivered').length
  const deliveredCount = shipments.filter(s => s.status === 'delivered').length
  const delayCount     = shipments.filter(s => s.delayRisk !== 'low').length
  const onTimeRate     = shipments.length
    ? Math.round((shipments.filter(s => s.delayRisk === 'low').length / shipments.length) * 100)
    : 0

  const stats = [
    { label: 'Active Shipments', value: activeCount,                              icon: Package,       color: '#6366f1' },
    { label: 'Delivered',        value: deliveredCount,                            icon: CheckCircle2,  color: '#10b981' },
    { label: 'On-Time Rate',     value: shipments.length ? `${onTimeRate}%` : '—', icon: TrendingUp,   color: '#22d3ee' },
    { label: 'Delay Alerts',     value: delayCount,                                icon: AlertTriangle, color: '#f59e0b' },
  ]

  // Dynamic AI insights based on real data
  const insights: string[] = []
  const delayed   = shipments.filter(s => s.delayRisk === 'high')
  const delivering = shipments.filter(s => s.status === 'out_for_delivery')
  const inTransit = shipments.filter(s => s.status === 'in_transit')
  if (delayed.length)    insights.push(`⚠️ ${delayed.length} shipment${delayed.length > 1 ? 's' : ''} flagged as high-risk — check timeline for details.`)
  if (delivering.length) insights.push(`🚚 ${delivering.length} shipment${delivering.length > 1 ? 's are' : ' is'} out for delivery today.`)
  if (inTransit.length)  insights.push(`📦 ${inTransit.length} shipment${inTransit.length > 1 ? 's' : ''} currently in transit.`)
  if (!insights.length && shipments.length)  insights.push('✅ All shipments are on track with no alerts.')
  if (!insights.length && !shipments.length) insights.push('Track your first shipment to start seeing insights here.')

  // ── Logged-out state ──────────────────────────────────────────────────────
  const [guestAuthModal, setGuestAuthModal] = useState<'signin' | 'signup' | null>(null)

  if (!user) {
    const fakeRows = [
      { tn: '1Z999AA10123456784', carrier: 'UPS', status: 'In Transit', from: 'Los Angeles', to: 'New York', eta: 'Jun 7' },
      { tn: 'MAD3456789',         carrier: 'Maersk', status: 'In Transit', from: 'Shanghai', to: 'Rotterdam', eta: 'Jun 20' },
      { tn: 'MAWB001-12345678',   carrier: 'Lufthansa Cargo', status: 'Delivered', from: 'Frankfurt', to: 'Dubai', eta: 'Jun 4' },
    ]
    return (
      <div style={{ minHeight: '100vh', paddingTop: '72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.4 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.08))', borderBottom: '1px solid rgba(99,102,241,0.2)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <Zap size={14} color="#818cf8" />
            <span style={{ fontSize: '13px', color: 'rgba(248,250,252,0.7)' }}>You're on the <strong style={{ color: '#818cf8' }}>Free plan</strong>. Upgrade to Pro for unlimited shipments.</span>
          </div>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc', marginBottom: '24px' }}>Shipment Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {[{ label: 'Active Shipments', value: '3' }, { label: 'Delivered', value: '1' }, { label: 'On-Time Rate', value: '85%' }, { label: 'Delay Alerts', value: '0' }].map(s => (
                <div key={s.label} style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>{s.value}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(248,250,252,0.45)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {fakeRows.map(r => (
                <div key={r.tn} style={{ padding: '16px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Package size={18} color="#818cf8" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', fontFamily: 'monospace', marginBottom: '4px' }}>{r.tn}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.45)' }}>{r.carrier} · {r.from} → {r.to}</div>
                  </div>
                  <div style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '100px', background: 'rgba(99,102,241,0.12)', color: '#818cf8', fontWeight: 600 }}>{r.status}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>{r.eta}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ padding: '40px 36px', borderRadius: '24px', background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 24px 80px rgba(0,0,0,0.7)', textAlign: 'center', maxWidth: '400px', width: '100%', backdropFilter: 'blur(20px)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Lock size={32} color="#6366f1" />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', marginBottom: '10px', letterSpacing: '-0.5px' }}>
              Your shipment dashboard
            </h2>
            <p style={{ color: 'rgba(248,250,252,0.55)', lineHeight: 1.6, marginBottom: '24px', fontSize: '14px' }}>
              Save shipments, track status changes, and get email alerts — all in one place.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', textAlign: 'left' }}>
              {['Up to 10 saved shipments free', 'Email status alerts', 'Advanced analytics (Pro)'].map(b => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(248,250,252,0.7)' }}>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>✓</span> {b}
                </div>
              ))}
            </div>
            <button
              onClick={() => setGuestAuthModal('signup')}
              style={{ width: '100%', padding: '13px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', color: 'white', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.4)', marginBottom: '12px' }}
            >
              Create Free Account
            </button>
            <button
              onClick={() => setGuestAuthModal('signin')}
              style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign In
            </button>
          </div>
        </div>

        {guestAuthModal && <AuthModal initialMode={guestAuthModal} onClose={() => setGuestAuthModal(null)} />}
      </div>
    )
  }

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: '14px' }}>Loading your shipments…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px' }}>
      {/* ── Pro Banner — hidden in native app ── */}
      {!isNative && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.08))',
          borderBottom: '1px solid rgba(99,102,241,0.2)',
          padding: isMobile ? '12px 20px' : '12px 24px',
          display: 'flex', flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center', justifyContent: 'center',
          gap: isMobile ? '8px' : '12px', textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <Zap size={14} color="#818cf8" />
            <span style={{ fontSize: '13px', color: 'rgba(248,250,252,0.7)' }}>
              You're on the <strong style={{ color: '#818cf8' }}>Free plan</strong>.{' '}
              {!isMobile && 'Upgrade to Pro for unlimited shipments & advanced analytics.'}
            </span>
          </div>
          <button
            onClick={() => window.open('https://badranalain.gumroad.com/l/impejho', '_blank')}
            style={{
              padding: '5px 16px', borderRadius: '100px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              border: 'none', color: 'white', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Upgrade to Pro →
          </button>
        </div>
      )}

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '24px 16px' : '32px 24px' }}>
        {/* ── Header ── */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px', marginBottom: '4px' }}>
              Shipment Dashboard
            </h1>
            <p style={{ color: 'rgba(248,250,252,0.45)', fontSize: '14px' }}>
              {shipments.length > 0
                ? `${shipments.length} shipment${shipments.length > 1 ? 's' : ''} tracked`
                : 'Track your first shipment to get started'}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            {shipments.length > 0 && (
              <button
                onClick={handleClearAll}
                onBlur={() => setTimeout(() => setConfirmClear(false), 200)}
                disabled={clearing}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '10px 14px', borderRadius: '12px',
                  background: confirmClear ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${confirmClear ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  color: confirmClear ? '#f87171' : 'rgba(248,250,252,0.5)',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s', flex: isMobile ? 1 : 'none',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                }}
              >
                <Trash2 size={14} />
                {clearing ? 'Clearing…' : confirmClear ? 'Confirm?' : 'Clear All'}
              </button>
            )}
            <button
              onClick={() => navigate('/track')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '10px 16px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none', color: 'white', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
                flex: isMobile ? 1 : 'none',
              }}
            >
              <Plus size={15} />
              Add Shipment
            </button>
          </div>
        </div>

        {/* ── Stats Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} style={{
                padding: '20px 24px', borderRadius: '16px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: `${stat.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
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

        {/* ── AI Insights ── */}
        <div style={{
          padding: '16px 20px', borderRadius: '16px',
          background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)',
          display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <Brain size={18} color="#818cf8" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#818cf8' }}>Insights</span>
          </div>
          <div style={{ flex: 1, display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {insights.map((msg, i) => (
              <span key={i} style={{ fontSize: '13px', color: 'rgba(248,250,252,0.65)' }}>{msg}</span>
            ))}
          </div>
        </div>

        {/* ── Empty state ── */}
        {shipments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '40px' }}>
            <PackageSearch size={48} color="rgba(248,250,252,0.15)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
              No shipments tracked yet
            </h3>
            <p style={{ color: 'rgba(248,250,252,0.4)', maxWidth: '340px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              Enter any tracking number on the Track page — it'll be saved here automatically when you're signed in.
            </p>
            <button
              onClick={() => navigate('/track')}
              style={{
                padding: '11px 28px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none', color: 'white', fontSize: '14px', fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
              }}
            >
              Track your first shipment →
            </button>
          </div>
        )}

        {/* ── Filters + List ── */}
        {shipments.length > 0 && (
          <>
            {/* Search + Filter + Sort toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                flex: 1, minWidth: '200px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px', padding: '0 12px',
              }}>
                <Search size={14} color="rgba(248,250,252,0.4)" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by tracking number or carrier…"
                  style={{ background: 'none', border: 'none', outline: 'none', color: '#f8fafc', fontSize: '13px', padding: '8px 4px', flex: 1 }}
                />
              </div>

              {/* Filter chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { label: 'All',      value: 'all'     },
                  { label: '✈ Air',   value: 'air'     },
                  { label: '🚢 Sea',  value: 'sea'     },
                  { label: '🚛 Land', value: 'land'    },
                  { label: '📦 Express', value: 'express' },
                ].map(f => (
                  <button key={f.value} onClick={() => setFilter(f.value)} style={{
                    padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
                    background: filter === f.value ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${filter === f.value ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    color: filter === f.value ? '#818cf8' : 'rgba(248,250,252,0.6)',
                    fontSize: '12px', fontWeight: 500,
                  }}>
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Generate Report button */}
              {shipments.length > 0 && (
                <button
                  onClick={() => setShowReport(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(79,70,229,0.2))',
                    border: '1px solid rgba(99,102,241,0.4)',
                    color: '#818cf8', fontSize: '12px', fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <FileBarChart2 size={14} />
                  {!isMobile && 'Analysis Report'}
                </button>
              )}

              {/* Sort dropdown */}
              <div ref={sortRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setSortOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', borderRadius: '8px', cursor: 'pointer',
                    background: sortOpen ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${sortOpen ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    color: sortOpen ? '#818cf8' : 'rgba(248,250,252,0.6)',
                    fontSize: '12px', fontWeight: 500,
                  }}>
                  Sort: {
                    { newest: 'Newest', oldest: 'Oldest', eta: 'ETA', carrier: 'Carrier', status: 'Status' }[sort]
                  }
                  <ChevronDown size={12} style={{ transition: 'transform 0.2s', transform: sortOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {sortOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                    background: 'rgba(15,20,40,0.97)', backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                    overflow: 'hidden', zIndex: 50, minWidth: '160px',
                  }}>
                    {([
                      { key: 'newest',  label: '🕐 Newest first'  },
                      { key: 'oldest',  label: '🕰 Oldest first'  },
                      { key: 'status',  label: '📊 By status'     },
                      { key: 'eta',     label: '📅 By ETA'        },
                      { key: 'carrier', label: '🏢 By carrier'    },
                    ] as { key: SortKey; label: string }[]).map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => { setSort(opt.key); setSortOpen(false) }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '10px 16px', border: 'none', cursor: 'pointer', fontSize: '13px',
                          background: sort === opt.key ? 'rgba(99,102,241,0.2)' : 'transparent',
                          color: sort === opt.key ? '#818cf8' : 'rgba(248,250,252,0.7)',
                          fontWeight: sort === opt.key ? 600 : 400,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Result count */}
            {(search || filter !== 'all') && (
              <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.35)', marginBottom: '10px' }}>
                {filtered.length} of {shipments.length} shipment{shipments.length !== 1 ? 's' : ''}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '40px' }}>
              {filtered.length > 0
                ? filtered.map(s => <ShipmentCard key={s.id} shipment={s} onDelete={handleDelete} />)
                : (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(248,250,252,0.4)', fontSize: '14px' }}>
                    No shipments match your filter.
                  </div>
                )
              }
            </div>
          </>
        )}

        {/* ── Analytics (locked) ── */}
        <div style={{
          padding: '40px', borderRadius: '20px',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 30%, rgba(10,15,30,0.95))',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
            padding: '40px', zIndex: 2,
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <BarChart3 size={24} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>Advanced Analytics</h3>
            <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.5)', maxWidth: '360px', marginBottom: '20px', lineHeight: 1.6 }}>
              Carrier performance, on-time rates, cost analysis &amp; CO₂ trends. Unlock with Pro.
            </p>
            {isNative ? (
              <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)', margin: 0 }}>
                Visit <span style={{ color: '#818cf8', fontWeight: 600 }}>track-ora.com/plans</span> to upgrade
              </p>
            ) : (
              <button
                onClick={() => window.open('https://badranalain.gumroad.com/l/impejho', '_blank')}
                style={{
                  padding: '12px 28px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  border: 'none', color: 'white', fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                <Zap size={16} />
                Upgrade to Pro — $4.99/mo
              </button>
            )}
          </div>
          {/* Blurred chart mockup */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', height: '120px', filter: 'blur(4px)' }}>
            {[60, 80, 45, 90, 75, 55, 88, 70, 95, 65, 78, 85].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '6px 6px 0 0', background: `rgba(99,102,241,${0.3 + i * 0.02})` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Report Modal */}
      {showReport && (
        <ReportModal shipments={shipments} onClose={() => setShowReport(false)} />
      )}
    </div>
  )
}
