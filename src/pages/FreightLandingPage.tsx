import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'

type PageKey = 'bol' | 'container' | 'sea-freight' | 'ocean-freight' | 'dhl'

interface HowStep {
  title: string
  body: string
}

interface FAQ {
  q: string
  a: string
}

interface RelatedLink {
  label: string
  href: string
}

interface PageConfig {
  title: string
  description: string
  canonical: string
  h1: string
  subtitle: string
  badge: string
  examples: string[]
  whatIsTitle: string
  whatIsBody: string
  howTitle: string
  howSteps: HowStep[]
  faqs: FAQ[]
  relatedLinks: RelatedLink[]
}

const PAGE_CONFIGS: Record<PageKey, PageConfig> = {
  bol: {
    title: 'Bill of Lading Tracking — Track B/L Numbers Instantly | Trackora',
    description:
      'Track any bill of lading (B/L) number in real time. Supports Maersk, MSC, CMA CGM, Hapag-Lloyd, ONE, COSCO, Yang Ming and 50+ shipping lines. Free BOL tracking.',
    canonical: 'https://www.track-ora.com/track/bill-of-lading',
    h1: 'Bill of Lading Tracking',
    subtitle:
      'Enter your B/L number below and get instant status updates from 50+ major shipping lines — no login required.',
    badge: 'B/L TRACKING',
    examples: ['MAEU123456789', 'MSCU987654321', 'HLCU556677889', 'CMAU112233445'],
    whatIsTitle: 'What is a Bill of Lading?',
    whatIsBody:
      'A bill of lading (B/L or BOL) is the official document issued by a shipping line that serves as a receipt for cargo, a contract of carriage, and a document of title. Every ocean freight shipment has one, and the B/L number is your key to tracking the shipment from port of loading to port of discharge.',
    howTitle: 'How to track a Bill of Lading',
    howSteps: [
      {
        title: 'Find your B/L number',
        body: 'Your freight forwarder or shipping line emails you a B/L confirmation — the number usually starts with the carrier prefix (e.g. MAEU for Maersk, MSCU for MSC).',
      },
      {
        title: 'Enter it above',
        body: 'Paste the B/L number into the tracking box and press Track. Trackora detects the carrier automatically.',
      },
      {
        title: 'Get live status',
        body: 'See the vessel name, current port, ETA, and full event history in real time.',
      },
    ],
    faqs: [
      {
        q: 'What is a B/L number format?',
        a: 'A bill of lading number typically starts with a 4-letter carrier prefix followed by 9–12 digits. For example, Maersk uses MAEU, MSC uses MSCU, and Hapag-Lloyd uses HLCU. Some carriers use alphanumeric formats.',
      },
      {
        q: 'How long does it take for BOL tracking to update?',
        a: 'Carrier systems typically update within 2–12 hours of a port event (loading, departure, arrival, discharge). Events at transshipment ports may take longer to appear.',
      },
      {
        q: 'Can I track a B/L number from any shipping line?',
        a: 'Trackora supports 50+ major shipping lines including Maersk, MSC, CMA CGM, Hapag-Lloyd, ONE, COSCO, Yang Ming, Evergreen, ZIM, and more. Enter your B/L and we auto-detect the carrier.',
      },
      {
        q: 'What is the difference between a B/L number and a booking number?',
        a: "A booking number is assigned when you book cargo space on a vessel — before the shipment. The B/L number is issued after the cargo is loaded and the bill of lading is signed. They are different documents, though some carriers use the same number for both.",
      },
      {
        q: 'What if my B/L tracking shows no results?',
        a: 'This usually means the carrier has not yet posted the first event. If the shipment was recently booked, wait 24–48 hours after the vessel departure date. You can also try tracking with the booking reference or container number instead.',
      },
    ],
    relatedLinks: [
      { label: 'Container Tracking', href: '/track/container' },
      { label: 'Sea Freight Tracking', href: '/track/sea-freight' },
      { label: 'Track Any Shipment', href: '/track' },
    ],
  },

  container: {
    title: 'Container Tracking — Track ISO Containers in Real Time | Trackora',
    description:
      'Track any ISO shipping container by container number (e.g. MSCU1234567) across Maersk, MSC, CMA CGM, Hapag-Lloyd, COSCO and 50+ lines. Free real-time container tracking.',
    canonical: 'https://www.track-ora.com/track/container',
    h1: 'Container Tracking',
    subtitle:
      'Enter your container number (format: 4 letters + 7 digits, e.g. MSCU1234567) for real-time vessel position, port events, and ETA.',
    badge: 'CONTAINER TRACKING',
    examples: ['MSCU1234567', 'MAEU9876543', 'CMAU1122334', 'HLXU5566778'],
    whatIsTitle: 'What is a container number?',
    whatIsBody:
      'Every intermodal shipping container has a unique ISO 6346 identifier: 4 letters (owner code + equipment category) followed by 6 digits and a check digit — for example MSCU1234567. This number stays with the physical box, unlike a B/L number which relates to a single booking.',
    howTitle: 'How to track a shipping container',
    howSteps: [
      {
        title: 'Locate your container number',
        body: 'Your container number appears on the bill of lading, shipping advice, or packing list. It is also physically stencilled on the container doors in large letters.',
      },
      {
        title: 'Enter the container number',
        body: 'Type or paste the container number (e.g. MSCU1234567) into the tracking box above. Trackora identifies the shipping line from the owner prefix automatically.',
      },
      {
        title: 'View real-time events',
        body: 'Track gate-in, loading, vessel departure, transshipment, arrival, discharge, and gate-out events along with the current vessel name and ETA at destination.',
      },
    ],
    faqs: [
      {
        q: 'What does a valid container number look like?',
        a: 'A valid ISO 6346 container number has 4 letters followed by 7 digits — for example MSCU1234567. The first 3 letters are the owner code, the 4th letter is the equipment category (U for freight containers), and the last digit is a check digit.',
      },
      {
        q: 'Can I track a container without a B/L number?',
        a: 'Yes. The container number is independent of the bill of lading. You can track the physical container at any point in its journey using the container number alone.',
      },
      {
        q: 'Why does my container show no tracking events?',
        a: "If the container was recently booked or loaded, the first port event may not yet be posted. Carrier systems typically update 4–24 hours after the event occurs. Try again after the vessel's scheduled departure.",
      },
      {
        q: 'Can I track multiple containers at once?',
        a: 'Yes. Trackora Pro allows you to save and monitor multiple containers with email alerts when the status changes. The free plan supports individual searches without saving.',
      },
      {
        q: 'What shipping lines does Trackora support for container tracking?',
        a: 'We support all major shipping lines including Maersk, MSC, CMA CGM, Hapag-Lloyd, COSCO, Evergreen, ONE, Yang Ming, ZIM, Wan Hai, PIL, SM Line, and 40+ more regional carriers.',
      },
    ],
    relatedLinks: [
      { label: 'Bill of Lading Tracking', href: '/track/bill-of-lading' },
      { label: 'Sea Freight Tracking', href: '/track/sea-freight' },
      { label: 'Track Any Shipment', href: '/track' },
    ],
  },

  'sea-freight': {
    title: 'Sea Freight Tracking — Track Ocean Shipments in Real Time | Trackora',
    description:
      'Track sea freight and ocean shipments by container number, B/L number, or booking reference. Covers all major shipping lines including Maersk, MSC, CMA CGM, Hapag-Lloyd and COSCO.',
    canonical: 'https://www.track-ora.com/track/sea-freight',
    h1: 'Sea Freight Tracking',
    subtitle:
      'Track any ocean shipment by container number, bill of lading, or booking reference — across all major shipping lines in one place.',
    badge: 'OCEAN FREIGHT TRACKING',
    examples: ['MAEU123456789', 'MSCU1234567', 'CNTR8872341'],
    whatIsTitle: 'How does sea freight tracking work?',
    whatIsBody:
      'Sea freight tracking combines two data sources: AIS (Automatic Identification System) vessel position data broadcast by ships in real time, and carrier API events (gate-in, loading, departure, arrival, discharge) posted by the shipping lines. Trackora fuses both sources so you can see not just the vessel position on the map but also the cargo event history and the ETA at the destination port.',
    howTitle: 'How to track your sea freight shipment',
    howSteps: [
      {
        title: 'Get your reference number',
        body: 'You need a container number (e.g. MSCU1234567), a B/L number (e.g. MAEU123456789), or a booking reference from your freight forwarder.',
      },
      {
        title: 'Enter it in the search box',
        body: 'Paste the reference into the tracking box above and click Track. Trackora automatically identifies the shipping line and queries the right carrier API.',
      },
      {
        title: 'Monitor your cargo',
        body: 'View the vessel route on the world map, see all port events with timestamps, and check the estimated time of arrival at destination.',
      },
    ],
    faqs: [
      {
        q: 'What reference numbers can I use to track sea freight?',
        a: 'You can track by container number (ISO 6346 format, e.g. MSCU1234567), bill of lading number (e.g. MAEU123456789), or booking reference. All three methods are supported on Trackora.',
      },
      {
        q: 'How accurate is the vessel ETA?',
        a: 'ETAs are provided by the carrier based on the scheduled port calls and current vessel speed/position. They are updated when the vessel posts an arrival notice, typically 24–72 hours before reaching the port.',
      },
      {
        q: 'Can I track LCL (less-than-container-load) shipments?',
        a: 'LCL shipments move inside shared containers. You can track the container your cargo is consolidated in using the container number. Your freight forwarder should provide this after booking.',
      },
      {
        q: 'What shipping lines are covered for sea freight tracking?',
        a: 'Trackora covers 50+ ocean carriers: Maersk, MSC, CMA CGM, Hapag-Lloyd, COSCO, Evergreen, ONE, Yang Ming, ZIM, Wan Hai, PIL, SM Line, and more. If your carrier is not listed, contact us.',
      },
      {
        q: 'How long does a sea freight shipment typically take?',
        a: 'Transit times depend on the origin-destination pair. Asia–Europe takes 20–30 days, Asia–US West Coast 12–16 days, Asia–US East Coast 25–32 days. Trackora shows the actual progress against the schedule.',
      },
    ],
    relatedLinks: [
      { label: 'Bill of Lading Tracking', href: '/track/bill-of-lading' },
      { label: 'Container Tracking', href: '/track/container' },
      { label: 'Track Any Shipment', href: '/track' },
    ],
  },

  'ocean-freight': {
    title: 'Ocean Freight Tracking — Track Ocean Cargo by Container & B/L | Trackora',
    description:
      'Track ocean freight shipments in real time by container number, bill of lading, or booking reference. Supports Maersk, MSC, CMA CGM, Evergreen, COSCO, ONE and 50+ ocean carriers.',
    canonical: 'https://www.track-ora.com/track/ocean-freight',
    h1: 'Ocean Freight Tracking',
    subtitle:
      'Track any ocean shipment by container number, bill of lading, or booking reference — across all major shipping lines in one place.',
    badge: 'OCEAN FREIGHT TRACKING',
    examples: ['MAEU123456789', 'MSCU1234567', 'CNTR8872341'],
    whatIsTitle: 'How does sea freight tracking work?',
    whatIsBody:
      'Sea freight tracking combines two data sources: AIS (Automatic Identification System) vessel position data broadcast by ships in real time, and carrier API events (gate-in, loading, departure, arrival, discharge) posted by the shipping lines. Trackora fuses both sources so you can see not just the vessel position on the map but also the cargo event history and the ETA at the destination port.',
    howTitle: 'How to track your ocean freight shipment',
    howSteps: [
      {
        title: 'Get your reference number',
        body: 'You need a container number (e.g. MSCU1234567), a B/L number (e.g. MAEU123456789), or a booking reference from your freight forwarder.',
      },
      {
        title: 'Enter it in the search box',
        body: 'Paste the reference into the tracking box above and click Track. Trackora automatically identifies the shipping line and queries the right carrier API.',
      },
      {
        title: 'Monitor your cargo',
        body: 'View the vessel route on the world map, see all port events with timestamps, and check the estimated time of arrival at destination.',
      },
    ],
    faqs: [
      {
        q: 'What reference numbers can I use to track ocean freight?',
        a: 'You can track by container number (ISO 6346 format, e.g. MSCU1234567), bill of lading number (e.g. MAEU123456789), or booking reference. All three methods are supported on Trackora.',
      },
      {
        q: 'How accurate is the vessel ETA?',
        a: 'ETAs are provided by the carrier based on the scheduled port calls and current vessel speed/position. They are updated when the vessel posts an arrival notice, typically 24–72 hours before reaching the port.',
      },
      {
        q: 'Can I track LCL (less-than-container-load) shipments?',
        a: 'LCL shipments move inside shared containers. You can track the container your cargo is consolidated in using the container number. Your freight forwarder should provide this after booking.',
      },
      {
        q: 'What shipping lines are covered for ocean freight tracking?',
        a: 'Trackora covers 50+ ocean carriers: Maersk, MSC, CMA CGM, Hapag-Lloyd, COSCO, Evergreen, ONE, Yang Ming, ZIM, Wan Hai, PIL, SM Line, and more.',
      },
      {
        q: 'How long does an ocean freight shipment typically take?',
        a: 'Transit times depend on the origin-destination pair. Asia–Europe takes 20–30 days, Asia–US West Coast 12–16 days, Asia–US East Coast 25–32 days. Trackora shows the actual progress against the schedule.',
      },
    ],
    relatedLinks: [
      { label: 'Bill of Lading Tracking', href: '/track/bill-of-lading' },
      { label: 'Container Tracking', href: '/track/container' },
      { label: 'Track Any Shipment', href: '/track' },
    ],
  },

  dhl: {
    title: 'DHL Shipment Tracking — Track DHL Packages & Cargo | Trackora',
    description:
      'Track DHL Express, DHL eCommerce, and DHL Global Forwarding shipments by tracking number or shipment ID. Get real-time status, delivery estimates, and event history.',
    canonical: 'https://www.track-ora.com/track/dhl',
    h1: 'DHL Shipment Tracking',
    subtitle:
      'Enter your DHL tracking number or shipment ID for real-time delivery status, event history, and estimated delivery time.',
    badge: 'DHL TRACKING',
    examples: ['1234567890', '9999999999999', 'JD014600006281940324'],
    whatIsTitle: 'DHL tracking number formats',
    whatIsBody:
      'DHL uses different tracking number formats depending on the service: DHL Express uses 10-digit numbers, DHL eCommerce uses longer reference codes starting with JD, and DHL Global Forwarding uses air waybill numbers. Trackora detects the format automatically.',
    howTitle: 'How to track a DHL shipment',
    howSteps: [
      {
        title: 'Find your DHL tracking number',
        body: 'Your DHL tracking number is in the shipment confirmation email, on the DHL waybill label, or in your sender\'s dispatch notification. DHL Express numbers are typically 10 digits.',
      },
      {
        title: 'Enter the tracking number above',
        body: 'Paste your DHL tracking number into the search box and click Track. Trackora identifies the DHL service type (Express, eCommerce, or Global Forwarding) automatically.',
      },
      {
        title: 'Get live delivery status',
        body: 'See the current location of your DHL shipment, all scan events with timestamps and locations, and the estimated delivery date.',
      },
    ],
    faqs: [
      {
        q: 'What DHL services does Trackora support?',
        a: 'Trackora supports tracking for DHL Express, DHL eCommerce (formerly DHL Global Mail), and DHL Global Forwarding (air and ocean freight). Enter your tracking number and the service is detected automatically.',
      },
      {
        q: 'Why is my DHL tracking not showing updates?',
        a: "DHL Express usually updates within 1–4 hours of a scan. DHL eCommerce may take 24–48 hours for the first scan. If you just got the tracking number, wait until the shipment is handed to DHL and the first pickup scan appears.",
      },
      {
        q: 'What does "Shipment on hold" mean in DHL tracking?',
        a: "It means DHL has temporarily stopped processing your shipment, usually due to a customs issue, incomplete documentation, or a recipient address problem. Contact DHL or your sender to resolve the issue.",
      },
      {
        q: 'Can I track a DHL parcel without the tracking number?',
        a: 'You need the tracking number to track a DHL shipment. If you lost it, contact the sender — they will have the tracking number on their DHL waybill or shipment receipt.',
      },
      {
        q: 'What is the difference between DHL Express and DHL eCommerce?',
        a: 'DHL Express is a premium door-to-door courier service with time-definite delivery, full tracking, and customs clearance included. DHL eCommerce is a more economical service for lower-value parcel volumes, often delivered via local postal networks in the destination country.',
      },
    ],
    relatedLinks: [
      { label: 'Track Any Shipment', href: '/track' },
      { label: 'Express Courier Rates', href: '/rates' },
      { label: 'How It Works', href: '/how-it-works' },
    ],
  },
}

interface Props {
  pageKey: PageKey
}

export default function FreightLandingPage({ pageKey }: Props) {
  const config = PAGE_CONFIGS[pageKey]
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [inputValue, setInputValue] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useSEO({
    title: config.title,
    description: config.description,
    canonical: config.canonical,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const val = inputValue.trim()
    if (val) navigate(`/track/${encodeURIComponent(val)}`)
  }

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: isMobile ? '20px 16px' : '28px 32px',
  }

  return (
    <main style={{ background: '#0a0f1e', minHeight: '100vh', color: '#f8fafc', paddingBottom: 64 }}>
      {/* Hero */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: isMobile ? '48px 16px 32px' : '72px 24px 48px', textAlign: 'center' }}>
        {/* Badge */}
        <span style={{
          display: 'inline-block',
          background: 'rgba(99,102,241,0.15)',
          border: '1px solid rgba(99,102,241,0.4)',
          color: '#a5b4fc',
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          padding: '4px 14px',
          marginBottom: 20,
        }}>
          {config.badge}
        </span>

        <h1 style={{ fontSize: isMobile ? 28 : 42, fontWeight: 800, color: '#f8fafc', lineHeight: 1.2, marginBottom: 16 }}>
          {config.h1}
        </h1>

        <p style={{ fontSize: isMobile ? 15 : 17, color: '#94a3b8', lineHeight: 1.7, marginBottom: 32 }}>
          {config.subtitle}
        </p>

        {/* Tracking Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, maxWidth: 600, margin: '0 auto 16px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Enter B/L number, container ID or AWB…"
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              color: '#f8fafc',
              fontSize: 15,
              padding: '12px 16px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              background: '#6366f1',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: 600,
              padding: '12px 22px',
              whiteSpace: 'nowrap',
            }}
          >
            Track
          </button>
        </form>

        {/* Example chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          <span style={{ fontSize: 12, color: '#64748b', marginRight: 4, lineHeight: '28px' }}>Try:</span>
          {config.examples.map(ex => (
            <button
              key={ex}
              onClick={() => setInputValue(ex)}
              style={{
                background: 'rgba(34,211,238,0.08)',
                border: '1px solid rgba(34,211,238,0.25)',
                borderRadius: 999,
                color: '#22d3ee',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 500,
                padding: '4px 12px',
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* What is X */}
        <section style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 18,
            }}>
              📄
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>
                {config.whatIsTitle}
              </h2>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
                {config.whatIsBody}
              </p>
            </div>
          </div>
        </section>

        {/* How to track */}
        <section style={cardStyle}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 20 }}>
            {config.howTitle}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {config.howSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(99,102,241,0.2)',
                  border: '1px solid rgba(99,102,241,0.4)',
                  color: '#a5b4fc',
                  fontWeight: 700,
                  fontSize: 13,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: 4, fontSize: 14 }}>{step.title}</div>
                  <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>{step.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={cardStyle}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 20 }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {config.faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: openFaq === i ? 'rgba(99,102,241,0.08)' : 'transparent',
                    border: 'none',
                    color: '#f8fafc',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    padding: '14px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ color: '#6366f1', fontSize: 18, flexShrink: 0, lineHeight: 1 }}>
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 16px 14px', fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Related links */}
        <section style={cardStyle}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 14 }}>
            Explore more
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {config.relatedLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  background: 'rgba(34,211,238,0.07)',
                  border: '1px solid rgba(34,211,238,0.2)',
                  borderRadius: 999,
                  color: '#22d3ee',
                  fontSize: 13,
                  fontWeight: 500,
                  padding: '6px 16px',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section style={{ ...cardStyle, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>
            Also track with Trackora
          </h2>
          <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, marginBottom: 14 }}>
            Trackora is a universal shipment tracker — beyond sea freight, we support express courier tracking (DHL, FedEx, UPS, Aramex), air freight MAWB tracking, and land freight. One place for all your shipments.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[
              { label: 'Track Any Shipment', href: '/track' },
              { label: 'How It Works', href: '/how-it-works' },
              { label: 'Carrier Directory', href: '/carriers/dhl' },
              { label: 'Freight Rates', href: '/rates' },
            ].map(link => (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 999,
                  color: '#a5b4fc',
                  fontSize: 13,
                  fontWeight: 500,
                  padding: '6px 16px',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
