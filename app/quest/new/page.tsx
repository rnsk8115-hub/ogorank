import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import QuestForm from '@/components/quest/QuestForm'
import type { Profile } from '@/lib/types'

export default async function NewQuestPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

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
          <div className="font-mono text-xs mb-1 animate-blink" style={{ color: 'var(--color-cyan)' }}>
            NEW QUEST
          </div>
          <h1 className="text-xl font-bold">クエストを発行する</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-dim)' }}>
            デート予定を登録して、女性に共有URLを送りましょう
          </p>
        </div>
        <QuestForm />
      </main>
    </>
  )
}
