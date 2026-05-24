import { Search, Zap, Bell, BarChart3, ChevronRight } from 'lucide-react'

const STEPS = [
  {
    step: '01',
    icon: Search,
    color: '#22d3ee',
    title: 'Enter Any Tracking ID',
    desc: 'Paste any tracking number — we auto-detect the carrier and freight type instantly. Works with 1,200+ carriers worldwide.',
  },
  {
    step: '02',
    icon: Zap,
    color: '#818cf8',
    title: 'Get Live Intelligence',
    desc: 'See your shipment on a live map with real-time status, route history, and AI-predicted delivery window in seconds.',
  },
  {
    step: '03',
    icon: Bell,
    color: '#10b981',
    title: 'Smart Notifications',
    desc: 'Get proactive alerts before delays happen. Choose email, SMS, Slack, or webhook — customizable per shipment.',
  },
  {
    step: '04',
    icon: BarChart3,
    color: '#f59e0b',
    title: 'Analyse & Optimise',
    desc: 'Your dashboard builds carrier performance profiles over time, revealing savings and reliability insights automatically.',
  },
]

export default function HowItWorks() {
  return (
    <section style={{ padding: '100px 24px', position: 'relative' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800,
            letterSpacing: '-1.5px', color: '#f8fafc', marginBottom: '16px', lineHeight: 1.1,
          }}>
            How it works
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(248,250,252,0.55)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            From tracking number to full intelligence in under 3 seconds.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0', position: 'relative' }}>
          {/* Connector line */}
          <div style={{
            position: 'absolute', top: '40px', left: '15%', right: '15%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(22,211,238,0.3), transparent)',
            display: 'none',
          }} />

          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', textAlign: 'center', position: 'relative' }}>
                {/* Connector arrow between steps */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute', right: '-16px', top: '36px',
                    color: 'rgba(248,250,252,0.2)',
                    zIndex: 2,
                  }}>
                    <ChevronRight size={24} />
                  </div>
                )}

                {/* Icon */}
                <div style={{
                  width: '72px', height: '72px', borderRadius: '20px',
                  background: `${step.color}15`,
                  border: `1px solid ${step.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                  position: 'relative',
                }}>
                  <Icon size={28} color={step.color} />
                  <div style={{
                    position: 'absolute', top: '-10px', right: '-10px',
                    width: '24px', height: '24px', borderRadius: '8px',
                    background: step.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: 800, color: 'white',
                  }}>
                    {i + 1}
                  </div>
                </div>

                <div style={{
                  fontSize: '11px', fontWeight: 700, color: step.color,
                  letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px',
                }}>
                  Step {step.step}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
