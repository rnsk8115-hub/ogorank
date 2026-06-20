'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function ProfileSetupPage() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nickname.trim()) {
      setError('ニックネームを入力してください')
      return
    }

    setLoading(true)
    setError('')

    try {
      let avatar_url: string | undefined

      if (avatarFile) {
        const formData = new FormData()
        formData.append('file', avatarFile)
        const res = await fetch('/api/profile/avatar', {
          method: 'POST',
          body: formData,
        })
        if (res.ok) {
          const data = await res.json()
          avatar_url = data.avatar_url
        }
      }

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim(), ...(avatar_url && { avatar_url }) }),
      })

      if (!res.ok) {
        throw new Error('プロフィールの保存に失敗しました')
      }

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="hud-card rounded-lg p-8 w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-mono text-xs mb-2 animate-blink" style={{ color: 'var(--color-cyan)' }}>
            INITIAL SETUP
          </div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            紳士プロフィールを設定
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-24 h-24 rounded-full overflow-hidden border-2 flex items-center justify-center cursor-pointer"
              style={{ borderColor: 'var(--color-border)', background: 'rgba(0,0,0,0.5)' }}
              onClick={() => document.getElementById('avatar-input')?.click()}
            >
              {avatarPreview ? (
                <Image src={avatarPreview} alt="preview" width={96} height={96} className="object-cover w-full h-full" />
              ) : (
                <span className="text-2xl" style={{ color: 'var(--color-text-dim)' }}>👤</span>
              )}
            </div>
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => document.getElementById('avatar-input')?.click()}
              className="text-xs"
              style={{ color: 'var(--color-cyan)' }}
            >
              顔写真をアップロード（任意）
            </button>
          </div>

          <div>
            <label className="block text-xs mb-2 font-mono" style={{ color: 'var(--color-text-dim)' }}>
              ニックネーム *
            </label>
            <input
              type="text"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="例: タロウ"
              maxLength={20}
              className="hud-input"
              required
            />
          </div>

          {error && (
            <p className="text-xs" style={{ color: 'var(--color-magenta)' }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 rounded text-sm"
          >
            {loading ? '[ 保存中... ]' : '[ 紳士として登録する ]'}
          </button>
        </form>
      </div>
    </main>
  )
}
