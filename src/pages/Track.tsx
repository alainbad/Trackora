import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Search, ArrowLeft, Share2, Bell, RefreshCw, ScanLine, Plus, X, Check, BellOff, Upload, FileText, Loader2, Mail } from 'lucide-react'
import { useIsMobile } from '../hooks/useIsMobile'
import { useSEO } from '../hooks/useSEO'
import type { Shipment } from '../data/mockShipments'
import { fetchShipment, getCarrierTrackUrl } from '../lib/trackingApi'
import { getCarrierFormat } from '../data/carrierFormats'
import { extractFromPdf, type Candidate } from '../lib/extractTracking'
import { getAirlineRedirect, type AirlineRedirect } from '../data/airlineRedirects'
import { getContainerRedirect, getContainerRedirectByCarrier, getSeaReferenceRedirect, type ContainerRedirect } from '../data/containerRedirects'
import TrackingTimeline from '../components/tracking/TrackingTimeline'
import ShipmentDetails, { DGBadge } from '../components/tracking/ShipmentDetails'
import WorldMap from '../components/tracking/WorldMap'
import TrackingAnimation from '../components/tracking/TrackingAnimation'
import AirlineRedirectCard from '../components/tracking/AirlineRedirectCard'
import ContainerRedirectCard from '../components/tracking/ContainerRedirectCard'
import BookingRedirectCard from '../components/tracking/BookingRedirectCard'
import SeaFreightTracker from '../components/tracking/SeaFreightTracker'
import CarrierRedirectCard from '../components/tracking/CarrierRedirectCard'
import { BOOKING_CARRIERS, type BookingCarrier } from '../data/bookingRedirects'
import { detectCarrier as detectCarrierFromNumber, type DetectedCarrier } from '../data/carrierDetect'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../contexts/ProfileContext'
import UpgradeModal from '../components/ui/UpgradeModal'
import AuthModal from '../components/auth/AuthModal'

const GUEST_USES_KEY = 'trackora_guest_uses'
const GUEST_LIMIT = 3

// Carrier auto-detection patterns shown live as user types
const CARRIER_HINTS = [
  { pattern: /^1Z/i,            name: 'UPS',              color: '#f5a623', bg: '#3d1f00' },
  { pattern: /^(JD|VD|UD)/i,   name: 'JD Logistics',     color: '#c0392b', bg: '#1a0000' },
  { pattern: /^MAD/i,           name: 'Maersk',           color: '#42ADEF', bg: '#003F6C' },
  { pattern: /^MAEU/i,          name: 'Maersk B/L',       color: '#42ADEF', bg: '#003F6C' },
  { pattern: /^MSCU/i,          name: 'MSC B/L',          color: '#003087', bg: '#00153b' },
  { pattern: /^HLCU/i,          name: 'Hapag-Lloyd B/L',  color: '#f59e0b', bg: '#2d1f00' },
  { pattern: /^COSU|^CBHU/i,   name: 'COSCO B/L',        color: '#C8102E', bg: '#1a0000' },
  { pattern: /^CMAU|^APHU/i,   name: 'CMA CGM B/L',      color: '#C41230', bg: '#1a0006' },
  { pattern: /^ONEY|^ONEU/i,   name: 'ONE Line B/L',     color: '#E4003B', bg: '#1a0010' },
  { pattern: /^YMLU/i,          name: 'Yang Ming B/L',    color: '#003DA5', bg: '#001030' },
  { pattern: /^ZIMU/i,          name: 'ZIM B/L',          color: '#005BAC', bg: '#001a30' },
  { pattern: /^MAWB/i,          name: 'Air Cargo / MAWB', color: '#FFAD00', bg: '#05164D' },
  { pattern: /^CNTR|^[A-Z]{4}\d{7}/i, name: 'Container (ISO)', color: '#10b981', bg: '#052e16' },
  { pattern: /^(\d{12}|\d{15}|\d{20})/i, name: 'FedEx',  color: '#FF6200', bg: '#1a0d2e' },
  { pattern: /^\d{10}$/,        name: 'DHL / Deutsche Post', color: '#FFCC00', bg: '#c8102e' },
]

const DEMO_IDS = ['1Z999AA10123456784', 'MAD3456789', 'MAWB001-12345678', 'CNTR8872341', '020-32974620']

function detectCarrier(val: string) {
  if (!val || val.length < 2) return null
  return CARRIER_HINTS.find(h => h.pattern.test(val)) || null
}

export default function Track() {
  useSEO({
    title:       'Track a Shipment | Real-Time Package & Cargo Tracking — Trackora',
    description: 'Enter any tracking number for instant results. Supports FedEx, DHL, UPS, Maersk, container IDs, air waybills (AWB/MAWB) and 1,200+ more carriers. Track packages, sea containers, and air cargo in real time.',
    canonical:   'https://www.track-ora.com/track',
  })

  const { trackingId } = useParams()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { user } = useAuth()
  const { planTier } = useProfile()
  const [searchParams] = useSearchParams()

  // Guest limit & upgrade gating
  const [showAuthWall, setShowAuthWall]   = useState(false)
  const [upgradeFeature, setUpgradeFeature] = useState<'air' | 'sea' | 'analytics' | 'alerts' | 'saved' | null>(null)
  const carrierContext = searchParams.get('carrier')   // set when arriving from a carrier chip

  const [lines, setLines] = useState<string[]>(trackingId ? [trackingId] : [''])
  const [activeLineIdx, setActiveLineIdx] = useState(0)
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [animating, setAnimating] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [currentId, setCurrentId] = useState(trackingId || '')
  const [mode, setMode] = useState<'single' | 'multi' | 'booking' | 'sea'>('single')
  const [bookingCarrier, setBookingCarrier] = useState<BookingCarrier | null>(null)
  const [bookingRedirect, setBookingRedirect] = useState<{ carrier: BookingCarrier; ref: string } | null>(null)
  // Detection-first redirect: shown immediately on submit while API loads in background
  const [detectedRedirect, setDetectedRedirect] = useState<{ carrier: DetectedCarrier; filledUrl: string; tn: string } | null>(null)
  const [apiReady, setApiReady] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [showAlerts, setShowAlerts] = useState(false)
  const [alertsEnabled, setAlertsEnabled] = useState(false)
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(false)
  const [emailAlertsSaving, setEmailAlertsSaving] = useState(false)
  const [airlineRedirect,   setAirlineRedirect]   = useState<AirlineRedirect | null>(null)
  const [containerRedirect, setContainerRedirect] = useState<ContainerRedirect | null>(null)

  // Document upload (AWB / BOL) → extract tracking numbers
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState('')
  const [candidates, setCandidates] = useState<Candidate[] | null>(null)
  const [uploadedName, setUploadedName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Stores the resolved API result so animation completion can read it synchronously
  const apiResultRef = useRef<Shipment | null>(null)
  // Holds the in-flight API promise so animation + fetch run in parallel
  const pendingRef = useRef<Promise<Shipment | null>>(Promise.resolve(null))

  useEffect(() => {
    if (trackingId) {
      setLines([trackingId])
      setCurrentId(trackingId)
      triggerSearch(trackingId)
    }
  }, [trackingId])

  function triggerSearch(id: string, carrierSlug?: string, isBooking?: boolean) {
    if (!id.trim()) return
    const tn = id.trim()

    // Detection-first: identify carrier client-side immediately, show redirect card
    // right away. The API call runs in parallel — if it succeeds with real timeline
    // data, the full inline view replaces the redirect card.
    if (!isBooking) {
      const detected = detectCarrierFromNumber(tn)
      if (detected) {
        setDetectedRedirect({ ...detected, tn })
      } else {
        setDetectedRedirect(null)
      }
    } else {
      setDetectedRedirect(null)
    }

    setAnimating(true)
    setShipment(null)
    setNotFound(false)
    setAirlineRedirect(null)
    setContainerRedirect(null)
    setBookingRedirect(null)
    setApiReady(false)
    apiResultRef.current = null

    pendingRef.current = fetchShipment(tn, carrierSlug, isBooking).then(result => {
      apiResultRef.current = result
      setApiReady(true)
      return result
    })
  }

  // ── Document upload: extract tracking numbers from a digital PDF ──────────
  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (e.target) e.target.value = ''   // allow re-selecting the same file
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setExtractError('Please upload a PDF file (digital, not a scanned image).')
      return
    }
    setExtracting(true)
    setExtractError('')
    setCandidates(null)
    setUploadedName(file.name)
    try {
      const found = await extractFromPdf(file)
      if (found.length === 0) {
        setExtractError('No tracking numbers found. This may be a scanned image — try entering the number manually.')
      } else {
        setCandidates(found)
      }
    } catch {
      setExtractError('Could not read this PDF. It may be encrypted or a scanned image.')
    } finally {
      setExtracting(false)
    }
  }

  function trackCandidate(c: Candidate) {
    // Auto-pick a sensible carrier mode hint for containers/MAWBs
    setCandidates(null)
    setExtractError('')
    setUploadedName('')
    setLines([c.value])
    setCurrentId(c.value)
    navigate(`/track/${encodeURIComponent(c.value)}`, { replace: true })
    triggerSearch(c.value)
  }

  function handleAnimationComplete() {
    // Animation held until apiReady — result is already in apiResultRef
    const result = apiResultRef.current
    setAnimating(false)
    if (result) {
      // Quality gate: if the API returned a shell with no events and no coordinates
      // (17track found the number format but has no real data yet), AND we have a
      // known airline redirect, prefer the redirect card — it's more useful than
      // showing an empty "Tracking data not available yet" notice.
      const hasRealData = result.timeline.length > 0 ||
        result.origin.lat !== 0 || result.origin.lng !== 0
      if (!hasRealData) {
        const airRedir = getAirlineRedirect(currentId)
        if (airRedir) {
          setAirlineRedirect(airRedir)
          setNotFound(false)
          setLastUpdated(new Date())
          return
        }
        // Owner-code lookup first; try sea B/L reference; then carrier-name fallback.
        const ctnRedir = getContainerRedirect(currentId)
          ?? getSeaReferenceRedirect(currentId)
          ?? (result.carrier ? getContainerRedirectByCarrier(currentId, result.carrier) : null)
        if (ctnRedir) {
          setContainerRedirect(ctnRedir)
          setNotFound(false)
          setLastUpdated(new Date())
          return
        }
      }
      // Fire a browser notification if the status changed and alerts are on
      const prevStatus = shipment?.status
      if (
        prevStatus &&
        prevStatus !== result.status &&
        alertsEnabled &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        new Notification(`Shipment ${result.trackingNumber} updated`, {
          body: `Status changed to: ${result.statusLabel}`,
          icon: '/favicon.ico',
        })
      }
      // Gate sea freight API data for free users
      if (user && planTier === 'free' && result.freightType === 'sea' && result.timeline.length > 0) {
        setUpgradeFeature('sea')
        setAnimating(false)
        setLastUpdated(new Date())
        return
      }

      // Keep detectedRedirect visible even with inline data — users should always
      // be able to open the official carrier page
      setShipment(result)
      setNotFound(false)

      // Sync the latest status back to the DB if this shipment is saved
      if (user && supabase) {
        supabase
          .from('shipments')
          .update({
            status:      result.status,
            carrier_name: result.carrier,
            est_delivery: result.estimatedDelivery ?? null,
            origin_city:  result.origin?.city ?? null,
            dest_city:    result.destination?.city ?? null,
            updated_at:  new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .eq('tracking_number', result.trackingNumber)
          .then(() => {})  // fire-and-forget
      }
    } else {
      // Booking mode fallback → show redirect card
      if (mode === 'booking' && bookingCarrier) {
        setBookingRedirect({ carrier: bookingCarrier, ref: currentId })
        setNotFound(false)
      } else {
        // Check for airline or container redirect before showing generic "not found"
        const airRedir = getAirlineRedirect(currentId)
        if (airRedir) {
          setAirlineRedirect(airRedir)
          setNotFound(false)
        } else {
          const ctnRedir = getContainerRedirect(currentId) ?? getSeaReferenceRedirect(currentId)
          if (ctnRedir) {
            setContainerRedirect(ctnRedir)
            setNotFound(false)
          } else {
            setNotFound(true)
          }
        }
      }
    }
    setLastUpdated(new Date())
  }

  function handleTrack() {
    if (mode === 'booking') {
      const id = (lines[0] || '').trim()
      if (!id || !bookingCarrier) return
      if (!checkGuestLimit()) return
      setCurrentId(id)
      setBookingRedirect(null)
      navigate(`/track/${encodeURIComponent(id)}`, { replace: true })
      triggerSearch(id, bookingCarrier.slug, true)
      return
    }
    const id = lines.filter(l => l.trim())[0] || ''
    if (!id) return

    // Guest limit: non-logged-in users get GUEST_LIMIT free tracks
    if (!checkGuestLimit()) return

    // Free plan gate: air freight (MAWB) requires Pro
    if (user && planTier === 'free') {
      const detected = detectCarrierFromNumber(id.trim())
      if (detected?.carrier.category === 'air') {
        setUpgradeFeature('air')
        return
      }
    }

    setCurrentId(id)
    navigate(`/track/${encodeURIComponent(id.trim())}`, { replace: true })
    triggerSearch(id)
  }

  function checkGuestLimit(): boolean {
    if (user) return true
    const uses = parseInt(localStorage.getItem(GUEST_USES_KEY) || '0', 10)
    if (uses >= GUEST_LIMIT) {
      setShowAuthWall(true)
      return false
    }
    localStorage.setItem(GUEST_USES_KEY, String(uses + 1))
    return true
  }

  // Load persisted alert state whenever the tracked shipment changes
  useEffect(() => {
    if (!shipment) return
    const saved = localStorage.getItem(`alerts:${shipment.trackingNumber}`)
    setAlertsEnabled(saved === 'true')

    // Load email_notify state from DB if user is logged in
    if (user && supabase) {
      supabase
        .from('shipments')
        .select('email_notify')
        .eq('user_id', user.id)
        .eq('tracking_number', shipment.trackingNumber)
        .single()
        .then(({ data }) => {
          if (data) setEmailAlertsEnabled(!!data.email_notify)
        })
    } else {
      setEmailAlertsEnabled(false)
    }
  }, [shipment?.trackingNumber, user?.id])

  // Close alerts panel on outside click
  useEffect(() => {
    if (!showAlerts) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-alerts-panel]')) setShowAlerts(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showAlerts])

  function handleShare() {
    const url = `${window.location.origin}/track/${encodeURIComponent(shipment!.trackingNumber)}`
    const shareData = { title: `Track ${shipment!.trackingNumber} on Trackora`, url }
    if (navigator.share && navigator.canShare?.(shareData)) {
      navigator.share(shareData).catch(() => {})
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2000)
      })
    }
  }

  async function handleToggleAlerts() {
    if (!shipment) return
    const next = !alertsEnabled
    setAlertsEnabled(next)
    localStorage.setItem(`alerts:${shipment.trackingNumber}`, String(next))

    if (next && 'Notification' in window) {
      const perm = Notification.permission === 'default'
        ? await Notification.requestPermission()
        : Notification.permission
      if (perm === 'granted') {
        new Notification('Trackora Alerts Active', {
          body: `You'll be notified when ${shipment.trackingNumber} status changes.`,
          icon: '/favicon.ico',
        })
      }
    }
    setShowAlerts(false)
  }

  async function handleToggleEmailAlerts() {
    if (!shipment || !user || !supabase) return
    const next = !emailAlertsEnabled
    setEmailAlertsEnabled(next)   // optimistic UI
    setEmailAlertsSaving(true)
    try {
      // UPSERT: create the row if it doesn't exist yet, update if it does.
      // A plain UPDATE silently fails when the shipment hasn't been saved to DB.
      const { error } = await supabase
        .from('shipments')
        .upsert({
          user_id:         user.id,
          tracking_number: shipment.trackingNumber,
          carrier_name:    shipment.carrier ?? null,
          status:          shipment.status  ?? null,
          freight_type:    shipment.freightType ?? 'express',
          origin_city:     shipment.origin?.city ?? null,
          origin_country:  shipment.origin?.country ?? null,
          dest_city:       shipment.destination?.city ?? null,
          dest_country:    shipment.destination?.country ?? null,
          est_delivery:    shipment.estimatedDelivery ?? null,
          email_notify:    next,
        }, { onConflict: 'user_id,tracking_number' })

      if (error) {
        // Revert optimistic UI on failure
        setEmailAlertsEnabled(!next)
        console.error('[Trackora] email alert toggle failed:', error.message)
      }
    } catch (e) {
      setEmailAlertsEnabled(!next)
      console.error('[Trackora] email alert toggle error:', e)
    } finally {
      setEmailAlertsSaving(false)
    }
  }

  const addLine = () => setLines(prev => [...prev, ''])
  const removeLine = (i: number) => setLines(prev => prev.filter((_, idx) => idx !== i))
  const updateLine = (i: number, val: string) => {
    setLines(prev => prev.map((l, idx) => idx === i ? val : l))
    setActiveLineIdx(i)
  }

  const hasResults = shipment || notFound || !!airlineRedirect || !!containerRedirect || !!bookingRedirect || !!detectedRedirect

  // Tracking-number format guidance + live validation for the selected carrier
  const fmt = carrierContext ? getCarrierFormat(carrierContext) : null
  const firstInput = (lines[0] || '').trim()
  const formatValid = fmt?.pattern ? fmt.pattern.test(firstInput) : null

  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px' }}>
      {/* ── Top search area ── */}
      <div style={{
        background: 'linear-gradient(to bottom, rgba(10,15,30,1) 0%, rgba(10,15,30,0.95) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: hasResults
          ? (isMobile ? '14px 16px' : '20px 24px')
          : (isMobile ? '28px 16px 24px' : '48px 24px 40px'),
        transition: 'padding 0.4s ease',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {!hasResults && !animating && (
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              {carrierContext && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  padding: '6px 8px 6px 14px', borderRadius: '100px', marginBottom: '18px',
                  background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
                  fontSize: '13px', color: '#a5b4fc', fontWeight: 600,
                }}>
                  Tracking via {carrierContext}
                  <button
                    onClick={() => navigate('/track')}
                    title="Clear carrier"
                    style={{
                      display: 'flex', background: 'rgba(255,255,255,0.08)', border: 'none',
                      borderRadius: '50%', width: '20px', height: '20px', alignItems: 'center',
                      justifyContent: 'center', color: 'rgba(248,250,252,0.6)', cursor: 'pointer',
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              <h1 style={{ fontSize: isMobile ? '24px' : 'clamp(28px,5vw,44px)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-1px', marginBottom: '8px' }}>
                {carrierContext ? `Track your ${carrierContext} shipment` : 'Track any shipment — instantly'}
              </h1>
              {!isMobile && (
                <p style={{ fontSize: '16px', color: 'rgba(248,250,252,0.5)', lineHeight: 1.5 }}>
                  {carrierContext
                    ? `Enter your ${carrierContext} tracking number below — results show right here on Trackora.`
                    : 'Enter up to 40 tracking numbers, one per line · 1,200+ carriers auto-detected'}
                </p>
              )}

              {/* Carrier tracking-number format guidance */}
              {fmt && (
                <div style={{
                  display: 'inline-flex', flexDirection: 'column', gap: '8px',
                  marginTop: '20px', padding: '14px 18px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                  textAlign: 'left', maxWidth: '440px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'rgba(248,250,252,0.4)' }}>
                      {carrierContext} number format
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#f8fafc', fontWeight: 600 }}>
                    {fmt.format}
                  </div>
                  {fmt.example && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(248,250,252,0.4)' }}>Example:</span>
                      <button
                        onClick={() => { setLines([fmt.example]); setActiveLineIdx(0) }}
                        title="Use this example"
                        style={{
                          fontFamily: 'monospace', fontSize: '13px', letterSpacing: '1px',
                          color: '#818cf8', background: 'rgba(99,102,241,0.1)',
                          border: '1px solid rgba(99,102,241,0.25)', borderRadius: '6px',
                          padding: '2px 8px', cursor: 'pointer',
                        }}
                      >
                        {fmt.example}
                      </button>
                    </div>
                  )}
                  {/* Live validation against the format */}
                  {firstInput && fmt.pattern && (
                    <div style={{
                      fontSize: '12px', fontWeight: 600,
                      color: formatValid ? '#34d399' : '#f59e0b',
                    }}>
                      {formatValid
                        ? `✓ Looks like a valid ${carrierContext} number`
                        : `⚠ Doesn't match the expected ${carrierContext} format yet`}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mode toggle */}
          {!hasResults && !animating && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {([
                { id: 'single',  label: '🔍 Single Track' },
                { id: 'multi',   label: '📋 Multi-Track' },
                { id: 'sea',     label: '🚢 Sea Freight' },
                { id: 'booking', label: '✈️ Air Cargo B/L' },
              ] as const).map(m => (
                <button key={m.id} onClick={() => { setMode(m.id); setBookingCarrier(null) }} style={{
                  padding: '6px 18px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: mode === m.id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${mode === m.id ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: mode === m.id ? '#818cf8' : 'rgba(248,250,252,0.6)',
                }}>
                  {m.label}
                </button>
              ))}
            </div>
          )}

          {/* Sea freight mode — full dedicated tracker */}
          {!animating && mode === 'sea' && (
            <div style={{ marginBottom: '0' }}>
              <SeaFreightTracker />
            </div>
          )}

          {/* Booking mode: carrier selector (air only now) */}
          {!hasResults && !animating && mode === 'booking' && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(248,250,252,0.45)', marginBottom: '12px' }}>
                Select airline — AWB/booking numbers are carrier-specific:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {(['air'] as const).map(cat => (
                  <div key={cat} style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                    <span style={{ width: '100%', textAlign: 'center', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(248,250,252,0.25)', marginBottom: '2px' }}>
                      {'✈️ Air Freight'}
                    </span>
                    {BOOKING_CARRIERS.filter(c => c.category === cat).map(c => {
                      const sel = bookingCarrier?.slug === c.slug
                      return (
                        <button
                          key={c.slug}
                          onClick={() => setBookingCarrier(sel ? null : c)}
                          style={{
                            padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.18s',
                            background: sel ? `${c.accentColor}25` : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${sel ? c.accentColor + '70' : 'rgba(255,255,255,0.08)'}`,
                            color: sel ? c.accentColor : 'rgba(248,250,252,0.65)',
                            boxShadow: sel ? `0 0 12px ${c.accentColor}20` : 'none',
                          }}
                        >
                          {c.name}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input area — hidden in sea mode (SeaFreightTracker replaces it) */}
          {!animating && mode !== 'sea' && (
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 0 60px rgba(99,102,241,0.12)',
            }}>
              {/* Lines */}
              <div style={{ padding: '8px 0' }}>
                {(mode === 'single' ? lines.slice(0, 1) : lines).map((line, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '8px 16px',
                    borderBottom: i < lines.length - 1 && mode === 'multi' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: activeLineIdx === i && mode === 'multi' ? 'rgba(99,102,241,0.05)' : 'transparent',
                  }}>
                    {mode === 'multi' && (
                      <span style={{ fontSize: '12px', color: 'rgba(248,250,252,0.2)', fontFamily: 'monospace', width: '16px', flexShrink: 0 }}>
                        {i + 1}.
                      </span>
                    )}
                    <Search size={16} color="rgba(248,250,252,0.3)" style={{ flexShrink: 0 }} />
                    <input
                      value={line}
                      onChange={e => updateLine(i, e.target.value)}
                      onFocus={() => setActiveLineIdx(i)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (mode === 'multi') addLine()
                          else handleTrack()
                        }
                      }}
                      placeholder={
                        mode === 'booking'
                          ? (bookingCarrier ? `Enter ${bookingCarrier.hint}…` : 'Select a carrier above, then enter booking reference…')
                          : i === 0
                            ? 'Enter tracking number, AWB, BOL, Container ID…'
                            : 'Add another tracking number…'
                      }
                      style={{
                        flex: 1, background: 'none', border: 'none', outline: 'none',
                        color: '#f8fafc', fontSize: '15px',
                        padding: '8px 0',
                        fontFamily: line.length > 6 ? 'monospace' : 'inherit',
                        letterSpacing: line.length > 6 ? '1px' : 'normal',
                      }}
                    />
                    {/* Live carrier detection badge */}
                    {activeLineIdx === i && detectCarrier(line) && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '3px 10px', borderRadius: '100px', flexShrink: 0,
                        background: detectCarrier(line)!.bg,
                        border: `1px solid ${detectCarrier(line)!.color}40`,
                        fontSize: '11px', fontWeight: 700,
                        color: detectCarrier(line)!.color,
                        animation: 'fadeInRight 0.2s ease',
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: detectCarrier(line)!.color, display: 'inline-block' }} />
                        {detectCarrier(line)!.name} detected
                      </div>
                    )}
                    {mode === 'multi' && lines.length > 1 && (
                      <button onClick={() => removeLine(i)} style={{
                        background: 'none', border: 'none', color: 'rgba(248,250,252,0.3)',
                        cursor: 'pointer', padding: '4px', borderRadius: '4px', flexShrink: 0,
                      }}>
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Upload AWB / BOL toolbar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 16px', flexWrap: 'wrap',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}>
                {/* Upload AWB / BOL */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileSelected}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={extracting}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '7px 12px', borderRadius: '10px',
                    cursor: extracting ? 'wait' : 'pointer',
                    background: 'rgba(34,211,153,0.1)', border: '1px solid rgba(34,211,153,0.3)',
                    color: '#34d399', fontSize: '13px', fontWeight: 600,
                  }}>
                  {extracting
                    ? <><Loader2 size={14} className="spin" /> Reading…</>
                    : <><Upload size={14} /> Upload AWB / BOL</>}
                </button>

                <span style={{ fontSize: '11px', color: 'rgba(248,250,252,0.3)' }}>
                  Auto-extracts container & AWB numbers from PDFs
                </span>
              </div>

              {/* Extraction result / error */}
              {(candidates || extractError) && (
                <div style={{
                  padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(0,0,0,0.12)',
                }}>
                  {extractError && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      fontSize: '13px', color: '#f59e0b',
                    }}>
                      <X size={14} /> {extractError}
                    </div>
                  )}
                  {candidates && candidates.length > 0 && (
                    <>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px',
                        fontSize: '13px', color: 'rgba(248,250,252,0.7)',
                      }}>
                        <FileText size={14} color="#34d399" />
                        Found {candidates.length} number{candidates.length > 1 ? 's' : ''} in
                        <span style={{ color: '#f8fafc', fontWeight: 600 }}>{uploadedName}</span>
                        — pick one to track:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {candidates.map((c, i) => (
                          <button
                            key={i}
                            onClick={() => trackCandidate(c)}
                            style={{
                              display: 'flex', flexDirection: 'column', gap: '2px',
                              padding: '8px 14px', borderRadius: '10px', cursor: 'pointer',
                              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
                              textAlign: 'left',
                            }}>
                            <span style={{ fontFamily: 'monospace', fontSize: '14px', color: '#f8fafc', letterSpacing: '0.5px' }}>
                              {c.value}
                            </span>
                            <span style={{ fontSize: '10px', color: '#818cf8', fontWeight: 600 }}>
                              {c.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Bottom bar */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'center',
                justifyContent: 'space-between',
                padding: isMobile ? '10px 14px' : '10px 16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(0,0,0,0.15)',
                gap: '10px',
              }}>
                {!isMobile && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {mode === 'multi' && lines.length < 40 && (
                      <button onClick={addLine} style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        padding: '5px 12px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(248,250,252,0.6)', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                      }}>
                        <Plus size={12} /> Add row
                      </button>
                    )}
                    <span style={{ fontSize: '12px', color: 'rgba(248,250,252,0.3)' }}>
                      Try: {DEMO_IDS.map((id) => (
                        <button key={id} onClick={() => { setLines([id]); setCurrentId(id) }} style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#818cf8', fontSize: '12px', fontFamily: 'monospace',
                          padding: '0 4px', textDecoration: 'underline dotted',
                        }}>{id}</button>
                      ))}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleTrack}
                  disabled={mode === 'booking' && !bookingCarrier}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: isMobile ? '13px' : '11px 28px', borderRadius: '12px',
                    background: mode === 'booking' && !bookingCarrier
                      ? 'rgba(99,102,241,0.25)'
                      : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    border: 'none', color: 'white', fontSize: '15px', fontWeight: 700,
                    cursor: mode === 'booking' && !bookingCarrier ? 'not-allowed' : 'pointer',
                    boxShadow: mode === 'booking' && !bookingCarrier ? 'none' : '0 4px 20px rgba(99,102,241,0.45)',
                    opacity: mode === 'booking' && !bookingCarrier ? 0.6 : 1,
                  }}
                >
                  <ScanLine size={16} />
                  {mode === 'booking'
                    ? (bookingCarrier ? `Track ${bookingCarrier.name} Booking` : 'Select a carrier first')
                    : mode === 'multi' && lines.filter(l => l.trim()).length > 1
                      ? `Track ${lines.filter(l => l.trim()).length} shipments`
                      : 'Track Now'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 24px' }}>
        {/* Scanning animation */}
        {animating && (
          <TrackingAnimation
            trackingNumber={currentId || lines[0] || ''}
            apiReady={apiReady}
            onComplete={handleAnimationComplete}
          />
        )}

        {/* Not found */}
        {!animating && notFound && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Sea freight fallback — shown for any "not found" result */}
            <div style={{
              padding: '20px 24px', borderRadius: '16px',
              background: 'rgba(66,173,239,0.06)',
              border: '1px solid rgba(66,173,239,0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{ fontSize: '20px' }}>🚢</span>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#42ADEF' }}>
                  Is this a sea freight shipment?
                </h3>
              </div>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'rgba(248,250,252,0.5)', lineHeight: 1.6 }}>
                Numbers like <code style={{ fontFamily: 'monospace', color: '#f8fafc' }}>{currentId}</code> from carriers like CMA CGM, Evergreen, Turkon, Maersk, MSC etc. cannot be auto-detected — select your carrier below to track instantly.
              </p>
              <SeaFreightTracker initialNumber={currentId} compact />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center', paddingBottom: '16px' }}>
              <div style={{ fontSize: '40px' }}>📭</div>
              <p style={{ color: 'rgba(248,250,252,0.35)', fontSize: '13px' }}>
                Not sea freight? Try one of the demo IDs:
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {DEMO_IDS.map(id => (
                  <button key={id} onClick={() => { setLines([id]); setCurrentId(id); navigate(`/track/${id}`); triggerSearch(id) }} style={{
                    padding: '6px 14px', borderRadius: '8px',
                    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                    color: '#818cf8', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer',
                  }}>{id}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Detection-first carrier redirect — suppressed when the specialist airline/container
            redirect card is already shown (those are more detailed for MAWB/container numbers) */}
        {!animating && detectedRedirect && !airlineRedirect && !containerRedirect && (
          shipment
            ? /* Compact banner when inline data also loaded */
              <a
                href={detectedRedirect.filledUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '12px', padding: '12px 18px', borderRadius: '12px',
                  marginBottom: '20px', textDecoration: 'none',
                  background: `${detectedRedirect.carrier.accentColor}18`,
                  border: `1px solid ${detectedRedirect.carrier.accentColor}40`,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = `${detectedRedirect.carrier.accentColor}28`)}
                onMouseLeave={e => (e.currentTarget.style.background = `${detectedRedirect.carrier.accentColor}18`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {detectedRedirect.carrier.logoUrl
                    ? <img src={detectedRedirect.carrier.logoUrl} alt="" style={{ height: '22px', width: 'auto', maxWidth: '60px', objectFit: 'contain', background: '#fff', borderRadius: '4px', padding: '2px 4px' }} />
                    : <span style={{ fontSize: '16px' }}>🔗</span>
                  }
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(248,250,252,0.8)' }}>
                    Also view on <strong style={{ color: detectedRedirect.carrier.accentColor }}>{detectedRedirect.carrier.name}</strong>'s official site
                  </span>
                  {detectedRedirect.carrier.confidence === 'medium' && (
                    <span style={{ fontSize: '11px', color: 'rgba(248,250,252,0.35)', fontStyle: 'italic' }}>· wrong carrier?</span>
                  )}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: detectedRedirect.carrier.accentColor, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Open →
                </span>
              </a>
            : /* Full card when no inline data */
              <CarrierRedirectCard
                carrier={detectedRedirect.carrier}
                trackingNumber={detectedRedirect.tn}
                filledUrl={detectedRedirect.filledUrl}
                loading={false}
              />
        )}

        {/* Airline redirect card */}
        {!animating && airlineRedirect && (
          <AirlineRedirectCard redirect={airlineRedirect} />
        )}

        {/* Container redirect card */}
        {!animating && containerRedirect && (
          <ContainerRedirectCard redirect={containerRedirect} />
        )}

        {/* Booking redirect card */}
        {!animating && bookingRedirect && (
          <BookingRedirectCard carrier={bookingRedirect.carrier} bookingRef={bookingRedirect.ref} />
        )}

        {/* Results */}
        {!animating && shipment && (
          <>
            {/* Sparse-data notice — shown when carrier returned no useful location/events */}
            {shipment.timeline.length === 0 &&
             shipment.origin.lat === 0 && shipment.origin.lng === 0 && (() => {
              const carrierUrl = getCarrierTrackUrl(shipment.carrier, shipment.trackingNumber)
              const isPickedUp = shipment.status === 'picked_up'
              return (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '14px',
                  padding: '16px 20px', borderRadius: '16px', marginBottom: '20px',
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.25)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>📡</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#f59e0b', marginBottom: '4px' }}>
                      {isPickedUp ? 'Booking confirmed — awaiting first scan' : 'Tracking data not available yet'}
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.6, marginBottom: carrierUrl ? '12px' : 0 }}>
                      {isPickedUp
                        ? <>
                            {shipment.carrier} has picked up your shipment but hasn't posted any transit scan events yet.
                            This is normal in the first 24–48 hours — the parcel is on its way.
                          </>
                        : <>
                            We found this tracking number with <strong style={{ color: 'rgba(248,250,252,0.75)' }}>{shipment.carrier}</strong> but no scan events have been posted yet.
                            {' '}Data usually appears within 24 hours of the first physical scan.
                          </>
                      }
                    </div>
                    {carrierUrl && (
                      <a
                        href={carrierUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '7px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                          background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)',
                          color: '#fbbf24', textDecoration: 'none', transition: 'background 0.2s',
                        }}
                      >
                        Check on {shipment.carrier} →
                      </a>
                    )}
                  </div>
                </div>
              )
            })()}

            {/* Header */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', marginBottom: isMobile ? '16px' : '24px', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => navigate(-1)} style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '7px 12px', borderRadius: '10px', flexShrink: 0,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(248,250,252,0.6)', fontSize: '13px', cursor: 'pointer',
                }}>
                  <ArrowLeft size={15} /> Back
                </button>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <h1 style={{ fontSize: isMobile ? '16px' : '22px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {shipment.trackingNumber}
                    </h1>
                    {shipment.dangerousGoods && <DGBadge size="sm" />}
                  </div>
                  <p style={{ fontSize: '11px', color: 'rgba(248,250,252,0.35)' }}>
                    Updated {lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                {/* Refresh */}
                <button onClick={() => triggerSearch(shipment.trackingNumber)} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: isMobile ? '8px 10px' : '8px 14px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(248,250,252,0.7)', fontSize: '13px', cursor: 'pointer',
                }}>
                  <RefreshCw size={14} /> {!isMobile && 'Refresh'}
                </button>

                {/* Alerts */}
                <div style={{ position: 'relative' }} data-alerts-panel>
                  <button
                    onClick={() => setShowAlerts(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '10px', cursor: 'pointer',
                      background: alertsEnabled ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.05)',
                      border: alertsEnabled ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.08)',
                      color: alertsEnabled ? '#818cf8' : 'rgba(248,250,252,0.7)',
                      fontSize: '13px',
                    }}>
                    {alertsEnabled ? <Bell size={14} /> : <BellOff size={14} />}
                    {alertsEnabled ? 'Alerts On' : 'Alerts'}
                  </button>

                  {/* Mobile backdrop */}
                  {showAlerts && isMobile && (
                    <div
                      onClick={() => setShowAlerts(false)}
                      style={{ position: 'fixed', inset: 0, zIndex: 199, background: 'rgba(0,0,0,0.5)' }}
                    />
                  )}

                  {showAlerts && (
                    <div style={isMobile ? {
                      // Mobile: full-width bottom sheet fixed to viewport
                      position: 'fixed', bottom: 0, left: 0, right: 0,
                      borderRadius: '20px 20px 0 0', zIndex: 200,
                      background: 'rgba(15,20,40,0.99)', backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderBottom: 'none',
                      boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
                      padding: '20px 20px 36px',
                    } : {
                      // Desktop: dropdown anchored right of button
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                      width: '300px', borderRadius: '16px', zIndex: 100,
                      background: 'rgba(15,20,40,0.97)', backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                      padding: '20px',
                    }}>
                      {/* Mobile drag handle */}
                      {isMobile && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.2)' }} />
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>
                          Status Alerts
                        </div>
                        {isMobile && (
                          <button onClick={() => setShowAlerts(false)} style={{ background: 'none', border: 'none', color: 'rgba(248,250,252,0.4)', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '0 4px' }}>×</button>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.45)', marginBottom: '16px', lineHeight: 1.5 }}>
                        Get notified whenever this shipment's status changes.
                      </div>

                      {/* Browser notifications toggle */}
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 14px', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        marginBottom: '8px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Bell size={14} color="#818cf8" />
                          <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: 600 }}>Browser</span>
                        </div>
                        <button
                          onClick={handleToggleAlerts}
                          style={{
                            width: '40px', height: '22px', borderRadius: '11px', border: 'none',
                            cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                            background: alertsEnabled ? '#6366f1' : 'rgba(255,255,255,0.15)',
                            flexShrink: 0,
                          }}>
                          <span style={{
                            position: 'absolute', top: '3px',
                            left: alertsEnabled ? '21px' : '3px',
                            width: '16px', height: '16px', borderRadius: '50%',
                            background: '#fff', transition: 'left 0.2s',
                            display: 'block',
                          }} />
                        </button>
                      </div>

                      {/* Email notifications toggle */}
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 14px', borderRadius: '12px',
                        background: user ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        marginBottom: '12px',
                        opacity: user ? 1 : 0.5,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={14} color={user ? '#22d3ee' : 'rgba(248,250,252,0.3)'} />
                          <div>
                            <span style={{ fontSize: '13px', color: user ? '#f8fafc' : 'rgba(248,250,252,0.4)', fontWeight: 600 }}>Email</span>
                            {!user && <p style={{ margin: '1px 0 0', fontSize: '10px', color: 'rgba(248,250,252,0.3)' }}>Sign in to enable</p>}
                          </div>
                        </div>
                        <button
                          onClick={user ? handleToggleEmailAlerts : undefined}
                          disabled={!user || emailAlertsSaving}
                          style={{
                            width: '40px', height: '22px', borderRadius: '11px', border: 'none',
                            cursor: user ? 'pointer' : 'not-allowed',
                            position: 'relative', transition: 'background 0.2s',
                            background: emailAlertsEnabled ? '#22d3ee' : 'rgba(255,255,255,0.15)',
                            flexShrink: 0,
                            opacity: emailAlertsSaving ? 0.6 : 1,
                          }}>
                          <span style={{
                            position: 'absolute', top: '3px',
                            left: emailAlertsEnabled ? '21px' : '3px',
                            width: '16px', height: '16px', borderRadius: '50%',
                            background: '#fff', transition: 'left 0.2s',
                            display: 'block',
                          }} />
                        </button>
                      </div>

                      {'Notification' in window && Notification.permission === 'denied' && (
                        <div style={{ fontSize: '12px', color: '#f59e0b', padding: '8px 10px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '12px' }}>
                          ⚠ Browser notifications are blocked in your settings.
                        </div>
                      )}

                      <button
                        onClick={() => setShowAlerts(false)}
                        style={{
                          width: '100%', padding: '8px', borderRadius: '10px',
                          background: 'none', border: '1px solid rgba(255,255,255,0.08)',
                          color: 'rgba(248,250,252,0.4)', fontSize: '12px', cursor: 'pointer',
                        }}>
                        Close
                      </button>
                    </div>
                  )}
                </div>

                {/* Share */}
                <button onClick={handleShare} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '10px', cursor: 'pointer',
                  background: shareCopied ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
                  border: shareCopied ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.08)',
                  color: shareCopied ? '#34d399' : 'rgba(248,250,252,0.7)',
                  fontSize: '13px', transition: 'all 0.2s',
                }}>
                  {shareCopied ? <Check size={14} /> : <Share2 size={14} />}
                  {shareCopied ? 'Copied!' : 'Share'}
                </button>
              </div>
            </div>

            {/* Responsive layout: 2-col on desktop, stacked on mobile */}
            {isMobile ? (
              /* ── Mobile: vertical stack ── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Details first on mobile */}
                <ShipmentDetails shipment={shipment} />

                {/* Map */}
                <div style={{
                  borderRadius: '16px', overflow: 'hidden',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)', height: '240px', position: 'relative',
                }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,15,30,0.8), rgba(15,22,41,0.6))' }} />
                  {(() => {
                    const hasCoords =
                      (shipment.origin.lat !== 0 || shipment.origin.lng !== 0) &&
                      (shipment.destination.lat !== 0 || shipment.destination.lng !== 0)
                    return (
                      <WorldMap
                        freightType={shipment.freightType}
                        route={hasCoords
                          ? { from: [shipment.origin.lat, shipment.origin.lng], to: [shipment.destination.lat, shipment.destination.lng] }
                          : undefined}
                        points={hasCoords ? [
                          { lat: shipment.origin.lat,          lng: shipment.origin.lng,          label: shipment.origin.city,      type: 'origin'      },
                          { lat: shipment.currentLocation.lat, lng: shipment.currentLocation.lng, label: 'Current',                 type: 'waypoint'    },
                          { lat: shipment.destination.lat,     lng: shipment.destination.lng,     label: shipment.destination.city, type: 'destination' },
                        ] : undefined}
                      />
                    )
                  })()}
                  <div style={{
                    position: 'absolute', bottom: '10px', left: '10px',
                    background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '7px 10px',
                    display: 'flex', gap: '10px',
                  }}>
                    {[{ color: '#10b981', label: 'Origin' }, { color: '#f59e0b', label: 'Current' }, { color: '#ef4444', label: 'Destination' }].map(l => (
                      <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'rgba(248,250,252,0.6)' }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: l.color }} />{l.label}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <TrackingTimeline events={shipment.timeline} delayRisk={shipment.delayRisk} delayReason={shipment.delayReason} />
                </div>
              </div>
            ) : (
              /* ── Desktop: two-column ── */
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: '24px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Map */}
                  <div style={{
                    borderRadius: '20px', overflow: 'hidden',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', height: '380px', position: 'relative',
                  }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,15,30,0.8), rgba(15,22,41,0.6))' }} />
                    {(() => {
                      const hasCoords =
                        (shipment.origin.lat !== 0 || shipment.origin.lng !== 0) &&
                        (shipment.destination.lat !== 0 || shipment.destination.lng !== 0)
                      return (
                        <WorldMap
                          freightType={shipment.freightType}
                          route={hasCoords
                            ? { from: [shipment.origin.lat, shipment.origin.lng], to: [shipment.destination.lat, shipment.destination.lng] }
                            : undefined}
                          points={hasCoords ? [
                            { lat: shipment.origin.lat,          lng: shipment.origin.lng,          label: shipment.origin.city,      type: 'origin'      },
                            { lat: shipment.currentLocation.lat, lng: shipment.currentLocation.lng, label: 'Current',                 type: 'waypoint'    },
                            { lat: shipment.destination.lat,     lng: shipment.destination.lng,     label: shipment.destination.city, type: 'destination' },
                          ] : undefined}
                        />
                      )
                    })()}
                    <div style={{
                      position: 'absolute', bottom: '16px', left: '16px',
                      background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 14px',
                      display: 'flex', gap: '16px',
                    }}>
                      {[{ color: '#10b981', label: 'Origin' }, { color: '#f59e0b', label: 'Current' }, { color: '#ef4444', label: 'Destination' }].map(l => (
                        <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(248,250,252,0.6)' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />{l.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <TrackingTimeline events={shipment.timeline} delayRisk={shipment.delayRisk} delayReason={shipment.delayReason} />
                  </div>
                </div>

                {/* Right panel */}
                <ShipmentDetails shipment={shipment} />
              </div>
            )}
          </>
        )}

        {/* Empty state - no search yet */}
        {!animating && !shipment && !notFound && !trackingId && (
          <div style={{ textAlign: 'center', padding: '60px 24px', color: 'rgba(248,250,252,0.4)' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🌍</div>
            <p style={{ fontSize: '16px' }}>Enter a tracking number above and hit Track Now</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
      `}</style>

      {/* Guest limit wall — requires sign-up after 3 free tracks */}
      {showAuthWall && (
        <AuthModal
          initialMode="signup"
          onClose={() => setShowAuthWall(false)}
          guestLimitMessage={`You've used your ${GUEST_LIMIT} free tracking lookups. Create a free account to keep tracking — unlimited express & land freight, forever free.`}
        />
      )}

      {/* Plan upgrade modal */}
      {upgradeFeature && (
        <UpgradeModal
          feature={upgradeFeature}
          onClose={() => setUpgradeFeature(null)}
        />
      )}
    </div>
  )
}
