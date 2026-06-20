import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileEditor from '@/components/profile/ProfileEditor'
import Navbar from '@/components/layout/Navbar'
import type { Profile } from '@/lib/types'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <>
      <Navbar profile={profile as Profile | null} />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="font-mono text-xs mb-1" style={{ color: 'var(--color-cyan)' }}>
            PROFILE SETTINGS
          </div>
          <h1 className="text-xl font-bold">プロフィール編集</h1>
        </div>
        <ProfileEditor profile={profile as Profile} />
      </main>
    </>
  )
}
