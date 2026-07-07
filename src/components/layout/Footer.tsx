import { Link } from 'react-router-dom'
import { MapPin, Mail } from 'lucide-react'
import TrackoraLogo from '../ui/TrackoraLogo'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function Footer() {
  const isMobile = useIsMobile()

  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(5,8,20,0.8)',
      padding: isMobile ? '48px 20px 28px' : '60px 24px 32px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr 1fr 1.2fr',
          gap: isMobile ? '32px' : '48px',
          marginBottom: isMobile ? '36px' : '48px',
        }}>

          {/* ── Brand column — full width on mobile ── */}
          <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '14px' }}>
              <TrackoraLogo size={36} showText textSize={18} />
            </Link>
            <p style={{
              color: 'rgba(248,250,252,0.5)', fontSize: '14px', lineHeight: 1.7,
              marginBottom: '20px', maxWidth: isMobile ? '100%' : '280px',
            }}>
              Global shipment intelligence for businesses of every size. Track any parcel, container,
              or air cargo across 1,200+ carriers — in real time.
            </p>
            {/* Contact chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <a
                href="mailto:support@track-ora.com"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  fontSize: '13px', color: 'rgba(248,250,252,0.55)', textDecoration: 'none',
                }}
              >
                <Mail size={14} color="#6366f1" />
                support@track-ora.com
              </a>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(248,250,252,0.4)' }}>
                <MapPin size={14} color="#6366f1" />
                Business Bay, Dubai, UAE
              </div>
            </div>
          </div>

          {/* ── Product ── */}
          <div>
            <h4 style={{
              fontSize: '12px', fontWeight: 600, color: 'rgba(248,250,252,0.4)',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px',
            }}>
              Product
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Track Shipment',  href: '/track' },
                { label: 'Dashboard',       href: '/dashboard' },
                { label: 'How It Works',    href: '/how-it-works' },
                { label: 'Features',        href: '/#features' },
                { label: 'Pricing Plans',   href: '/plans' },
                { label: 'FAQ',             href: '/faq' },
                { label: 'Contact Us',      href: '/contact' },
                { label: 'Rate Calculator', href: '/rates' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.href} style={{ fontSize: '14px', color: 'rgba(248,250,252,0.6)', textDecoration: 'none' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Freight Types ── */}
          <div>
            <h4 style={{
              fontSize: '12px', fontWeight: 600, color: 'rgba(248,250,252,0.4)',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px',
            }}>
              Freight Types
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Air Freight',      href: '/track' },
                { label: 'Sea Freight',      href: '/track' },
                { label: 'Land Freight',     href: '/track' },
                { label: 'Express Couriers', href: '/track' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.href} style={{ fontSize: '14px', color: 'rgba(248,250,252,0.6)', textDecoration: 'none' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Top Carriers ── */}
          <div>
            <h4 style={{
              fontSize: '12px', fontWeight: 600, color: 'rgba(248,250,252,0.4)',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px',
            }}>
              Top Carriers
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'FedEx',          href: '/carriers/fedex' },
                { label: 'DHL Express',    href: '/carriers/dhl' },
                { label: 'UPS',            href: '/carriers/ups' },
                { label: 'Maersk',         href: '/carriers/maersk' },
                { label: 'Aramex',         href: '/carriers/aramex' },
                { label: 'Emirates Cargo', href: '/carriers/lufthansa-cargo' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.href} style={{ fontSize: '14px', color: 'rgba(248,250,252,0.6)', textDecoration: 'none' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Resources ── */}
          <div>
            <h4 style={{
              fontSize: '12px', fontWeight: 600, color: 'rgba(248,250,252,0.4)',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px',
            }}>
              Resources
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Blog',                href: '/blog' },
                { label: 'Track DHL',           href: '/blog/how-to-track-dhl-shipment' },
                { label: 'Track FedEx',         href: '/blog/how-to-track-fedex-shipment' },
                { label: 'Track UPS',           href: '/blog/how-to-track-ups-shipment' },
                { label: 'Track Aramex',        href: '/blog/how-to-track-aramex-shipment' },
                { label: 'What Is a B/L?',      href: '/blog/what-is-a-bill-of-lading' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.href} style={{ fontSize: '14px', color: 'rgba(248,250,252,0.6)', textDecoration: 'none' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Tools ── */}
          <div>
            <h4 style={{
              fontSize: '12px', fontWeight: 600, color: 'rgba(248,250,252,0.4)',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px',
            }}>
              Tools
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Rate Calculator',       href: '/rates' },
                { label: 'Customs Duty',          href: '/customs-duty' },
                { label: 'Detention Calculator',  href: '/detention-calculator' },
                { label: 'Profit Calculator',     href: '/profit-calculator' },
                { label: 'Document Generator',    href: '/document-generator' },
              ].map(l => (
                <li key={l.label}>
                  <Link to={l.href} style={{ fontSize: '14px', color: 'rgba(248,250,252,0.6)', textDecoration: 'none' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── About ── */}
          <div>
            <h4 style={{
              fontSize: '12px', fontWeight: 600, color: 'rgba(248,250,252,0.4)',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px',
            }}>
              About Trackora
            </h4>
            <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)', lineHeight: 1.75, marginBottom: '14px' }}>
              Founded in Dubai, Trackora was built by a team of logistics and technology professionals
              who saw firsthand how fragmented shipment visibility was across carriers and borders.
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)', lineHeight: 1.75, marginBottom: '16px' }}>
              Our mission is simple: give every business — from solo importers to large 3PLs — a
              single, intelligent window into their global supply chain.
            </p>
            <a
              href="mailto:support@track-ora.com"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '7px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                color: '#818cf8', textDecoration: 'none',
              }}
            >
              <Mail size={13} />
              Contact Support
            </a>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.35)' }}>
            © 2026 Trackora. All rights reserved. · Business Bay, Dubai, UAE
          </p>
          <div style={{ display: 'flex', gap: isMobile ? '16px' : '24px', flexWrap: 'wrap' }}>
            <Link to="/privacy" style={{ fontSize: '13px', color: 'rgba(248,250,252,0.35)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms"   style={{ fontSize: '13px', color: 'rgba(248,250,252,0.35)', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/about"   style={{ fontSize: '13px', color: 'rgba(248,250,252,0.35)', textDecoration: 'none' }}>About</Link>
            <Link to="/faq"     style={{ fontSize: '13px', color: 'rgba(248,250,252,0.35)', textDecoration: 'none' }}>FAQ</Link>
            <Link to="/contact" style={{ fontSize: '13px', color: 'rgba(248,250,252,0.35)', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
