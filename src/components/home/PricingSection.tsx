import { useState } from 'react'
import { Check, X, Zap, Building2, Globe2 } from 'lucide-react'
import AuthModal from '../auth/AuthModal'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useIsNativeApp } from '../../hooks/useIsNativeApp'

const PLANS = [
  {
    icon: Globe2, name: 'Free', price: '$0', period: 'free forever',
    color: '#6b7280', gradient: null, popular: false,
    desc: 'For individuals tracking parcels and land freight.',
    features: [
      { text: 'Express courier tracking (UPS, FedEx, DHL…)', included: true },
      { text: 'Land freight tracking', included: true },
      { text: 'Live event timeline & route map', included: true },
      { text: 'Sea freight carrier redirect (official portals)', included: true },
      { text: 'PDF label scanner (AWB / BOL)', included: true },
      { text: 'Up to 10 saved shipments', included: true },
      { text: 'Air freight (MAWB) tracking', included: false },
      { text: 'Sea freight full timeline & vessel data', included: false },
      { text: 'Email status alerts', included: false },
    ],
    cta: 'Get Started Free', ctaStyle: 'outline' as const,
    gumroadUrl: null,
  },
  {
    icon: Zap, name: 'Pro', price: '$4.99', period: 'per month',
    offerPrice: '$2.49', offerNote: 'first month only',
    color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)', popular: true,
    desc: 'For importers, exporters and growing businesses.',
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Air freight (MAWB) real-time tracking', included: true },
      { text: 'Sea freight full timeline & vessel position', included: true },
      { text: 'Unlimited saved shipments', included: true },
      { text: 'Email status change alerts', included: true },
      { text: 'Advanced analytics dashboard', included: true },
      { text: 'AI-powered shipment insights', included: true },
      { text: 'Priority email support', included: true },
    ],
    cta: 'Claim Offer', ctaStyle: 'filled' as const,
    gumroadUrl: 'https://badranalain.gumroad.com/l/impejho',
  },
  {
    icon: Building2, name: 'Business', price: '$9.99', period: 'per month',
    color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', popular: false,
    desc: 'For logistics operations, 3PLs, and enterprises.',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Team & multi-user access (5 seats)', included: true },
      { text: 'API & webhook integrations', included: true },
      { text: 'Dedicated support line', included: true },
      { text: 'Custom carrier onboarding', included: true },
    ],
    cta: 'Get Started', ctaStyle: 'gold' as const,
    gumroadUrl: 'https://badranalain.gumroad.com/l/rconap',
  },
]

const BADGE_STYLES = {
  outline: { background: 'rgba(255,255,255,0.06)', color: 'rgba(248,250,252,0.8)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'none' },
  filled:  { background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' },
  gold:    { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', border: 'none', boxShadow: '0 4px 20px rgba(245,158,11,0.35)' },
}

export default function PricingSection() {
  const [authModal, setAuthModal] = useState<'signin' | 'signup' | null>(null)
  const isMobile = useIsMobile()
  const isNative = useIsNativeApp()

  const visiblePlans = isNative ? PLANS.filter(p => p.name === 'Free') : PLANS

  if (isNative) {
    return (
      <section id="pricing" style={{ padding: isMobile ? '72px 20px' : '100px 24px', background: 'rgba(5,8,20,0.4)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '100px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            marginBottom: '20px', fontSize: '12px', color: '#818cf8',
            fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            Pricing
          </div>
          <h2 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 800, letterSpacing: '-1.5px', color: '#f8fafc', marginBottom: '16px', lineHeight: 1.1 }}>
            Want Pro or Business?
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(248,250,252,0.6)', lineHeight: 1.7, marginBottom: '32px' }}>
            Upgrade plans are available on our website. Visit{' '}
            <span style={{ color: '#818cf8', fontWeight: 600 }}>track-ora.com/plans</span>{' '}
            in your browser to view Pro and Business pricing and subscribe.
          </p>
          <div style={{
            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '16px', padding: '20px 24px',
            fontSize: '14px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.6,
          }}>
            Pro starts at $2.49 for the first month — then $4.99/mo.
            Business is $9.99/mo. No hidden fees, cancel anytime.
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="pricing" style={{ padding: isMobile ? '72px 20px' : '100px 24px', background: 'rgba(5,8,20,0.4)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '48px' : '64px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '5px 14px', borderRadius: '100px',
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
              marginBottom: '20px', fontSize: '12px', color: '#818cf8',
              fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
            }}>
              Pricing
            </div>
            <h2 style={{ fontSize: isMobile ? '28px' : 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#f8fafc', marginBottom: '16px', lineHeight: 1.1 }}>
              Start free.{' '}
              <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Scale as you grow.
              </span>
            </h2>
            <p style={{ fontSize: isMobile ? '15px' : '18px', color: 'rgba(248,250,252,0.55)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
              No hidden fees. Cancel anytime. Upgrade or downgrade instantly.
            </p>
          </div>

          {/* Plans Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: isMobile ? '20px' : '24px',
            alignItems: 'start',
          }}>
            {visiblePlans.map((plan, i) => {
              const Icon = plan.icon
              const btnStyle = BADGE_STYLES[plan.ctaStyle]
              return (
                <div
                  key={i}
                  style={{
                    borderRadius: '24px',
                    padding: isMobile ? '24px' : '32px',
                    background: plan.popular ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
                    border: plan.popular ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(255,255,255,0.07)',
                    position: 'relative',
                    boxShadow: plan.popular ? '0 0 60px rgba(99,102,241,0.15)' : 'none',
                    // No scale on mobile — it causes horizontal overflow
                    transform: (plan.popular && !isMobile) ? 'scale(1.03)' : 'none',
                    marginTop: plan.popular ? (isMobile ? '0' : '0') : '0',
                  }}
                >
                  {plan.popular && (
                    <div style={{
                      position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                      padding: '5px 20px', borderRadius: '100px',
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      fontSize: '12px', fontWeight: 700, color: 'white', whiteSpace: 'nowrap',
                      boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
                    }}>
                      Most Popular
                    </div>
                  )}

                  {/* Plan header */}
                  <div style={{ marginBottom: '24px', marginTop: plan.popular ? '8px' : '0' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: plan.gradient || 'rgba(107,114,128,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '16px',
                    }}>
                      <Icon size={20} color={plan.gradient ? 'white' : plan.color} />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>{plan.name}</h3>
                    <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)', marginBottom: '20px' }}>{plan.desc}</p>
                    {'offerPrice' in plan && plan.offerPrice ? (
                      <div>
                        {/* Offer badge */}
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '3px 10px', borderRadius: '100px', marginBottom: '10px',
                          background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)',
                          fontSize: '11px', fontWeight: 700, color: '#f87171', letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                        }}>
                          🔥 Limited Offer
                        </div>
                        {/* Offer price row */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '44px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-2px' }}>
                            {plan.offerPrice}
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{
                              fontSize: '13px', color: 'rgba(248,250,252,0.4)',
                              textDecoration: 'line-through', fontWeight: 500,
                            }}>
                              {plan.price}
                            </span>
                            <span style={{ fontSize: '12px', color: 'rgba(248,250,252,0.4)' }}>
                              /per month
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: '12px', color: '#f87171', marginTop: '5px', fontWeight: 500 }}>
                          {plan.offerNote} — then {plan.price}/mo
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '44px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-2px' }}>{plan.price}</span>
                        <span style={{ fontSize: '14px', color: 'rgba(248,250,252,0.45)' }}>/{plan.period}</span>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => plan.gumroadUrl ? window.open(plan.gumroadUrl, '_blank') : setAuthModal('signup')}
                    style={{
                      display: 'block', width: '100%', textAlign: 'center',
                      padding: '13px 24px', borderRadius: '12px',
                      fontSize: '15px', fontWeight: 600,
                      marginBottom: '28px', cursor: 'pointer',
                      transition: 'all 0.2s',
                      ...btnStyle,
                    }}
                  >
                    {plan.cta}
                  </button>

                  {/* Features */}
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {plan.features.map((f, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: f.included ? 'rgba(248,250,252,0.75)' : 'rgba(248,250,252,0.3)' }}>
                        {f.included
                          ? <Check size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                          : <X size={15} color="rgba(248,250,252,0.2)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        }
                        {f.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {authModal && <AuthModal initialMode={authModal} onClose={() => setAuthModal(null)} />}
    </>
  )
}
