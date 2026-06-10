import { useState, useMemo } from 'react'
import { TrendingUp, Plus, X, DollarSign } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'
import AdUnit from '../components/ui/AdUnit'

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

type FreightMode = 'Air' | 'Sea' | 'Express' | 'Road'
type Currency = 'USD' | 'EUR' | 'AED' | 'GBP'

interface CostItem {
  id: number
  label: string
  amount: string
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  AED: 'AED ',
  GBP: '£',
}

const MODE_ICONS: Record<FreightMode, string> = {
  Air: '✈',
  Sea: '🚢',
  Express: '📦',
  Road: '🚛',
}

let nextId = 1

function fmt(n: number, sym: string) {
  if (n === 0) return `${sym}0.00`
  return `${sym}${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function ProfitCalc() {
  useSEO({
    title: 'Freight Profit Margin Calculator — Logistics Profitability Tool | Trackora',
    description: 'Calculate your freight profit margin instantly. Enter buy rate, sell rate and additional costs to see gross profit, margin %, and cost breakdown. Free tool for freight forwarders.',
    canonical: 'https://www.track-ora.com/profit-calculator',
  })

  const isMobile = useIsMobile()

  const [mode, setMode] = useState<FreightMode>('Air')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [buyRate, setBuyRate] = useState('')
  const [sellRate, setSellRate] = useState('')
  const [extraCosts, setExtraCosts] = useState<CostItem[]>([])

  const sym = CURRENCY_SYMBOLS[currency]

  const calc = useMemo(() => {
    const buy = parseFloat(buyRate) || 0
    const sell = parseFloat(sellRate) || 0
    const extras = extraCosts.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)
    const totalCost = buy + extras
    const grossProfit = sell - totalCost
    const margin = sell > 0 ? (grossProfit / sell) * 100 : 0
    return { buy, sell, extras, totalCost, grossProfit, margin }
  }, [buyRate, sellRate, extraCosts])

  function addCost() {
    setExtraCosts(prev => [...prev, { id: nextId++, label: '', amount: '' }])
  }

  function removeCost(id: number) {
    setExtraCosts(prev => prev.filter(c => c.id !== id))
  }

  function updateCost(id: number, field: 'label' | 'amount', val: string) {
    setExtraCosts(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c))
  }

  const marginColor = calc.margin >= 20 ? '#22c55e' : calc.margin >= 10 ? '#f59e0b' : '#f87171'
  const profitColor = calc.grossProfit >= 0 ? '#22c55e' : '#f87171'

  function marginBadge() {
    if (calc.grossProfit < 0) return { text: 'Operating at a Loss', color: '#f87171', bg: 'rgba(248,113,113,0.08)' }
    if (calc.margin < 10) return { text: 'Very Low Margin ⚠', color: '#f87171', bg: 'rgba(248,113,113,0.08)' }
    if (calc.margin < 20) return { text: 'Low Margin — consider reviewing costs', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' }
    return { text: 'Healthy Margin ✓', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' }
  }

  const badge = marginBadge()
  const barCostPct = calc.sell > 0 ? Math.min(100, (calc.totalCost / calc.sell) * 100) : 100
  const barProfitPct = calc.sell > 0 ? Math.max(0, ((calc.grossProfit) / calc.sell) * 100) : 0

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1020px', margin: '0 auto', padding: isMobile ? '40px 20px' : '60px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ ...BADGE_STYLE, margin: '0 auto 16px' }}>
            <TrendingUp size={12} />
            Free Margin Calculator
          </div>
          <h1 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 800, color: '#f8fafc', margin: '0 0 16px' }}>
            Freight Profit Margin Calculator
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(248,250,252,0.6)', maxWidth: '560px', margin: '0 auto' }}>
            Instantly calculate gross profit, margin percentage and cost breakdown for any freight shipment.
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
              Shipment Details
            </h2>

            {/* Mode selector */}
            <div style={{ marginBottom: '16px' }}>
              <label style={LABEL_STYLE}>Freight Mode</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(['Air', 'Sea', 'Express', 'Road'] as FreightMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '20px',
                      border: mode === m ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                      background: mode === m ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                      color: mode === m ? '#818cf8' : 'rgba(248,250,252,0.6)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {MODE_ICONS[m]} {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={LABEL_STYLE}>Currency</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['USD', 'EUR', 'AED', 'GBP'] as Currency[]).map(c => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: currency === c ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
                      background: currency === c ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                      color: currency === c ? '#818cf8' : 'rgba(248,250,252,0.6)',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Sell Rate */}
              <div>
                <label style={LABEL_STYLE}>Sell Rate (Revenue)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(248,250,252,0.4)', fontSize: '14px' }}>
                    {sym}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={sellRate}
                    onChange={e => setSellRate(e.target.value)}
                    style={{ ...INPUT_STYLE, paddingLeft: currency === 'AED' ? '44px' : '24px' }}
                  />
                </div>
              </div>

              {/* Buy Rate */}
              <div>
                <label style={LABEL_STYLE}>Buy Rate (Cost to Carrier)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(248,250,252,0.4)', fontSize: '14px' }}>
                    {sym}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={buyRate}
                    onChange={e => setBuyRate(e.target.value)}
                    style={{ ...INPUT_STYLE, paddingLeft: currency === 'AED' ? '44px' : '24px' }}
                  />
                </div>
              </div>

              {/* Extra Costs */}
              <div>
                <label style={LABEL_STYLE}>Additional Costs</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {extraCosts.map(cost => (
                    <div key={cost.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Label (e.g. Customs Fees)"
                        value={cost.label}
                        onChange={e => updateCost(cost.id, 'label', e.target.value)}
                        style={{ ...INPUT_STYLE, flex: 2 }}
                      />
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="Amount"
                        value={cost.amount}
                        onChange={e => updateCost(cost.id, 'amount', e.target.value)}
                        style={{ ...INPUT_STYLE, flex: 1 }}
                      />
                      <button
                        onClick={() => removeCost(cost.id)}
                        style={{
                          background: 'rgba(248,113,113,0.1)',
                          border: '1px solid rgba(248,113,113,0.2)',
                          borderRadius: '8px',
                          width: '34px',
                          height: '34px',
                          cursor: 'pointer',
                          color: '#f87171',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addCost}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px dashed rgba(255,255,255,0.15)',
                      background: 'transparent',
                      color: 'rgba(248,250,252,0.5)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <Plus size={14} /> Add cost item
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results panel — live, no button needed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 4 metric cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { label: 'Revenue', value: fmt(calc.sell, sym), color: '#f8fafc' },
                { label: 'Total Costs', value: fmt(calc.totalCost, sym), color: '#f8fafc' },
                { label: 'Gross Profit', value: (calc.grossProfit < 0 ? `-${fmt(Math.abs(calc.grossProfit), sym)}` : fmt(calc.grossProfit, sym)), color: profitColor },
                { label: 'Margin %', value: `${calc.margin.toFixed(1)}%`, color: marginColor },
              ].map(metric => (
                <div key={metric.label} style={{
                  ...CARD_STYLE,
                  padding: '16px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '11px', color: 'rgba(248,250,252,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    {metric.label}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: metric.color }}>
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Profit bar */}
            <div style={CARD_STYLE}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)' }}>Cost</span>
                <span style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)' }}>Profit</span>
              </div>
              <div style={{ position: 'relative', height: '28px', borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.06)' }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${barCostPct}%`,
                  background: calc.grossProfit < 0 ? '#f87171' : 'rgba(248,113,113,0.6)',
                  transition: 'width 0.3s',
                }} />
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  height: '100%',
                  width: `${barProfitPct}%`,
                  background: '#22c55e',
                  transition: 'width 0.3s',
                }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#f8fafc',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                }}>
                  {calc.margin.toFixed(1)}% margin
                </div>
              </div>

              {/* Margin status badge */}
              <div style={{
                marginTop: '14px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: badge.bg,
                color: badge.color,
                fontSize: '13px',
                fontWeight: 600,
                textAlign: 'center',
              }}>
                {badge.text}
              </div>
            </div>

            {/* Cost breakdown */}
            <div style={CARD_STYLE}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={14} color="#818cf8" /> Cost Breakdown
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'rgba(248,250,252,0.6)' }}>Buy Rate ({mode})</span>
                  <span style={{ color: '#f8fafc', fontWeight: 600 }}>{fmt(calc.buy, sym)}</span>
                </div>
                {extraCosts.map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'rgba(248,250,252,0.6)' }}>{c.label || 'Additional Cost'}</span>
                    <span style={{ color: '#f8fafc', fontWeight: 600 }}>{fmt(parseFloat(c.amount) || 0, sym)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#f8fafc', fontWeight: 700 }}>Total Costs</span>
                  <span style={{ color: '#f8fafc', fontWeight: 700 }}>{fmt(calc.totalCost, sym)}</span>
                </div>
              </div>
            </div>

            {/* Industry norms explainer */}
            <div style={CARD_STYLE}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={14} color="#22c55e" /> What is a Healthy Freight Margin?
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.6)', margin: 0, lineHeight: 1.7 }}>
                Industry norms for freight forwarders vary by mode. <strong style={{ color: '#f8fafc' }}>Air freight</strong> typically targets 20–35% gross margin. <strong style={{ color: '#f8fafc' }}>Express couriers</strong> (DHL, FedEx) can exceed 30%. <strong style={{ color: '#f8fafc' }}>Sea freight</strong> (LCL/FCL) commonly runs 15–25%. <strong style={{ color: '#f8fafc' }}>Road freight</strong> is often tighter at 10–20%. Margins below 10% leave little room for error and should prompt a cost review.
              </p>
            </div>
          </div>
        </div>

        {/* Also useful */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.5)', marginBottom: '12px' }}>Also useful:</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/customs-duty" style={{ fontSize: '13px', color: '#818cf8', textDecoration: 'none', fontWeight: 600, padding: '8px 16px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px' }}>
              Customs Duty Calculator →
            </a>
            <a href="/rates" style={{ fontSize: '13px', color: '#818cf8', textDecoration: 'none', fontWeight: 600, padding: '8px 16px', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px' }}>
              Freight Rate Calculator →
            </a>
          </div>
        </div>

        <AdUnit slot="5988077434" style={{ marginTop: '48px' }} />
      </div>
    </div>
  )
}
