import { Link } from 'react-router-dom'
import { Calculator, Package, Clock, TrendingUp, FileText } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'

interface ToolCard {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  badge: 'Free' | 'Pro'
}

const TOOLS: ToolCard[] = [
  {
    icon: <Calculator size={26} color="#818cf8" />,
    title: 'Freight Rate Calculator',
    description: 'Compare air and express courier rates across top carriers',
    href: '/rates',
    badge: 'Free',
  },
  {
    icon: <Package size={26} color="#818cf8" />,
    title: 'Customs Duty Estimator',
    description: 'Estimate import duties and VAT for 15 countries',
    href: '/customs-duty',
    badge: 'Free',
  },
  {
    icon: <Clock size={26} color="#818cf8" />,
    title: 'Detention Calculator',
    description: 'Calculate container detention charges by carrier and region',
    href: '/detention-calculator',
    badge: 'Free',
  },
  {
    icon: <TrendingUp size={26} color="#818cf8" />,
    title: 'Profit Calculator',
    description: 'Calculate freight profit margins and cost breakdowns',
    href: '/profit-calculator',
    badge: 'Free',
  },
  {
    icon: <FileText size={26} color="#22d3ee" />,
    title: 'Document Generator',
    description: 'Generate commercial invoices, packing lists, and shipping instructions',
    href: '/document-generator',
    badge: 'Pro',
  },
]

export default function Tools() {
  useSEO({
    title: 'Free & Pro Logistics Tools — Rate Calculator, Duty Estimator & More | Trackora',
    description: 'Access free and pro logistics tools: freight rate calculator, customs duty estimator, detention calculator, profit calculator, and document generator.',
    canonical: 'https://www.track-ora.com/tools',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Trackora Logistics Tools',
      'description': 'Free and pro logistics tools for freight forwarders, importers, and logistics professionals.',
      'url': 'https://www.track-ora.com/tools',
      'numberOfItems': 5,
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Freight Rate Calculator', 'url': 'https://www.track-ora.com/rates', 'description': 'Compare air and express courier rates across top carriers' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Customs Duty Estimator', 'url': 'https://www.track-ora.com/customs-duty', 'description': 'Estimate import duties and VAT for 15 countries' },
        { '@type': 'ListItem', 'position': 3, 'name': 'Container Detention Calculator', 'url': 'https://www.track-ora.com/detention-calculator', 'description': 'Calculate container detention charges by carrier and region' },
        { '@type': 'ListItem', 'position': 4, 'name': 'Freight Profit Calculator', 'url': 'https://www.track-ora.com/profit-calculator', 'description': 'Calculate freight profit margins and cost breakdowns' },
        { '@type': 'ListItem', 'position': 5, 'name': 'Logistics Document Generator', 'url': 'https://www.track-ora.com/document-generator', 'description': 'Generate commercial invoices, packing lists, and shipping instructions' },
      ],
    },
  })

  return (
    <div style={{ background: '#0a0f1e', color: '#f8fafc', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section style={{
        padding: '100px 24px 72px',
        background: 'linear-gradient(180deg, rgba(99,102,241,0.08) 0%, transparent 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-block', marginBottom: '20px',
            padding: '6px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
            letterSpacing: '1.2px', textTransform: 'uppercase',
            background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8',
          }}>
            Logistics Tools
          </span>

          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, lineHeight: 1.15, marginBottom: '18px' }}>
            Free &amp; Pro Logistics Tools
          </h1>

          <p style={{ fontSize: '18px', color: 'rgba(248,250,252,0.6)', lineHeight: 1.7 }}>
            Calculate costs, estimate duties, and generate documents — all in one place.
          </p>
        </div>
      </section>

      {/* ── Tool cards ── */}
      <section style={{ padding: '64px 24px 80px', maxWidth: '1120px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {TOOLS.map(tool => (
            <div key={tool.href} style={{
              padding: '28px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', flexDirection: 'column', gap: '14px',
            }}>
              {/* Icon + badge row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  background: tool.badge === 'Pro' ? 'rgba(34,211,238,0.08)' : 'rgba(99,102,241,0.1)',
                  border: `1px solid ${tool.badge === 'Pro' ? 'rgba(34,211,238,0.2)' : 'rgba(99,102,241,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {tool.icon}
                </div>
                <span style={{
                  padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.6px', textTransform: 'uppercase',
                  background: tool.badge === 'Pro' ? 'rgba(34,211,238,0.12)' : 'rgba(99,102,241,0.12)',
                  color: tool.badge === 'Pro' ? '#22d3ee' : '#818cf8',
                }}>
                  {tool.badge}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                  {tool.title}
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.65 }}>
                  {tool.description}
                </p>
              </div>

              <div style={{ marginTop: 'auto' }}>
                <Link to={tool.href} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                  background: tool.badge === 'Pro'
                    ? 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(34,211,238,0.08))'
                    : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  border: tool.badge === 'Pro' ? '1px solid rgba(34,211,238,0.3)' : 'none',
                  color: tool.badge === 'Pro' ? '#22d3ee' : 'white',
                  textDecoration: 'none',
                  boxShadow: tool.badge === 'Pro' ? 'none' : '0 4px 14px rgba(99,102,241,0.3)',
                }}>
                  Open Tool →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
