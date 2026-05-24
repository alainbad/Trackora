import { Link } from 'react-router-dom'
import { Globe2, Code2, AtSign, Mail } from 'lucide-react'
import TrackoraLogo from '../ui/TrackoraLogo'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(5,8,20,0.8)',
      padding: '60px 24px 32px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '16px' }}>
              <TrackoraLogo size={36} showText textSize={18} />
            </Link>
            <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
              The world's most advanced global shipment intelligence platform. Track anything, anywhere.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[Globe2, Code2, AtSign, Mail].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(248,250,252,0.5)', textDecoration: 'none',
                }}><Icon size={16} /></a>
              ))}
            </div>
          </div>
          {[
            { title: 'Product', links: ['Track Shipment', 'Dashboard', 'API Access', 'Integrations', 'Pricing'] },
            { title: 'Freight Types', links: ['Air Freight', 'Sea Freight', 'Land Freight', 'Express Couriers', 'Multi-modal'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press', 'Contact'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map(l => (
                  <li key={l}><a href="#" style={{ fontSize: '14px', color: 'rgba(248,250,252,0.6)', textDecoration: 'none' }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.35)' }}>© 2026 Trackora. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <a key={l} href="#" style={{ fontSize: '13px', color: 'rgba(248,250,252,0.35)', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
