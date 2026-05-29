import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

const IDLE_MS  = 5 * 60 * 1000   // 5 minutes → sign out
const WARN_MS  = 30 * 1000        // warn 30 s before

// ── Types ──────────────────────────────────────────────────────────────────
interface AuthContextType {
  user:    User | null
  loading: boolean
  signIn:  (email: string, password: string) => Promise<{ error: string | null }>
  signUp:  (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user:    null,
  loading: false,
  signIn:  async () => ({ error: 'Auth not configured' }),
  signUp:  async () => ({ error: 'Auth not configured', needsConfirmation: false }),
  signOut: async () => {},
})

// ── Idle warning overlay ───────────────────────────────────────────────────
function IdleWarning({ secondsLeft, onStay }: { secondsLeft: number; onStay: () => void }) {
  return createPortal(
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      background: 'rgba(15,20,40,0.97)', backdropFilter: 'blur(16px)',
      border: '1px solid rgba(245,158,11,0.4)',
      borderRadius: '16px', padding: '20px 24px', maxWidth: '320px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
      animation: 'slideInUp 0.25s ease',
    }}>
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <span style={{ fontSize: '20px' }}>⏱</span>
        <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '14px' }}>
          Session expiring soon
        </span>
        <span style={{
          marginLeft: 'auto', fontWeight: 800, fontSize: '16px',
          color: secondsLeft <= 10 ? '#ef4444' : '#f59e0b',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {secondsLeft}s
        </span>
      </div>
      <p style={{ fontSize: '12px', color: 'rgba(248,250,252,0.5)', marginBottom: '14px', lineHeight: 1.5 }}>
        You've been inactive for 5 minutes. You'll be signed out automatically.
      </p>
      <button
        onClick={onStay}
        style={{
          width: '100%', padding: '9px', borderRadius: '10px', cursor: 'pointer',
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          border: 'none', color: 'white', fontSize: '13px', fontWeight: 700,
        }}
      >
        Stay signed in
      </button>
    </div>,
    document.body,
  )
}

// ── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,        setUser]        = useState<User | null>(null)
  const [loading,     setLoading]     = useState(!!supabase)
  const [idleWarning, setIdleWarning] = useState(false)
  const [countdown,   setCountdown]   = useState(WARN_MS / 1000)

  const signOutTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warnTimer     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const countdownRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearAllTimers = useCallback(() => {
    if (signOutTimer.current)  clearTimeout(signOutTimer.current)
    if (warnTimer.current)     clearTimeout(warnTimer.current)
    if (countdownRef.current)  clearInterval(countdownRef.current)
  }, [])

  const doSignOut = useCallback(async () => {
    clearAllTimers()
    setIdleWarning(false)
    if (supabase) await supabase.auth.signOut()
  }, [clearAllTimers])

  const resetIdleTimer = useCallback(() => {
    if (!supabase) return
    clearAllTimers()
    setIdleWarning(false)

    warnTimer.current = setTimeout(() => {
      setIdleWarning(true)
      setCountdown(WARN_MS / 1000)
      countdownRef.current = setInterval(() => {
        setCountdown(s => {
          if (s <= 1) { clearInterval(countdownRef.current!); return 0 }
          return s - 1
        })
      }, 1000)
    }, IDLE_MS - WARN_MS)

    signOutTimer.current = setTimeout(doSignOut, IDLE_MS)
  }, [clearAllTimers, doSignOut])

  // Start/stop idle tracking based on whether user is signed in
  useEffect(() => {
    if (!user) { clearAllTimers(); setIdleWarning(false); return }

    const EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'] as const
    EVENTS.forEach(e => window.addEventListener(e, resetIdleTimer, { passive: true }))
    resetIdleTimer()

    return () => {
      EVENTS.forEach(e => window.removeEventListener(e, resetIdleTimer))
      clearAllTimers()
    }
  }, [user, resetIdleTimer, clearAllTimers])

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Map raw Supabase error messages to user-friendly copy ──────────────────
  function friendlyAuthError(msg: string): string {
    const m = msg.toLowerCase()
    if (m.includes('rate limit') || m.includes('too many'))
      return 'Too many requests — please wait a minute and try again.'
    if (m.includes('user already registered') || m.includes('already been registered'))
      return 'An account with this email already exists. Try signing in instead.'
    if (m.includes('invalid login credentials') || m.includes('invalid email or password'))
      return 'Incorrect email or password. Please check and try again.'
    if (m.includes('email not confirmed'))
      return 'Please confirm your email address first — check your inbox.'
    if (m.includes('password') && m.includes('6'))
      return 'Password must be at least 8 characters.'
    if (m.includes('unable to validate email'))
      return 'Please enter a valid email address.'
    if (m.includes('signup') && m.includes('disabled'))
      return 'Sign-ups are temporarily disabled. Please try again later.'
    return msg  // fallback: show raw message if no pattern matched
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: 'Auth not configured — add Supabase env vars to .env.local' }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error ? friendlyAuthError(error.message) : null }
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { error: 'Auth not configured — add Supabase env vars to .env.local', needsConfirmation: false }
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error: friendlyAuthError(error.message), needsConfirmation: false }
    return { error: null, needsConfirmation: !data.session }
  }

  const signOut = async () => {
    if (!supabase) return
    clearAllTimers()
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
      {idleWarning && (
        <IdleWarning secondsLeft={countdown} onStay={resetIdleTimer} />
      )}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useAuth() {
  return useContext(AuthContext)
}
