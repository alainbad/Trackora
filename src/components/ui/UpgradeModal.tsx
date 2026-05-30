import { X, Zap, Check, Lock } from 'lucide-react'

interface UpgradeModalProps {
  feature: 'air' | 'sea' | 'analytics' | 'alerts' | 'saved'
  onClose: () => void
  onUpgrade?: () => void
}

const FEATURE_COPY: Record<UpgradeModalProps['feature'], {
  icon: string; title: string; subtitle: string; highlight: string
}> = {
  air: {
    icon: '✈️',
    title: 'Air Freight Tracking',
    subtitle: 'MAWB & air cargo tracking is available on Pro and Business plans.',
    highlight: 'Track air waybills from 200+ airlines in real time',
  },
  sea: {
    icon: '🚢',
    title: 'Sea Freight Tracking',
    subtitle: 'Full ocean container data (timeline & vessel position) is a Pro feature.',
    highlight: 'Live vessel tracking for Maersk, MSC, CMA CGM & more',
  },
  analytics: {
    icon: '📊',
    title: 'Advanced Analytics',
    subtitle: 'Carrier performance, on-time rates and cost insights are on Pro.',
    highlight: 'AI-powered insights across all your shipments',
  },
  alerts: {
    icon: '🔔',
    title: 'Email Alerts',
    subtitle: 'Automatic email notifications on status changes require a Pro plan.',
    highlight: 'Get notified the moment your shipment status changes',
  },
  saved: {
    icon: '📦',
    title: 'Saved Shipments Limit',
    subtitle: 'You have reached the 10 shipment limit on the Free plan.',
    highlight: 'Unlimited saved shipments on Pro — never lose track again',
  },
}

const PRO_FEATURES = [
  'Air freight (MAWB) tracking',
  'Sea freight full timeline data',
  'Unlimited saved shipments',
  'Email status alerts',
  'Advanced analytics dashboard',
  'Priority email support',
]

export default function UpgradeModal({ feature, onClose, onUpgrade }: UpgradeModalProps) {
  const copy = FEATURE_COPY[feature]

  function handleUpgrade() {
    if (onUpgrade) onUpgrade()
    window.open('https://badranalain.gumroad.com/l/impejho', '_blank')
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(5,8,20,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'rgba(15,20,40,0.98)',
        border: '1px solid rgba(99,102,241,0.35)',
        borderRadius: '24px',
        padding: '36px 32px',
        maxWidth: '460px',
        width: '100%',
        boxShadow: '0 0 80px rgba(99,102,241,0.2), 0 24px 64px rgba(0,0,0,0.6)',
        position: 'relative',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'rgba(248,250,252,0.5)',
            display: 'flex', alignItems: 'center',
          }}
        >
          <X size={16} />
        </button>

        {/* Lock icon */}
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px', marginBottom: '20px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(79,70,229,0.15))',
          border: '1px solid rgba(99,102,241,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Lock size={24} color="#818cf8" />
        </div>

        {/* Feature icon + title */}
        <div style={{ marginBottom: '6px', fontSize: '24px' }}>{copy.icon}</div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', marginBottom: '10px', letterSpacing: '-0.5px' }}>
          Unlock {copy.title}
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.55)', marginBottom: '20px', lineHeight: 1.6 }}>
          {copy.subtitle}
        </p>

        {/* Highlight box */}
        <div style={{
          padding: '14px 16px', borderRadius: '12px', marginBottom: '20px',
          background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={16} color="#818cf8" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '14px', color: '#a5b4fc', fontWeight: 600, lineHeight: 1.4 }}>
              {copy.highlight}
            </span>
          </div>
        </div>

        {/* Pro features list */}
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
          {PRO_FEATURES.map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(248,250,252,0.7)' }}>
              <Check size={13} color="#10b981" style={{ flexShrink: 0 }} />
              {f}
            </li>
          ))}
        </ul>

        {/* Pricing note */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(248,250,252,0.4)' }}>
            Starting at{' '}
          </span>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc' }}>$2.49</span>
          <span style={{ fontSize: '13px', color: 'rgba(248,250,252,0.4)' }}> first month · then $4.99/mo</span>
        </div>

        {/* CTA */}
        <button
          onClick={handleUpgrade}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            width: '100%', padding: '14px', borderRadius: '14px', cursor: 'pointer',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            border: 'none', color: 'white', fontSize: '15px', fontWeight: 700,
            boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          }}
        >
          <Zap size={16} />
          Upgrade to Pro — Claim Offer
        </button>

        <button
          onClick={onClose}
          style={{
            display: 'block', width: '100%', marginTop: '12px', padding: '11px',
            borderRadius: '12px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(248,250,252,0.45)',
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
