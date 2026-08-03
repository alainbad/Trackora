import { useState } from 'react'
import { Zap, Building2, X, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react'
import { useIAP } from '../../hooks/useIAP'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

interface Props {
  onClose: () => void
  defaultTier?: 'pro' | 'business'
}

export default function IAPPaywall({ onClose, defaultTier = 'pro' }: Props) {
  const { user } = useAuth()
  const [selectedTier, setSelectedTier] = useState<'pro' | 'business'>(defaultTier)
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'annual'>('annual')

  const handlePurchaseComplete = async (tier: 'pro' | 'business') => {
    if (!user) return
    await supabase.from('profiles').upsert({ id: user.id, plan_tier: tier })
  }

  const { products, purchaseState, error, ready, purchase, restorePurchases } = useIAP(handlePurchaseComplete)

  const proFeatures = [
    'Unlimited rate searches',
    'Advanced shipment tracking',
    'Export to PDF & Excel',
    'Priority email support',
    'Document generator',
    'All freight calculators',
  ]

  const businessFeatures = [
    'Everything in Pro',
    'Team accounts (up to 10)',
    'API access',
    'Custom carrier integrations',
    'Dedicated account manager',
    'SLA support',
  ]

  const features = selectedTier === 'pro' ? proFeatures : businessFeatures

  const currentProduct = products.find(
    p => p.tier === selectedTier && p.period === selectedPeriod
  )

  const overlay: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
  }

  const modal: React.CSSProperties = {
    background: '#0f1629', borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    width: '100%', maxWidth: '420px',
    padding: '28px 24px', position: 'relative',
  }

  if (purchaseState === 'success') {
    return (
      <div style={overlay}>
        <div style={{ ...modal, textAlign: 'center' }}>
          <CheckCircle size={56} color="#22d3ee" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ color: '#f8fafc', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
            Welcome to {selectedTier === 'pro' ? 'Pro' : 'Business'}!
          </h2>
          <p style={{ color: 'rgba(248,250,252,0.6)', marginBottom: '24px' }}>
            Your subscription is now active. Enjoy all premium features.
          </p>
          <button onClick={onClose} style={{
            padding: '12px 32px', borderRadius: '12px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: 'white', fontWeight: 700, fontSize: '15px',
          }}>
            Get Started
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px',
          width: '32px', height: '32px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f8fafc',
        }}>
          <X size={16} />
        </button>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {(['pro', 'business'] as const).map(t => (
            <button key={t} onClick={() => setSelectedTier(t)} style={{
              flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600,
              fontSize: '14px', border: selectedTier === t ? 'none' : '1px solid rgba(255,255,255,0.1)',
              background: selectedTier === t ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255,255,255,0.04)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}>
              {t === 'pro' ? <Zap size={14} /> : <Building2 size={14} />}
              {t === 'pro' ? 'Pro' : 'Business'}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.04)',
          borderRadius: '10px', padding: '4px', marginBottom: '24px',
        }}>
          {(['monthly', 'annual'] as const).map(p => (
            <button key={p} onClick={() => setSelectedPeriod(p)} style={{
              flex: 1, padding: '8px', borderRadius: '8px', cursor: 'pointer',
              border: 'none', fontWeight: 600, fontSize: '13px',
              background: selectedPeriod === p ? 'rgba(99,102,241,0.3)' : 'transparent',
              color: selectedPeriod === p ? '#a5b4fc' : 'rgba(248,250,252,0.5)',
            }}>
              {p === 'monthly' ? 'Monthly' : 'Annual (save 33%)'}
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '40px', fontWeight: 800, color: '#f8fafc' }}>
            {currentProduct?.price ?? '—'}
          </div>
          <div style={{ color: 'rgba(248,250,252,0.4)', fontSize: '13px', marginTop: '4px' }}>
            {selectedPeriod === 'annual' ? 'billed annually' : 'billed monthly'} · cancel anytime
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          {features.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <CheckCircle size={16} color="#22d3ee" style={{ flexShrink: 0 }} />
              <span style={{ color: 'rgba(248,250,252,0.8)', fontSize: '14px' }}>{f}</span>
            </div>
          ))}
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
            <span style={{ color: '#fca5a5', fontSize: '13px' }}>{error}</span>
          </div>
        )}

        <button
          onClick={() => currentProduct && purchase(currentProduct.id)}
          disabled={purchaseState === 'loading' || !ready}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            cursor: purchaseState === 'loading' || !ready ? 'not-allowed' : 'pointer',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: 'white', fontWeight: 700, fontSize: '16px',
            opacity: purchaseState === 'loading' || !ready ? 0.6 : 1,
            marginBottom: '12px',
          }}
        >
          {purchaseState === 'loading' ? 'Processing…' : `Subscribe to ${selectedTier === 'pro' ? 'Pro' : 'Business'}`}
        </button>

        <button onClick={restorePurchases} style={{
          width: '100%', padding: '10px', background: 'transparent', border: 'none',
          color: 'rgba(248,250,252,0.4)', fontSize: '13px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        }}>
          <RotateCcw size={13} /> Restore Purchases
        </button>

        <p style={{ textAlign: 'center', color: 'rgba(248,250,252,0.3)', fontSize: '11px', marginTop: '12px' }}>
          Payment will be charged to your Apple ID. Subscriptions renew automatically unless cancelled at least 24 hours before the renewal date.
        </p>
      </div>
    </div>
  )
}
