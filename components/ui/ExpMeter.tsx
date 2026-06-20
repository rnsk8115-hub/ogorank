'use client'

import { useEffect, useState } from 'react'
import { getNextRankInfo } from '@/lib/exp'
import { RANK_LABELS } from '@/lib/types'
import type { Rank } from '@/lib/types'

interface ExpMeterProps {
  totalExp: number
  rank: Rank
}

export default function ExpMeter({ totalExp, rank }: ExpMeterProps) {
  const [mounted, setMounted] = useState(false)
  const { nextRank, remaining, progress } = getNextRankInfo(totalExp, rank)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs font-mono" style={{ color: 'var(--color-text-dim)' }}>
        <span>EXP</span>
        <span style={{ color: 'var(--color-cyan)' }}>
          {totalExp.toLocaleString()}
        </span>
      </div>

      <div className="exp-bar-track">
        <div
          className="exp-bar-fill"
          style={{ width: mounted ? `${progress}%` : '0%' }}
        />
      </div>

      <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-dim)' }}>
        {nextRank ? (
          <>
            <span>→ {RANK_LABELS[nextRank as Rank]}</span>
            <span>残り {remaining.toLocaleString()} EXP</span>
          </>
        ) : (
          <span className="text-glow-gold w-full text-center font-mono" style={{ color: 'var(--color-god-gold)' }}>
            MAX RANK ACHIEVED
          </span>
        )}
      </div>
    </div>
  )
}
