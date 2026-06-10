import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'
import { Mail, MapPin, Clock, MessageSquare, HelpCircle, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Contact() {
  useSEO({
    title: 'Contact Trackora | Get in Touch',
    description: 'Contact the Trackora team for support, partnership inquiries, carrier integrations, or B2B API access. We typically respond within 24 hours.',
    canonical: 'https://www.track-ora.com/contact',
  })

  const isMobile = useIsMobile()

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f8fafc',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const contactCards = [
    {
      icon: Mail,
      color: '#6366f1',
      title: 'Email Support',
      body: 'For tracking help, account questions, and bug reports.',
      detail: 'support@track-ora.com',
      isLink: true,
      note: 'Response within 24 hours',
    },
    {
      icon: MapPin,
      color: '#22d3ee',
      title: 'Headquarters',
      body: 'Business Bay, Dubai, UAE',
      detail: null,
      isLink: false,
      note: 'Serving customers globally',
    },
    {
      icon: Clock,
      color: '#10b981',
      title: 'Response Times',
      body: 'Monday–Friday: within 24 hours. Weekends: within 48 hours.',
      detail: null,
      isLink: false,
      note: "We're a global team",
    },
  ]

  const faqLinks = [
    { icon: HelpCircle, label: 'FAQ', sub: 'Common questions answered', href: '/faq' },
    { icon: Zap,        label: 'Plans & Pricing', sub: 'Compare free and pro features', href: '/plans' },
    { icon: MessageSquare, label: 'How It Works', sub: 'See the platform in action', href: '/how-it-works' },
  ]

  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: isMobile ? '40px 20px' : '60px 24px' }}>

        {/* Hero */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px', borderRadius: '100px', marginBottom: '16px',
            background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)',
            fontSize: '11px', color: '#22d3ee', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            Contact
          </div>
          <h1 style={{ fontSize: isMobile ? '30px' : '48px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-1.5px', marginBottom: '20px', lineHeight: 1.1 }}>
            Get in Touch
          </h1>
          <p style={{ fontSize: isMobile ? '15px' : '18px', color: 'rgba(248,250,252,0.6)', lineHeight: 1.7, maxWidth: '560px' }}>
            Have a question, partnership idea, or need help with a shipment? We're here.
          </p>
        </div>

        {/* Contact method cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '56px',
        }}>
          {contactCards.map(c => {
            const Icon = c.icon
            return (
              <div key={c.title} style={{
                padding: '24px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', marginBottom: '16px',
                  background: `${c.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color={c.color} />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>{c.title}</h3>
                <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.7, marginBottom: c.detail ? '10px' : '12px' }}>{c.body}</p>
                {c.detail && (
                  <a href={`mailto:${c.detail}`} style={{ display: 'block', fontSize: '13px', color: '#818cf8', textDecoration: 'none', marginBottom: '12px' }}>
                    {c.detail}
                  </a>
                )}
                <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.3)', fontStyle: 'italic' }}>{c.note}</div>
              </div>
            )
          })}
        </div>

        {/* Contact form */}
        <div style={{
          padding: isMobile ? '24px' : '40px',
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '56px',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>Send us a message</h2>
          <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.45)', marginBottom: '32px' }}>
            Fill in the form below and we'll get back to you as soon as possible.
          </p>

          {submitted ? (
            <div style={{
              padding: '24px',
              borderRadius: '14px',
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.25)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>Message sent!</p>
              <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.6)' }}>Thanks! We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'rgba(248,250,252,0.6)', marginBottom: '8px' }}>Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.5)' }}
                    onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'rgba(248,250,252,0.6)', marginBottom: '8px' }}>Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.5)' }}
                    onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'rgba(248,250,252,0.6)', marginBottom: '8px' }}>Subject</label>
                <select
                  required
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.5)' }}
                  onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)' }}
                >
                  <option value="" style={{ background: '#0a0f1e' }}>Select a subject</option>
                  <option value="general" style={{ background: '#0a0f1e' }}>General Inquiry</option>
                  <option value="tracking" style={{ background: '#0a0f1e' }}>Tracking Help</option>
                  <option value="billing" style={{ background: '#0a0f1e' }}>Billing &amp; Plans</option>
                  <option value="partnership" style={{ background: '#0a0f1e' }}>Partnership</option>
                  <option value="carrier" style={{ background: '#0a0f1e' }}>Carrier Integration Request</option>
                  <option value="other" style={{ background: '#0a0f1e' }}>Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'rgba(248,250,252,0.6)', marginBottom: '8px' }}>Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  onFocus={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.5)' }}
                  onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              <div>
                <button
                  type="submit"
                  style={{
                    padding: '13px 32px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
                  }}
                >
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>

        {/* FAQ shortcut */}
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>Looking for quick answers?</h2>
          <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.45)', marginBottom: '24px' }}>
            Browse our resources to find answers without waiting for a reply.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
            {faqLinks.map(f => {
              const Icon = f.icon
              return (
                <Link
                  key={f.label}
                  to={f.href}
                  style={{
                    padding: '20px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                  }}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
                    background: 'rgba(99,102,241,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color="#818cf8" />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>{f.label}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.45)' }}>{f.sub}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
