import { Brain, Globe2, Bell, BarChart3, Lock, Zap, Leaf, FileCheck, Layers, Cpu } from 'lucide-react'

const FEATURES = [
  {
    icon: Brain,
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.1)',
    title: 'AI ETA Predictions',
    desc: 'Machine learning models trained on billions of data points predict exact delivery windows — even before carriers update their systems.',
    badge: 'Pro',
  },
  {
    icon: Globe2,
    color: '#22d3ee',
    bg: 'rgba(6,182,212,0.1)',
    title: 'Universal Tracking',
    desc: 'One search bar covers 1,200+ carriers — air, sea, land, and express. Auto-detects carrier from your tracking number format.',
    badge: null,
  },
  {
    icon: Bell,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    title: 'Smart Delay Alerts',
    desc: 'Predictive delay detection notifies you before a delay happens, with root-cause analysis: weather, port congestion, customs.',
    badge: 'Pro',
  },
  {
    icon: Leaf,
    color: '#34d399',
    bg: 'rgba(52,211,153,0.1)',
    title: 'Carbon Footprint Tracker',
    desc: 'Every shipment\'s CO₂ impact is calculated in real-time. Compare modes, offset directly, and generate sustainability reports.',
    badge: 'Pro',
  },
  {
    icon: BarChart3,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    title: 'Shipment Analytics',
    desc: 'Business-grade dashboards with on-time rates, cost-per-km, carrier performance scores, and trend forecasting.',
    badge: 'Enterprise',
  },
  {
    icon: Layers,
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
    title: 'Multi-modal Journey View',
    desc: 'A single shipment travelling by truck, then ship, then air shows as one unified, continuous timeline — not fragmented.',
    badge: null,
  },
  {
    icon: FileCheck,
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.1)',
    title: 'Document Vault',
    desc: 'Store AWBs, Bills of Lading, customs docs, and certificates. Attach to shipments and share with customs brokers instantly.',
    badge: 'Pro',
  },
  {
    icon: Cpu,
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.1)',
    title: 'API & Integrations',
    desc: 'REST API, webhooks, and native integrations with SAP, Salesforce, Shopify, and 50+ ERPs for automated tracking workflows.',
    badge: 'Enterprise',
  },
  {
    icon: Lock,
    color: '#6ee7b7',
    bg: 'rgba(110,231,183,0.1)',
    title: 'SOC 2 Compliant',
    desc: 'Enterprise-grade security with SSO, audit logs, role-based access, and end-to-end encrypted tracking data.',
    badge: null,
  },
]

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  Pro: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
  Enterprise: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
}

export default function FeaturesSection() {
  return (
    <section id="features" style={{ padding: '100px 24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px',
            borderRadius: '100px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            marginBottom: '20px',
            fontSize: '12px',
            color: '#818cf8',
            fontWeight: 600,
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            <Zap size={12} />
            Features Built for the Future
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 800,
            letterSpacing: '-1.5px',
            color: '#f8fafc',
            marginBottom: '16px',
            lineHeight: 1.1,
          }}>
            Not just tracking.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a5b4fc, #6366f1, #22d3ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Shipment intelligence.
            </span>
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(248,250,252,0.55)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
            Every feature is designed to give you an unfair advantage over your supply chain.
          </p>
        </div>

        {/* Feature Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
        }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={i}
                style={{
                  padding: '28px',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.background = 'rgba(255,255,255,0.06)'
                  el.style.borderColor = `${f.color}40`
                  el.style.transform = 'translateY(-4px)'
                  el.style.boxShadow = `0 20px 40px ${f.color}15`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.background = 'rgba(255,255,255,0.03)'
                  el.style.borderColor = 'rgba(255,255,255,0.07)'
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                {/* Icon + Badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px',
                    background: f.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={22} color={f.color} />
                  </div>
                  {f.badge && (
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '100px',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      background: BADGE_COLORS[f.badge].bg,
                      color: BADGE_COLORS[f.badge].color,
                      border: `1px solid ${BADGE_COLORS[f.badge].color}30`,
                    }}>
                      {f.badge}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc', marginBottom: '10px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
