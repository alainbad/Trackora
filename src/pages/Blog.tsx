import { Link } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'
import { BLOG_POSTS } from '../data/blogPosts'
import AdUnit from '../components/ui/AdUnit'

export default function Blog() {
  useSEO({
    title: 'Trackora Blog — Freight Tracking Guides & Logistics Tips',
    description: 'In-depth guides on sea freight, air freight, and express courier tracking. Learn about container numbers, MAWBs, bills of lading, and more.',
    canonical: 'https://www.track-ora.com/blog',
  })

  const isMobile = useIsMobile()

  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: isMobile ? '40px 20px' : '60px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '56px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px', borderRadius: '100px', marginBottom: '16px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            fontSize: '11px', color: '#818cf8', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            Resources
          </div>
          <h1 style={{ fontSize: isMobile ? '28px' : '44px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-1.5px', marginBottom: '14px', lineHeight: 1.1 }}>
            Freight Tracking Guides
          </h1>
          <p style={{ fontSize: isMobile ? '15px' : '18px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto' }}>
            Practical guides on container numbers, air waybills, bills of lading, and how to track any shipment worldwide.
          </p>
        </div>

        {/* Post grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {BLOG_POSTS.map(post => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <article style={{
                padding: isMobile ? '22px' : '30px',
                borderRadius: '18px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                transition: 'border-color 0.2s, background 0.2s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.35)'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.05)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(248,250,252,0.35)' }}>{post.date}</span>
                  <span style={{ color: 'rgba(248,250,252,0.2)' }}>·</span>
                  <span style={{ fontSize: '12px', color: 'rgba(248,250,252,0.35)' }}>{post.readTime}</span>
                </div>
                <h2 style={{ fontSize: isMobile ? '17px' : '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '10px', lineHeight: 1.3 }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.55)', lineHeight: 1.7, margin: '0 0 14px' }}>
                  {post.excerpt}
                </p>
                <span style={{ fontSize: '13px', color: '#818cf8', fontWeight: 600 }}>
                  Read article →
                </span>
              </article>
            </Link>
          ))}
        </div>

        <AdUnit slot="5988077434" style={{ marginTop: '48px' }} />
      </div>
    </div>
  )
}
