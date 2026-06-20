'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GENRE_OPTIONS } from '@/lib/types'

export default function QuestForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    store_name: '',
    store_address: '',
    genre: '',
    scheduled_date: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'クエストの作成に失敗しました')
      }

      const quest = await res.json()
      router.push(`/quest/${quest.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="hud-card rounded-lg p-6 space-y-5">
        <div>
          <label className="block text-xs mb-2 font-mono" style={{ color: 'var(--color-text-dim)' }}>
            店名 *
          </label>
          <input
            type="text"
            name="store_name"
            value={form.store_name}
            onChange={handleChange}
            placeholder="例: イタリアン ROSSO"
            className="hud-input"
            required
          />
        </div>

        <div>
          <label className="block text-xs mb-2 font-mono" style={{ color: 'var(--color-text-dim)' }}>
            店の住所（任意）
          </label>
          <input
            type="text"
            name="store_address"
            value={form.store_address}
            onChange={handleChange}
            placeholder="例: 東京都渋谷区道玄坂1-1"
            className="hud-input"
          />
        </div>

        <div>
          <label className="block text-xs mb-2 font-mono" style={{ color: 'var(--color-text-dim)' }}>
            ジャンル *
          </label>
          <select
            name="genre"
            value={form.genre}
            onChange={handleChange}
            className="hud-select"
            required
          >
            <option value="">選択してください</option>
            {GENRE_OPTIONS.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs mb-2 font-mono" style={{ color: 'var(--color-text-dim)' }}>
            デート予定日 *
          </label>
          <input
            type="date"
            name="scheduled_date"
            value={form.scheduled_date}
            onChange={handleChange}
            className="hud-input"
            required
          />
        </div>
      </div>

      {error && (
        <p className="text-xs" style={{ color: 'var(--color-magenta)' }}>{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded text-sm">
        {loading ? '[ クエスト発行中... ]' : '[ クエストを発行する ]'}
      </button>
    </form>
  )
}
