import { useState, useEffect, useRef } from 'react'
import { X, Mail, Lock, Eye, EyeOff, CheckCircle, Zap, RefreshCw } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

interface AuthModalProps {
  initialMode?: 'signin' | 'signup'
  onClose: () => void
  guestLimitMessage?: string
}

export default function AuthModal({ initialMode = 'signin', onClose, guestLimitMessage }: AuthModalProps) {
  const [mode,         setMode]         = useState<'signin' | 'signup'>(initialMode)
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [done,         setDone]         = useState(false)   // email-confirm screen
  const [resendCd,     setResendCd]     = useState(0)       // countdown seconds
  const [resending,    setResending]    = useState(false)
  const [resendOk,     setResendOk]     = useState(false)
  const cdRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { signIn, signUp } = useAuth()

  function startCountdown() {
    setResendCd(60)
    setResendOk(false)
    if (cdRef.current) clearInterval(cdRef.current)
    cdRef.current = setInterval(() => {
      setResendCd(n => {
        if (n <= 1) { clearInterval(cdRef.current!); cdRef.current = null; return 0 }
        return n - 1
      })
    }, 1000)
  }

  async function handleResend() {
    if (resendCd > 0 || resending || !email || !supabase) return
    setResending(true)
    try {
      await supabase.auth.resend({ type: 'signup', email })
      setResendOk(true)
      startCountdown()
    } finally {
      setResending(false)
    }
  }

  // clean up interval on unmount
  useEffect(() => () => { if (cdRef.current) clearInterval(cdRef.current) }, [])

  // Close on Escape
  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [onClose])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const switchMode = (m: 'signin' | 'signup') => {
    setMode(m); setError(null); setDone(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError(null)

    if (mode === 'signup' && password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password)
        if (error) setError(error)
        else onClose()
      } else {
        const { error, needsConfirmation } = await signUp(email, password)
        if (error) setError(error)
        else if (needsConfirmation) setDone(true)
        else onClose()   // email confirm disabled → auto signed-in
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Shared input style ──────────────────────────────────────────────────
  const inputBase: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px 12px 44px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#f8fafc',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  // ── Email-confirm success screen ─────────────────────────────────────────
  if (done) {
    return (
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
        onClick={onClose}
      >
        <div
          style={{ background: 'rgba(10,15,30,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '48px 40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}
          onClick={e => e.stopPropagation()}
        >
          <CheckCircle size={52} color="#10b981" style={{ margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
            Check your email
          </h3>
          <p style={{ fontSize: '15px', color: 'rgba(248,250,252,0.6)', lineHeight: 1.7, marginBottom: '28px' }}>
            We sent a confirmation link to{' '}
            <span style={{ color: '#818cf8', fontWeight: 600 }}>{email}</span>.
            <br />Click the link to activate your account.
          </p>
          <button
            onClick={onClose}
            style={{ padding: '12px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.35)', marginBottom: '16px' }}
          >
            Got it
          </button>
          <div style={{ marginTop: '4px' }}>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCd > 0 || resending}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', margin: '0 auto',
                padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                border: '1px solid rgba(99,102,241,0.4)',
                background: resendCd > 0 ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.15)',
                color: resendCd > 0 ? 'rgba(129,140,248,0.45)' : '#818cf8',
                cursor: resendCd > 0 || resending ? 'not-allowed' : 'pointer',
              }}
            >
              <RefreshCw size={13} style={resending ? { animation: 'spin 1s linear infinite' } : {}} />
              {resending ? 'Sending…' : resendCd > 0 ? `Resend in ${resendCd}s` : 'Resend confirmation email'}
            </button>
            {resendOk && <p style={{ fontSize: '12px', color: '#10b981', marginTop: '8px' }}>✓ New email sent!</p>}
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  // ── Main modal ────────────────────────────────────────────────────────────
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={onClose}
    >
      <div
        style={{ background: 'rgba(10,15,30,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '40px', maxWidth: '420px', width: '100%', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(248,250,252,0.5)' }}
        >
          <X size={15} />
        </button>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="white" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>Trackora</span>
        </div>

        {/* Mode toggle tabs */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px', marginBottom: '28px', border: '1px solid rgba(255,255,255,0.07)' }}>
          {(['signin', 'signup'] as const).map(m => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{ flex: 1, padding: '9px', borderRadius: '9px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', background: mode === m ? 'rgba(99,102,241,0.2)' : 'transparent', color: mode === m ? '#818cf8' : 'rgba(248,250,252,0.45)', transition: 'all 0.2s' }}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Guest limit banner */}
        {guestLimitMessage && (
          <div style={{
            padding: '12px 14px', borderRadius: '10px', marginBottom: '20px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
            fontSize: '13px', color: '#a5b4fc', lineHeight: 1.6,
          }}>
            {guestLimitMessage}
          </div>
        )}

        {/* Heading */}
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.45)', marginBottom: '24px' }}>
          {mode === 'signin'
            ? 'Sign in to manage and track your shipments.'
            : 'Start tracking shipments for free — no credit card required.'}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Mail size={15} color="rgba(248,250,252,0.3)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={inputBase}
              onFocus={e  => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')}
              onBlur={e   => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Lock size={15} color="rgba(248,250,252,0.3)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'Password (min. 8 characters)' : 'Password'}
              style={{ ...inputBase, paddingRight: '44px' }}
              onFocus={e  => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')}
              onBlur={e   => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(248,250,252,0.3)', padding: 0 }}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', color: '#fca5a5', lineHeight: 1.5 }}>
                {error}
              </div>
              {error.toLowerCase().includes('confirm') && (
                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCd > 0 || resending}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                      border: '1px solid rgba(99,102,241,0.4)',
                      background: resendCd > 0 ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.15)',
                      color: resendCd > 0 ? 'rgba(129,140,248,0.45)' : '#818cf8',
                      cursor: resendCd > 0 || resending ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <RefreshCw size={13} style={resending ? { animation: 'spin 1s linear infinite' } : {}} />
                    {resending ? 'Sending…' : resendCd > 0 ? `Resend in ${resendCd}s` : 'Resend confirmation email'}
                  </button>
                  {resendOk && <span style={{ fontSize: '12px', color: '#10b981' }}>✓ Email sent!</span>}
                </div>
              )}
            </div>
          )}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '13px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.35)', transition: 'all 0.2s', marginBottom: '16px' }}
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Free Account'}
          </button>
        </form>

        {/* Footer note */}
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(248,250,252,0.35)' }}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#818cf8', fontWeight: 600, fontSize: '13px', padding: 0 }}
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  )
}
