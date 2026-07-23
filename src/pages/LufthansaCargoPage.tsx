import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'
import { Plane, FileText, ChevronRight, AlertCircle, Clock, CheckCircle, Package } from 'lucide-react'

const FAQS = [
  { q: 'How do I track a Lufthansa Cargo shipment?', a: 'Enter your 11-digit air waybill number in the format 020-XXXXXXXX into the search box above and click Track. Trackora will retrieve your shipment status directly. You can also enter the number without the hyphen as 02012345678.' },
  { q: 'What does the 020 prefix mean on an air waybill?', a: 'The 020 prefix is the IATA-assigned airline prefix for Lufthansa Cargo AG. Every air waybill (AWB) begins with a 3-digit airline code. When you see 020-XXXXXXXX, the first three digits identify Lufthansa Cargo as the issuing carrier.' },
  { q: 'What is the correct format for a Lufthansa Cargo AWB number?', a: 'A Lufthansa Cargo air waybill number follows the IATA standard: 020 (prefix) followed by a hyphen, then 8 digits — for example 020-12345678. When entered without hyphens, it is 11 digits total: 02012345678. Both formats are accepted by Trackora.' },
  { q: 'Why is my Lufthansa Cargo tracking not showing updates?', a: 'Tracking events typically appear 2–6 hours after each physical milestone (acceptance, departure, arrival, delivery). If the shipment was recently booked, the first event appears after Lufthansa Cargo accepts the cargo at the airport of origin. Check again after the scheduled flight departure.' },
  { q: 'Can I track a Lufthansa Cargo shipment without the full AWB number?', a: 'No — the complete 11-digit air waybill number (including the 020 prefix) is required to retrieve tracking data. Partial numbers are not accepted. Your freight forwarder or shipper will have the full AWB on the cargo documents.' },
  { q: 'Is Trackora affiliated with Lufthansa Cargo?', a: 'No. Trackora is an independent, third-party tracking aggregator and is not affiliated with, endorsed by, or connected to Lufthansa Cargo AG or Deutsche Lufthansa AG in any way.' },
]

const AWB_STATUSES = [
  { icon: CheckCircle, color: '#22d3ee', label: 'Freight Accepted', desc: 'Cargo has been received by Lufthansa Cargo at the origin airport.' },
  { icon: Plane,       color: '#6366f1', label: 'Departed',         desc: 'The flight carrying your cargo has departed from the origin airport.' },
  { icon: Clock,       color: '#f59e0b', label: 'In Transit',       desc: 'Shipment is en route or at an intermediate hub.' },
  { icon: Package,     color: '#22d3ee', label: 'Arrived',          desc: 'Cargo has arrived at the destination airport and is awaiting customs clearance.' },
  { icon: CheckCircle, color: '#10b981', label: 'Delivered',        desc: 'Cargo has been collected or delivered to the consignee.' },
]

export default function LufthansaCargoPage() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [input, setInput] = useState('020-')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const jsonLd = useMemo(() => [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.track-ora.com/' },
      { '@type': 'ListItem', position: 2, name: 'Air Cargo', item: 'https://www.track-ora.com/track' },
      { '@type': 'ListItem', position: 3, name: 'Lufthansa Cargo 020 Tracking', item: 'https://www.track-ora.com/air-cargo/lufthansa-cargo-tracking' },
    ]},
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ], [])

  useSEO({ title: '020 Tracking – Lufthansa Cargo AWB Tracking | Trackora', description: 'Track Lufthansa Cargo shipments using your 020 air waybill number. Enter the complete AWB number to view cargo status, routing and shipment updates.', canonical: 'https://www.track-ora.com/air-cargo/lufthansa-cargo-tracking', jsonLd })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const val = input.trim()
    if (val && val !== '020-') navigate(`/track/${encodeURIComponent(val)}`)
  }

  function handleInputChange(v: string) {
    setInput(v.startsWith('020-') ? v : '020-')
  }

  const card: React.CSSProperties = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: isMobile ? '20px 16px' : '28px 32px' }
  const crumbLink: React.CSSProperties = { color: '#64748b', textDecoration: 'none', fontSize: 13 }

  return (
    <main style={{ background: '#0a0f1e', minHeight: '100vh', color: '#f8fafc', paddingBottom: 80 }}>
      <nav aria-label="Breadcrumb" style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '20px 16px 0' : '28px 24px 0', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <Link to="/" style={crumbLink}>Home</Link>
        <ChevronRight size={12} color="#475569" />
        <Link to="/track" style={crumbLink}>Air Cargo</Link>
        <ChevronRight size={12} color="#475569" />
        <span style={{ fontSize: 13, color: '#94a3b8' }}>Lufthansa Cargo 020 Tracking</span>
      </nav>

      <section style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '32px 16px 28px' : '48px 24px 40px', textAlign: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,173,0,0.12)', border: '1px solid rgba(255,173,0,0.35)', color: '#ffc843', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.11em', padding: '4px 14px', marginBottom: 20 }}>
          <Plane size={11} /> AIR WAYBILL TRACKING
        </span>
        <h1 style={{ fontSize: isMobile ? 28 : 44, fontWeight: 800, color: '#f8fafc', lineHeight: 1.15, marginBottom: 14 }}>Lufthansa Cargo 020 AWB Tracking</h1>
        <p style={{ fontSize: isMobile ? 15 : 17, color: '#94a3b8', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 32px' }}>Track any Lufthansa Cargo air waybill by entering your 020 AWB number below. Status updates, routing, and event history — no login required.</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, maxWidth: 580, margin: '0 auto 12px' }}>
          <input type="text" value={input} onChange={e => handleInputChange(e.target.value)} placeholder="020-12345678" aria-label="Lufthansa Cargo AWB number" style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, color: '#f8fafc', fontSize: 16, padding: '13px 16px', outline: 'none', fontFamily: 'monospace', letterSpacing: '0.04em' }} />
          <button type="submit" style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 15, fontWeight: 600, padding: '13px 24px', whiteSpace: 'nowrap' }}>Track</button>
        </form>
        <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Format: <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>020-XXXXXXXX</span> — 8 digits after the prefix</p>
      </section>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <section style={card}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0, background: 'rgba(255,173,0,0.1)', border: '1px solid rgba(255,173,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText size={18} color="#ffc843" /></div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>What is a Lufthansa Cargo AWB number?</h2>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>An air waybill (AWB) is the official contract of carriage for air freight shipments. The <strong style={{ color: '#f8fafc' }}>020 prefix</strong> is the IATA-assigned airline code for <strong style={{ color: '#f8fafc' }}>Lufthansa Cargo AG</strong> — one of the world's largest air cargo carriers. The full AWB number follows the pattern <span style={{ fontFamily: 'monospace', color: '#22d3ee' }}>020-XXXXXXXX</span>.</p>
            </div>
          </div>
        </section>

        <section style={card}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 18 }}>AWB number formats</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 12 }}>
            {[{ label: 'Standard format', example: '020-12345678', note: 'With hyphen — most common on documents' }, { label: 'Hyphen-free format', example: '02012345678', note: '11 digits, no separator — also accepted' }, { label: 'On air waybill document', example: '020 – 1234 5678', note: 'Spaces added for readability; enter without spaces' }, { label: 'In emails / booking refs', example: 'AWB 020-12345678', note: 'Copy from "AWB" onwards' }].map(fmt => (
              <div key={fmt.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', color: '#64748b', marginBottom: 6 }}>{fmt.label.toUpperCase()}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 15, color: '#22d3ee', marginBottom: 4 }}>{fmt.example}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{fmt.note}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={card}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 20 }}>How to track Lufthansa Cargo</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[{ title: 'Locate your AWB', body: 'Your air waybill number appears on the shipment confirmation email from your freight forwarder, on the physical AWB document, or in your shipping instruction. Look for a number starting with 020.' }, { title: 'Enter the AWB number above', body: 'Paste the 11-digit number (with or without the hyphen) into the tracking box. Trackora pre-fills the 020 prefix — just add the 8 remaining digits.' }, { title: 'View shipment events', body: "See every milestone: acceptance, departure, transshipment connections, arrival, and customs clearance status at the destination airport." }].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
                <div><div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: 4, fontSize: 14 }}>{step.title}</div><div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65 }}>{step.body}</div></div>
              </div>
            ))}
          </div>
        </section>

        <section style={card}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 18 }}>Lufthansa Cargo shipment statuses explained</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {AWB_STATUSES.map(({ icon: Icon, color, label, desc }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: `${color}14`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={16} color={color} /></div>
                <div><div style={{ fontWeight: 600, fontSize: 14, color: '#f8fafc', marginBottom: 2 }}>{label}</div><div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{desc}</div></div>
              </div>
            ))}
          </div>
        </section>

        <section style={card}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 18 }}>Frequently asked questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', background: openFaq === i ? 'rgba(99,102,241,0.08)' : 'transparent', color: '#f8fafc', fontSize: 14, fontWeight: 600, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <span>{faq.q}</span><span style={{ color: '#6366f1', fontSize: 18, flexShrink: 0, lineHeight: 1 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <div style={{ padding: '0 16px 14px', fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </section>

        <section style={card}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 14 }}>More tracking options</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[{ label: 'Track Any Shipment', href: '/track' }, { label: 'Bill of Lading Tracking', href: '/track/bill-of-lading' }, { label: 'Container Tracking', href: '/track/container' }, { label: 'Sea Freight Tracking', href: '/track/sea-freight' }, { label: 'Freight Rates', href: '/rates' }].map(link => (
              <Link key={link.href + link.label} to={link.href} style={{ background: 'rgba(34,211,238,0.07)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 999, color: '#22d3ee', fontSize: 13, fontWeight: 500, padding: '6px 16px', textDecoration: 'none' }}>{link.label}</Link>
            ))}
          </div>
        </section>

        <section style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <AlertCircle size={15} color="#64748b" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.65, margin: 0 }}><strong style={{ color: '#94a3b8' }}>Disclaimer:</strong> Trackora is an independent third-party tracking service and is not affiliated with, endorsed by, or in any way connected to Lufthansa Cargo AG or Deutsche Lufthansa AG. Tracking information is sourced from publicly available carrier systems.</p>
        </section>

        <section style={{ ...card, background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.14)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>Also track with Trackora</h2>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65, marginBottom: 14 }}>Beyond Lufthansa Cargo, Trackora supports all major MAWB prefixes — Emirates SkyCargo (176), Qatar Cargo (157), Turkish Cargo (235), Air France Cargo (057), and 40+ more — plus express couriers (DHL, FedEx, UPS), ocean containers, and sea freight bills of lading.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[{ label: 'Track Any AWB', href: '/track' }, { label: 'How It Works', href: '/how-it-works' }, { label: 'Carrier Directory', href: '/carriers/lufthansa-cargo' }, { label: 'Air Freight Rates', href: '/rates' }].map(link => (
              <Link key={link.href} to={link.href} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, color: '#a5b4fc', fontSize: 13, fontWeight: 500, padding: '6px 16px', textDecoration: 'none' }}>{link.label}</Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
