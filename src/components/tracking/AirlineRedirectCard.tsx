import { useState } from 'react'
import { Plane, ExternalLink, Copy, Check, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { AirlineRedirect } from '../../data/airlineRedirects'

export default function AirlineRedirectCard({ redirect }: { redirect: AirlineRedirect }) {
  const navigate  = useNavigate()
  const [copied,  setCopied]  = useState(false)
  const [logoOk,  setLogoOk]  = useState(true)

  const logoUrl = `https://assets.aftership.com/couriers/svg/${redirect.logoSlug}.svg`
  const domain  = redirect.trackUrl.replace(/^https?:\/\//, '').split('/')[0]

  function copyAwb() {
    navigator.clipboard.writeText(redirect.trackingNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  // First word of the airline name for the button label
  const shortName = redirect.airline.split(' ')[0]

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
        border: '1px solid rgba(34,211,238,0.18)',
        boxShadow: '0 0 80px rgba(34,211,238,0.07), 0 24px 64px rgba(0,0,0,0.4)',
      }}>

        {/* ── Top strip ── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(34,211,238,0.10), rgba(99,102,241,0.07))',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '18px 24px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
            background: 'rgba(34,211,238,0.14)', border: '1px solid rgba(34,211,238,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Plane size={18} color="#22d3ee" />
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#22d3ee', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Air Freight · MAWB
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(248,250,252,0.35)', marginTop: '1px' }}>
              Master Air Waybill
            </div>
          </div>
          <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '15px', fontWeight: 700, color: '#f8fafc', letterSpacing: '1.5px' }}>
            {redirect.trackingNumber}
          </div>
        </div>

        {/* ── Flight route arc ── */}
        <div style={{
          background: 'rgba(5,8,20,0.6)',
          padding: '28px 32px 20px',
          display: 'flex', alignItems: 'center', gap: '0',
        }}>
          {/* Origin node */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{
              width: '14px', height: '14px', borderRadius: '50%',
              background: '#22d3ee', boxShadow: '0 0 14px rgba(34,211,238,0.8)',
            }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(248,250,252,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Origin
            </span>
          </div>

          {/* Arc / dashed route */}
          <div style={{ flex: 1, position: 'relative', margin: '0 -2px' }}>
            {/* SVG arc */}
            <svg viewBox="0 0 200 40" style={{ width: '100%', height: '40px', overflow: 'visible' }}>
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              {/* Dashed base line */}
              <line x1="0" y1="32" x2="200" y2="32"
                stroke="rgba(255,255,255,0.08)" strokeWidth="1.5"
                strokeDasharray="4,4" />
              {/* Curved arc */}
              <path d="M 0 32 Q 100 4 200 32"
                fill="none" stroke="url(#routeGrad)" strokeWidth="1.5" />
              {/* Plane icon at arc midpoint */}
              <g transform="translate(92, 10)">
                <circle cx="8" cy="8" r="10" fill="rgba(10,15,30,1)" />
                <circle cx="8" cy="8" r="9" fill="rgba(34,211,238,0.12)" stroke="rgba(34,211,238,0.3)" strokeWidth="0.8" />
                {/* Simple plane shape */}
                <path d="M5 8 L11 6 L13 8 L11 10 Z" fill="#22d3ee" />
                <path d="M7 7 L7 9 L5 9" fill="none" stroke="#22d3ee" strokeWidth="0.6" />
              </g>
            </svg>
          </div>

          {/* Destination node */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{
              width: '14px', height: '14px', borderRadius: '50%',
              background: '#6366f1', boxShadow: '0 0 14px rgba(99,102,241,0.8)',
            }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(248,250,252,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Destination
            </span>
          </div>
        </div>

        {/* ── Airline identity card ── */}
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
              alt={redirect.airline}
              onError={() => setLogoOk(false)}
              style={{ width: '52px', height: '52px', objectFit: 'contain', borderRadius: '12px', flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: '52px', height: '52px', borderRadius: '12px', flexShrink: 0,
              background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Plane size={24} color="#22d3ee" />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
              {redirect.airline}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.4)' }}>
              Airline cargo carrier
            </div>
          </div>
          {/* AWB badge */}
          <div style={{
            padding: '6px 12px', borderRadius: '8px',
            background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.18)',
            fontFamily: 'monospace', fontSize: '13px', fontWeight: 700,
            color: '#22d3ee', letterSpacing: '1px', flexShrink: 0,
          }}>
            {redirect.trackingNumber}
          </div>
        </div>

        {/* ── Info banner ── */}
        <div style={{
          padding: '16px 24px',
          background: 'rgba(34,211,238,0.05)',
          borderBottom: '1px solid rgba(34,211,238,0.1)',
          display: 'flex', gap: '12px', alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>ℹ️</span>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(248,250,252,0.6)', lineHeight: 1.65 }}>
            <strong style={{ color: 'rgba(248,250,252,0.85)' }}>{redirect.airline}</strong> manages air cargo
            tracking directly on their own portal.{' '}
            {redirect.supportsDeepLink
              ? 'Your AWB number is already pre-filled in the link below — click to see live status instantly.'
              : `Click below to open their tracking portal, then enter AWB `}
            {!redirect.supportsDeepLink && (
              <span style={{ fontFamily: 'monospace', color: '#22d3ee', fontWeight: 700 }}>
                {redirect.trackingNumber}
              </span>
            )}
            {!redirect.supportsDeepLink && '.'}
          </p>
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
              background: 'linear-gradient(135deg, #22d3ee 0%, #6366f1 100%)',
              color: 'white', fontSize: '15px', fontWeight: 700,
              boxShadow: '0 4px 24px rgba(34,211,238,0.25)',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <ExternalLink size={16} />
            Track on {shortName} Portal
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

          {/* Secondary — copy AWB */}
          <button
            onClick={copyAwb}
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
            {copied ? 'AWB copied to clipboard!' : `Copy AWB  ·  ${redirect.trackingNumber}`}
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
