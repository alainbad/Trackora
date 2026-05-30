import { useParams, Link, Navigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'
import { BLOG_POSTS } from '../data/blogPosts'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const isMobile = useIsMobile()

  const post = BLOG_POSTS.find(p => p.slug === slug)
  if (!post) return <Navigate to="/blog" replace />

  useSEO({
    title: post.seo.title,
    description: post.seo.description,
    canonical: `https://www.track-ora.com/blog/${post.slug}`,
  })

  const otherPosts = BLOG_POSTS.filter(p => p.slug !== slug)

  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: isMobile ? '40px 20px' : '60px 24px' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '32px' }}>
          <Link to="/blog" style={{ fontSize: '13px', color: '#818cf8', textDecoration: 'none', fontWeight: 600 }}>
            ← Back to Blog
          </Link>
        </div>

        {/* Header */}
        <header style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(248,250,252,0.4)' }}>{post.date}</span>
            <span style={{ color: 'rgba(248,250,252,0.2)' }}>·</span>
            <span style={{ fontSize: '13px', color: 'rgba(248,250,252,0.4)' }}>{post.readTime}</span>
          </div>
          <h1 style={{
            fontSize: isMobile ? '26px' : '40px', fontWeight: 800, color: '#f8fafc',
            letterSpacing: '-1.2px', lineHeight: 1.15, marginBottom: '0',
          }}>
            {post.title}
          </h1>
        </header>

        {/* Article body */}
        <article>
          {post.sections.map((section, i) => (
            <div key={i} style={{ marginBottom: '28px' }}>
              {section.heading && (
                <h2 style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px', letterSpacing: '-0.4px' }}>
                  {section.heading}
                </h2>
              )}
              <p style={{ fontSize: isMobile ? '15px' : '17px', color: 'rgba(248,250,252,0.7)', lineHeight: 1.8, margin: 0 }}>
                {section.body}
              </p>
            </div>
          ))}
        </article>

        {/* CTA */}
        <div style={{
          margin: '56px 0',
          padding: isMobile ? '24px' : '32px',
          borderRadius: '18px',
          background: 'rgba(99,102,241,0.07)',
          border: '1px solid rgba(99,102,241,0.25)',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            Track any shipment in seconds
          </h3>
          <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.5)', marginBottom: '20px' }}>
            Paste any container number, AWB, B/L, or courier tracking number — Trackora finds it across 1,200+ carriers.
          </p>
          <Link
            to="/track"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 26px', borderRadius: '12px', textDecoration: 'none',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', fontSize: '15px', fontWeight: 700,
              boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
            }}
          >
            Start tracking for free →
          </Link>
        </div>

        {/* Other articles */}
        {otherPosts.length > 0 && (
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>More guides</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {otherPosts.map(p => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  style={{
                    display: 'block', padding: '16px 20px', borderRadius: '12px', textDecoration: 'none',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>{p.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.4)' }}>{p.readTime}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* JSON-LD Article schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.seo.description,
          datePublished: post.date,
          author: { '@type': 'Organization', name: 'Trackora' },
          publisher: { '@type': 'Organization', name: 'Trackora', url: 'https://www.track-ora.com' },
          mainEntityOfPage: `https://www.track-ora.com/blog/${post.slug}`,
        }) }}
      />
    </div>
  )
}
