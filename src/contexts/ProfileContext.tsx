import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { useIsNativeApp } from '../hooks/useIsNativeApp'

// ── Types ──────────────────────────────────────────────────────────────────
export interface Profile {
  id:         string
  full_name:  string | null
  mobile:     string | null
  dob:        string | null
  avatar_url: string | null
  plan_tier:  'free' | 'pro' | 'business' | null
}

interface ProfileContextType {
  profile:       Profile | null
  loading:       boolean
  planTier:      'free' | 'pro' | 'business'
  updateProfile: (updates: Partial<Omit<Profile, 'id'>>) => Promise<{ error: string | null }>
  uploadAvatar:  (file: File) => Promise<{ error: string | null; url: string | null }>
  refetch:       () => void
}

const ProfileContext = createContext<ProfileContextType>({
  profile:       null,
  loading:       false,
  planTier:      'free',
  updateProfile: async () => ({ error: null }),
  uploadAvatar:  async () => ({ error: null, url: null }),
  refetch:       () => {},
})

// ── Provider ───────────────────────────────────────────────────────────────
export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchProfile = async () => {
    if (!user || !supabase) return
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    setProfile(data ?? null)

    // Apply any pending Gumroad upgrade (paid before signing up)
    if (user.email) {
      const { data: pending } = await supabase
        .from('pending_plan_upgrades')
        .select('plan_tier')
        .eq('email', user.email.toLowerCase())
        .maybeSingle()
      if (pending?.plan_tier) {
        await supabase.from('profiles').upsert({ id: user.id, plan_tier: pending.plan_tier })
        await supabase.from('pending_plan_upgrades').delete().eq('email', user.email.toLowerCase())
        setProfile(prev => prev ? { ...prev, plan_tier: pending.plan_tier } : prev)
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    if (user) fetchProfile()
    else setProfile(null)
  }, [user])

  const updateProfile = async (updates: Partial<Omit<Profile, 'id'>>) => {
    if (!user || !supabase) return { error: 'Not authenticated' }
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates, updated_at: new Date().toISOString() })
    if (!error) setProfile(prev => ({ id: user.id, full_name: null, mobile: null, dob: null, avatar_url: null, plan_tier: null, ...prev, ...updates }))
    return { error: error?.message ?? null }
  }

  const uploadAvatar = async (file: File) => {
    if (!user || !supabase) return { error: 'Not authenticated', url: null }
    const ext  = file.name.split('.').pop() ?? 'jpg'
    const path = `${user.id}/avatar.${ext}`
    const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (upErr) return { error: upErr.message, url: null }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    // append cache-buster so the browser re-fetches the new image
    const url = `${data.publicUrl}?t=${Date.now()}`
    return { error: null, url }
  }

  const isNative = useIsNativeApp()
  // In native app all users are treated as free — Pro/Business must be purchased via IAP
  const planTier: 'free' | 'pro' | 'business' = isNative ? 'free' : (profile?.plan_tier ?? 'free')

  return (
    <ProfileContext.Provider value={{ profile, loading, planTier, updateProfile, uploadAvatar, refetch: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useProfile() {
  return useContext(ProfileContext)
}
