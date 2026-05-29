import { useRef } from 'react'

interface WorldMapProps {
  animated?: boolean
  freightType?: 'air' | 'sea' | 'land' | 'express'
  route?: { from: [number, number]; to: [number, number]; progress?: number }
  points?: Array<{ lat: number; lng: number; label?: string; type?: 'origin' | 'destination' | 'waypoint' }>
}

// Convert lat/lng to SVG x/y (equirectangular)
function toSVG(lat: number, lng: number, w = 1000, h = 500): [number, number] {
  const x = ((lng + 180) / 360) * w
  const y = ((90 - lat) / 180) * h
  return [x, y]
}

// Sample animated route points for hero
const DEMO_ROUTES = [
  { from: [40.7128, -74.006]   as [number, number], to: [51.5074, -0.1278]   as [number, number] }, // NYC → London
  { from: [35.6762, 139.6503]  as [number, number], to: [1.3521, 103.8198]   as [number, number] }, // Tokyo → Singapore
  { from: [31.2304, 121.4737]  as [number, number], to: [48.8566, 2.3522]    as [number, number] }, // Shanghai → Paris
  { from: [-33.8688, 151.2093] as [number, number], to: [25.2048, 55.2708]   as [number, number] }, // Sydney → Dubai
]

// Continent outlines
const LAND_PATHS = [
  "M 195 120 L 180 130 L 165 145 L 155 160 L 150 180 L 160 195 L 175 200 L 190 195 L 200 185 L 215 175 L 225 160 L 220 145 L 210 135 Z",
  "M 480 95 L 470 105 L 475 115 L 490 120 L 500 115 L 510 120 L 520 115 L 515 105 L 505 95 Z",
  "M 490 185 L 480 200 L 478 220 L 483 240 L 490 255 L 500 260 L 510 255 L 517 240 L 515 220 L 510 200 L 505 185 Z",
  "M 560 90 L 545 100 L 540 115 L 555 130 L 570 140 L 590 145 L 610 140 L 625 130 L 640 120 L 655 115 L 650 100 L 635 90 L 620 85 L 600 82 L 580 85 Z",
  "M 255 215 L 245 230 L 243 250 L 248 270 L 255 285 L 265 295 L 273 290 L 278 275 L 275 255 L 270 235 L 262 218 Z",
  "M 720 275 L 710 285 L 708 300 L 715 315 L 725 320 L 738 315 L 745 300 L 742 285 L 733 275 Z",
]

// Freight-type colour palette
const FREIGHT_COLORS: Record<string, string> = {
  air:     '#22d3ee',
  sea:     '#6366f1',
  land:    '#10b981',
  express: '#f59e0b',
}

// Ship icon (for sea freight)
function ShipIcon() {
  return (
    <>
      <path d="M -14 2 L 14 2 L 10 8 L -10 8 Z" />
      <rect x="-4" y="-8" width="3" height="10" />
      <path d="M -4 -8 L 8 -2 L -4 -2 Z" />
    </>
  )
}

// Plane icon (for air/express/land)
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

  // Is this a real shipment route (not demo) with valid coordinates?
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
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
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
          @keyframes pulse-ring { 0%{r:8;opacity:0.4} 100%{r:20;opacity:0} }
        `}</style>
      </defs>

      {/* Background glow */}
      <ellipse cx="500" cy="250" rx="500" ry="250" fill="url(#globe-glow)" />

      {/* Grid lines */}
      {[30, 60, 120, 150, 210, 240, 300, 330].map(lng => {
        const [x] = toSVG(0, lng - 180)
        return <line key={`v${lng}`} x1={x} y1={0} x2={x} y2={500} stroke="rgba(99,102,241,0.06)" strokeWidth="1" />
      })}
      {[30, 60, 90, 120, 150].map(lat => {
        const [, y] = toSVG(lat - 90, 0)
        return <line key={`h${lat}`} x1={0} y1={y} x2={1000} y2={y} stroke="rgba(99,102,241,0.06)" strokeWidth="1" />
      })}

      {/* Continents */}
      {LAND_PATHS.map((d, i) => (
        <path key={i} d={d} fill="rgba(99,102,241,0.12)" stroke="rgba(99,102,241,0.25)" strokeWidth="1" />
      ))}

      {/* Routes */}
      {routesToDraw.map((r, i) => {
        const [x1, y1] = toSVG(r.from[0], r.from[1])
        const [x2, y2] = toSVG(r.to[0],   r.to[1])

        // Arc control point — higher arc for longer routes
        const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
        const cx   = (x1 + x2) / 2
        const cy   = Math.min(y1, y2) - dist * 0.22 - 30

        const demoColors = ['#22d3ee', '#818cf8', '#10b981', '#f59e0b']
        const color      = routeColor ?? demoColors[i % demoColors.length]
        const arcPath    = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`

        // Animation speed: faster for real (single) route, varied for demos
        const dur = hasRealRoute ? '6s' : `${8 + i * 2}s`

        return (
          <g key={i}>
            {/* Glow halo */}
            <path d={arcPath} fill="none" stroke={color} strokeWidth={hasRealRoute ? 6 : 4} strokeOpacity="0.12" />
            {/* Main arc */}
            <path
              d={arcPath}
              fill="none"
              stroke={color}
              strokeWidth={hasRealRoute ? 2 : 1.5}
              strokeOpacity={hasRealRoute ? 0.7 : 0.4}
              strokeDasharray="10 6"
              style={{ animation: `dash ${hasRealRoute ? '3s' : '15s'} linear infinite` }}
            />

            {/* Origin dot */}
            <circle cx={x1} cy={y1} r="5" fill={color} opacity="0.9" filter="url(#glow)" />
            <circle cx={x1} cy={y1} r="10" fill={color} opacity="0.18" />

            {/* Destination dot with pulsing ring */}
            <circle cx={x2} cy={y2} r="5" fill={color} opacity="0.9" filter="url(#glow)" />
            <circle cx={x2} cy={y2} r="10" fill={color} opacity="0" >
              <animate attributeName="r"       values="8;22;8"   dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.35;0;0.35" dur="2.5s" repeatCount="indefinite" />
            </circle>

            {/* Animated vehicle — plane or ship */}
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
        // Skip [0,0] null-island points
        if (p.lat === 0 && p.lng === 0) return null
        const [x, y] = toSVG(p.lat, p.lng)
        const color  = p.type === 'origin' ? '#10b981' : p.type === 'destination' ? '#ef4444' : '#f59e0b'
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="6" fill={color} opacity="0.9" filter="url(#strong-glow)" />
            <circle cx={x} cy={y} r="12" fill={color} opacity="0.2">
              <animate attributeName="r"       values="8;16;8"     dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3"  dur="2s" repeatCount="indefinite" />
            </circle>
            {p.label && (
              <text x={x + 14} y={y + 4} fill="white" fontSize="11" fontFamily="Inter,system-ui,sans-serif" opacity="0.8">
                {p.label}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
