import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'
import TrackoraLogo from '../ui/TrackoraLogo'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Track', href: '/track' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(10,15,30,0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <TrackoraLogo size={68} showText textSize={24} />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {navLinks.map(link => (
              <Link key={link.label} to={link.href} style={{
                padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
                textDecoration: 'none',
                color: location.pathname === link.href ? '#818cf8' : 'rgba(248,250,252,0.7)',
                background: location.pathname === link.href ? 'rgba(99,102,241,0.12)' : 'transparent',
                transition: 'all 0.2s',
              }}>{link.label}</Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/dashboard" style={{
              padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
              textDecoration: 'none', color: 'rgba(248,250,252,0.7)',
              border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
            }}>Sign In</Link>
            <Link to="/dashboard" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
              textDecoration: 'none', color: 'white',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
            }}>
              <Zap size={14} />Get Pro
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
