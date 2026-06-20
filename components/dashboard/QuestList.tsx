import Link from 'next/link'
import type { Quest } from '@/lib/types'
import { formatDate, formatCurrency } from '@/lib/utils'

const STATUS_LABELS: Record<Quest['status'], string> = {
  pending: '精算待ち',
  awaiting_review: '評価待ち',
  completed: '完了',
  expired: '期限切れ',
}

const STATUS_COLORS: Record<Quest['status'], string> = {
  pending: 'var(--color-cyan)',
  awaiting_review: 'var(--color-magenta)',
  completed: '#4ade80',
  expired: 'var(--color-text-dim)',
}

interface QuestListProps {
  quests: Quest[]
}

export default function QuestList({ quests }: QuestListProps) {
  if (quests.length === 0) {
    return (
      <div className="hud-card rounded-lg p-8 text-center">
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-dim)' }}>
          クエストはまだありません
        </p>
        <Link href="/quest/new" className="btn-primary px-6 py-2 rounded text-xs inline-block">
          [ 最初のクエストを発行する ]
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {quests.map(quest => (
        <Link key={quest.id} href={`/quest/${quest.id}`}>
          <div className="hud-card rounded-lg p-4 transition-all hover:border-cyan-500" style={{ cursor: 'pointer' }}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded border"
                    style={{ color: STATUS_COLORS[quest.status], borderColor: STATUS_COLORS[quest.status] }}
                  >
                    {STATUS_LABELS[quest.status]}
                  </span>
                </div>
                <p className="font-bold text-sm truncate">{quest.store_name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-dim)' }}>
                  {quest.genre} · {formatDate(quest.scheduled_date)}
                </p>
              </div>
              <div className="text-right ml-3">
                {quest.male_payment_ratio !== null ? (
                  <>
                    <div className="font-mono text-lg font-bold" style={{ color: 'var(--color-cyan)' }}>
                      {quest.male_payment_ratio}%
                    </div>
                    <div className="text-xs" style={{ color: 'var(--color-text-dim)' }}>男気</div>
                  </>
                ) : (
                  <div className="font-mono text-sm" style={{ color: 'var(--color-text-dim)' }}>
                    {formatCurrency(quest.budget)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
