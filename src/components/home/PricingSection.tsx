import { Check, Zap, Building2, Globe2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const PLANS = [
  {
    icon: Globe2,
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: '#6b7280',
    gradient: null,
    desc: 'For individuals tracking personal shipments.',
    features: [
      'Up to 5 active shipments',
      'Universal carrier tracking',
      'Basic timeline view',
      'Email notifications',
      'Mobile-friendly interface',
    ],
    cta: 'Get Started Free',
    ctaStyle: 'outline',
  },
  {
    icon: Zap,
    name: 'Pro',
    price: '$19',
    period: 'per month',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    desc: 'For power users, SMBs, and growing teams.',
    popular: true,
    features: [
      'Unlimited active shipments',
      'AI ETA predictions',
      'Smart delay alerts',
      'Carbon footprint tracking',
      'Document Vault (5GB)',
      'Multi-shipment dashboard',
      'Slack & email webhooks',
      'Priority support',
    ],
    cta: 'Start 14-day Free Trial',
    ctaStyle: 'filled',
  },
  {
    icon: Building2,
    name: 'Enterprise',
    price: 'Custom',
    period: 'annual billing',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    desc: 'For logistics operations, 3PLs, and enterprises.',
    features: [
      'Everything in Pro',
      'Full API & webhook access',
      'SAP / Salesforce / Shopify integrations',
      'Advanced analytics & BI export',
      'Dedicated account manager',
      'Custom SLA (99.99% uptime)',
      'SSO / SAML / SCIM',
      'On-premise option available',
    ],
    cta: 'Contact Sales',
    ctaStyle: 'gold',
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" style={{ padding: '100px 24px', background: 'rgba(5,8,20,0.4)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px', borderRadius: '100px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            marginBottom: '20px', fontSize: '12px', color: '#818cf8',
            fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            Pricing
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800,
            letterSpacing: '-1.5px', color: '#f8fafc', marginBottom: '16px', lineHeight: 1.1,
          }}>
            Start free.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a5b4fc, #6366f1)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Scale as you grow.
            </span>
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(248,250,252,0.55)', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
            No hidden fees. Cancel anytime. Upgrade or downgrade instantly.
          </p>
        </div>

        {/* Plans Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {PLANS.map((plan, i) => {
            const Icon = plan.icon
            return (
              <div
                key={i}
                style={{
                  borderRadius: '24px',
                  padding: '32px',
                  background: plan.popular ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
                  border: plan.popular ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(255,255,255,0.07)',
                  position: 'relative',
                  boxShadow: plan.popular ? '0 0 60px rgba(99,102,241,0.15)' : 'none',
                  transform: plan.popular ? 'scale(1.03)' : 'scale(1)',
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
                <div style={{ marginBottom: '24px' }}>
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
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '44px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-2px' }}>{plan.price}</span>
                    <span style={{ fontSize: '14px', color: 'rgba(248,250,252,0.45)' }}>/{plan.period}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  to="/dashboard"
                  style={{
                    display: 'block', textAlign: 'center',
                    padding: '13px 24px', borderRadius: '12px',
                    fontSize: '15px', fontWeight: 600,
                    textDecoration: 'none',
                    marginBottom: '28px',
                    background: plan.ctaStyle === 'filled'
                      ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                      : plan.ctaStyle === 'gold'
                      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                      : 'rgba(255,255,255,0.06)',
                    color: plan.ctaStyle !== 'outline' ? 'white' : 'rgba(248,250,252,0.8)',
                    border: plan.ctaStyle === 'outline' ? '1px solid rgba(255,255,255,0.12)' : 'none',
                    boxShadow: plan.ctaStyle === 'filled' ? '0 4px 20px rgba(99,102,241,0.4)'
                      : plan.ctaStyle === 'gold' ? '0 4px 20px rgba(245,158,11,0.35)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: 'rgba(248,250,252,0.75)' }}>
                      <Check size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
