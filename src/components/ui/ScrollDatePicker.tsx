/**
 * ScrollDatePicker
 * iOS-style drum-roll date picker with three scrollable columns: Day · Month · Year.
 * Returns a value string in "YYYY-MM-DD" format (same as <input type="date">).
 */
import { useRef, useEffect, useCallback, useState } from 'react'

interface Props {
  value:    string                   // "YYYY-MM-DD" or ""
  onChange: (v: string) => void
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

const ITEM_H = 44   // px per row
const VISIBLE = 5   // rows visible (centre = selected)

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate()
}

function pad(n: number) { return String(n).padStart(2, '0') }

// ── Single drum column ────────────────────────────────────────────────────────
interface DrumProps {
  items:    (string | number)[]
  selected: number          // index
  onSelect: (i: number) => void
  width:    number | string   // px number or "100%" for flex column
}

function Drum({ items, selected, onSelect, width }: DrumProps) {
  const ref       = useRef<HTMLDivElement>(null)
  // Scroll to selected index
  const scrollTo = useCallback((idx: number, smooth = true) => {
    const el = ref.current
    if (!el) return
    el.scrollTo({ top: idx * ITEM_H, behavior: smooth ? 'smooth' : 'instant' })
  }, [])

  useEffect(() => { scrollTo(selected, false) }, []) // mount: no animation
  useEffect(() => { scrollTo(selected, true) },  [selected]) // prop change: animate

  // Snap to nearest item after scroll ends
  const snap = useCallback(() => {
    const el = ref.current
    if (!el) return
    const idx = Math.round(el.scrollTop / ITEM_H)
    const clamped = Math.max(0, Math.min(items.length - 1, idx))
    onSelect(clamped)
    el.scrollTo({ top: clamped * ITEM_H, behavior: 'smooth' })
  }, [items.length, onSelect])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let timer: ReturnType<typeof setTimeout>
    const onScroll = () => { clearTimeout(timer); timer = setTimeout(snap, 120) }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => { el.removeEventListener('scroll', onScroll); clearTimeout(timer) }
  }, [snap])

  return (
    <div style={{ position: 'relative', width, flexShrink: width === '100%' ? 1 : 0, minWidth: 0 }}>
      {/* Scrollable list */}
      <div
        ref={ref}
        style={{
          height: ITEM_H * VISIBLE,
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Top padding so first item can centre */}
        <div style={{ height: ITEM_H * Math.floor(VISIBLE / 2) }} />
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() => onSelect(i)}
            style={{
              height: ITEM_H,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: i === selected ? 700 : 400,
              color: i === selected ? '#f8fafc' : 'rgba(248,250,252,0.35)',
              cursor: 'pointer',
              transition: 'color 0.15s, font-weight 0.15s',
              userSelect: 'none',
            }}
          >
            {item}
          </div>
        ))}
        {/* Bottom padding */}
        <div style={{ height: ITEM_H * Math.floor(VISIBLE / 2) }} />
      </div>

      {/* Top + bottom fade overlays */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: ITEM_H * Math.floor(VISIBLE / 2),
        background: 'linear-gradient(to bottom, rgba(15,23,42,0.95), transparent)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: ITEM_H * Math.floor(VISIBLE / 2),
        background: 'linear-gradient(to top, rgba(15,23,42,0.95), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Centre selection highlight */}
      <div style={{
        position: 'absolute',
        top: '50%', transform: 'translateY(-50%)',
        left: 6, right: 6, height: ITEM_H,
        borderRadius: '10px',
        background: 'rgba(99,102,241,0.12)',
        border: '1px solid rgba(99,102,241,0.25)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ScrollDatePicker({ value, onChange }: Props) {
  const now   = new Date()
  const defY  = now.getFullYear() - 25   // default ~25 years ago

  // Parse existing value
  const parse = (v: string) => {
    if (!v) return { d: 1, m: 0, y: defY }
    const [y, mo, d] = v.split('-').map(Number)
    return { d, m: mo - 1, y }
  }

  const init = parse(value)
  const [day,   setDay]   = useState(init.d - 1)      // 0-based index
  const [month, setMonth] = useState(init.m)           // 0-based
  const [year,  setYear]  = useState(0)                // index into years array

  // Year range: 1920 → current year - 5
  const years = Array.from(
    { length: now.getFullYear() - 5 - 1920 + 1 },
    (_, i) => now.getFullYear() - 5 - i   // descending: newest at top
  )
  // Init year index
  useEffect(() => {
    const idx = years.indexOf(init.y)
    setYear(idx >= 0 ? idx : years.indexOf(defY))
  }, [])

  // Days array for current month/year
  const selectedYear = years[year] ?? defY
  const numDays = daysInMonth(month + 1, selectedYear)
  const days    = Array.from({ length: numDays }, (_, i) => pad(i + 1))

  // Clamp day if month/year change reduces days
  const clampedDay = Math.min(day, numDays - 1)

  // Emit onChange whenever selection changes
  useEffect(() => {
    const d = clampedDay + 1
    const m = month + 1
    const y = selectedYear
    if (y && m && d) {
      onChange(`${y}-${pad(m)}-${pad(d)}`)
    }
  }, [clampedDay, month, selectedYear])

  return (
    <div style={{
      borderRadius: '14px',
      background: 'rgba(15,23,42,0.8)',
      border: '1px solid rgba(99,102,241,0.25)',
      overflow: 'hidden',
      padding: '0 4px',
    }}>
      {/* Column headers */}
      <div style={{
        display: 'flex', justifyContent: 'space-around',
        padding: '10px 8px 4px',
        fontSize: '10px', fontWeight: 700, letterSpacing: '1px',
        color: 'rgba(248,250,252,0.3)', textTransform: 'uppercase',
      }}>
        <span style={{ width: 56, textAlign: 'center' }}>Day</span>
        <span style={{ flex: 1, textAlign: 'center' }}>Month</span>
        <span style={{ width: 70, textAlign: 'center' }}>Year</span>
      </div>

      {/* Drums */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 4px 8px', width: '100%', boxSizing: 'border-box' }}>
        <Drum items={days}   selected={clampedDay} onSelect={setDay}   width={56} />
        <Drum items={MONTHS} selected={month}      onSelect={setMonth} width="100%" />
        <Drum items={years}  selected={year}       onSelect={setYear}  width={70} />
      </div>
    </div>
  )
}
