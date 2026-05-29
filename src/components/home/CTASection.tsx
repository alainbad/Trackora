import { Link } from 'react-router-dom'
import { ChevronRight, Zap } from 'lucide-react'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function CTASection() {
  const isMobile = useIsMobile()
  return (
    <section style={{ padding: isMobile ? '64px 20px' : '100px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          padding: isMobile ? '36px 24px' : '60px 48px', borderRadius: '32px',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.06))',
          border: '1px solid rgba(99,102,241,0.25)', position: 'relative', overflow: 'hidden',
          boxShadow: '0 0 80px rgba(99,102,241,0.15)',
        }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '100px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', marginBottom: '24px', fontSize: '12px', color: '#818cf8', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
              <Zap size={12} /> Start for free today
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#f8fafc', marginBottom: '16px', lineHeight: 1.1 }}>
              Ready to take control of your supply chain?
            </h2>
            <p style={{ fontSize: '18px', color: 'rgba(248,250,252,0.6)', marginBottom: '36px', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 36px' }}>
              Join 50,000+ businesses already using Trackora to track smarter, deliver faster, and cut logistics costs.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/track" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', textDecoration: 'none', color: 'white', fontSize: '16px', fontWeight: 700, boxShadow: '0 8px 30px rgba(99,102,241,0.45)' }}>
                Track a shipment now <ChevronRight size={18} />
              </Link>
              <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', textDecoration: 'none', color: 'rgba(248,250,252,0.8)', fontSize: '16px', fontWeight: 600 }}>
                View Dashboard
              </Link>
            </div>
            <p style={{ marginTop: '20px', fontSize: '13px', color: 'rgba(248,250,252,0.35)' }}>
              Free forever · No credit card required · Setup in 30 seconds
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
