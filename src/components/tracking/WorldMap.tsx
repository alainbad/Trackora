import { useRef } from 'react'
import { WORLD_LAND_PATHS } from '../../data/worldLandPaths'

interface WorldMapProps {
  animated?: boolean
  freightType?: 'air' | 'sea' | 'land' | 'express'
  route?: { from: [number, number]; to: [number, number]; progress?: number }
  points?: Array<{ lat: number; lng: number; label?: string; type?: 'origin' | 'destination' | 'waypoint' }>
}

// Convert lat/lng to SVG x/y (equirectangular, matches worldLandPaths projection)
function toSVG(lat: number, lng: number, w = 1000, h = 500): [number, number] {
  const x = ((lng + 180) / 360) * w
  const y = ((90 - lat) / 180) * h
  return [x, y]
}

const DEMO_ROUTES = [
  { from: [40.7128, -74.006]   as [number, number], to: [51.5074, -0.1278]   as [number, number] }, // NYC → London
  { from: [35.6762, 139.6503]  as [number, number], to: [1.3521, 103.8198]   as [number, number] }, // Tokyo → Singapore
  { from: [31.2304, 121.4737]  as [number, number], to: [48.8566, 2.3522]    as [number, number] }, // Shanghai → Paris
  { from: [-33.8688, 151.2093] as [number, number], to: [25.2048, 55.2708]   as [number, number] }, // Sydney → Dubai
]

const FREIGHT_COLORS: Record<string, string> = {
  air:     '#22d3ee',
  sea:     '#6366f1',
  land:    '#10b981',
  express: '#f59e0b',
}

function ShipIcon() {
  return (
    <>
      <path d="M -14 2 L 14 2 L 10 8 L -10 8 Z" />
      <rect x="-4" y="-8" width="3" height="10" />
      <path d="M -4 -8 L 8 -2 L -4 -2 Z" />
    </>
  )
}

function PlaneIcon() {
  return (
    <>
      <path d="M 12 0 L 4 -1.6 L -9 -1.4 L -11 0 L -9 1.4 L 4 1.6 Z" />
      <path d="M 3 -1 L -5 -8 L -1.5 -8.5 L 5 -1 Z" />
      <path d="M 3 1 L -5 8 L -1.5 8.5 L 5 1 Z" />
      <path d="M -8 -1 L -12 -4.5 L -9.5 -5 L -6 -1 Z" />
      <path d="M -8 1 L -12 4.5 L -9.5 5 L -6 1 Z" />
    </>
  )
}

export default function WorldMap({ animated = false, freightType = 'express', route, points }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  const routesToDraw = route
    ? [{ from: route.from, to: route.to }]
    : animated ? DEMO_ROUTES : []

  const hasRealRoute = !!route && (
    (route.from[0] !== 0 || route.from[1] !== 0) ||
    (route.to[0]   !== 0 || route.to[1]   !== 0)
  )

  const routeColor = hasRealRoute ? (FREIGHT_COLORS[freightType] ?? '#22d3ee') : undefined

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 500"
      style={{ width: '100%', height: '100%' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0a0f1e" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="strong-glow">
          <feGaussianBlur stdDeviation="5" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <style>{`
          @keyframes dash { to { stroke-dashoffset: -100; } }
        `}</style>
      </defs>

      {/* Ocean background */}
      <rect width="1000" height="500" fill="#0d1229" />

      {/* Subtle radial glow */}
      <ellipse cx="500" cy="250" rx="500" ry="250" fill="url(#globe-glow)" />

      {/* Grid lines */}
      {[30, 60, 120, 150, 210, 240, 300, 330].map(lng => {
        const [x] = toSVG(0, lng - 180)
        return <line key={`v${lng}`} x1={x} y1={0} x2={x} y2={500} stroke="rgba(99,102,241,0.1)" strokeWidth="0.5" />
      })}
      {[30, 60, 90, 120, 150].map(lat => {
        const [, y] = toSVG(lat - 90, 0)
        return <line key={`h${lat}`} x1={0} y1={y} x2={1000} y2={y} stroke="rgba(99,102,241,0.1)" strokeWidth="0.5" />
      })}

      {/* Real world land masses — Natural Earth 110m */}
      {WORLD_LAND_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="rgba(71,85,165,0.35)"
          stroke="rgba(139,148,255,0.55)"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      ))}

      {/* Routes */}
      {routesToDraw.map((r, i) => {
        const [x1, y1] = toSVG(r.from[0], r.from[1])
        const [x2, y2] = toSVG(r.to[0],   r.to[1])

        const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
        const cx   = (x1 + x2) / 2
        const cy   = Math.min(y1, y2) - dist * 0.22 - 30

        const demoColors = ['#22d3ee', '#818cf8', '#10b981', '#f59e0b']
        const color      = routeColor ?? demoColors[i % demoColors.length]
        const arcPath    = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`

        const dur = hasRealRoute ? '6s' : `${8 + i * 2}s`

        return (
          <g key={i}>
            {/* Glow halo */}
            <path d={arcPath} fill="none" stroke={color} strokeWidth={hasRealRoute ? 8 : 6} strokeOpacity="0.25" />
            {/* Main arc */}
            <path
              d={arcPath}
              fill="none"
              stroke={color}
              strokeWidth={hasRealRoute ? 2.5 : 2}
              strokeOpacity={hasRealRoute ? 0.9 : 0.65}
              strokeDasharray="10 6"
              style={{ animation: `dash ${hasRealRoute ? '3s' : '15s'} linear infinite` }}
            />

            {/* Origin dot */}
            <circle cx={x1} cy={y1} r="5" fill={color} opacity="0.9" filter="url(#glow)" />
            <circle cx={x1} cy={y1} r="10" fill={color} opacity="0.18" />

            {/* Destination dot with pulsing ring */}
            <circle cx={x2} cy={y2} r="5" fill={color} opacity="0.9" filter="url(#glow)" />
            <circle cx={x2} cy={y2} r="10" fill={color} opacity="0">
              <animate attributeName="r"       values="8;22;8"      dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;0;0.35" dur="2.5s" repeatCount="indefinite" />
            </circle>

            {/* Animated vehicle */}
            {(animated || hasRealRoute) && (
              <g fill={color} opacity="0.95" filter="url(#strong-glow)">
                {freightType === 'sea' ? <ShipIcon /> : <PlaneIcon />}
                <animateMotion
                  dur={dur}
                  repeatCount="indefinite"
                  rotate="auto"
                  path={arcPath}
                />
              </g>
            )}
          </g>
        )
      })}

      {/* Custom points (origin / current / destination) */}
      {points?.map((p, i) => {
        if (p.lat === 0 && p.lng === 0) return null
        const [x, y] = toSVG(p.lat, p.lng)
        const color  = p.type === 'origin' ? '#10b981' : p.type === 'destination' ? '#ef4444' : '#f59e0b'
        // Place label above for destination, below for origin, above-right for waypoint
        const labelOffsetY = p.type === 'origin' ? 22 : -16
        const labelOffsetX = p.type === 'waypoint' ? 14 : 0
        const labelAnchor  = p.type === 'waypoint' ? 'start' : 'middle'
        const labelX = x + labelOffsetX
        const labelY = y + labelOffsetY
        const labelW = (p.label?.length ?? 0) * 6.5 + 12
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="6" fill={color} opacity="0.9" filter="url(#strong-glow)" />
            <circle cx={x} cy={y} r="12" fill={color} opacity="0.2">
              <animate attributeName="r"       values="8;16;8"    dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
            {p.label && (
              <g>
                {/* Dark pill background */}
                <rect
                  x={labelAnchor === 'middle' ? labelX - labelW / 2 : labelX - 4}
                  y={labelY - 11}
                  width={labelW}
                  height={16}
                  rx="4"
                  fill="rgba(8,12,28,0.82)"
                  stroke={color}
                  strokeWidth="0.8"
                  strokeOpacity="0.5"
                />
                <text
                  x={labelX}
                  y={labelY}
                  fill="white"
                  fontSize="10"
                  fontFamily="Inter,system-ui,sans-serif"
                  fontWeight="600"
                  textAnchor={labelAnchor}
                  opacity="0.95"
                  letterSpacing="0.5"
                >
                  {p.label.toUpperCase()}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}
