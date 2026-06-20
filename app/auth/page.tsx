'use client'

import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AuthContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  async function handleGoogleLogin() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="hud-card rounded-lg p-8 w-full max-w-sm text-center">
        <div className="mb-8">
          <h1 className="font-mono text-3xl font-bold text-cyan text-glow-cyan mb-2">
            奢RANK
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-dim)' }}>
            SYSTEM LOGIN REQUIRED
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 border border-magenta rounded text-sm" style={{ color: 'var(--color-magenta)' }}>
            ログインに失敗しました。再度お試しください。
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          className="btn-primary w-full py-3 rounded text-sm"
        >
          [ Googleでログイン ]
        </button>

        <p className="mt-6 text-xs" style={{ color: 'var(--color-text-dim)' }}>
          ログインすることで利用規約に同意したものとします
        </p>
      </div>
    </main>
  )
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthContent />
    </Suspense>
  )
}
