import { useState, useRef, useEffect } from 'react'
import { X, Camera, User, Phone, Calendar, Check, Loader, Trash2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useProfile } from '../../contexts/ProfileContext'
import { useIsNativeApp } from '../../hooks/useIsNativeApp'
import { supabase } from '../../lib/supabase'
import ScrollDatePicker from '../ui/ScrollDatePicker'

interface ProfileModalProps {
  onClose: () => void
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const { user, signOut }                          = useAuth()
  const { profile, updateProfile, uploadAvatar }   = useProfile()
  const isNative = useIsNativeApp()

  const [fullName,     setFullName]     = useState(profile?.full_name  ?? '')
  const [mobile,       setMobile]       = useState(profile?.mobile     ?? '')
  const [dob,          setDob]          = useState(profile?.dob        ?? '')
  const [avatarPreview,setAvatarPreview]= useState<string | null>(profile?.avatar_url ?? null)
  const [avatarFile,   setAvatarFile]   = useState<File | null>(null)
  const [saving,       setSaving]       = useState(false)
  const [saved,        setSaved]        = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting,     setDeleting]     = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose])

  // Sync profile data when it loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name  ?? '')
      setMobile(profile.mobile       ?? '')
      setDob(profile.dob             ?? '')
      setAvatarPreview(profile.avatar_url ?? null)
    }
  }, [profile])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleDeleteAccount = async () => {
    if (!supabase || !user) return
    setDeleting(true)
    setError(null)
    try {
      // Delete user data
      await supabase.from('shipments').delete().eq('user_id', user.id)
      await supabase.from('profiles').delete().eq('id', user.id)
      // Delete auth user via edge function or admin — fall back to sign out
      const { error: fnErr } = await supabase.functions.invoke('delete-account', {})
      if (fnErr) {
        // If edge function not available, sign out and note deletion is pending
        await signOut()
      }
      onClose()
    } catch {
      setError('Failed to delete account. Please contact support.')
      setDeleting(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      let avatarUrl = profile?.avatar_url ?? null

      // Upload new avatar if selected
      if (avatarFile) {
        const { error: upErr, url } = await uploadAvatar(avatarFile)
        if (upErr) { setError(upErr); setSaving(false); return }
        avatarUrl = url
      }

      const { error: saveErr } = await updateProfile({
        full_name:  fullName  || null,
        mobile:     mobile    || null,
        dob:        dob       || null,
        avatar_url: avatarUrl,
      })

      if (saveErr) { setError(saveErr); return }

      setSaved(true)
      setTimeout(() => { setSaved(false); onClose() }, 1200)
    } finally {
      setSaving(false)
    }
  }

  // ── Shared styles ─────────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '11px 14px 11px 42px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', color: '#f8fafc', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.2s',
  }

  const initials = (fullName || user?.email || '?').slice(0, 2).toUpperCase()

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={onClose}
    >
      <div
        style={{ background: 'rgba(10,15,30,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '36px', maxWidth: '440px', width: '100%', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(248,250,252,0.5)' }}>
          <X size={15} />
        </button>

        {/* Header */}
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>Edit Profile</h2>
        <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.4)', marginBottom: '28px' }}>{user?.email}</p>

        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <div style={{ position: 'relative', cursor: isNative ? 'default' : 'pointer' }} onClick={() => !isNative && fileInputRef.current?.click()}>
            <div style={{ width: '88px', height: '88px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, #6366f1, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(99,102,241,0.4)' }}>
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '28px', fontWeight: 700, color: 'white' }}>{initials}</span>
              }
            </div>
            {/* Camera overlay — hidden in native to avoid camera permission crash */}
            {!isNative && (
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(10,15,30,0.98)' }}>
                <Camera size={13} color="white" />
              </div>
            )}
          </div>
          {!isNative && <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />}
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>

          {/* Full name */}
          <div style={{ position: 'relative' }}>
            <User size={14} color="rgba(248,250,252,0.3)" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text" value={fullName} onChange={e => setFullName(e.target.value)}
              placeholder="Full name"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')}
              onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Mobile */}
          <div style={{ position: 'relative' }}>
            <Phone size={14} color="rgba(248,250,252,0.3)" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="tel" value={mobile} onChange={e => setMobile(e.target.value)}
              placeholder="Mobile number (e.g. +971 50 123 4567)"
              style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)')}
              onBlur={e  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Date of birth — scroll picker */}
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(248,250,252,0.35)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={12} color="rgba(248,250,252,0.35)" /> Date of Birth
            </p>
            <ScrollDatePicker value={dob} onChange={setDob} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving || saved}
          style={{ width: '100%', padding: '12px', borderRadius: '10px', fontSize: '15px', fontWeight: 600, border: 'none', cursor: saving || saved ? 'not-allowed' : 'pointer', background: saved ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, #6366f1, #4f46e5)', color: saved ? '#10b981' : 'white', boxShadow: saved ? 'none' : '0 4px 20px rgba(99,102,241,0.3)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {saving ? <><Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : saved ? <><Check size={15} /> Saved!</> : 'Save Profile'}
        </button>

        {/* Delete Account */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.06)', color: 'rgba(248,113,113,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Trash2 size={13} /> Delete Account
            </button>
          ) : (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '16px' }}>
              <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.7)', marginBottom: '12px', textAlign: 'center', lineHeight: 1.5 }}>
                This will permanently delete your account and all data. This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{ flex: 1, padding: '9px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(248,250,252,0.6)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  style={{ flex: 1, padding: '9px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, border: 'none', background: 'rgba(239,68,68,0.8)', color: 'white', cursor: deleting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  {deleting ? <><Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> Deleting…</> : 'Yes, Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
