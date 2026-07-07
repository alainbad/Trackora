import { useNavigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'

export default function NotFound() {
  const navigate = useNavigate()

  useSEO({
    title:       'Page Not Found | Trackora',
    description: 'The page you are looking for does not exist. Go back to Trackora and track any shipment across 1,200+ carriers.',
    canonical:   'https://www.track-ora.com/404',
  })

  return (
    <div style={{
      minHeight: '70vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', textAlign: 'center',
    }}>
      <div style={{
        fontSize: '96px', fontWeight: 800, lineHeight: 1,
        background: 'linear-gradient(135deg, #22d3ee, #6366f1)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        marginBottom: '16px',
      }}>
        404
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#f8fafc', margin: '0 0 12px' }}>
        Page not found
      </h1>
      <p style={{ fontSize: '16px', color: 'rgba(248,250,252,0.55)', maxWidth: '420px', margin: '0 0 36px', lineHeight: 1.6 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 28px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            border: 'none', color: '#fff', fontSize: '15px', fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Go to Home
        </button>
        <button
          onClick={() => navigate('/track')}
          style={{
            padding: '12px 28px', borderRadius: '12px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#f8fafc', fontSize: '15px', fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Track a Shipment
        </button>
      </div>
    </div>
  )
}
