import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Search, ArrowLeft, Share2, Bell, RefreshCw, ScanLine, Plus, X } from 'lucide-react'
import { getShipment, type Shipment } from '../data/mockShipments'
import TrackingTimeline from '../components/tracking/TrackingTimeline'
import ShipmentDetails from '../components/tracking/ShipmentDetails'
import WorldMap from '../components/tracking/WorldMap'
import TrackingAnimation from '../components/tracking/TrackingAnimation'

// Carrier auto-detection patterns shown live as user types
const CARRIER_HINTS = [
  { pattern: /^1Z/i, name: 'UPS', color: '#f5a623', bg: '#3d1f00' },
  { pattern: /^(JD|VD|UD)/i, name: 'JD Logistics', color: '#c0392b', bg: '#1a0000' },
  { pattern: /^MAD/i, name: 'Maersk', color: '#42ADEF', bg: '#003F6C' },
  { pattern: /^MAWB/i, name: 'Air Cargo / MAWB', color: '#FFAD00', bg: '#05164D' },
  { pattern: /^CNTR|^[A-Z]{4}\d{7}/i, name: 'Container (ISO)', color: '#10b981', bg: '#052e16' },
  { pattern: /^(\d{12}|\d{15}|\d{20})/i, name: 'FedEx', color: '#FF6200', bg: '#1a0d2e' },
  { pattern: /^\d{10}$/, name: 'DHL / Deutsche Post', color: '#FFCC00', bg: '#c8102e' },
]

const DEMO_IDS = ['1Z999AA10123456784', 'MAD3456789', 'MAWB001-12345678', 'CNTR8872341']

function detectCarrier(val: string) {
  if (!val || val.length < 2) return null
  return CARRIER_HINTS.find(h => h.pattern.test(val)) || null
}

export default function Track() {
  const { trackingId } = useParams()
  const navigate = useNavigate()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [lines, setLines] = useState<string[]>(trackingId ? [trackingId] : [''])
  const [activeLineIdx, setActiveLineIdx] = useState(0)
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [animating, setAnimating] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [currentId, setCurrentId] = useState(trackingId || '')
  const [mode, setMode] = useState<'single' | 'multi'>('single')

  useEffect(() => {
    if (trackingId) {
      setLines([trackingId])
      setCurrentId(trackingId)
      triggerSearch(trackingId)
    }
  }, [trackingId])

  function triggerSearch(id: string) {
    if (!id.trim()) return
    setAnimating(true)
    setShipment(null)
    setNotFound(false)
  }

  function handleAnimationComplete() {
    const id = currentId || lines[0] || ''
    const result = getShipment(id.trim())
    setAnimating(false)
    if (result) {
      setShipment(result)
      setNotFound(false)
    } else {
      setNotFound(true)
    }
    setLastUpdated(new Date())
  }

  function handleTrack() {
    const id = lines.filter(l => l.trim())[0] || ''
    if (!id) return
    setCurrentId(id)
    navigate(`/track/${encodeURIComponent(id.trim())}`, { replace: true })
    triggerSearch(id)
  }

  const addLine = () => setLines(prev => [...prev, ''])
  const removeLine = (i: number) => setLines(prev => prev.filter((_, idx) => idx !== i))
  const updateLine = (i: number, val: string) => {
    setLines(prev => prev.map((l, idx) => idx === i ? val : l))
    setActiveLineIdx(i)
  }

  const detectedCarrier = detectCarrier(lines[activeLineIdx] || '')
  const hasResults = shipment || notFound

  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px' }}>
      {/* ── Top search area ── */}
      <div style={{
        background: 'linear-gradient(to bottom, rgba(10,15,30,1) 0%, rgba(10,15,30,0.95) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: hasResults ? '20px 24px' : '48px 24px 40px',
        transition: 'padding 0.4s ease',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          {!hasResults && !animating && (
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <h1 style={{ fontSize: 'clamp(28px,5vw,44px)', fontWeight: 800, color: '#f8fafc', letterSpacing: '-1px', marginBottom: '10px' }}>
                Track any shipment — instantly
              </h1>
              <p style={{ fontSize: '16px', color: 'rgba(248,250,252,0.5)', lineHeight: 1.5 }}>
                Enter up to 40 tracking numbers, one per line · 1,200+ carriers auto-detected
              </p>
            </div>
          )}

          {/* Mode toggle */}
          {!hasResults && !animating && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
              {(['single', 'multi'] as const).map(m => (
                <button key={m} onClick={() => setMode(m)} style={{
                  padding: '6px 18px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: mode === m ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${mode === m ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  color: mode === m ? '#818cf8' : 'rgba(248,250,252,0.6)',
                }}>
                  {m === 'single' ? '🔍 Single Track' : '📋 Multi-Track (up to 40)'}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          {!animating && (
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
                      placeholder={i === 0
                        ? 'Enter tracking number, AWB, BOL, Container ID…'
                        : 'Add another tracking number…'}
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

              {/* Bottom bar */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(0,0,0,0.15)',
                gap: '12px',
                flexWrap: 'wrap',
              }}>
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
                    Try: {DEMO_IDS.map((id, i) => (
                      <button key={id} onClick={() => { setLines([id]); setCurrentId(id) }} style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#818cf8', fontSize: '12px', fontFamily: 'monospace',
                        padding: '0 4px', textDecoration: 'underline dotted',
                      }}>{id}</button>
                    ))}
                  </span>
                </div>
                <button onClick={handleTrack} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '11px 28px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  border: 'none', color: 'white', fontSize: '15px', fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.45)',
                  flexShrink: 0,
                }}>
                  <ScanLine size={16} />
                  Track {mode === 'multi' && lines.filter(l => l.trim()).length > 1
                    ? `${lines.filter(l => l.trim()).length} shipments`
                    : 'Now'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Scanning animation */}
        {animating && (
          <TrackingAnimation
            trackingNumber={currentId || lines[0] || ''}
            onComplete={handleAnimationComplete}
          />
        )}

        {/* Not found */}
        {!animating && notFound && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '300px', justifyContent: 'center', gap: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '56px' }}>📭</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc' }}>Shipment not found</h2>
            <p style={{ color: 'rgba(248,250,252,0.5)', maxWidth: '360px', lineHeight: 1.6 }}>
              We queried 1,200+ carriers and couldn't find a match. Try one of the demo IDs.
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
        )}

        {/* Results */}
        {!animating && shipment && (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => navigate(-1)} style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '7px 14px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(248,250,252,0.6)', fontSize: '13px', cursor: 'pointer',
                }}>
                  <ArrowLeft size={15} /> Back
                </button>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px', marginBottom: '2px' }}>
                    {shipment.trackingNumber}
                  </h1>
                  <p style={{ fontSize: '12px', color: 'rgba(248,250,252,0.35)' }}>
                    Updated {lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { icon: RefreshCw, label: 'Refresh', action: () => triggerSearch(shipment.trackingNumber) },
                  { icon: Bell, label: 'Alerts', action: () => {} },
                  { icon: Share2, label: 'Share', action: () => {} },
                ].map(btn => (
                  <button key={btn.label} onClick={btn.action} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 14px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(248,250,252,0.7)', fontSize: '13px', cursor: 'pointer',
                  }}>
                    <btn.icon size={14} /> {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Two-column layout */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: '24px', alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Map */}
                <div style={{
                  borderRadius: '20px', overflow: 'hidden',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)', height: '380px', position: 'relative',
                }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,15,30,0.8), rgba(15,22,41,0.6))' }} />
                  <WorldMap
                    route={{ from: [shipment.origin.lat, shipment.origin.lng], to: [shipment.destination.lat, shipment.destination.lng] }}
                    points={[
                      { lat: shipment.origin.lat, lng: shipment.origin.lng, label: shipment.origin.city, type: 'origin' },
                      { lat: shipment.currentLocation.lat, lng: shipment.currentLocation.lng, label: 'Current', type: 'waypoint' },
                      { lat: shipment.destination.lat, lng: shipment.destination.lng, label: shipment.destination.city, type: 'destination' },
                    ]}
                  />
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
      `}</style>
    </div>
  )
}
