import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Zap, LogOut, User, Menu, X } from 'lucide-react'
import TrackoraLogo from '../ui/TrackoraLogo'
import AuthModal from '../auth/AuthModal'
import ProfileModal from '../auth/ProfileModal'
import { useAuth } from '../../contexts/AuthContext'
import { useProfile } from '../../contexts/ProfileContext'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [authModal,   setAuthModal]   = useState<'signin' | 'signup' | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, signOut } = useAuth()
  const { profile }       = useProfile()
  const isMobile = useIsMobile()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { label: 'Track',     href: '/track' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Features',  href: '/#features' },
    { label: 'Tools',     href: '/tools' },
{ label: 'Plans', href: '/plans' },
    { label: 'Rates',     href: '/rates' },
  ]

  const displayName = profile?.full_name || user?.email?.split('@')[0] || ''
  const initials    = displayName.slice(0, 2).toUpperCase()

  function handleNavLink(href: string) {
    setMenuOpen(false)
    if (href.startsWith('/#')) {
      navigate('/')
      setTimeout(() => {
        const el = document.querySelector(href.slice(1))
        el?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.3s ease',
        background: (scrolled || menuOpen) ? 'rgba(10,15,30,0.97)' : 'transparent',
        backdropFilter: (scrolled || menuOpen) ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
          {/* ── Main bar ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>

            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <TrackoraLogo size={isMobile ? 52 : 68} showText textSize={isMobile ? 20 : 24} />
            </Link>

            {/* Desktop nav links */}
            {!isMobile && (
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
            )}

            {/* Desktop auth */}
            {!isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {user ? (
                  <>
                    <button
                      onClick={() => setProfileOpen(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 12px 5px 5px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}
                    >
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, #6366f1, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {profile?.avatar_url
                          ? <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : profile?.full_name
                            ? <span style={{ fontSize: '11px', fontWeight: 700, color: 'white' }}>{initials}</span>
                            : <User size={13} color="white" />
                        }
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(248,250,252,0.8)', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {displayName}
                      </span>
                    </button>
                    <button
                      onClick={signOut}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(248,250,252,0.6)', cursor: 'pointer' }}
                    >
                      <LogOut size={14} />Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setAuthModal('signin')}
                      style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 500, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(248,250,252,0.7)', cursor: 'pointer' }}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setAuthModal('signup')}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, border: 'none', color: 'white', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 15px rgba(99,102,241,0.35)', cursor: 'pointer' }}
                    >
                      <Zap size={14} />Sign Up Free
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Mobile: avatar (if logged in) + hamburger */}
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user && (
                  <button
                    onClick={() => { setMenuOpen(false); setProfileOpen(true) }}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, #6366f1, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', flexShrink: 0 }}
                  >
                    {profile?.avatar_url
                      ? <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : profile?.full_name
                        ? <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{initials}</span>
                        : <User size={15} color="white" />
                    }
                  </button>
                )}
                <button
                  onClick={() => setMenuOpen(v => !v)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '10px', background: menuOpen ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${menuOpen ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.1)'}`, color: '#f8fafc', cursor: 'pointer' }}
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            )}
          </div>

          {/* ── Mobile dropdown menu ── */}
          {isMobile && menuOpen && (
            <div style={{
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingBottom: '20px',
              animation: 'menuSlideDown 0.18s ease-out',
            }}>
              {/* Nav links */}
              <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
                {navLinks.map(link => (
                  link.href.startsWith('/#')
                    ? (
                      <button
                        key={link.label}
                        onClick={() => handleNavLink(link.href)}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '14px 8px', borderRadius: '10px', fontSize: '16px', fontWeight: 600,
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          color: 'rgba(248,250,252,0.8)',
                        }}
                      >{link.label}</button>
                    )
                    : (
                      <Link
                        key={link.label}
                        to={link.href}
                        style={{
                          display: 'block', padding: '14px 8px', borderRadius: '10px',
                          fontSize: '16px', fontWeight: 600, textDecoration: 'none',
                          color: location.pathname === link.href ? '#818cf8' : 'rgba(248,250,252,0.8)',
                          background: location.pathname === link.href ? 'rgba(99,102,241,0.12)' : 'transparent',
                        }}
                      >{link.label}</Link>
                    )
                ))}
              </div>

              {/* Auth section */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {user ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, #6366f1, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {profile?.full_name
                          ? <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{initials}</span>
                          : <User size={14} color="white" />
                        }
                      </div>
                      <span style={{ fontSize: '14px', color: 'rgba(248,250,252,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {displayName || user.email}
                      </span>
                    </div>
                    <button
                      onClick={() => { setMenuOpen(false); signOut() }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(248,250,252,0.7)', cursor: 'pointer' }}
                    >
                      <LogOut size={16} />Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setMenuOpen(false); setAuthModal('signin') }}
                      style={{ padding: '13px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'rgba(248,250,252,0.8)', cursor: 'pointer' }}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); setAuthModal('signup') }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, border: 'none', color: 'white', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 15px rgba(99,102,241,0.35)', cursor: 'pointer' }}
                    >
                      <Zap size={16} />Sign Up Free
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <style>{`
        @keyframes menuSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {authModal   && <AuthModal initialMode={authModal} onClose={() => setAuthModal(null)} />}
      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}
    </>
  )
}
