import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import NeonBadge from '@/components/ui/NeonBadge'
import ExpMeter from '@/components/ui/ExpMeter'
import QuestList from '@/components/dashboard/QuestList'
import GodRankUpModal from '@/components/god-animation/GodRankUpModal'
import { calcHighRatingRatio } from '@/lib/exp'
import type { Profile, Quest } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/profile/setup')

  const { data: quests } = await supabase
    .from('quests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const p = profile as Profile
  const highRatingRatio = calcHighRatingRatio(p)

  return (
    <>
      <Navbar profile={p} />

      {p.god_rank_up_pending && (
        <GodRankUpModal />
      )}

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="hud-card hud-card-god rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-mono text-xs mb-1" style={{ color: 'var(--color-text-dim)' }}>
                GENTLEMAN RANK
              </div>
              <h2 className="text-lg font-bold">{p.nickname}</h2>
            </div>
            <NeonBadge rank={p.rank} size="lg" />
          </div>

          <ExpMeter totalExp={p.total_exp} rank={p.rank} />

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="text-center p-3 rounded" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)' }}>
              <div className="font-mono text-xl font-bold" style={{ color: 'var(--color-cyan)' }}>
                {p.total_exp.toLocaleString()}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>累計EXP</div>
            </div>
            <div className="text-center p-3 rounded" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)' }}>
              <div className="font-mono text-xl font-bold" style={{ color: 'var(--color-cyan)' }}>
                {p.quest_count}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>クエスト数</div>
            </div>
            <div className="text-center p-3 rounded" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)' }}>
              <div className="font-mono text-xl font-bold" style={{ color: highRatingRatio >= 80 ? 'var(--color-god-gold)' : 'var(--color-cyan)' }}>
                {highRatingRatio}%
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>高評価率</div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>
              QUEST LOG
            </div>
          </div>
          <QuestList quests={(quests ?? []) as Quest[]} />
        </div>
      </main>
    </>
  )
}
