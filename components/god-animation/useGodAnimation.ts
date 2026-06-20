'use client'

import { useState, useEffect } from 'react'

export type GodPhase = 0 | 1 | 2 | 3 | 4 | 5

export function useGodAnimation() {
  const [phase, setPhase] = useState<GodPhase>(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 2200),
      setTimeout(() => setPhase(5), 3800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return phase
}
