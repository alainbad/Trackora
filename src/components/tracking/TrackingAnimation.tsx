import { useEffect, useState } from 'react'

interface Props {
  trackingNumber: string
  apiReady: boolean
  onComplete: () => void
}

const SCAN_STEPS = [
  { label: 'Parsing tracking number format…',     pct: 18  },
  { label: 'Querying 1,200+ carrier databases…',  pct: 40  },
  { label: 'Carrier matched — connecting…',        pct: 58  },
  { label: 'Retrieving live events from carrier…', pct: 72, hold: true },
  { label: 'Calculating AI delivery prediction…',  pct: 88  },
  { label: 'Building route intelligence…',         pct: 96  },
  { label: 'Ready',                                pct: 100 },
]

const HOLD_STEP = SCAN_STEPS.findIndex(s => s.hold)

export default function TrackingAnimation({ trackingNumber, apiReady, onComplete }: Props) {
  const [step,      setStep]      = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [done,      setDone]      = useState(false)

  useEffect(() => {
    if (charIndex < trackingNumber.length) {
      const t = setTimeout(() => setCharIndex(i => i + 1), 40)
      return () => clearTimeout(t)
    }
  }, [charIndex, trackingNumber.length])

  useEffect(() => {
    if (step >= SCAN_STEPS.length - 1) {
      const t = setTimeout(() => { setDone(true); onComplete() }, 200)
      return () => clearTimeout(t)
    }
    if (step === HOLD_STEP && !apiReady) return
    // Pre-hold steps: give them enough time to read; post-hold: race through quickly
    const delay = step === 0 ? 220 : step === 1 ? 350 : step === 2 ? 280 : 160
    const t = setTimeout(() => setStep(s => s + 1), delay)
    return () => clearTimeout(t)
  }, [step, apiReady, onComplete])

  useEffect(() => {
    if (apiReady && step === HOLD_STEP) {
      const t = setTimeout(() => setStep(s => s + 1), 150)
      return () => clearTimeout(t)
    }
  }, [apiReady, step])

  if (done) return null

  const currentStep = SCAN_STEPS[step]
  const pct         = currentStep.pct
  const isHolding   = step === HOLD_STEP && !apiReady

  // Theme colours
  const outer  = isHolding ? '#f59e0b' : '#6366f1'
  const middle = isHolding ? '#fbbf24' : '#22d3ee'
  const inner  = isHolding ? '#f59e0b' : '#818cf8'
  const glow   = isHolding ? 'rgba(245,158,11,0.7)' : 'rgba(99,102,241,0.7)'

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '420px', gap: '32px', padding: '40px 24px',
    }}>

      {/* ── Spiral loader ── */}
      <div style={{ position: 'relative', width: '160px', height: '160px', flexShrink: 0 }}>
        <style>{`
          @keyframes spin-cw  { to { transform: rotate(360deg);  } }
          @keyframes spin-ccw { to { transform: rotate(-360deg); } }
          @keyframes pulse-dot {
            0%,100% { opacity: 0.7; r: 5px; }
            50%     { opacity: 1;   r: 7px; }
          }
          @keyframes scan-beam {
            0%   { left: -100%; }
            100% { left:  200%; }
          }
          @keyframes blink {
            0%,100% { opacity:1; }
            50%     { opacity:0; }
          }
          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }
        `}</style>

        <svg width="160" height="160" viewBox="0 0 160 160" overflow="visible">
          <defs>
            <filter id="glow-outer" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer ring — r=66, CW 1.1s, ~50% arc = 207 of 414 */}
          <g style={{ transformOrigin: '80px 80px', animation: 'spin-cw 1.1s linear infinite' }}>
            <circle
              cx="80" cy="80" r="66"
              fill="none"
              stroke={outer}
              strokeWidth="3"
              strokeDasharray="207 207"
              strokeLinecap="round"
              filter="url(#glow-outer)"
              style={{ transition: 'stroke 0.4s ease' }}
            />
          </g>

          {/* Middle ring — r=49, CCW 1.7s, ~33% arc = 102 of 308 */}
          <g style={{ transformOrigin: '80px 80px', animation: 'spin-ccw 1.7s linear infinite' }}>
            <circle
              cx="80" cy="80" r="49"
              fill="none"
              stroke={middle}
              strokeWidth="2.5"
              strokeDasharray="102 206"
              strokeLinecap="round"
              style={{ transition: 'stroke 0.4s ease' }}
            />
          </g>

          {/* Inner ring — r=32, CW 0.85s, ~25% arc = 50 of 201 */}
          <g style={{ transformOrigin: '80px 80px', animation: 'spin-cw 0.85s linear infinite' }}>
            <circle
              cx="80" cy="80" r="32"
              fill="none"
              stroke={inner}
              strokeWidth="2"
              strokeDasharray="50 151"
              strokeLinecap="round"
              style={{ transition: 'stroke 0.4s ease' }}
            />
          </g>

          {/* Center pulsing dot */}
          <circle
            cx="80" cy="80" r="5"
            fill={outer}
            style={{
              filter: `drop-shadow(0 0 6px ${glow})`,
              animation: 'pulse-dot 1.4s ease-in-out infinite',
              transition: 'fill 0.4s ease',
            }}
          />
        </svg>
      </div>

      {/* ── Tracking number scan ── */}
      <div style={{
        padding: '14px 24px', borderRadius: '12px',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${isHolding ? 'rgba(245,158,11,0.3)' : 'rgba(99,102,241,0.25)'}`,
        position: 'relative', overflow: 'hidden',
        maxWidth: '400px', width: '100%',
        transition: 'border-color 0.4s ease',
      }}>
        <div style={{
          position: 'absolute', top: 0, bottom: 0, width: '60px',
          background: `linear-gradient(90deg, transparent, ${isHolding ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.3)'}, transparent)`,
          animation: 'scan-beam 1.8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{ fontFamily: 'monospace', fontSize: '16px', letterSpacing: '2px', textAlign: 'center' }}>
          {trackingNumber.split('').map((ch, i) => (
            <span key={i} style={{
              color: i < charIndex
                ? (isHolding ? '#f59e0b' : '#818cf8')
                : 'rgba(248,250,252,0.15)',
              transition: 'color 0.1s',
              textShadow: i < charIndex
                ? `0 0 8px ${isHolding ? 'rgba(245,158,11,0.6)' : 'rgba(99,102,241,0.8)'}`
                : 'none',
            }}>{ch}</span>
          ))}
          <span style={{ animation: 'blink 0.8s step-end infinite', color: isHolding ? '#f59e0b' : '#818cf8' }}>|</span>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: isHolding ? '#f59e0b' : 'rgba(248,250,252,0.6)', transition: 'color 0.3s' }}>
            {isHolding ? 'Waiting for carrier response…' : currentStep.label}
          </span>
          <span style={{ fontSize: '13px', color: isHolding ? '#f59e0b' : '#818cf8', fontWeight: 700, transition: 'color 0.3s' }}>
            {isHolding ? '…' : `${pct}%`}
          </span>
        </div>
        <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          {isHolding ? (
            <div style={{
              height: '100%', borderRadius: '2px', width: '40%',
              background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s ease-in-out infinite',
            }} />
          ) : (
            <div style={{
              height: '100%', borderRadius: '2px',
              background: 'linear-gradient(90deg, #6366f1, #22d3ee)',
              width: `${pct}%`,
              transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
              boxShadow: '0 0 8px rgba(99,102,241,0.6)',
            }} />
          )}
        </div>
      </div>

      {/* ── Step dots ── */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {SCAN_STEPS.slice(0, -1).map((_, i) => (
          <div key={i} style={{
            width: i <= step ? '20px' : '6px', height: '6px', borderRadius: '3px',
            background: i <= step
              ? (isHolding && i === HOLD_STEP ? '#f59e0b' : '#6366f1')
              : 'rgba(255,255,255,0.12)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>
    </div>
  )
}
