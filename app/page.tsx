import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 animate-blink font-mono text-xs" style={{ color: 'var(--color-text-dim)' }}>
          ▶ SYSTEM ONLINE
        </div>

        <h1 className="font-mono text-5xl font-bold text-glow-cyan mb-4" style={{ color: 'var(--color-cyan)' }}>
          奢RANK
        </h1>
        <p className="font-mono text-lg mb-2" style={{ color: 'var(--color-magenta)' }}>
          奢りがステータスになる
        </p>
        <p className="text-sm max-w-xs mb-12" style={{ color: 'var(--color-text-dim)' }}>
          デートで奢った金額が紳士ランクに変わる。<br />
          あなたの「男気」を数値で証明しろ。
        </p>

        <div className="grid grid-cols-1 gap-4 w-full max-w-xs mb-12">
          <div className="hud-card rounded p-4 text-left">
            <div className="font-mono text-xs mb-2" style={{ color: 'var(--color-cyan)' }}>01 / クエスト発行</div>
            <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>デート予定を登録して、共有URLを生成</p>
          </div>
          <div className="hud-card rounded p-4 text-left">
            <div className="font-mono text-xs mb-2" style={{ color: 'var(--color-cyan)' }}>02 / 精算入力</div>
            <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>デート後に金額を入力。男気パーセンテージを算出</p>
          </div>
          <div className="hud-card rounded p-4 text-left">
            <div className="font-mono text-xs mb-2" style={{ color: 'var(--color-cyan)' }}>03 / EXP獲得</div>
            <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>女性の評価でEXPが付与され、紳士ランクが上昇</p>
          </div>
        </div>

        <Link
          href="/auth"
          className="btn-primary px-8 py-4 rounded text-sm inline-block"
        >
          [ 紳士として登録する ]
        </Link>

        <div className="mt-12 flex gap-4 text-xs font-mono flex-wrap justify-center" style={{ color: 'var(--color-text-dim)' }}>
          <span>BRONZE</span>
          <span>→</span>
          <span style={{ color: '#c0c0c0' }}>SILVER</span>
          <span>→</span>
          <span style={{ color: '#ffd700' }}>GOLD</span>
          <span>→</span>
          <span style={{ color: 'var(--color-cyan)' }}>LEGEND</span>
          <span>→</span>
          <span style={{ color: 'var(--color-god-gold)' }} className="text-glow-gold">GOD</span>
        </div>
      </div>
    </main>
  )
}
