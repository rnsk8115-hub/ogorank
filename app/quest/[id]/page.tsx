import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import SettlementForm from '@/components/quest/SettlementForm'
import ShareButton from '@/components/quest/ShareButton'
import type { Profile, Quest } from '@/lib/types'
import { formatDate, formatCurrency } from '@/lib/utils'

export default async function QuestDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const { data: quest } = await supabase
    .from('quests')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!quest) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const q = quest as Quest
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://ogorank.vercel.app').trim()
  const shareUrl = `${appUrl}/q/${q.share_token}`

  return (
    <>
      <Navbar profile={profile as Profile | null} />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div>
          <div className="font-mono text-xs mb-1" style={{ color: 'var(--color-cyan)' }}>
            QUEST DETAIL
          </div>
          <h1 className="text-xl font-bold">{q.store_name}</h1>
        </div>

        <div className="hud-card rounded-lg p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs font-mono" style={{ color: 'var(--color-text-dim)' }}>ジャンル</span>
              <p>{q.genre}</p>
            </div>
            <div>
              <span className="text-xs font-mono" style={{ color: 'var(--color-text-dim)' }}>ジャンル</span>
              <p>{q.genre}</p>
            </div>
            <div>
              <span className="text-xs font-mono" style={{ color: 'var(--color-text-dim)' }}>デート日</span>
              <p>{formatDate(q.scheduled_date)}</p>
            </div>
            <div>
              <span className="text-xs font-mono" style={{ color: 'var(--color-text-dim)' }}>ステータス</span>
              <p style={{ color: q.status === 'completed' ? '#4ade80' : q.status === 'awaiting_review' ? 'var(--color-magenta)' : 'var(--color-cyan)' }}>
                {q.status === 'pending' ? '精算待ち' : q.status === 'awaiting_review' ? '評価待ち' : '完了'}
              </p>
            </div>
          </div>
        </div>

        <div className="hud-card rounded-lg p-5">
          <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-text-dim)' }}>
            SHARE URL
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-dim)' }}>
            女性にこのURLを共有してください。デート後は再送をお願いします。
          </p>
          <ShareButton url={shareUrl} />
        </div>

        {q.status === 'pending' && (
          <div className="hud-card rounded-lg p-5">
            <div className="font-mono text-xs mb-4" style={{ color: 'var(--color-cyan)' }}>
              SETTLEMENT INPUT
            </div>
            <SettlementForm questId={q.id} />
          </div>
        )}

        {q.status === 'awaiting_review' && q.male_payment_ratio !== null && (
          <div className="hud-card hud-card-magenta rounded-lg p-5 text-center">
            <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-text-dim)' }}>
              男気パーセンテージ
            </div>
            <div className="font-mono text-6xl font-bold text-glow-cyan mb-2" style={{ color: 'var(--color-cyan)' }}>
              {q.male_payment_ratio}%
            </div>
            <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
              女性の評価を待っています
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--color-magenta)' }}>
              LINEでURLを再送して、評価をお願いしましょう
            </p>
          </div>
        )}

        {q.status === 'completed' && q.male_payment_ratio !== null && (
          <div className="hud-card rounded-lg p-5 text-center">
            <div className="font-mono text-xs mb-3" style={{ color: '#4ade80' }}>
              QUEST COMPLETE
            </div>
            <div className="font-mono text-5xl font-bold mb-2" style={{ color: 'var(--color-cyan)' }}>
              {q.male_payment_ratio}%
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text-dim)' }}>
              合計 {formatCurrency(q.total_amount ?? 0)} / 負担 {formatCurrency(q.male_payment ?? 0)}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
