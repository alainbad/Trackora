import { useParams, Link, Navigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'

interface CarrierInfo {
  name: string
  type: 'express' | 'sea' | 'air' | 'land'
  emoji: string
  color: string
  description: string
  trackingFormat: string
  formatExample: string
  guide: string[]
  faqs: { q: string; a: string }[]
}

const CARRIERS: Record<string, CarrierInfo> = {
  'fedex': {
    name: 'FedEx', type: 'express', emoji: '📦', color: '#FF6200',
    description: 'FedEx is one of the world\'s largest courier and logistics companies, operating 600+ aircraft and delivering to 220+ countries. Track your FedEx package in real time on Trackora.',
    trackingFormat: '12, 15, or 20 digits',
    formatExample: '123456789012',
    guide: [
      'Find your FedEx tracking number on your shipping confirmation email or receipt.',
      'Enter the 12, 15, or 20-digit number in the Trackora search box.',
      'Trackora automatically detects FedEx and retrieves your delivery timeline.',
      'Enable notifications to get alerted on every status change.',
    ],
    faqs: [
      { q: 'Where do I find my FedEx tracking number?', a: 'Your FedEx tracking number appears in your shipping confirmation email, on the shipping label, or in your FedEx account shipment history.' },
      { q: 'How long does FedEx tracking take to update?', a: 'FedEx tracking typically updates within 30-60 minutes of each scan event. Some international shipments may have longer gaps between updates.' },
      { q: 'What does "In transit" mean for FedEx?', a: 'In transit means your package is moving through the FedEx network toward its destination. You will see the current facility location and expected delivery date.' },
    ],
  },
  'dhl': {
    name: 'DHL Express', type: 'express', emoji: '📦', color: '#FFCC00',
    description: 'DHL Express is the world\'s leading international express courier, delivering to 220+ countries. Track your DHL shipment live on Trackora.',
    trackingFormat: '10-digit number',
    formatExample: '1234567890',
    guide: [
      'Locate your DHL waybill number on your shipment receipt or email.',
      'Enter the 10-digit number in the Trackora search bar.',
      'See your package\'s current location, transit history, and delivery ETA.',
      'Set up email alerts for instant status updates.',
    ],
    faqs: [
      { q: 'What is a DHL waybill number?', a: 'A DHL waybill number is the unique 10-digit tracking number assigned to your shipment. It appears on the shipping label and your confirmation email.' },
      { q: 'How often does DHL tracking update?', a: 'DHL tracking updates at each scan point — typically every few hours in transit and more frequently during final delivery.' },
      { q: 'Can I track DHL Parcel and DHL eCommerce on Trackora?', a: 'Yes. Trackora supports DHL Express, DHL Parcel, and DHL eCommerce tracking numbers.' },
    ],
  },
  'ups': {
    name: 'UPS', type: 'express', emoji: '📦', color: '#f5a623',
    description: 'UPS (United Parcel Service) delivers over 24 million packages daily in 220+ countries. Track your UPS package in real time — from pickup to delivery.',
    trackingFormat: '1Z + 16 alphanumeric characters',
    formatExample: '1Z999AA10123456784',
    guide: [
      'Find your UPS tracking number (starts with 1Z) on your shipping confirmation.',
      'Enter the 18-character number starting with "1Z" in the Trackora search box.',
      'View real-time location, delivery timeline, and proof of delivery.',
    ],
    faqs: [
      { q: 'What does a UPS tracking number look like?', a: 'UPS tracking numbers start with "1Z" followed by 16 alphanumeric characters, totalling 18 characters (e.g. 1Z999AA10123456784).' },
      { q: 'Can I track UPS international shipments on Trackora?', a: 'Yes. Trackora tracks UPS domestic (US) and international shipments, including UPS Worldwide Express and UPS Standard.' },
    ],
  },
  'maersk': {
    name: 'Maersk', type: 'sea', emoji: '🚢', color: '#42ADEF',
    description: 'Maersk is the world\'s largest container shipping company, operating over 700 vessels. Track your Maersk container, bill of lading, or booking reference in real time.',
    trackingFormat: 'Container: MSKU + 7 digits | B/L: 9 digits',
    formatExample: 'MSKU1234567',
    guide: [
      'Identify your reference type: container number (MSKU/MAEU prefix), bill of lading, or booking number.',
      'Use the Sea Freight mode on Trackora and select Maersk as your carrier.',
      'Enter your reference number — Maersk container tracking supports direct deep-links.',
      'For B/L and booking references, you will be redirected to Maersk\'s official tracking portal.',
    ],
    faqs: [
      { q: 'What is a Maersk container number format?', a: 'Maersk containers use ISO 6346 format: 4 letters (e.g. MSKU or MRKU) followed by 7 digits. Example: MSKU1234567.' },
      { q: 'How do I track a Maersk bill of lading?', a: 'Enter your B/L number in the Sea Freight mode on Trackora and select Maersk. You will be redirected to Maersk\'s official portal with your number pre-filled for the most accurate results.' },
      { q: 'Where do I find my Maersk container number?', a: 'Your Maersk container number appears on your booking confirmation, bill of lading, or the physical container itself.' },
    ],
  },
  'msc': {
    name: 'MSC', type: 'sea', emoji: '🚢', color: '#003087',
    description: 'MSC (Mediterranean Shipping Company) is one of the world\'s largest ocean carriers with a fleet of 600+ vessels. Track your MSC container or booking on Trackora.',
    trackingFormat: 'Container: MSCU + 7 digits | B/L: MSCU prefix',
    formatExample: 'MSCU1234567',
    guide: [
      'Find your MSC container number or B/L reference on your shipping documents.',
      'Select Sea Freight mode on Trackora and choose MSC.',
      'Enter your container number for a pre-filled direct link to MSC\'s tracking portal.',
      'For the most up-to-date vessel position and port status, click "Open Pre-filled Tracking" to go directly to MSC\'s official website.',
    ],
    faqs: [
      { q: 'Why does Trackora redirect me to MSC\'s website?', a: 'MSC does not provide a public API for third-party tracking. Redirecting you to MSC\'s official portal ensures you see 100% accurate, real-time data — the same information MSC\'s own team uses.' },
      { q: 'What is an MSC container number?', a: 'MSC containers start with MSCU followed by 7 digits (e.g. MSCU1234567). You can find it on your bill of lading or booking confirmation.' },
    ],
  },
  'cma-cgm': {
    name: 'CMA CGM', type: 'sea', emoji: '🚢', color: '#C41230',
    description: 'CMA CGM is the third-largest container shipping line in the world with 600+ vessels. Track your CMA CGM container, B/L, or booking reference on Trackora.',
    trackingFormat: 'Container: CMAU + 7 digits | B/L: CMAU prefix',
    formatExample: 'CMAU1234567',
    guide: [
      'Locate your CMA CGM container number or B/L reference on your shipping documents.',
      'Use the Sea Freight tracker on Trackora and select CMA CGM.',
      'Your container number will be pre-filled in the direct link to CMA CGM\'s tracking portal.',
    ],
    faqs: [
      { q: 'What is a CMA CGM container number?', a: 'CMA CGM containers use the owner code CMAU followed by 7 digits. APL containers (owned by CMA CGM) use APHU as the prefix.' },
      { q: 'Can I track a CMA CGM B/L on Trackora?', a: 'Yes. Enter your B/L in the Sea Freight mode on Trackora and select CMA CGM. You will be redirected to CMA CGM\'s official tracking portal with your reference pre-filled.' },
    ],
  },
  'hapag-lloyd': {
    name: 'Hapag-Lloyd', type: 'sea', emoji: '🚢', color: '#f59e0b',
    description: 'Hapag-Lloyd is the fifth-largest container shipping company, operating 260+ vessels on 130 trade routes. Track your Hapag-Lloyd container or booking on Trackora.',
    trackingFormat: 'Container: HLCU + 7 digits | B/L: HLCU prefix',
    formatExample: 'HLCU1234567',
    guide: [
      'Find your Hapag-Lloyd container number (HLCU prefix) or B/L on your shipping documents.',
      'Select Sea Freight mode on Trackora and choose Hapag-Lloyd.',
      'Your number is pre-filled in the direct link to Hapag-Lloyd\'s tracking portal.',
    ],
    faqs: [
      { q: 'What is a Hapag-Lloyd tracking number?', a: 'Hapag-Lloyd containers use the owner code HLCU followed by 7 digits (e.g. HLCU1234567). B/L numbers typically follow a HLCUXXXX format.' },
    ],
  },
  'usps': {
    name: 'USPS', type: 'express', emoji: '📬', color: '#004B87',
    description: 'USPS (United States Postal Service) delivers over 130 billion pieces of mail annually. Track your USPS package, Priority Mail, or international shipment on Trackora.',
    trackingFormat: '20-22 digit number',
    formatExample: '94001234567890123456',
    guide: [
      'Find your USPS tracking number on your shipping label, receipt, or confirmation email.',
      'Enter the 20-22 digit number in the Trackora search box.',
      'Trackora auto-detects USPS and shows your full delivery timeline.',
    ],
    faqs: [
      { q: 'What does a USPS tracking number look like?', a: 'USPS tracking numbers are 20-22 digits long, often starting with 94 (Priority Mail), 92 (Certified Mail), or 82 (First Class). International USPS tracking numbers have a letter-prefix format like LZ123456789US.' },
      { q: 'Can I track USPS international packages on Trackora?', a: 'Yes. Trackora supports USPS international packages including First Class Mail International, Priority Mail International, and Priority Mail Express International.' },
    ],
  },
  'amazon': {
    name: 'Amazon', type: 'express', emoji: '📦', color: '#FF9900',
    description: 'Track your Amazon package or Amazon Logistics (AMZL) shipment in real time. See current delivery location, driver details, and estimated arrival window.',
    trackingFormat: 'TBA + 12 digits',
    formatExample: 'TBA123456789000',
    guide: [
      'Find your Amazon tracking number in your order confirmation email or the Amazon app (Your Orders → Track Package).',
      'AMZL tracking numbers start with "TBA" followed by 12 digits.',
      'Enter the number in Trackora to see real-time delivery status.',
    ],
    faqs: [
      { q: 'What is an Amazon TBA tracking number?', a: 'TBA tracking numbers (e.g. TBA123456789000) are used by Amazon Logistics (AMZL), Amazon\'s own delivery service. They indicate the package is being delivered by Amazon\'s in-house drivers.' },
      { q: 'Why is my Amazon package showing "out for delivery" for hours?', a: 'AMZL drivers typically have 100-200 stops per route. Once "out for delivery" is shown, delivery is usually within the same day. The 4-hour delivery window in the Amazon app is based on the driver\'s current position.' },
    ],
  },
}

export default function CarrierPage() {
  const { slug } = useParams<{ slug: string }>()
  const isMobile = useIsMobile()

  const carrier = slug ? CARRIERS[slug] : null
  if (!carrier) return <Navigate to="/track" replace />

  useSEO({
    title: `${carrier.name} Tracking | Track ${carrier.name} Shipments in Real Time — Trackora`,
    description: `Track any ${carrier.name} ${carrier.type === 'sea' ? 'container, bill of lading, or booking reference' : 'tracking number'} in real time. Free, instant results — no sign-up required.`,
    canonical: `https://www.track-ora.com/carriers/${slug}`,
  })

  const typeLabel = carrier.type === 'sea' ? 'Sea Freight' : carrier.type === 'air' ? 'Air Freight' : carrier.type === 'land' ? 'Land Freight' : 'Express Courier'
  const typeColor = carrier.type === 'sea' ? '#10b981' : carrier.type === 'air' ? '#6366f1' : carrier.type === 'land' ? '#f59e0b' : '#06b6d4'

  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: isMobile ? '40px 20px' : '60px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px', borderRadius: '100px', marginBottom: '16px',
            background: `${typeColor}18`, border: `1px solid ${typeColor}30`,
            fontSize: '11px', color: typeColor, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            {typeLabel}
          </div>
          <h1 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-1.5px', marginBottom: '16px', lineHeight: 1.1 }}>
            {carrier.emoji} {carrier.name} Shipment Tracking
          </h1>
          <p style={{ fontSize: isMobile ? '15px' : '17px', color: 'rgba(248,250,252,0.6)', lineHeight: 1.7, maxWidth: '640px' }}>
            {carrier.description}
          </p>
        </div>

        {/* CTA box */}
        <div style={{
          padding: isMobile ? '20px' : '28px',
          borderRadius: '18px',
          background: 'rgba(99,102,241,0.07)',
          border: '1px solid rgba(99,102,241,0.25)',
          marginBottom: '56px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
            Track a {carrier.name} shipment now
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)', marginBottom: '16px' }}>
            Format: <span style={{ fontFamily: 'monospace', color: '#a5b4fc' }}>{carrier.trackingFormat}</span>
            {' · '}Example: <span style={{ fontFamily: 'monospace', color: '#a5b4fc' }}>{carrier.formatExample}</span>
          </p>
          <Link
            to={`/track/${encodeURIComponent(carrier.formatExample)}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '11px 22px', borderRadius: '12px', textDecoration: 'none',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', fontSize: '14px', fontWeight: 700,
              boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
            }}
          >
            Track on Trackora →
          </Link>
        </div>

        {/* How-to guide */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', marginBottom: '24px', letterSpacing: '-0.5px' }}>
            How to track a {carrier.name} shipment
          </h2>
          <ol style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {carrier.guide.map((step, i) => (
              <li key={i} style={{
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                padding: '18px 20px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: `${typeColor}18`, border: `1px solid ${typeColor}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 800, color: typeColor,
                }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.7)', lineHeight: 1.7, margin: 0 }}>{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', marginBottom: '24px', letterSpacing: '-0.5px' }}>
            Frequently asked questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {carrier.faqs.map((faq, i) => (
              <div key={i} style={{
                padding: '20px 0',
                borderBottom: i < carrier.faqs.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>{faq.q}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.6)', lineHeight: 1.75, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Other carriers */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>Track other carriers</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Object.entries(CARRIERS).filter(([k]) => k !== slug).map(([k, c]) => (
              <Link
                key={k}
                to={`/carriers/${k}`}
                style={{
                  padding: '7px 14px', borderRadius: '100px', textDecoration: 'none',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '13px', color: 'rgba(248,250,252,0.6)', fontWeight: 600,
                }}
              >
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* JSON-LD FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: carrier.faqs.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        }) }}
      />
    </div>
  )
}
