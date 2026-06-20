import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import NeonBadge from '@/components/ui/NeonBadge'
import ReviewForm from '@/components/public-quest/ReviewForm'
import type { Profile, Quest } from '@/lib/types'
import { formatDate, formatCurrency, isQuestExpired } from '@/lib/utils'
import { calcHighRatingRatio } from '@/lib/exp'
import { RANK_LABELS } from '@/lib/types'

export default async function PublicQuestPage(props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params
  const supabase = await createClient()

  const { data: quest } = await supabase
    .from('quests')
    .select('*, profile:profiles(*)')
    .eq('share_token', token)
    .single()

  if (!quest) notFound()

  const q = quest as Quest & { profile: Profile }

  if (isQuestExpired(q.expires_at) && q.status !== 'completed') {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="hud-card rounded-lg p-8 text-center max-w-sm w-full">
          <div className="font-mono text-xs mb-2" style={{ color: 'var(--color-magenta)' }}>
            LINK EXPIRED
          </div>
          <p style={{ color: 'var(--color-text-dim)' }}>このリンクの有効期限が切れました</p>
        </div>
      </main>
    )
  }

  const profile = q.profile
  const highRatingRatio = calcHighRatingRatio(profile)

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-sm mx-auto space-y-5">
        <div className="text-center mb-2">
          <span className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>奢RANK | QUEST INVITATION</span>
        </div>

        <div className="hud-card rounded-lg p-6">
          <div className="font-mono text-xs mb-4" style={{ color: 'var(--color-text-dim)' }}>ESCORT PROFILE</div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0 flex items-center justify-center"
              style={{ borderColor: 'var(--color-border)', background: 'rgba(0,0,0,0.5)' }}>
              {profile.avatar_url ? (
                <Image src={profile.avatar_url} alt={profile.nickname} width={64} height={64} className="object-cover w-full h-full" />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <div>
              <p className="font-bold text-lg">{profile.nickname}</p>
              <NeonBadge rank={profile.rank} size="sm" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="p-2 rounded" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)' }}>
              <div className="font-mono text-sm font-bold" style={{ color: 'var(--color-cyan)' }}>{profile.quest_count}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-dim)' }}>デート数</div>
            </div>
            <div className="p-2 rounded" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)' }}>
              <div className="font-mono text-sm font-bold" style={{ color: 'var(--color-cyan)' }}>{highRatingRatio}%</div>
              <div className="text-xs" style={{ color: 'var(--color-text-dim)' }}>高評価率</div>
            </div>
            <div className="p-2 rounded" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--color-border)' }}>
              <div className="font-mono text-sm font-bold" style={{ color: 'var(--color-cyan)' }}>
                {profile.total_exp.toLocaleString()}
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-dim)' }}>EXP</div>
            </div>
          </div>
        </div>

        <div className="hud-card rounded-lg p-5">
          <div className="font-mono text-xs mb-4" style={{ color: 'var(--color-text-dim)' }}>MISSION AREA</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span style={{ color: 'var(--color-text-dim)' }}>店名</span>
              <span className="font-bold">{q.store_name}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-text-dim)' }}>ジャンル</span>
              <span>{q.genre}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--color-text-dim)' }}>日程</span>
              <span>{formatDate(q.scheduled_date)}</span>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q.store_address ? `${q.store_name} ${q.store_address}` : q.store_name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded text-xs font-mono"
            style={{
              border: '1px solid var(--color-cyan)',
              color: 'var(--color-cyan)',
            }}
          >
            <span>📍</span> Google マップで開く
          </a>
        </div>

        {q.status === 'awaiting_review' && q.male_payment_ratio !== null && (
          <>
            <div className="hud-card hud-card-magenta rounded-lg p-5 text-center">
              <div className="font-mono text-xs mb-3" style={{ color: 'var(--color-text-dim)' }}>男気パーセンテージ</div>
              <div className="font-mono text-6xl font-bold text-glow-cyan mb-2" style={{ color: 'var(--color-cyan)' }}>
                {q.male_payment_ratio}%
              </div>
              <div className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
                合計 {formatCurrency(q.total_amount ?? 0)} のうち {formatCurrency(q.male_payment ?? 0)} を負担
              </div>
            </div>

            <div className="hud-card rounded-lg p-5">
              <div className="font-mono text-xs mb-4" style={{ color: 'var(--color-cyan)' }}>
                EVALUATION REQUEST
              </div>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-dim)' }}>
                {profile.nickname} さんのエスコートはいかがでしたか？
              </p>
              <ReviewForm questId={q.id} />
            </div>
          </>
        )}

        {q.status === 'completed' && (
          <div className="hud-card rounded-lg p-6 text-center">
            <div className="text-2xl mb-2">✓</div>
            <p className="font-mono text-sm" style={{ color: '#4ade80' }}>評価済みです</p>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-dim)' }}>
              ご回答ありがとうございました
            </p>
          </div>
        )}

        {q.status === 'pending' && (
          <div className="hud-card rounded-lg p-5 text-center">
            <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>
              デート後に精算情報が更新されます
            </p>
          </div>
        )}

        <div className="text-center pb-4">
          <span className="text-xs font-mono" style={{ color: 'var(--color-text-dim)' }}>奢RANK</span>
        </div>
      </div>
    </main>
  )
}
