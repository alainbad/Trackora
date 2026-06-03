import { useState } from 'react'
import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'
import AdUnit from '../components/ui/AdUnit'

const categories = [
  {
    label: 'Tracking',
    items: [
      {
        q: 'How do I track a shipment on Trackora?',
        a: 'Enter your tracking number, AWB, B/L, or container ID in the search box and click Track Now. We support 1,200+ carriers and auto-detect the carrier.',
      },
      {
        q: 'Which carriers does Trackora support?',
        a: 'We support all major express couriers (DHL, FedEx, UPS, Aramex, TNT), sea freight lines (Maersk, MSC, CMA CGM, Evergreen, COSCO and 50+ more), air freight (MAWB tracking for 90+ airlines), and land freight carriers.',
      },
      {
        q: 'Why is my tracking not updating?',
        a: 'Carrier systems can take 2–24 hours to post scan events. If your shipment was recently booked, the first scan is usually at pickup. Check back in a few hours or visit the carrier\'s website directly for the latest.',
      },
      {
        q: 'What is a tracking number / AWB / B/L?',
        a: 'A tracking number identifies your parcel with the courier. An Air Waybill (AWB) is the document for air freight shipments. A Bill of Lading (B/L) is the contract for sea freight. Trackora accepts all formats.',
      },
      {
        q: 'Can I upload a PDF to extract my tracking number?',
        a: 'Yes. Click "Upload AWB / BOL" on the Track page to upload a DHL, FedEx, or other carrier label PDF. We automatically extract the tracking number for you.',
      },
      {
        q: 'How accurate is the tracking data?',
        a: 'We retrieve data directly from carrier APIs in real time. Accuracy depends on the carrier posting updates. ETAs are estimates provided by the carrier and may change.',
      },
    ],
  },
  {
    label: 'Account & Plans',
    items: [
      {
        q: 'Is Trackora free to use?',
        a: 'Yes, the Free plan is available forever with no credit card required. It includes express courier and land freight tracking, sea freight redirects, and up to 10 saved shipments.',
      },
      {
        q: 'What is included in the Pro plan?',
        a: 'Pro ($4.99/month) adds air freight MAWB tracking, full sea freight timelines with vessel position, unlimited saved shipments, email status alerts, and advanced analytics.',
      },
      {
        q: 'How do I upgrade to Pro?',
        a: 'Click "Get Pro" in the navigation or visit the Plans page. You will be redirected to our secure Gumroad checkout.',
      },
      {
        q: 'Can I cancel my subscription?',
        a: 'Yes, you can cancel anytime from your Gumroad account. Your Pro access continues until the end of the current billing period.',
      },
      {
        q: 'Do you offer refunds?',
        a: 'We offer refunds within 7 days of your first payment if you have not used Pro features. Email support@track-ora.com to request one.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Trackora does not store any payment details. All billing is handled by Gumroad, which is PCI DSS compliant.',
      },
    ],
  },
  {
    label: 'Sea & Air Freight',
    items: [
      {
        q: 'How do I track a sea freight shipment?',
        a: 'Enter your container number (e.g. MSCU1234567) or Bill of Lading number. Pro users get a full timeline with vessel position; Free users are redirected to the carrier\'s official tracking portal.',
      },
      {
        q: 'What is a container number format?',
        a: 'Container numbers follow the ISO 6346 standard: 4 letters (owner code + equipment category) followed by 7 digits, e.g. MSCU1234567.',
      },
      {
        q: 'How do I track an air freight MAWB?',
        a: 'Enter your 11-digit Master Air Waybill number in the format XXX-XXXXXXXX (e.g. 020-12345678). This is available on Pro and Business plans.',
      },
      {
        q: 'Why does my sea freight tracking say "redirect to carrier"?',
        a: 'Full sea freight timeline data requires a Pro subscription. Free users are taken directly to the carrier\'s official tracking page for real-time updates.',
      },
    ],
  },
  {
    label: 'Technical',
    items: [
      {
        q: 'Does Trackora work on mobile?',
        a: 'Yes, Trackora is fully responsive and works on all modern smartphones and tablets.',
      },
      {
        q: 'How does PDF label scanning work?',
        a: 'We use browser-based PDF text extraction (no file is uploaded to our servers). The extracted text is scanned for tracking number patterns and the best match is pre-filled for you.',
      },
      {
        q: 'How do I save a shipment to my dashboard?',
        a: 'Sign in or create a free account, track a shipment, and click "Save" on the tracking result page. Saved shipments appear in your Dashboard for quick re-tracking.',
      },
      {
        q: 'What data does Trackora store about me?',
        a: 'We store your email address, hashed password, and any shipments you explicitly save to your dashboard. We do not store tracking queries from guest users. See our Privacy Policy for full details.',
      },
    ],
  },
]

export default function FAQ() {
  useSEO({
    title: 'FAQ | Trackora',
    description: 'Frequently asked questions about Trackora shipment tracking — how to track parcels, AWBs, containers, manage your account, and more.',
    canonical: 'https://www.track-ora.com/faq',
  })

  const isMobile = useIsMobile()
  const [openKey, setOpenKey] = useState<string | null>(null)

  function toggle(key: string) {
    setOpenKey(prev => (prev === key ? null : key))
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: isMobile ? '40px 20px' : '60px 24px' }}>

        <div style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px', borderRadius: '100px', marginBottom: '16px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            fontSize: '11px', color: '#818cf8', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            Support
          </div>
          <h1 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-1px', marginBottom: '12px' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.7 }}>
            Everything you need to know about tracking shipments, managing your account, and getting the most from Trackora.
          </p>
        </div>

        <div>
          {categories.map((cat, ci) => (
            <div key={cat.label}>
              <p style={{
                fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px',
                color: '#818cf8', marginTop: ci === 0 ? '0' : '32px', marginBottom: '12px', fontWeight: 600,
              }}>
                {cat.label}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cat.items.map((item, ii) => {
                  const key = `${ci}-${ii}`
                  const isOpen = openKey === key
                  return (
                    <div
                      key={key}
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        onClick={() => toggle(key)}
                        style={{
                          width: '100%', textAlign: 'left', display: 'flex',
                          alignItems: 'center', justifyContent: 'space-between',
                          padding: '18px', cursor: 'pointer',
                          background: 'transparent', border: 'none',
                        }}
                      >
                        <span style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc', lineHeight: 1.5, paddingRight: '16px' }}>
                          {item.q}
                        </span>
                        <span style={{ fontSize: '20px', color: '#6366f1', flexShrink: 0, lineHeight: 1 }}>
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 18px 18px', color: 'rgba(248,250,252,0.65)', fontSize: '14px', lineHeight: 1.8 }}>
                          {item.a}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <AdUnit slot="2874691530" style={{ marginTop: '48px' }} />
      </div>
    </div>
  )
}
