interface Props {
  size?: number
  showText?: boolean
  textSize?: number
}

export default function TrackoraLogo({ size = 40, showText = true, textSize = 20 }: Props) {
  const r = size / 2
  const cx = r
  const cy = r
  const ringR = r * 0.88
  const innerR = r * 0.26
  const iconR = r * 0.58
  const s = r * 0.26  // icon half-size

  const spokes = [270, 0, 90, 180]
  const dotAngles = [315, 45, 135, 225]

  const toXY = (angleDeg: number, radius: number) => {
    const rad = (angleDeg * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <linearGradient id="icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
          <filter id="logo-glow">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Outer ring */}
        <circle cx={cx} cy={cy} r={ringR} fill="none" stroke="url(#ring-grad)" strokeWidth={r * 0.09} filter="url(#logo-glow)" />

        {/* Spokes */}
        {spokes.map((angle, i) => {
          const outer = toXY(angle, ringR - r * 0.05)
          const inner = toXY(angle, innerR + r * 0.02)
          return (
            <line key={i}
              x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke="url(#icon-grad)" strokeWidth={r * 0.035} strokeOpacity="0.4"
            />
          )
        })}

        {/* Diagonal dots on ring */}
        {dotAngles.map((angle, i) => {
          const pos = toXY(angle, ringR)
          return <circle key={i} cx={pos.x} cy={pos.y} r={r * 0.052} fill="url(#ring-grad)" />
        })}

        {/* Center circle */}
        <circle cx={cx} cy={cy} r={innerR} fill="url(#ring-grad)" fillOpacity="0.12" stroke="url(#ring-grad)" strokeWidth={r * 0.04} />

        {/* Center package icon */}
        <g transform={`translate(${cx - r * 0.15}, ${cy - r * 0.15})`}>
          <rect width={r * 0.3} height={r * 0.3} rx={r * 0.05} fill="none" stroke="url(#icon-grad)" strokeWidth={r * 0.05} />
          <line x1={0} y1={r * 0.13} x2={r * 0.3} y2={r * 0.13} stroke="url(#icon-grad)" strokeWidth={r * 0.04} />
          <line x1={r * 0.15} y1={0} x2={r * 0.15} y2={r * 0.13} stroke="url(#icon-grad)" strokeWidth={r * 0.04} />
        </g>

        {/* PLANE — top (270°), nose pointing up */}
        {(() => {
          const p = toXY(270, iconR)
          return (
            <g transform={`translate(${p.x}, ${p.y})`} fill="url(#icon-grad)">
              {/* Fuselage */}
              <path d={`M 0,${-s} L ${s*0.24},${s*0.5} L 0,${s*0.28} L ${-s*0.24},${s*0.5} Z`} opacity="0.95" />
              {/* Left wing */}
              <path d={`M ${-s*0.07},${s*0.04} L ${-s},${s*0.52} L ${-s*0.07},${s*0.36} Z`} opacity="0.88" />
              {/* Right wing */}
              <path d={`M ${s*0.07},${s*0.04} L ${s},${s*0.52} L ${s*0.07},${s*0.36} Z`} opacity="0.88" />
              {/* Left tail */}
              <path d={`M ${-s*0.06},${s*0.46} L ${-s*0.36},${s*0.9} L ${-s*0.06},${s*0.73} Z`} opacity="0.72" />
              {/* Right tail */}
              <path d={`M ${s*0.06},${s*0.46} L ${s*0.36},${s*0.9} L ${s*0.06},${s*0.73} Z`} opacity="0.72" />
            </g>
          )
        })()}

        {/* SHIP — right (0°), bow pointing right */}
        {(() => {
          const p = toXY(0, iconR)
          return (
            <g transform={`translate(${p.x}, ${p.y})`} fill="url(#icon-grad)">
              {/* Hull */}
              <path d={`M ${-s},${-s*0.08} L ${-s},${s*0.38} Q ${-s*0.75},${s*0.82} ${-s*0.3},${s*0.88} L ${s*0.3},${s*0.88} Q ${s*0.75},${s*0.82} ${s},${s*0.38} L ${s},${-s*0.08} Z`} opacity="0.9" />
              {/* Superstructure */}
              <rect x={-s*0.42} y={-s*0.75} width={s*0.84} height={s*0.67} rx={s*0.09} opacity="0.88" />
              {/* Funnel */}
              <rect x={-s*0.13} y={-s*1.0} width={s*0.26} height={s*0.3} rx={s*0.07} opacity="0.75" />
              {/* Deck divider */}
              <line x1={-s} y1={-s*0.08} x2={s} y2={-s*0.08} stroke="#0a0f1e" strokeWidth={s*0.12} opacity="0.45" />
            </g>
          )
        })()}

        {/* TRAIN — bottom (90°) */}
        {(() => {
          const p = toXY(90, iconR)
          return (
            <g transform={`translate(${p.x}, ${p.y})`} fill="url(#icon-grad)">
              {/* Body */}
              <rect x={-s} y={-s*0.62} width={s*2} height={s*1.08} rx={s*0.22} opacity="0.9" />
              {/* Left window */}
              <rect x={-s*0.86} y={-s*0.46} width={s*0.5} height={s*0.36} rx={s*0.1} fill="#0a0f1e" opacity="0.9" />
              {/* Right window */}
              <rect x={s*0.36} y={-s*0.46} width={s*0.5} height={s*0.36} rx={s*0.1} fill="#0a0f1e" opacity="0.9" />
              {/* Left wheel */}
              <circle cx={-s*0.58} cy={s*0.63} r={s*0.27} opacity="0.95" />
              {/* Right wheel */}
              <circle cx={s*0.58} cy={s*0.63} r={s*0.27} opacity="0.95" />
              {/* Rail */}
              <line x1={-s*0.92} y1={s*0.9} x2={s*0.92} y2={s*0.9} stroke="url(#icon-grad)" strokeWidth={s*0.1} opacity="0.38" />
            </g>
          )
        })()}

        {/* TRUCK — left (180°), cab facing left */}
        {(() => {
          const p = toXY(180, iconR)
          return (
            <g transform={`translate(${p.x}, ${p.y})`} fill="url(#icon-grad)">
              {/* Cargo box (right side) */}
              <rect x={-s*0.22} y={-s*0.6} width={s*1.22} height={s*0.94} rx={s*0.09} opacity="0.9" />
              {/* Cab (left side) */}
              <rect x={-s} y={-s*0.38} width={s*0.78} height={s*0.72} rx={s*0.12} opacity="0.86" />
              {/* Cab window */}
              <rect x={-s*0.88} y={-s*0.25} width={s*0.54} height={s*0.32} rx={s*0.09} fill="#0a0f1e" opacity="0.9" />
              {/* Rear wheel */}
              <circle cx={s*0.65} cy={s*0.58} r={s*0.27} opacity="0.95" />
              {/* Front wheel */}
              <circle cx={-s*0.55} cy={s*0.58} r={s*0.24} opacity="0.95" />
            </g>
          )
        })()}
      </svg>

      {showText && (
        <span style={{ fontSize: textSize, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 }}>
          <span style={{ color: 'rgba(248,250,252,0.88)' }}>Track</span>
          <span style={{
            background: 'linear-gradient(135deg, #22d3ee, #6366f1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>ora</span>
        </span>
      )}
    </div>
  )
}
