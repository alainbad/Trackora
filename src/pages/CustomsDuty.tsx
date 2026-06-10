import { useState } from 'react'
import { Calculator, Package, AlertCircle, CheckCircle } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'
import AdUnit from '../components/ui/AdUnit'
import { DUTY_RATES, CATEGORY_LABELS, SUPPORTED_IMPORT_COUNTRIES, type CustomsCategory } from '../data/customsRates'
import { COUNTRIES } from '../data/shippingRates'

const INPUT_STYLE: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '10px',
  fontSize: '14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#f8fafc',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: 'rgba(248,250,252,0.45)',
  fontWeight: 600,
  display: 'block',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const CARD_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '16px',
  padding: '24px',
}

const BADGE_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 14px',
  borderRadius: '20px',
  background: 'rgba(99,102,241,0.1)',
  border: '1px solid rgba(99,102,241,0.2)',
  fontSize: '11px',
  fontWeight: 700,
  color: '#818cf8',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  marginBottom: '16px',
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function CustomsDuty() {
  useSEO({
    title: 'Customs Duty Calculator — Estimate Import Duties & Taxes | Trackora',
    description: 'Free customs duty calculator for 15 countries. Estimate import duties, VAT, and total landed cost for 20 product categories including UAE, Saudi Arabia, EU, USA, UK and more.',
    canonical: 'https://www.track-ora.com/customs-duty',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'Customs Duty Calculator',
        'applicationCategory': 'BusinessApplication',
        'url': 'https://www.track-ora.com/customs-duty',
        'description': 'Free customs duty calculator for 15 countries. Estimate import duties, VAT, and total landed cost for 20 product categories.',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'featureList': ['Import duty estimation', 'VAT calculation', '15 countries covered', '20 product categories', 'Total landed cost'],
        'publisher': { '@type': 'Organization', 'name': 'Trackora', 'url': 'https://www.track-ora.com' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'How is customs duty calculated?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'Customs duty is calculated as a percentage of the CIF value (Cost + Insurance + Freight) of the imported goods. The duty rate depends on the product category (HS code) and the importing country. For example, the UAE charges 5% import duty on most goods.' },
          },
          {
            '@type': 'Question',
            'name': 'What is CIF value for customs purposes?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'CIF stands for Cost, Insurance, and Freight. It is the total value of goods including the purchase price, insurance premium, and freight charges to the port of entry. Most countries use CIF as the customs valuation basis.' },
          },
          {
            '@type': 'Question',
            'name': 'Does the UAE charge VAT on imports?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes. The UAE charges 5% VAT on most imported goods. This is applied on top of the import duty. Medical devices and most food items are exempt from both import duty and VAT.' },
          },
          {
            '@type': 'Question',
            'name': 'Which countries are covered by the customs duty calculator?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'The calculator covers 15 countries: UAE, Saudi Arabia, Bahrain, Kuwait, Qatar, Oman, Germany (EU proxy), USA, UK, Lebanon, India, Australia, Canada, Turkey, and Singapore.' },
          },
        ],
      },
    ],
  })

  const isMobile = useIsMobile()

  const [importCountry, setImportCountry] = useState('')
  const [exportCountry, setExportCountry] = useState('')
  const [category, setCategory] = useState<CustomsCategory | ''>('')
  const [cifValue, setCifValue] = useState('')
  const [includeVat, setIncludeVat] = useState(true)
  const [result, setResult] = useState<{
    duty: number; vat: number; total: number; dutyPct: number; vatPct: number; notes?: string
  } | null>(null)

  function handleCalc() {
    if (!importCountry || !category || !cifValue) return
    const rate = DUTY_RATES[importCountry]?.[category as CustomsCategory]
    if (!rate) return
    const cif = parseFloat(cifValue)
    if (isNaN(cif) || cif <= 0) return
    const duty = Math.round(cif * rate.dutyPct / 100 * 100) / 100
    const vatBase = cif + duty
    const vat = includeVat ? Math.round(vatBase * rate.vatPct / 100 * 100) / 100 : 0
    const total = Math.round((cif + duty + vat) * 100) / 100
    setResult({ duty, vat, total, dutyPct: rate.dutyPct, vatPct: rate.vatPct, notes: rate.notes })
  }

  const faqs = [
    {
      q: 'Which countries does this calculator cover?',
      a: 'This tool covers 15 import destinations: United Arab Emirates (UAE), Saudi Arabia, Bahrain, Kuwait, Qatar, Oman, European Union (Germany as proxy), United States (USA), United Kingdom (UK), Lebanon, India, Australia, Canada, Turkey, and Singapore.',
    },
    {
      q: 'Is VAT included in customs duties?',
      a: 'No — import duty and VAT/GST are separate charges. Import duty is calculated on the CIF value. VAT is typically calculated on the CIF value plus the import duty. Some countries (e.g. Kuwait, Qatar) have no VAT. You can toggle VAT off in the calculator if your shipment is VAT-exempt.',
    },
    {
      q: 'Why do my actual duties differ from this estimate?',
      a: 'This calculator uses standard indicative tariff rates per product category. Actual duties depend on the specific HS (Harmonized System) code, country of origin, applicable trade agreements (e.g. FTAs), anti-dumping duties, and any special levies. Always consult a licensed customs broker for a binding duty determination.',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1020px', margin: '0 auto', padding: isMobile ? '40px 20px' : '60px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ ...BADGE_STYLE, margin: '0 auto 16px' }}>
            <Calculator size={12} />
            Free Customs Calculator
          </div>
          <h1 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 800, color: '#f8fafc', margin: '0 0 16px' }}>
            Customs Duty Calculator
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(248,250,252,0.6)', maxWidth: '560px', margin: '0 auto' }}>
            Estimate import duties, VAT and total landed cost for 15 countries across 20 product categories.
          </p>
        </div>

        <AdUnit slot="5988077434" style={{ marginBottom: '32px' }} />

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '380px 1fr',
          gap: '24px',
          alignItems: 'start',
        }}>
          {/* Form */}
          <div style={CARD_STYLE}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', margin: '0 0 20px' }}>
              Enter Shipment Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Import Country */}
              <div>
                <label style={LABEL_STYLE}>Import Country (Destination)</label>
                <select
                  value={importCountry}
                  onChange={e => setImportCountry(e.target.value)}
                  style={INPUT_STYLE}
                >
                  <option value="">Select country...</option>
                  {SUPPORTED_IMPORT_COUNTRIES.map(c => (
                    <option key={c.iso} value={c.iso}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Export Country */}
              <div>
                <label style={LABEL_STYLE}>Export Country (Origin, optional)</label>
                <select
                  value={exportCountry}
                  onChange={e => setExportCountry(e.target.value)}
                  style={INPUT_STYLE}
                >
                  <option value="">Select country...</option>
                  {COUNTRIES.map(c => (
                    <option key={c.iso} value={c.iso}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Product Category */}
              <div>
                <label style={LABEL_STYLE}>Product Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as CustomsCategory | '')}
                  style={INPUT_STYLE}
                >
                  <option value="">Select category...</option>
                  {(Object.entries(CATEGORY_LABELS) as [CustomsCategory, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* CIF Value */}
              <div>
                <label style={LABEL_STYLE}>CIF Value (USD)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 10000"
                  value={cifValue}
                  onChange={e => setCifValue(e.target.value)}
                  style={INPUT_STYLE}
                />
                <p style={{ fontSize: '11px', color: 'rgba(248,250,252,0.35)', margin: '6px 0 0' }}>
                  Cost + Insurance + Freight
                </p>
              </div>

              {/* VAT Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ ...LABEL_STYLE, margin: 0 }}>Include VAT / GST</label>
                <button
                  onClick={() => setIncludeVat(v => !v)}
                  style={{
                    width: '48px',
                    height: '26px',
                    borderRadius: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    background: includeVat ? '#6366f1' : 'rgba(255,255,255,0.1)',
                    position: 'relative',
                    transition: 'background 0.2s',
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    top: '3px',
                    left: includeVat ? '24px' : '3px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left 0.2s',
                  }} />
                </button>
              </div>

              {/* Calculate */}
              <button
                onClick={handleCalc}
                style={{
                  background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Calculate Duties
              </button>
            </div>
          </div>

          {/* Result */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {result ? (
              <div style={CARD_STYLE}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <CheckCircle size={20} color="#22c55e" />
                  <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    Estimated Duty Breakdown
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'CIF Value', value: `$${fmt(parseFloat(cifValue))}` },
                    { label: `Import Duty (${result.dutyPct}%)`, value: `$${fmt(result.duty)}` },
                    ...(includeVat && result.vatPct > 0
                      ? [{ label: `VAT / GST (${result.vatPct}%)`, value: `$${fmt(result.vat)}` }]
                      : []),
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: 'rgba(248,250,252,0.65)' }}>{row.label}</span>
                      <span style={{ fontSize: '14px', color: '#f8fafc', fontWeight: 600 }}>{row.value}</span>
                    </div>
                  ))}

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>Total Landed Cost</span>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: '#22d3ee' }}>${fmt(result.total)}</span>
                  </div>
                </div>

                {result.notes && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px 14px',
                    background: 'rgba(251,191,36,0.08)',
                    border: '1px solid rgba(251,191,36,0.2)',
                    borderRadius: '10px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                  }}>
                    <AlertCircle size={16} color="#fbbf24" style={{ flexShrink: 0, marginTop: '1px' }} />
                    <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.7)', margin: 0 }}>{result.notes}</p>
                  </div>
                )}

                <p style={{ fontSize: '11px', color: 'rgba(248,250,252,0.35)', marginTop: '16px', lineHeight: 1.6 }}>
                  These are indicative estimates based on standard tariff rates. Actual duties may vary. Consult a licensed customs broker for binding advice.
                </p>

                <div style={{ marginTop: '12px' }}>
                  <a href="/rates" style={{ fontSize: '13px', color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>
                    Calculate freight cost →
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ ...CARD_STYLE, textAlign: 'center', color: 'rgba(248,250,252,0.4)' }}>
                <Package size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p style={{ fontSize: '14px', margin: 0 }}>Fill in the form and click Calculate to see your duty estimate.</p>
              </div>
            )}

            {/* CIF Explainer */}
            <div style={CARD_STYLE}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', margin: '0 0 10px' }}>
                What is CIF Value?
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.6)', margin: 0, lineHeight: 1.7 }}>
                <strong style={{ color: '#f8fafc' }}>CIF</strong> stands for <strong style={{ color: '#f8fafc' }}>Cost + Insurance + Freight</strong> — the total value of your goods including the price you paid, any insurance, and the shipping cost to the port of entry. Most countries use CIF as the basis for calculating customs duties.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: '48px' }}>
          <div style={{ ...BADGE_STYLE }}>FAQ</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#f8fafc', margin: '0 0 24px' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map(faq => (
              <div key={faq.q} style={CARD_STYLE}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', margin: '0 0 10px' }}>{faq.q}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.65)', margin: 0, lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <AdUnit slot="5988077434" style={{ marginTop: '48px' }} />
      </div>
    </div>
  )
}
