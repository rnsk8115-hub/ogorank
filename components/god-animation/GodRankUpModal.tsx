'use client'

import { useRouter } from 'next/navigation'
import { useGodAnimation } from './useGodAnimation'
import GodEmblem from './GodEmblem'

export default function GodRankUpModal() {
  const router = useRouter()
  const phase = useGodAnimation()

  async function handleClose() {
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ god_rank_up_pending: false }),
    })
    router.refresh()
  }

  if (phase === 0) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.95)' }}
    >
      {phase >= 2 && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="god-noise absolute inset-0"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(0,240,255,0.05) 3px,
                rgba(0,240,255,0.05) 4px
              )`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              left: 0,
              right: 0,
              height: '20%',
              background: 'linear-gradient(transparent, rgba(0,240,255,0.1), transparent)',
              animation: 'scanline-fast 2s linear infinite',
            }}
          />
        </div>
      )}

      {phase >= 3 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="god-shockwave-cyan" />
          <div className="god-shockwave-magenta" />
        </div>
      )}

      <div className="relative z-10 text-center px-8">
        {phase >= 4 && (
          <div className="god-emblem flex justify-center mb-6">
            <GodEmblem />
          </div>
        )}

        {phase >= 5 && (
          <>
            <div
              className="font-mono text-sm mb-2 animate-magenta-flicker"
              style={{ color: 'var(--color-magenta)' }}
            >
              TOP 10%
            </div>

            <div className="overflow-hidden">
              <h1
                className="font-mono text-2xl font-bold god-typewriter text-glow-gold inline-block"
                style={{ color: 'var(--color-god-gold)' }}
              >
                RANK UP: GOD GENTLEMAN
              </h1>
            </div>

            <p
              className="font-mono text-sm mt-2 animate-fade-in-up"
              style={{ color: 'var(--color-text-dim)', animationDelay: '0.5s', opacity: 0 }}
            >
              真の紳士へ昇格！
            </p>

            <button
              onClick={handleClose}
              className="btn-god px-8 py-3 rounded text-sm mt-8 inline-block animate-fade-in-up"
              style={{ animationDelay: '1s', opacity: 0 }}
            >
              [ GOD として覚醒する ]
            </button>
          </>
        )}
      </div>
    </div>
  )
}
