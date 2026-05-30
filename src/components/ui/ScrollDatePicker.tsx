/**
 * ScrollDatePicker — iOS-style drum-roll date picker.
 * Uses CSS scroll-snap for reliable mobile momentum scrolling.
 * Hides scrollbars on all browsers (Firefox + WebKit).
 */
import { useRef, useEffect, useCallback, useState } from 'react'

interface Props {
  value:    string        // "YYYY-MM-DD" or ""
  onChange: (v: string) => void
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

const ITEM_H  = 44   // px per row
const VISIBLE = 5    // rows shown (centre = selected)

function daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate()
}
function pad(n: number) { return String(n).padStart(2, '0') }

// ── Injected CSS (once) — hides scrollbars on WebKit / Blink ─────────────────
const STYLE_ID = 'drum-picker-style'
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style')
  s.id = STYLE_ID
  s.textContent = '.drum-scroll::-webkit-scrollbar { display: none }'
  document.head.appendChild(s)
}

// ── Single drum column ────────────────────────────────────────────────────────
interface DrumProps {
  items:    (string | number)[]
  selected: number
  onSelect: (i: number) => void
  width:    number | string
}

function Drum({ items, selected, onSelect, width }: DrumProps) {
  const ref = useRef<HTMLDivElement>(null)

  // Jump to index without animation (mount + external prop change)
  const jumpTo = useCallback((idx: number) => {
    const el = ref.current
    if (!el) return
    el.scrollTop = idx * ITEM_H          // instant — no smooth to avoid fighting snap
  }, [])

  // Mount: position instantly
  useEffect(() => { jumpTo(selected) }, [])   // eslint-disable-line

  // External selection change (e.g. day clamped when month changes)
  const prevSelected = useRef(selected)
  useEffect(() => {
    if (selected !== prevSelected.current) {
      prevSelected.current = selected
      jumpTo(selected)
    }
  }, [selected, jumpTo])

  // After CSS snap settles, read scroll position and call onSelect
  useEffect(() => {
    const el = ref.current
    if (!el) return

    // 'scrollend' fires when momentum + snap are truly done (Safari 16.4+, Chrome 114+)
    // Falls back to a 200 ms debounce for older browsers.
    let timer: ReturnType<typeof setTimeout>

    const commit = () => {
      const idx = Math.round(el.scrollTop / ITEM_H)
      const clamped = Math.max(0, Math.min(items.length - 1, idx))
      prevSelected.current = clamped
      onSelect(clamped)
    }

    const onScrollEnd = () => commit()
    const onScroll    = () => { clearTimeout(timer); timer = setTimeout(commit, 200) }

    const supportsScrollEnd = 'onscrollend' in el
    if (supportsScrollEnd) {
      el.addEventListener('scrollend', onScrollEnd, { passive: true })
    }
    // Always attach scroll fallback for browsers without scrollend
    el.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      el.removeEventListener('scrollend', onScrollEnd)
      el.removeEventListener('scroll', onScroll)
      clearTimeout(timer)
    }
  }, [items.length, onSelect])

  return (
    <div style={{ position: 'relative', width, flexShrink: width === '100%' ? 1 : 0, minWidth: 0 }}>
      {/* Scroll container — CSS snap handles momentum on mobile */}
      <div
        ref={ref}
        className="drum-scroll"
        style={{
          height: ITEM_H * VISIBLE,
          overflowY: 'scroll',
          scrollbarWidth: 'none',           // Firefox
          WebkitOverflowScrolling: 'touch', // legacy iOS
          scrollSnapType: 'y mandatory',    // CSS snap
        }}
      >
        {/* Top padding so first item can centre */}
        <div style={{ height: ITEM_H * Math.floor(VISIBLE / 2) }} />

        {items.map((item, i) => (
          <div
            key={i}
            style={{
              height: ITEM_H,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px',
              fontWeight: i === selected ? 700 : 400,
              color: i === selected ? '#f8fafc' : 'rgba(248,250,252,0.35)',
              cursor: 'pointer',
              userSelect: 'none',
              scrollSnapAlign: 'center',     // snap target
              transition: 'color 0.12s',
            }}
            onClick={() => {
              onSelect(i)
              ref.current?.scrollTo({ top: i * ITEM_H, behavior: 'smooth' })
            }}
          >
            {item}
          </div>
        ))}

        {/* Bottom padding */}
        <div style={{ height: ITEM_H * Math.floor(VISIBLE / 2) }} />
      </div>

      {/* Top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: ITEM_H * Math.floor(VISIBLE / 2),
        background: 'linear-gradient(to bottom, rgba(15,23,42,0.95), transparent)',
        pointerEvents: 'none',
      }} />
      {/* Bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: ITEM_H * Math.floor(VISIBLE / 2),
        background: 'linear-gradient(to top, rgba(15,23,42,0.95), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Selected row highlight */}
      <div style={{
        position: 'absolute',
        top: '50%', transform: 'translateY(-50%)',
        left: 4, right: 4, height: ITEM_H,
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
  const now  = new Date()
  const defY = now.getFullYear() - 25

  const parse = (v: string) => {
    if (!v) return { d: 1, m: 0, y: defY }
    const [y, mo, d] = v.split('-').map(Number)
    return { d: isNaN(d) ? 1 : d, m: isNaN(mo) ? 0 : mo - 1, y: isNaN(y) ? defY : y }
  }

  const init = parse(value)
  const [day,   setDay]   = useState(init.d - 1)
  const [month, setMonth] = useState(init.m)
  const [year,  setYear]  = useState(0)

  // Year range: 1920 → current year − 5, newest first
  const years = Array.from(
    { length: now.getFullYear() - 5 - 1920 + 1 },
    (_, i) => now.getFullYear() - 5 - i
  )

  useEffect(() => {
    const idx = years.indexOf(init.y)
    setYear(idx >= 0 ? idx : years.indexOf(defY))
  }, []) // eslint-disable-line

  const selectedYear = years[year] ?? defY
  const numDays      = daysInMonth(month + 1, selectedYear)
  const days         = Array.from({ length: numDays }, (_, i) => pad(i + 1))
  const clampedDay   = Math.min(day, numDays - 1)

  // Emit value
  useEffect(() => {
    const d = clampedDay + 1
    const m = month + 1
    const y = selectedYear
    if (y && m && d) onChange(`${y}-${pad(m)}-${pad(d)}`)
  }, [clampedDay, month, selectedYear]) // eslint-disable-line

  return (
    <div style={{
      borderRadius: '14px',
      background: 'rgba(15,23,42,0.85)',
      border: '1px solid rgba(99,102,241,0.25)',
      overflow: 'hidden',
      padding: '0 4px',
    }}>
      {/* Headers */}
      <div style={{
        display: 'flex',
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
