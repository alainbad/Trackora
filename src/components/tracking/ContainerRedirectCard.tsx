import { useState } from 'react'
import { Anchor, ExternalLink, Copy, Check, ArrowLeft, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ContainerRedirect } from '../../data/containerRedirects'

export default function ContainerRedirectCard({ redirect }: { redirect: ContainerRedirect }) {
  const navigate = useNavigate()
  const [copied,  setCopied]  = useState(false)
  const [logoOk,  setLogoOk]  = useState(true)
  const [whyOpen, setWhyOpen] = useState(false)

  const logoUrl = `https://assets.aftership.com/couriers/svg/${redirect.logoSlug}.svg`
  const domain  = redirect.trackUrl.replace(/^https?:\/\//, '').split('/')[0]

  function copyContainer() {
    navigator.clipboard.writeText(redirect.containerNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div style={{ maxWidth: '580px', margin: '0 auto' }}>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '7px 14px', borderRadius: '10px', marginBottom: '20px',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(248,250,252,0.6)', fontSize: '13px', cursor: 'pointer',
        }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Card */}
      <div style={{
        borderRadius: '24px', overflow: 'hidden',
        border: '1px solid rgba(16,185,129,0.18)',
        boxShadow: '0 0 80px rgba(16,185,129,0.07), 0 24px 64px rgba(0,0,0,0.4)',
      }}>

        {/* ── Top strip ── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.10), rgba(6,182,212,0.07))',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '18px 24px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
            background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Anchor size={18} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Sea Freight · Container
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(248,250,252,0.35)', marginTop: '1px' }}>
              ISO 6346 Container Number
            </div>
          </div>
          <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '15px', fontWeight: 700, color: '#f8fafc', letterSpacing: '1.5px' }}>
            {redirect.containerNumber}
          </div>
        </div>

        {/* ── Ocean route visual ── */}
        <div style={{
          background: 'rgba(5,8,20,0.6)',
          padding: '28px 32px 20px',
          display: 'flex', alignItems: 'center', gap: '0',
        }}>
          {/* Origin node */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{
              width: '14px', height: '14px', borderRadius: '50%',
              background: '#10b981', boxShadow: '0 0 14px rgba(16,185,129,0.8)',
            }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(248,250,252,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Port of Loading
            </span>
          </div>

          {/* Wave route */}
          <div style={{ flex: 1, position: 'relative', margin: '0 -2px' }}>
            <svg viewBox="0 0 200 40" style={{ width: '100%', height: '40px', overflow: 'visible' }}>
              <defs>
                <linearGradient id="seaRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#10b981" stopOpacity="0.5" />
                  <stop offset="50%"  stopColor="#06b6d4" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              {/* Dashed base */}
              <line x1="0" y1="28" x2="200" y2="28"
                stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"
                strokeDasharray="4,4" />
              {/* Wave path */}
              <path d="M 0 28 Q 40 16 80 28 Q 120 40 160 28 Q 180 20 200 28"
                fill="none" stroke="url(#seaRouteGrad)" strokeWidth="1.5" />
              {/* Ship icon at midpoint */}
              <g transform="translate(88, 10)">
                <circle cx="8" cy="8" r="10" fill="rgba(10,15,30,1)" />
                <circle cx="8" cy="8" r="9" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.8" />
                {/* Simple ship hull */}
                <path d="M3 10 L13 10 L11 13 L5 13 Z" fill="#10b981" />
                <rect x="7" y="5" width="1.5" height="5" fill="#10b981" />
                <path d="M7 5 L12 8 L7 8 Z" fill="#06b6d4" />
              </g>
            </svg>
          </div>

          {/* Destination node */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{
              width: '14px', height: '14px', borderRadius: '50%',
              background: '#06b6d4', boxShadow: '0 0 14px rgba(6,182,212,0.8)',
            }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(248,250,252,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Port of Discharge
            </span>
          </div>
        </div>

        {/* ── Shipping line identity ── */}
        <div style={{
          background: 'rgba(255,255,255,0.025)',
          padding: '20px 24px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          {logoOk ? (
            <img
              src={logoUrl}
              alt={redirect.shippingLine}
              onError={() => setLogoOk(false)}
              style={{ width: '52px', height: '52px', objectFit: 'contain', borderRadius: '12px', flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: '52px', height: '52px', borderRadius: '12px', flexShrink: 0,
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Anchor size={24} color="#10b981" />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
              {redirect.shippingLine}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.4)' }}>
              Ocean carrier · Owner code <span style={{ fontFamily: 'monospace', color: '#10b981' }}>{redirect.ownerCode}</span>
            </div>
          </div>
          {/* Container badge */}
          <div style={{
            padding: '6px 12px', borderRadius: '8px',
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)',
            fontFamily: 'monospace', fontSize: '12px', fontWeight: 700,
            color: '#10b981', letterSpacing: '1px', flexShrink: 0,
          }}>
            {redirect.containerNumber}
          </div>
        </div>

        {/* ── Official source badge ── */}
        <div style={{
          padding: '12px 24px',
          background: 'rgba(16,185,129,0.06)',
          borderBottom: '1px solid rgba(16,185,129,0.1)',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <ShieldCheck size={16} color="#10b981" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: '#34d399', fontWeight: 700 }}>
            Official source — 100% accurate data
          </span>
        </div>

        {/* ── Info banner ── */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(16,185,129,0.04)',
          borderBottom: '1px solid rgba(16,185,129,0.08)',
          display: 'flex', gap: '12px', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>ℹ️</span>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(248,250,252,0.6)', lineHeight: 1.65 }}>
            For guaranteed accuracy, we link you directly to{' '}
            <strong style={{ color: 'rgba(248,250,252,0.85)' }}>{redirect.shippingLine}</strong>'s official tracking portal.{' '}
            {redirect.supportsDeepLink
              ? 'Your container number is pre-filled — click to see live vessel position and port events instantly.'
              : `Click below to open their tracking portal, then paste container number `}
            {!redirect.supportsDeepLink && (
              <span style={{ fontFamily: 'monospace', color: '#10b981', fontWeight: 700 }}>
                {redirect.containerNumber}
              </span>
            )}
            {!redirect.supportsDeepLink && '.'}
          </p>
        </div>

        {/* ── Why direct link ── */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setWhyOpen(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              width: '100%', padding: '12px 24px', background: 'none', border: 'none',
              cursor: 'pointer', color: 'rgba(248,250,252,0.4)', fontSize: '12px', fontWeight: 600,
              textAlign: 'left',
            }}
          >
            {whyOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Why are we redirecting you?
          </button>
          {whyOpen && (
            <div style={{ padding: '0 24px 16px', fontSize: '13px', color: 'rgba(248,250,252,0.5)', lineHeight: 1.65 }}>
              Sea freight container data can change multiple times per day as vessels move between ports.
              Rather than risk showing you delayed or incomplete information, we redirect you to the
              carrier's own system — the same data their teams use. This ensures you always see the
              most current vessel position, ETA, and port events. Trackora never shows unverified data.
            </div>
          )}
        </div>

        {/* ── Actions ── */}
        <div style={{
          padding: '20px 24px',
          background: 'rgba(5,8,20,0.4)',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          {/* Primary CTA */}
          <a
            href={redirect.trackUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
              padding: '14px 24px', borderRadius: '14px', textDecoration: 'none',
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              color: 'white', fontSize: '15px', fontWeight: 700,
              boxShadow: '0 4px 24px rgba(16,185,129,0.25)',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <ExternalLink size={16} />
            Open Pre-filled Tracking →
            {redirect.supportsDeepLink && (
              <span style={{
                fontSize: '10px', fontWeight: 700, padding: '2px 7px',
                borderRadius: '6px', background: 'rgba(255,255,255,0.2)',
                letterSpacing: '0.3px', marginLeft: '2px',
              }}>
                PRE-FILLED
              </span>
            )}
          </a>

          {/* Secondary — copy container number */}
          <button
            onClick={copyContainer}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '11px 20px', borderRadius: '12px', cursor: 'pointer',
              background: copied ? 'rgba(16,185,129,0.10)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${copied ? 'rgba(16,185,129,0.30)' : 'rgba(255,255,255,0.09)'}`,
              color: copied ? '#34d399' : 'rgba(248,250,252,0.55)',
              fontSize: '13px', fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Container number copied!' : `Copy  ·  ${redirect.containerNumber}`}
          </button>

          {/* Trust line */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            fontSize: '11px', color: 'rgba(248,250,252,0.22)',
            paddingTop: '2px',
          }}>
            <span>🔒 Opens</span>
            <span style={{ fontFamily: 'monospace', color: 'rgba(248,250,252,0.35)' }}>{domain}</span>
            <span>in a new tab</span>
          </div>
        </div>
      </div>
    </div>
  )
}
