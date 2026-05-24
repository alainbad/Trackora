interface Props {
  size?: number
  showText?: boolean
  textSize?: number
}

export default function TrackoraLogo({ size = 40, showText = true, textSize = 20 }: Props) {
  const r = size / 2
  const cx = r, cy = r
  const ringR = r * 0.87
  const innerR = r * 0.215
  const iconR = r * 0.585
  const s = r * 0.43   // icon half-size — large to match reference

  // Spokes are DIAGONAL: NE / SE / SW / NW (45°, 135°, 225°, 315°)
  const spokeAngles = [45, 135, 225, 315]

  const toXY = (deg: number, radius: number) => {
    const rad = (deg * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  const b = innerR * 0.55  // 3D box half-size

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: showText ? '10px' : '0' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60c8f5" />
            <stop offset="100%" stopColor="#4f62e8" />
          </linearGradient>
          <filter id="lgw" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Clip inner icons to just inside the ring */}
          <clipPath id="lc">
            <circle cx={cx} cy={cy} r={ringR - r * 0.015} />
          </clipPath>
        </defs>

        {/* ── Outer gradient ring ── */}
        <circle cx={cx} cy={cy} r={ringR}
          fill="none" stroke="url(#lg)"
          strokeWidth={r * 0.07}
          filter="url(#lgw)"
        />

        {/* ── All inner content clipped to ring ── */}
        <g clipPath="url(#lc)">

          {/* Diagonal spokes */}
          {spokeAngles.map((angle, i) => {
            const outer = toXY(angle, ringR * 0.85)
            const inner = toXY(angle, innerR * 1.1)
            return (
              <line key={i}
                x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                stroke="url(#lg)" strokeWidth={r * 0.035} opacity="0.68"
              />
            )
          })}

          {/* ── PLANE — top (270°), rotated −45° to point upper-right ── */}
          {(() => {
            const p = toXY(270, iconR)
            return (
              <g transform={`translate(${p.x}, ${p.y}) rotate(-45)`} fill="url(#lg)">
                {/* Fuselage — pointed nose up, tapers to tail */}
                <path d={`M 0,${-s * 0.95} L ${s * 0.16},${s * 0.55} L 0,${s * 0.3} L ${-s * 0.16},${s * 0.55} Z`} />
                {/* Left wing — large swept-back triangle */}
                <path d={`M ${-s * 0.08},${s * 0.0} L ${-s},${s * 0.52} L ${-s * 0.08},${s * 0.35} Z`} />
                {/* Right wing */}
                <path d={`M ${s * 0.08},${s * 0.0} L ${s},${s * 0.52} L ${s * 0.08},${s * 0.35} Z`} />
                {/* Left tail fin */}
                <path d={`M ${-s * 0.07},${s * 0.44} L ${-s * 0.4},${s * 0.9} L ${-s * 0.07},${s * 0.72} Z`} opacity="0.88" />
                {/* Right tail fin */}
                <path d={`M ${s * 0.07},${s * 0.44} L ${s * 0.4},${s * 0.9} L ${s * 0.07},${s * 0.72} Z`} opacity="0.88" />
              </g>
            )
          })()}

          {/* ── SHIP — right (0°), profile facing right, waves below ── */}
          {(() => {
            const p = toXY(0, iconR)
            return (
              <g transform={`translate(${p.x}, ${p.y})`} fill="url(#lg)">
                {/* Hull body */}
                <path d={`
                  M ${-s * 0.95},${-s * 0.08}
                  L ${-s * 0.95},${s * 0.32}
                  Q ${-s * 0.75},${s * 0.72} ${-s * 0.3},${s * 0.78}
                  L ${s * 0.3},${s * 0.78}
                  Q ${s * 0.75},${s * 0.72} ${s * 0.95},${s * 0.32}
                  L ${s * 0.95},${-s * 0.08} Z
                `} opacity="0.88" />
                {/* Superstructure / bridge */}
                <rect x={-s * 0.38} y={-s * 0.72} width={s * 0.76} height={s * 0.64} rx={s * 0.08} />
                {/* Funnel */}
                <rect x={-s * 0.09} y={-s} width={s * 0.18} height={s * 0.32} rx={s * 0.05} opacity="0.9" />
                {/* Wave 1 */}
                <path d={`M ${-s * 0.9},${s * 0.86} Q ${-s * 0.55},${s * 0.76} ${-s * 0.18},${s * 0.86} Q ${s * 0.18},${s * 0.96} ${s * 0.55},${s * 0.86} Q ${s * 0.75},${s * 0.8} ${s * 0.9},${s * 0.86}`}
                  fill="none" stroke="url(#lg)" strokeWidth={s * 0.11} opacity="0.6" strokeLinecap="round" />
              </g>
            )
          })()}

          {/* ── TRAIN — bottom (90°), front-facing with diverging track rails ── */}
          {(() => {
            const p = toXY(90, iconR)
            return (
              <g transform={`translate(${p.x}, ${p.y})`} fill="url(#lg)">
                {/* Train body — wide rounded rectangle */}
                <rect x={-s * 0.82} y={-s * 0.78} width={s * 1.64} height={s * 1.18} rx={s * 0.22} opacity="0.95" />
                {/* Front windshield window */}
                <rect x={-s * 0.5} y={-s * 0.62} width={s} height={s * 0.52} rx={s * 0.1} fill="rgba(255,255,255,0.2)" />
                {/* Left diverging rail */}
                <line x1={-s * 0.52} y1={s * 0.48} x2={-s * 0.88} y2={s * 0.98}
                  stroke="url(#lg)" strokeWidth={s * 0.1} opacity="0.72" strokeLinecap="round" />
                {/* Right diverging rail */}
                <line x1={s * 0.52} y1={s * 0.48} x2={s * 0.88} y2={s * 0.98}
                  stroke="url(#lg)" strokeWidth={s * 0.1} opacity="0.72" strokeLinecap="round" />
              </g>
            )
          })()}

          {/* ── TRUCK — left (180°), side view facing left, speed lines ── */}
          {(() => {
            const p = toXY(180, iconR)
            return (
              <g transform={`translate(${p.x}, ${p.y})`} fill="url(#lg)">
                {/* Cargo box */}
                <rect x={-s * 0.15} y={-s * 0.65} width={s * 1.1} height={s * 1.0} rx={s * 0.07} opacity="0.88" />
                {/* Cab */}
                <rect x={-s * 1.0} y={-s * 0.45} width={s * 0.85} height={s * 0.8} rx={s * 0.14} />
                {/* Cab windshield */}
                <rect x={-s * 0.92} y={-s * 0.33} width={s * 0.6} height={s * 0.33} rx={s * 0.08} fill="rgba(255,255,255,0.25)" />
                {/* Rear wheel */}
                <circle cx={s * 0.6} cy={s * 0.58} r={s * 0.28} />
                {/* Front wheel */}
                <circle cx={-s * 0.52} cy={s * 0.58} r={s * 0.25} />
                {/* Speed line 1 (top) */}
                <line x1={-s * 1.06} y1={-s * 0.12} x2={-s * 1.52} y2={-s * 0.12}
                  stroke="url(#lg)" strokeWidth={s * 0.1} opacity="0.62" strokeLinecap="round" />
                {/* Speed line 2 (middle) */}
                <line x1={-s * 1.06} y1={s * 0.12} x2={-s * 1.65} y2={s * 0.12}
                  stroke="url(#lg)" strokeWidth={s * 0.1} opacity="0.48" strokeLinecap="round" />
                {/* Speed line 3 (bottom) */}
                <line x1={-s * 1.06} y1={s * 0.35} x2={-s * 1.48} y2={s * 0.35}
                  stroke="url(#lg)" strokeWidth={s * 0.09} opacity="0.35" strokeLinecap="round" />
              </g>
            )
          })()}

        </g>

        {/* ── Dots at diagonal spoke endpoints (above the clip, on the ring) ── */}
        {spokeAngles.map((angle, i) => {
          const p = toXY(angle, ringR)
          return <circle key={i} cx={p.x} cy={p.y} r={r * 0.062} fill="url(#lg)" />
        })}

        {/* ── Center white circle ── */}
        <circle cx={cx} cy={cy} r={innerR} fill="white" fillOpacity="0.95" />

        {/* ── Center 3D isometric package box ── */}
        <g fill="url(#lg)">
          {/* Top face */}
          <path d={`M ${cx},${cy - b * 0.92} L ${cx + b},${cy - b * 0.28} L ${cx},${cy + b * 0.24} L ${cx - b},${cy - b * 0.28} Z`} opacity="0.97" />
          {/* Left face (darker) */}
          <path d={`M ${cx - b},${cy - b * 0.28} L ${cx},${cy + b * 0.24} L ${cx},${cy + b * 0.92} L ${cx - b},${cy + b * 0.42} Z`} opacity="0.55" />
          {/* Right face (medium) */}
          <path d={`M ${cx + b},${cy - b * 0.28} L ${cx},${cy + b * 0.24} L ${cx},${cy + b * 0.92} L ${cx + b},${cy + b * 0.42} Z`} opacity="0.75" />
        </g>
      </svg>

      {showText && (
        <span style={{ fontSize: textSize, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 }}>
          <span style={{ color: 'rgba(248,250,252,0.75)' }}>Track</span>
          <span style={{ color: '#4f62e8' }}>ora</span>
        </span>
      )}
    </div>
  )
}
