'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Profile } from '@/lib/types'

interface ProfileEditorProps {
  profile: Profile
}

export default function ProfileEditor({ profile }: ProfileEditorProps) {
  const router = useRouter()
  const [nickname, setNickname] = useState(profile.nickname)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      let avatar_url = profile.avatar_url

      if (avatarFile) {
        const formData = new FormData()
        formData.append('file', avatarFile)
        const res = await fetch('/api/profile/avatar', { method: 'POST', body: formData })
        if (res.ok) {
          const data = await res.json()
          avatar_url = data.avatar_url
        }
      }

      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, avatar_url }),
      })

      setMessage('保存しました')
      router.refresh()
    } catch {
      setMessage('保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="hud-card rounded-lg p-6 flex flex-col items-center gap-4">
        <div
          className="w-24 h-24 rounded-full overflow-hidden border-2 flex items-center justify-center cursor-pointer"
          style={{ borderColor: 'var(--color-border)', background: 'rgba(0,0,0,0.5)' }}
          onClick={() => document.getElementById('profile-avatar')?.click()}
        >
          {avatarPreview ? (
            <Image src={avatarPreview} alt="avatar" width={96} height={96} className="object-cover w-full h-full" />
          ) : (
            <span className="text-3xl">👤</span>
          )}
        </div>
        <input id="profile-avatar" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <button type="button" onClick={() => document.getElementById('profile-avatar')?.click()} className="text-xs" style={{ color: 'var(--color-cyan)' }}>
          写真を変更
        </button>
      </div>

      <div>
        <label className="block text-xs mb-2 font-mono" style={{ color: 'var(--color-text-dim)' }}>
          ニックネーム
        </label>
        <input
          type="text"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          maxLength={20}
          className="hud-input"
          required
        />
      </div>

      {message && (
        <p className="text-xs" style={{ color: message === '保存しました' ? 'var(--color-cyan)' : 'var(--color-magenta)' }}>
          {message}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded text-sm">
        {loading ? '[ 保存中... ]' : '[ 保存する ]'}
      </button>
    </form>
  )
}
