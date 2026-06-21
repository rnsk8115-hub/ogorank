'use client'

import { useEffect, useState } from 'react'
import type { Profile } from '@/lib/types'
import { RANK_LABELS } from '@/lib/types'
import { getNextRankInfo } from '@/lib/exp'

const RANK_COLORS: Record<string, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  legend: '#00f0ff',
  god: '#d4af37',
}

interface Props {
  profile: Profile
  highRatingRatio: number
}

export default function RankReveal({ profile, highRatingRatio }: Props) {
  const [phase, setPhase] = useState(0)
  const [expDisplay, setExpDisplay] = useState(0)

  const color = RANK_COLORS[profile.rank]
  const rankInfo = getNextRankInfo(profile.total_exp, profile.rank)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100)
    const t2 = setTimeout(() => setPhase(2), 600)
    const t3 = setTimeout(() => setPhase(3), 1200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  useEffect(() => {
    if (phase < 2) return
    const target = profile.total_exp
    const duration = 1000
    const steps = 40
    const increment = target / steps
    let current = 0
    const interval = setInterval(() => {
      current = Math.min(current + increment, target)
      setExpDisplay(Math.floor(current))
      if (current >= target) clearInterval(interval)
    }, duration / steps)
    return () => clearInterval(interval)
  }, [phase, profile.total_exp])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8">

        <div
          className="text-center"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <div className="font-mono text-xs mb-3 tracking-widest" style={{ color: 'var(--color-text-dim)' }}>
            GENTLEMAN RANK
          </div>

          <div
            className="inline-block px-8 py-4 rounded-lg mb-4"
            style={{
              border: `2px solid ${color}`,
              boxShadow: phase >= 2 ? `0 0 40px ${color}, 0 0 80px ${color}40` : 'none',
              transition: 'box-shadow 0.8s ease',
            }}
          >
            <div
              className="font-mono text-5xl font-bold tracking-wider"
              style={{
                color,
                textShadow: phase >= 2 ? `0 0 20px ${color}` : 'none',
                transition: 'text-shadow 0.8s ease',
              }}
            >
              {RANK_LABELS[profile.rank]}
            </div>
          </div>

          <div className="font-bold text-xl">{profile.nickname}</div>
        </div>

        <div
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s',
          }}
        >
          <div className="hud-card rounded-xl p-6 space-y-5">
            <div className="text-center">
              <div className="font-mono text-xs mb-1" style={{ color: 'var(--color-text-dim)' }}>TOTAL EXP</div>
              <div className="font-mono text-4xl font-bold" style={{ color: 'var(--color-cyan)' }}>
                {expDisplay.toLocaleString()}
              </div>
            </div>

            {rankInfo.nextRank && (
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span style={{ color: 'var(--color-text-dim)' }}>→ {RANK_LABELS[rankInfo.nextRank]}</span>
                  <span style={{ color: 'var(--color-text-dim)' }}>残り {rankInfo.remaining.toLocaleString()} EXP</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: phase >= 2 ? `${rankInfo.progress}%` : '0%',
                      background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                      boxShadow: `0 0 8px ${color}`,
                      transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1) 0.4s',
                    }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 text-center pt-2">
              {[
                { label: 'クエスト数', value: profile.quest_count },
                { label: '高評価率', value: `${highRatingRatio}%` },
                { label: '神紳士', value: profile.god_gentleman_count },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--color-border)' }}>
                  <div className="font-mono text-lg font-bold" style={{ color: 'var(--color-cyan)' }}>{value}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="text-center"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.5s ease',
          }}
        >
          <div className="font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>
            {profile.rank === 'god' ? '▲ 最高ランク達成 ▲' : 'デートで奢るとEXPが増える'}
          </div>
        </div>
      </div>
    </main>
  )
}
