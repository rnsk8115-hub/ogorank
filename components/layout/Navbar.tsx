'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'
import NeonBadge from '@/components/ui/NeonBadge'

interface NavbarProps {
  profile: Profile | null
}

export default function Navbar({ profile }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="hud-card border-x-0 border-t-0 sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-mono font-bold text-lg text-glow-cyan" style={{ color: 'var(--color-cyan)' }}>
          奢RANK
        </Link>

        <div className="flex items-center gap-3">
          {profile && (
            <NeonBadge rank={profile.rank} size="sm" />
          )}
          <Link
            href="/quest/new"
            className="btn-primary px-3 py-1.5 rounded text-xs"
          >
            + クエスト
          </Link>
          <Link
            href="/profile"
            className="text-xs"
            style={{ color: pathname === '/profile' ? 'var(--color-cyan)' : 'var(--color-text-dim)' }}
          >
            プロフィール
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs"
            style={{ color: 'var(--color-text-dim)' }}
          >
            ログアウト
          </button>
        </div>
      </div>
    </nav>
  )
}
