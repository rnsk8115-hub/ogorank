import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import RankReveal from '@/components/rank/RankReveal'
import type { Profile } from '@/lib/types'
import { calcHighRatingRatio } from '@/lib/exp'

export default async function RankPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/profile/setup')

  const p = profile as Profile
  const highRatingRatio = calcHighRatingRatio(p)

  return (
    <>
      <Navbar profile={p} />
      <RankReveal profile={p} highRatingRatio={highRatingRatio} />
    </>
  )
}
