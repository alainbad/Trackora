import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'
import { Link } from 'react-router-dom'
import { Search, MapPin, Bell, FileText } from 'lucide-react'

const STEPS = [
  {
    icon: Search, color: '#6366f1',
    title: 'Enter any tracking number',
    body: 'Paste your tracking number, air waybill (MAWB), container ID, or bill of lading into the search box. Trackora auto-detects the carrier — no need to select it manually.',
  },
  {
    icon: MapPin, color: '#10b981',
    title: 'See real-time status instantly',
    body: 'Within seconds you\'ll see a full event timeline, a live route map showing your cargo\'s current position, estimated delivery date, and any delays.',
  },
  {
    icon: Bell, color: '#f59e0b',
    title: 'Set alerts and never miss an update',
    body: 'Enable browser notifications or email alerts to get notified the moment your shipment status changes — departure, customs clearance, delivery, and more.',
  },
  {
    icon: FileText, color: '#06b6d4',
    title: 'Upload documents to extract numbers',
    body: 'Not sure of your tracking number? Upload your airway bill or bill of lading PDF. Trackora scans the document and extracts all tracking numbers automatically.',
  },
]

const FAQS = [
  {
    q: 'How do I track a sea freight container?',
    a: 'Enter your ISO 6346 container number (e.g. MSKU1234567) or your bill of lading number in the Trackora search box. For the most accurate live data, select the "Sea Freight" mode to choose your shipping line directly. We then redirect you to the carrier\'s official portal with your number pre-filled, or show you the full timeline if your carrier supports API tracking.',
  },
  {
    q: 'How do I track an air freight shipment (MAWB)?',
    a: 'Enter your Master Air Waybill number in the format NNN-NNNNNNNN (e.g. 176-12345678). Trackora identifies the airline from the 3-digit prefix (176 = Emirates SkyCargo) and retrieves the full flight and customs status.',
  },
  {
    q: 'What is the difference between a container number, B/L, and booking reference?',
    a: 'A container number (ISO 6346) identifies the physical box: 4 letters + 7 digits, e.g. MSKU1234567. A bill of lading (B/L) is a shipping document number issued by the carrier. A booking reference is a reservation number issued before the cargo is loaded. You can track using any of these on Trackora.',
  },
  {
    q: 'Does Trackora support DHL, FedEx, and UPS tracking?',
    a: 'Yes. Enter your DHL, FedEx, or UPS tracking number and Trackora will auto-detect the carrier and show you the full delivery timeline, current location, and estimated delivery time.',
  },
  {
    q: 'Is Trackora free to use?',
    a: 'The Free plan supports unlimited express courier tracking (DHL, FedEx, UPS, USPS, Aramex, and 1,000+ more) and land freight, with up to 10 saved shipments. Air freight (MAWB) and sea freight full timeline data require a Pro plan from $4.99/month.',
  },
  {
    q: 'Why does Trackora redirect me to the carrier\'s website for some containers?',
    a: 'For sea freight carriers that do not provide a public API, redirecting you directly to the carrier\'s official tracking portal is the most accurate and honest approach. We never display unverified data. Your container number is pre-filled in the redirect link so you can see live vessel position and port events with one click.',
  },
]

export default function HowItWorks() {
  useSEO({
    title: 'How Trackora Works | Track Any Shipment in 3 Steps',
    description: 'Learn how to track sea freight containers, air waybills (MAWB), express parcels, and land freight on Trackora. Step-by-step guide with FAQs.',
    canonical: 'https://www.track-ora.com/how-it-works',
  })

  const isMobile = useIsMobile()

  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: isMobile ? '40px 20px' : '60px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '64px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px', borderRadius: '100px', marginBottom: '16px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            fontSize: '11px', color: '#818cf8', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            Guide
          </div>
          <h1 style={{ fontSize: isMobile ? '28px' : '44px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-1.5px', marginBottom: '16px', lineHeight: 1.1 }}>
            How to Track Any Shipment with Trackora
          </h1>
          <p style={{ fontSize: isMobile ? '15px' : '18px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto' }}>
            Track sea freight containers, air waybills, express parcels, and land freight shipments
            from 1,200+ carriers — all in one place.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '72px' }}>
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} style={{
                display: 'flex', gap: '20px', alignItems: 'flex-start',
                padding: isMobile ? '20px' : '28px',
                borderRadius: '18px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                  background: `${step.color}18`,
                  border: `1px solid ${step.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={22} color={step.color} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(248,250,252,0.35)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Step {i + 1}
                  </div>
                  <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>{step.title}</h2>
                  <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.6)', lineHeight: 1.7, margin: 0 }}>{step.body}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Freight types grid */}
        <div style={{ marginBottom: '72px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            What can you track?
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(248,250,252,0.5)', marginBottom: '28px' }}>
            Trackora supports all four modes of international freight.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { emoji: '✈️', title: 'Air Freight (MAWB)', body: 'Track any master air waybill from 200+ airlines including Emirates SkyCargo, Lufthansa Cargo, Qatar Airways Cargo, and CARGOLUX. Format: 3-digit airline prefix + 8 digits (e.g. 176-12345678).' },
              { emoji: '🚢', title: 'Sea Freight (Ocean)', body: 'Track ISO 6346 container numbers, bills of lading (B/L), and booking references across Maersk, MSC, CMA CGM, Hapag-Lloyd, COSCO, Evergreen, ONE, and 100+ other shipping lines.' },
              { emoji: '🚚', title: 'Express Couriers', body: 'Unlimited tracking for FedEx, DHL Express, UPS, USPS, Aramex, DPD, GLS, Hermes/Evri, PostNL, Royal Mail, and 1,000+ more carriers worldwide.' },
              { emoji: '🏭', title: 'Land Freight (LTL/FTL)', body: 'Track truck and rail shipments across Europe, Asia, and the Americas. Supports DHL Freight, DB Schenker, Kuehne+Nagel, and major regional road freight carriers.' },
            ].map(item => (
              <div key={item.title} style={{
                padding: '22px',
                borderRadius: '16px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.emoji}</div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.7, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc', marginBottom: '28px', letterSpacing: '-0.5px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                padding: '22px 0',
                borderBottom: i < FAQS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>{faq.q}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.6)', lineHeight: 1.75, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link
            to="/track"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px', borderRadius: '14px', textDecoration: 'none',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', fontSize: '16px', fontWeight: 700,
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
            }}
          >
            Start tracking for free →
          </Link>
        </div>

      </div>

      {/* JSON-LD FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        }) }}
      />
    </div>
  )
}
