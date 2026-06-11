import { useState, useMemo } from 'react'
import { Ship, AlertTriangle, Clock, Calculator } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'
import AdUnit from '../components/ui/AdUnit'
import {
  DETENTION_RATES,
  CARRIER_LABELS,
  CONTAINER_LABELS,
  REGION_LABELS,
  type DetentionCarrier,
  type DetentionRegion,
  type ContainerType,
} from '../data/detentionRates'

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

export default function DetentionCalc() {
  useSEO({
    title: 'Container Detention Calculator — Demurrage & Detention Costs | Trackora',
    description: 'Calculate container detention and demurrage charges for Maersk, MSC, CMA CGM, Hapag-Lloyd, COSCO, Evergreen, ONE, Yang Ming and ZIM. Free tool for freight forwarders and importers.',
    canonical: 'https://www.track-ora.com/detention-calculator',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'Container Detention Calculator',
        'applicationCategory': 'BusinessApplication',
        'url': 'https://www.track-ora.com/detention-calculator',
        'description': 'Calculate container detention and demurrage charges by shipping line, container type, and region. Covers Maersk, MSC, CMA CGM, Hapag-Lloyd, COSCO, Evergreen, ONE, Yang Ming and ZIM.',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'featureList': ['9 major shipping lines', '5 container types', '6 global regions', 'Tiered daily rate calculation', 'Free days tracking'],
        'publisher': { '@type': 'Organization', 'name': 'Trackora', 'url': 'https://www.track-ora.com' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'What is container detention?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'Container detention is a charge levied by shipping lines when a container (full or empty) is kept by the shipper/consignee outside the port or depot beyond the agreed free days. It applies to containers that have been picked up from the terminal but not yet returned.' },
          },
          {
            '@type': 'Question',
            'name': 'What is the difference between demurrage and detention?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'Demurrage is charged when a full container sits inside the terminal beyond the free days. Detention applies outside the terminal — when the container has been picked up but not yet returned empty. Both have tiered daily rates that increase the longer the container is held.' },
          },
          {
            '@type': 'Question',
            'name': 'How many free days do shipping lines typically give?',
            'acceptedAnswer': { '@type': 'Answer', 'text': 'Free days vary by carrier and region. Maersk typically gives 4-7 free days depending on the trade lane. ZIM tends to give fewer free days (3-5) while carriers like COSCO and Evergreen often give 5-6. Free days can also be negotiated in volume contracts.' },
          },
        ],
      },
    ],
  })

  const isMobile = useIsMobile()

  const [carrier, setCarrier] = useState<DetentionCarrier | ''>('')
  const [containerType, setContainerType] = useState<ContainerType | ''>('')
  const [region, setRegion] = useState<DetentionRegion | ''>('')
  const [actualDays, setActualDays] = useState('')
  const [numContainers, setNumContainers] = useState('1')
  const [customFreeDays, setCustomFreeDays] = useState<string>('')
  const [calculated, setCalculated] = useState(false)

  const standardRate = useMemo(() => {
    if (!carrier || !region || !containerType) return null
    return DETENTION_RATES[carrier as DetentionCarrier]?.[region as DetentionRegion]?.[containerType as ContainerType] ?? null
  }, [carrier, region, containerType])

  const effectiveFreeDays = useMemo(() => {
    if (customFreeDays !== '') {
      const parsed = parseInt(customFreeDays)
      if (!isNaN(parsed) && parsed >= 0) return parsed
    }
    return standardRate?.freeDays ?? 5
  }, [customFreeDays, standardRate])

  const calcResult = useMemo(() => {
    if (!calculated || !actualDays || !standardRate) return null
    const days = parseInt(actualDays)
    if (isNaN(days) || days <= 0) return null

    const excessDays = Math.max(0, days - effectiveFreeDays)

    if (excessDays === 0) {
      return { noCharge: true, excessDays: 0, breakdown: [], totalPerContainer: 0, grandTotal: 0 }
    }

    let remainingExcess = excessDays
    let totalPerContainer = 0
    const breakdown: { range: string; days: number; rate: number; subtotal: number }[] = []
    let daysCounted = effectiveFreeDays

    for (const tier of standardRate.tiers) {
      const tierEnd = tier.upToDay === Infinity ? days : tier.upToDay
      const tierDays = Math.min(remainingExcess, tierEnd - daysCounted)
      if (tierDays > 0) {
        breakdown.push({
          range: `Days ${daysCounted + 1}–${daysCounted + tierDays}`,
          days: tierDays,
          rate: tier.dailyRateUSD,
          subtotal: tierDays * tier.dailyRateUSD,
        })
        totalPerContainer += tierDays * tier.dailyRateUSD
        daysCounted += tierDays
        remainingExcess -= tierDays
      }
      if (remainingExcess <= 0) break
    }

    const containers = parseInt(numContainers) || 1
    const grandTotal = totalPerContainer * containers

    return { noCharge: false, excessDays, breakdown, totalPerContainer, grandTotal }
  }, [calculated, actualDays, standardRate, effectiveFreeDays, numContainers])

  function handleCalc() {
    setCalculated(true)
  }

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1020px', margin: '0 auto', padding: isMobile ? '24px 20px' : '40px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ ...BADGE_STYLE, margin: '0 auto 16px' }}>
            <Ship size={12} />
            Free Detention Calculator
          </div>
          <h1 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 800, color: '#f8fafc', margin: '0 0 16px' }}>
            Container Detention Calculator
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(248,250,252,0.6)', maxWidth: '560px', margin: '0 auto' }}>
            Calculate detention and demurrage charges by shipping line, container type and region.
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
              Enter Container Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Carrier */}
              <div>
                <label style={LABEL_STYLE}>Shipping Line</label>
                <select
                  value={carrier}
                  onChange={e => { setCarrier(e.target.value as DetentionCarrier | ''); setCustomFreeDays(''); setCalculated(false) }}
                  style={INPUT_STYLE}
                >
                  <option value="">Select carrier...</option>
                  {(Object.entries(CARRIER_LABELS) as [DetentionCarrier, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Container Type */}
              <div>
                <label style={LABEL_STYLE}>Container Type</label>
                <select
                  value={containerType}
                  onChange={e => { setContainerType(e.target.value as ContainerType | ''); setCustomFreeDays(''); setCalculated(false) }}
                  style={INPUT_STYLE}
                >
                  <option value="">Select type...</option>
                  {(Object.entries(CONTAINER_LABELS) as [ContainerType, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Region */}
              <div>
                <label style={LABEL_STYLE}>Region / Port</label>
                <select
                  value={region}
                  onChange={e => { setRegion(e.target.value as DetentionRegion | ''); setCustomFreeDays(''); setCalculated(false) }}
                  style={INPUT_STYLE}
                >
                  <option value="">Select region...</option>
                  {(Object.entries(REGION_LABELS) as [DetentionRegion, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Free Days */}
              <div>
                <label style={LABEL_STYLE}>
                  Free Days
                  {standardRate && customFreeDays === '' && (
                    <span style={{ color: '#818cf8', marginLeft: '6px' }}>
                      (standard: {standardRate.freeDays})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder={standardRate ? String(standardRate.freeDays) : 'e.g. 5'}
                  value={customFreeDays}
                  onChange={e => setCustomFreeDays(e.target.value)}
                  style={INPUT_STYLE}
                />
              </div>

              {/* Actual Days */}
              <div>
                <label style={LABEL_STYLE}>Actual Days at Port / Yard</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 12"
                  value={actualDays}
                  onChange={e => { setActualDays(e.target.value); setCalculated(false) }}
                  style={INPUT_STYLE}
                />
              </div>

              {/* Num Containers */}
              <div>
                <label style={LABEL_STYLE}>Number of Containers</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={numContainers}
                  onChange={e => { setNumContainers(e.target.value); setCalculated(false) }}
                  style={INPUT_STYLE}
                />
              </div>

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
                Calculate Detention
              </button>
            </div>
          </div>

          {/* Result */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {calcResult ? (
              <div style={CARD_STYLE}>
                {calcResult.noCharge ? (
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ color: '#22c55e', marginBottom: '12px' }}>
                      <Clock size={40} style={{ margin: '0 auto' }} />
                    </div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e', margin: '0 0 8px' }}>
                      No Detention Charges
                    </h2>
                    <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.6)', margin: 0 }}>
                      Container is within the {effectiveFreeDays}-day free period. No detention fees apply.
                    </p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                      <AlertTriangle size={20} color="#f59e0b" />
                      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                        Detention Charge Estimate
                      </h2>
                    </div>

                    <div style={{
                      padding: '12px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '10px',
                      marginBottom: '16px',
                      fontSize: '13px',
                      color: 'rgba(248,250,252,0.65)',
                    }}>
                      {calcResult.excessDays} excess day{calcResult.excessDays !== 1 ? 's' : ''} × {parseInt(numContainers) || 1} container{(parseInt(numContainers) || 1) > 1 ? 's' : ''}
                    </div>

                    {/* Breakdown table */}
                    <div style={{ overflowX: 'auto', marginBottom: '16px' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr>
                            {['Day Range', 'Days', 'Daily Rate', 'Subtotal'].map(h => (
                              <th key={h} style={{
                                textAlign: 'left',
                                padding: '8px 10px',
                                color: 'rgba(248,250,252,0.45)',
                                fontWeight: 600,
                                fontSize: '11px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                borderBottom: '1px solid rgba(255,255,255,0.07)',
                              }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {calcResult.breakdown.map((row, i) => (
                            <tr key={i}>
                              <td style={{ padding: '10px 10px', color: '#f8fafc' }}>{row.range}</td>
                              <td style={{ padding: '10px 10px', color: 'rgba(248,250,252,0.7)' }}>{row.days}</td>
                              <td style={{ padding: '10px 10px', color: 'rgba(248,250,252,0.7)' }}>${row.rate}/day</td>
                              <td style={{ padding: '10px 10px', color: '#f8fafc', fontWeight: 600 }}>${fmt(row.subtotal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {(parseInt(numContainers) || 1) > 1 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', color: 'rgba(248,250,252,0.65)' }}>Per Container</span>
                        <span style={{ fontSize: '14px', color: '#f8fafc', fontWeight: 600 }}>${fmt(calcResult.totalPerContainer)}</span>
                      </div>
                    )}

                    <div style={{
                      borderTop: '1px solid rgba(255,255,255,0.08)',
                      paddingTop: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>Grand Total</span>
                      <span style={{ fontSize: '24px', fontWeight: 800, color: '#f87171' }}>${fmt(calcResult.grandTotal)}</span>
                    </div>
                  </>
                )}

                <p style={{ fontSize: '11px', color: 'rgba(248,250,252,0.35)', marginTop: '16px', lineHeight: 1.6 }}>
                  Rates are indicative. Actual charges depend on your carrier contract, port, and terminal operator. Contact your shipping line for official rates.
                </p>

                <div style={{ marginTop: '8px' }}>
                  <a href="/track/container" style={{ fontSize: '13px', color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>
                    Track your container →
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ ...CARD_STYLE, textAlign: 'center', color: 'rgba(248,250,252,0.4)' }}>
                <Calculator size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p style={{ fontSize: '14px', margin: 0 }}>Select carrier, container type and region, then click Calculate.</p>
              </div>
            )}

            {/* Explainer */}
            <div style={CARD_STYLE}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', margin: '0 0 10px' }}>
                Detention vs Demurrage
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.6)', margin: 0, lineHeight: 1.7 }}>
                <strong style={{ color: '#f8fafc' }}>Demurrage</strong> is charged when a container sits at the port/terminal beyond the free period (before customs clearance). <strong style={{ color: '#f8fafc' }}>Detention</strong> is charged when a container is kept outside the terminal (e.g. at your warehouse) beyond the free period. This calculator estimates <em>detention</em> charges. Demurrage tariffs are set by the port authority and vary by terminal.
              </p>
            </div>
          </div>
        </div>

        <AdUnit slot="5988077434" style={{ marginTop: '48px' }} />
      </div>
    </div>
  )
}
