import { useEffect, useState } from 'react'

interface Props {
  trackingNumber: string
  onComplete: () => void
}

const SCAN_STEPS = [
  { label: 'Parsing tracking number format…', pct: 15 },
  { label: 'Querying 1,200+ carrier databases…', pct: 38 },
  { label: 'Carrier matched — fetching live data…', pct: 62 },
  { label: 'Calculating AI delivery prediction…', pct: 82 },
  { label: 'Building route intelligence…', pct: 95 },
  { label: 'Ready', pct: 100 },
]

export default function TrackingAnimation({ trackingNumber, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [done, setDone] = useState(false)

  // Animate the tracking number character-by-character scan
  useEffect(() => {
    if (charIndex < trackingNumber.length) {
      const t = setTimeout(() => setCharIndex(i => i + 1), 40)
      return () => clearTimeout(t)
    }
  }, [charIndex, trackingNumber.length])

  // Step through progress steps
  useEffect(() => {
    if (step >= SCAN_STEPS.length - 1) {
      const t = setTimeout(() => { setDone(true); onComplete() }, 400)
      return () => clearTimeout(t)
    }
    const delay = step === 0 ? 300 : step === 1 ? 500 : step === 2 ? 400 : 350
    const t = setTimeout(() => setStep(s => s + 1), delay)
    return () => clearTimeout(t)
  }, [step, onComplete])

  if (done) return null

  const currentStep = SCAN_STEPS[step]
  const pct = currentStep.pct

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '420px', gap: '32px', padding: '40px 24px',
    }}>
      {/* Radar / pulse animation */}
      <div style={{ position: 'relative', width: '100px', height: '100px' }}>
        {/* Outer pulse rings */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '1px solid rgba(99,102,241,0.4)',
            animation: `radar-ping 2s ease-out ${i * 0.6}s infinite`,
          }} />
        ))}
        {/* Inner circle */}
        <div style={{
          position: 'absolute', inset: '20px', borderRadius: '50%',
          background: 'rgba(99,102,241,0.15)',
          border: '2px solid rgba(99,102,241,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Rotating scan line */}
          <div style={{
            width: '28px', height: '2px',
            background: 'linear-gradient(90deg, transparent, #6366f1)',
            transformOrigin: 'left center',
            animation: 'spin 1.2s linear infinite',
            borderRadius: '2px',
          }} />
        </div>
        <style>{`
          @keyframes radar-ping {
            0% { transform: scale(0.6); opacity: 0.8; }
            100% { transform: scale(2.2); opacity: 0; }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes scan-beam {
            0% { left: -100%; }
            100% { left: 200%; }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </div>

      {/* Tracking number scan */}
      <div style={{
        padding: '14px 24px', borderRadius: '12px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(99,102,241,0.25)',
        position: 'relative', overflow: 'hidden',
        maxWidth: '400px', width: '100%',
      }}>
        {/* Scan beam */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, width: '60px',
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)',
          animation: 'scan-beam 1.8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{ fontFamily: 'monospace', fontSize: '16px', letterSpacing: '2px', textAlign: 'center' }}>
          {trackingNumber.split('').map((ch, i) => (
            <span key={i} style={{
              color: i < charIndex ? '#818cf8' : 'rgba(248,250,252,0.15)',
              transition: 'color 0.1s',
              textShadow: i < charIndex ? '0 0 8px rgba(99,102,241,0.8)' : 'none',
            }}>
              {ch}
            </span>
          ))}
          <span style={{ animation: 'blink 0.8s step-end infinite', color: '#818cf8' }}>|</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(248,250,252,0.6)' }}>{currentStep.label}</span>
          <span style={{ fontSize: '13px', color: '#818cf8', fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{
          height: '4px', borderRadius: '2px',
          background: 'rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: '2px',
            background: 'linear-gradient(90deg, #6366f1, #22d3ee)',
            width: `${pct}%`,
            transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 0 8px rgba(99,102,241,0.6)',
          }} />
        </div>
      </div>

      {/* Step dots */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {SCAN_STEPS.slice(0, -1).map((_, i) => (
          <div key={i} style={{
            width: i <= step ? '20px' : '6px', height: '6px', borderRadius: '3px',
            background: i <= step ? '#6366f1' : 'rgba(255,255,255,0.12)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>
    </div>
  )
}
