import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window { adsbygoogle: unknown[] }
}

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  style?: React.CSSProperties
}

export default function AdUnit({ slot, format = 'auto', style }: AdUnitProps) {
  const ref = useRef<HTMLModElement>(null)
  const pushed = useRef(false)
  const [hasHeight, setHasHeight] = useState(false)

  useEffect(() => {
    if (pushed.current) return
    pushed.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (_) {}
  }, [])

  // Poll briefly to detect if the ad filled in (gets a non-zero height)
  useEffect(() => {
    let attempts = 0
    const id = setInterval(() => {
      if (ref.current && ref.current.offsetHeight > 0) {
        setHasHeight(true)
        clearInterval(id)
      }
      if (++attempts > 20) clearInterval(id)
    }, 250)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ overflow: 'hidden', textAlign: 'center', ...style, ...(!hasHeight ? { margin: 0, padding: 0 } : {}) }}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 0 }}
        data-ad-client="ca-pub-5739293622071866"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
