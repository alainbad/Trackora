interface Props {
  size?: number
  showText?: boolean
  textSize?: number
}

export default function TrackoraLogo({ size = 40, showText = true, textSize = 20 }: Props) {
  const r = size / 2
  const cx = r, cy = r
  const ringR = r * 0.87
  const innerR = r * 0.22
  const iconR = r * 0.58
  const s = r * 0.26

  // Spokes are DIAGONAL: NE / SE / SW / NW
  const spokeAngles = [45, 135, 225, 315]

  const toXY = (deg: number, radius: number) => {
    const rad = (deg * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  const b = innerR * 0.52  // 3D box half-size in center

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <filter id="lgw">
            <feGaussianBlur stdDeviation="0.9" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Clip inner content to just inside the ring */}
          <clipPath id="lc">
            <circle cx={cx} cy={cy} r={ringR - r * 0.01} />
          </clipPath>
        </defs>

        {/* ── Outer ring ── */}
        <circle cx={cx} cy={cy} r={ringR}
          fill="none" stroke="url(#lg)"
          strokeWidth={r * 0.075}
          filter="url(#lgw)"
        />

        {/* ── Inner content (spokes + icons) clipped to ring ── */}
        <g clipPath="url(#lc)">

          {/* Diagonal spokes */}
          {spokeAngles.map((angle, i) => {
            const outer = toXY(angle, ringR * 0.86)
            const inner = toXY(angle, innerR * 1.12)
            return (
              <line key={i}
                x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                stroke="url(#lg)" strokeWidth={r * 0.04} opacity="0.72"
              />
            )
          })}

          {/* ── PLANE — top (270°), rotated −45° to point upper-right ── */}
          {(() => {
            const p = toXY(270, iconR)
            return (
              <g transform={`translate(${p.x}, ${p.y}) rotate(-45)`} fill="url(#lg)">
                {/* Fuselage */}
                <path d={`M 0,${-s * 0.9} L ${s * 0.18},${s * 0.45} L 0,${s * 0.25} L ${-s * 0.18},${s * 0.45} Z`} />
                {/* Left wing */}
                <path d={`M ${-s * 0.07},${s * 0.02} L ${-s * 0.92},${s * 0.5} L ${-s * 0.07},${s * 0.33} Z`} />
                {/* Right wing */}
                <path d={`M ${s * 0.07},${s * 0.02} L ${s * 0.92},${s * 0.5} L ${s * 0.07},${s * 0.33} Z`} />
                {/* Left tail fin */}
                <path d={`M ${-s * 0.06},${s * 0.43} L ${-s * 0.38},${s * 0.88} L ${-s * 0.06},${s * 0.7} Z`} opacity="0.85" />
                {/* Right tail fin */}
                <path d={`M ${s * 0.06},${s * 0.43} L ${s * 0.38},${s * 0.88} L ${s * 0.06},${s * 0.7} Z`} opacity="0.85" />
              </g>
            )
          })()}

          {/* ── SHIP — right (0°), profile facing right, waves below ── */}
          {(() => {
            const p = toXY(0, iconR)
            return (
              <g transform={`translate(${p.x}, ${p.y})`} fill="url(#lg)">
                {/* Hull */}
                <path d={`M ${-s},${-s * 0.05} L ${-s},${s * 0.38} Q ${-s * 0.72},${s * 0.78} ${-s * 0.28},${s * 0.84} L ${s * 0.28},${s * 0.84} Q ${s * 0.72},${s * 0.78} ${s},${s * 0.38} L ${s},${-s * 0.05} Z`} opacity="0.9" />
                {/* Superstructure */}
                <rect x={-s * 0.4} y={-s * 0.72} width={s * 0.8} height={s * 0.67} rx={s * 0.09} />
                {/* Funnel */}
                <rect x={-s * 0.1} y={-s * 0.98} width={s * 0.2} height={s * 0.3} rx={s * 0.06} opacity="0.88" />
                {/* Waves */}
                <path
                  d={`M ${-s},${s * 0.9} Q ${-s * 0.6},${s * 0.8} ${-s * 0.2},${s * 0.9} Q ${s * 0.2},${s},${s * 0.6},${s * 0.9} Q ${s * 0.82},${s * 0.84} ${s},${s * 0.9}`}
                  fill="none" stroke="url(#lg)" strokeWidth={s * 0.13} opacity="0.65"
                />
              </g>
            )
          })()}

          {/* ── TRAIN — bottom (90°), front-facing view with track rails ── */}
          {(() => {
            const p = toXY(90, iconR)
            return (
              <g transform={`translate(${p.x}, ${p.y})`} fill="url(#lg)">
                {/* Body */}
                <rect x={-s * 0.8} y={-s * 0.75} width={s * 1.6} height={s * 1.12} rx={s * 0.25} opacity="0.95" />
                {/* Front window */}
                <rect x={-s * 0.46} y={-s * 0.58} width={s * 0.92} height={s * 0.5} rx={s * 0.12} fill="rgba(255,255,255,0.22)" />
                {/* Left track rail */}
                <line x1={-s * 0.55} y1={s * 0.44} x2={-s * 0.88} y2={s * 0.98}
                  stroke="url(#lg)" strokeWidth={s * 0.1} opacity="0.7" />
                {/* Right track rail */}
                <line x1={s * 0.55} y1={s * 0.44} x2={s * 0.88} y2={s * 0.98}
                  stroke="url(#lg)" strokeWidth={s * 0.1} opacity="0.7" />
              </g>
            )
          })()}

          {/* ── TRUCK — left (180°), side view facing left with speed lines ── */}
          {(() => {
            const p = toXY(180, iconR)
            return (
              <g transform={`translate(${p.x}, ${p.y})`} fill="url(#lg)">
                {/* Cargo box */}
                <rect x={-s * 0.18} y={-s * 0.62} width={s * 1.18} height={s * 0.96} rx={s * 0.08} opacity="0.9" />
                {/* Cab */}
                <rect x={-s * 1.0} y={-s * 0.4} width={s * 0.82} height={s * 0.74} rx={s * 0.13} />
                {/* Cab window */}
                <rect x={-s * 0.9} y={-s * 0.27} width={s * 0.56} height={s * 0.3} rx={s * 0.08} fill="rgba(255,255,255,0.28)" />
                {/* Rear wheel */}
                <circle cx={s * 0.68} cy={s * 0.56} r={s * 0.27} />
                {/* Front wheel */}
                <circle cx={-s * 0.54} cy={s * 0.56} r={s * 0.24} />
                {/* Speed lines (clipped naturally by ring clip) */}
                <line x1={-s * 1.05} y1={-s * 0.08} x2={-s * 1.55} y2={-s * 0.08}
                  stroke="url(#lg)" strokeWidth={s * 0.11} opacity="0.65" strokeLinecap="round" />
                <line x1={-s * 1.05} y1={s * 0.16} x2={-s * 1.65} y2={s * 0.16}
                  stroke="url(#lg)" strokeWidth={s * 0.1} opacity="0.5" strokeLinecap="round" />
                <line x1={-s * 1.05} y1={s * 0.38} x2={-s * 1.5} y2={s * 0.38}
                  stroke="url(#lg)" strokeWidth={s * 0.09} opacity="0.38" strokeLinecap="round" />
              </g>
            )
          })()}
        </g>

        {/* ── Dots at diagonal spoke ends (drawn on the ring, above clip) ── */}
        {spokeAngles.map((angle, i) => {
          const p = toXY(angle, ringR)
          return <circle key={i} cx={p.x} cy={p.y} r={r * 0.06} fill="url(#lg)" />
        })}

        {/* ── Center white circle ── */}
        <circle cx={cx} cy={cy} r={innerR} fill="white" fillOpacity="0.93" />

        {/* ── Center 3D isometric package icon ── */}
        <g fill="url(#lg)">
          {/* Top face */}
          <path d={`M ${cx},${cy - b * 0.9} L ${cx + b},${cy - b * 0.28} L ${cx},${cy + b * 0.22} L ${cx - b},${cy - b * 0.28} Z`} opacity="0.95" />
          {/* Left face */}
          <path d={`M ${cx - b},${cy - b * 0.28} L ${cx},${cy + b * 0.22} L ${cx},${cy + b * 0.9} L ${cx - b},${cy + b * 0.4} Z`} opacity="0.58" />
          {/* Right face */}
          <path d={`M ${cx + b},${cy - b * 0.28} L ${cx},${cy + b * 0.22} L ${cx},${cy + b * 0.9} L ${cx + b},${cy + b * 0.4} Z`} opacity="0.75" />
        </g>
      </svg>

      {showText && (
        <span style={{ fontSize: textSize, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 }}>
          <span style={{ color: 'rgba(248,250,252,0.82)' }}>Track</span>
          <span style={{ color: '#4f46e5' }}>ora</span>
        </span>
      )}
    </div>
  )
}
