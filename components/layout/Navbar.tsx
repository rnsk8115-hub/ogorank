'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Profile } from '@/lib/types'
import NeonBadge from '@/components/ui/NeonBadge'

interface NavbarProps {
  profile: Profile | null
}

export default function Navbar({ profile }: NavbarProps) {
  const pathname = usePathname()

  return (
    <nav className="hud-card border-x-0 border-t-0 sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="font-mono font-bold text-sm tracking-widest cyber-btn"
          style={{ color: 'var(--color-text-dim)' }}
        >
          [ HOME ]
        </Link>

        <div className="flex items-center gap-4">
          {profile && (
            <Link href="/rank" className="cyber-btn">
              <NeonBadge rank={profile.rank} size="sm" />
            </Link>
          )}
          <Link
            href="/quest/new"
            className="btn-primary px-4 py-2 rounded text-xs cyber-btn"
          >
            + クエスト
          </Link>
          <Link
            href="/profile"
            className="text-xs font-mono cyber-btn"
            style={{ color: pathname === '/profile' ? 'var(--color-cyan)' : 'var(--color-text-dim)' }}
          >
            設定
          </Link>
        </div>
      </div>
    </nav>
  )
}
