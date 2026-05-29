import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

// ── Types ──────────────────────────────────────────────────────────────────
export interface Profile {
  id:         string
  full_name:  string | null
  mobile:     string | null
  dob:        string | null
  avatar_url: string | null
}

interface ProfileContextType {
  profile:       Profile | null
  loading:       boolean
  updateProfile: (updates: Partial<Omit<Profile, 'id'>>) => Promise<{ error: string | null }>
  uploadAvatar:  (file: File) => Promise<{ error: string | null; url: string | null }>
  refetch:       () => void
}

const ProfileContext = createContext<ProfileContextType>({
  profile:       null,
  loading:       false,
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
    if (!error) setProfile(prev => ({ id: user.id, full_name: null, mobile: null, dob: null, avatar_url: null, ...prev, ...updates }))
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

  return (
    <ProfileContext.Provider value={{ profile, loading, updateProfile, uploadAvatar, refetch: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────
export function useProfile() {
  return useContext(ProfileContext)
}
