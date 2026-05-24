interface Props {
  size?: number
  showText?: boolean
  textSize?: number
}

export default function TrackoraLogo({ size = 40, showText = true, textSize = 20 }: Props) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <img
        src="/trackora-icon.png"
        alt="Trackora icon"
        width={size}
        height={size}
        style={{ display: 'block', width: size, height: size, objectFit: 'contain' }}
      />
      {showText && (
        <span style={{ fontSize: textSize, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1 }}>
          <span style={{ color: 'rgba(200,212,235,0.72)' }}>Track</span>
          <span style={{ color: '#5068e8' }}>ora</span>
        </span>
      )}
    </div>
  )
}
