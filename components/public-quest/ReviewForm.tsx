'use client'

import { useState } from 'react'
import type { Rating } from '@/lib/types'

const RATING_OPTIONS: { value: Rating; label: string; desc: string; color: string }[] = [
  { value: 'god_gentleman', label: '神紳士', desc: 'EXP 1.5倍ボーナス', color: 'var(--color-god-gold)' },
  { value: 'gentleman', label: '紳士', desc: '通常EXP', color: 'var(--color-cyan)' },
  { value: 'normal', label: '普通・その他', desc: 'EXP最小', color: 'var(--color-text-dim)' },
]

interface ReviewFormProps {
  questId: string
}

export default function ReviewForm({ questId }: ReviewFormProps) {
  const [selected, setSelected] = useState<Rating | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!selected) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quest_id: questId, rating: selected }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || '送信に失敗しました')
      }

      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '送信に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-4">
        <div className="text-3xl mb-2">✓</div>
        <p className="font-mono text-sm" style={{ color: 'var(--color-cyan)' }}>
          評価を送信しました！
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--color-text-dim)' }}>
          ありがとうございました
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {RATING_OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => setSelected(opt.value)}
          className="w-full p-4 rounded text-left transition-all"
          style={{
            background: selected === opt.value ? `rgba(${opt.color === 'var(--color-god-gold)' ? '212,175,55' : opt.color === 'var(--color-cyan)' ? '0,240,255' : '107,122,141'},0.1)` : 'rgba(0,0,0,0.3)',
            border: `1px solid ${selected === opt.value ? opt.color : 'var(--color-border)'}`,
            boxShadow: selected === opt.value ? `0 0 12px ${opt.color}40` : 'none',
          }}
        >
          <div className="font-bold text-sm" style={{ color: opt.color }}>{opt.label}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-dim)' }}>{opt.desc}</div>
        </button>
      ))}

      {error && (
        <p className="text-xs" style={{ color: 'var(--color-magenta)' }}>{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!selected || loading}
        className="btn-primary w-full py-3 rounded text-sm mt-2"
      >
        {loading ? '[ 送信中... ]' : '[ 評価を送信する ]'}
      </button>
    </div>
  )
}
