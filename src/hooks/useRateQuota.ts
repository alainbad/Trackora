import { useCallback } from 'react'
import { useProfile } from '../contexts/ProfileContext'

const STORAGE_KEY = 'trackora_rate_searches'
const FREE_LIMIT   = 30

interface QuotaStore { count: number; month: string }

function currentMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}`
}

function readStore(): QuotaStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { count: 0, month: currentMonth() }
    const parsed = JSON.parse(raw) as QuotaStore
    if (parsed.month !== currentMonth()) return { count: 0, month: currentMonth() }
    return parsed
  } catch {
    return { count: 0, month: currentMonth() }
  }
}

function writeStore(s: QuotaStore) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch { /* ignore */ }
}

export function useRateQuota() {
  const { planTier } = useProfile()
  const isPro = planTier === 'pro' || planTier === 'business'

  const store = readStore()
  const remaining = isPro ? Infinity : Math.max(0, FREE_LIMIT - store.count)
  const isLimited = !isPro && store.count >= FREE_LIMIT

  const consume = useCallback(() => {
    if (isPro) return
    const s = readStore()
    writeStore({ count: s.count + 1, month: currentMonth() })
  }, [isPro])

  return { remaining, isLimited, isPro, consume, used: isPro ? 0 : store.count }
}
