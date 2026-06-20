'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'

interface SettlementFormProps {
  questId: string
}

export default function SettlementForm({ questId }: SettlementFormProps) {
  const router = useRouter()
  const [totalAmount, setTotalAmount] = useState('')
  const [malePayment, setMalePayment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const ratio = totalAmount && malePayment
    ? Math.round((Number(malePayment) / Number(totalAmount)) * 100)
    : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (Number(malePayment) > Number(totalAmount)) {
      setError('自分の支払額が合計を超えています')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/quests/${questId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_amount: Number(totalAmount),
          male_payment: Number(malePayment),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : '精算に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs mb-2 font-mono" style={{ color: 'var(--color-text-dim)' }}>
          合計金額 (円) *
        </label>
        <input
          type="number"
          value={totalAmount}
          onChange={e => setTotalAmount(e.target.value)}
          placeholder="例: 10000"
          min={1}
          className="hud-input"
          required
        />
      </div>

      <div>
        <label className="block text-xs mb-2 font-mono" style={{ color: 'var(--color-text-dim)' }}>
          自分の支払額 (円) *
        </label>
        <input
          type="number"
          value={malePayment}
          onChange={e => setMalePayment(e.target.value)}
          placeholder="例: 8000"
          min={0}
          className="hud-input"
          required
        />
      </div>

      {ratio !== null && (
        <div className="p-4 rounded text-center" style={{ background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.2)' }}>
          <div className="text-xs font-mono mb-1" style={{ color: 'var(--color-text-dim)' }}>男気パーセンテージ</div>
          <div className="font-mono text-4xl font-bold text-glow-cyan" style={{ color: 'var(--color-cyan)' }}>
            {ratio}%
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>
            {formatCurrency(Number(malePayment))} / {formatCurrency(Number(totalAmount))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs" style={{ color: 'var(--color-magenta)' }}>{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded text-sm">
        {loading ? '[ 精算中... ]' : '[ 精算を確定する ]'}
      </button>
    </form>
  )
}
