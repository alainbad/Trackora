import type { TimelineEvent } from '../../data/mockShipments'
import { CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react'

interface Props {
  events: TimelineEvent[]
  delayRisk?: 'low' | 'medium' | 'high'
  delayReason?: string
}

const STATUS_ICONS = {
  completed: CheckCircle2,
  current: Clock,
  upcoming: Circle,
}
const STATUS_COLORS = {
  completed: '#10b981',
  current: '#6366f1',
  upcoming: 'rgba(248,250,252,0.25)',
}

export default function TrackingTimeline({ events, delayRisk, delayReason }: Props) {
  return (
    <div>
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '20px' }}>Shipment Timeline</h3>

      {/* Delay Alert */}
      {delayRisk && delayRisk !== 'low' && delayReason && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '10px',
          padding: '14px 16px', borderRadius: '12px', marginBottom: '20px',
          background: delayRisk === 'high' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
          border: `1px solid ${delayRisk === 'high' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`,
        }}>
          <AlertTriangle size={16} color={delayRisk === 'high' ? '#ef4444' : '#f59e0b'} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: delayRisk === 'high' ? '#ef4444' : '#f59e0b', marginBottom: '2px' }}>
              {delayRisk === 'high' ? 'Delay Detected' : 'Delay Risk'}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.6)' }}>{delayReason}</div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {events.length === 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '12px', padding: '40px 20px', textAlign: 'center',
          borderRadius: '16px',
          background: 'rgba(99,102,241,0.05)',
          border: '1px dashed rgba(99,102,241,0.2)',
        }}>
          <div style={{ fontSize: '32px' }}>📡</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(248,250,252,0.7)' }}>
            Awaiting tracking updates
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.4)', maxWidth: '280px', lineHeight: 1.6 }}>
            The carrier hasn't posted any scan events yet. Check back in a few hours — updates usually appear within 24 hours of pickup.
          </div>
        </div>
      )}

      {/* Events */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {events.map((event, i) => {
          const Icon = STATUS_ICONS[event.type]
          const color = STATUS_COLORS[event.type]
          const isLast = i === events.length - 1

          return (
            <div key={i} style={{ display: 'flex', gap: '16px' }}>
              {/* Icon + Line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: event.type === 'current' ? 'rgba(99,102,241,0.2)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: event.type === 'current' ? '2px solid rgba(99,102,241,0.5)' : 'none',
                }}>
                  <Icon size={event.type === 'current' ? 14 : 18} color={color} />
                </div>
                {!isLast && (
                  <div style={{
                    width: '2px', flex: 1, minHeight: '20px',
                    background: event.type === 'completed'
                      ? 'linear-gradient(to bottom, #10b981, rgba(16,185,129,0.3))'
                      : 'rgba(255,255,255,0.08)',
                    margin: '4px 0',
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingBottom: isLast ? '0' : '20px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '14px', fontWeight: 600,
                    color: event.type === 'upcoming' ? 'rgba(248,250,252,0.4)' : '#f8fafc',
                  }}>
                    {event.status}
                  </span>
                  <span style={{ fontSize: '12px', color: 'rgba(248,250,252,0.35)', fontFamily: 'monospace' }}>
                    {event.date} · {event.time}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)', marginBottom: '2px' }}>
                  📍 {event.location}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(248,250,252,0.35)' }}>
                  {event.description}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
