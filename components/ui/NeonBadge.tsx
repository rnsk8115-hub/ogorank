import type { Rank } from '@/lib/types'
import { RANK_LABELS } from '@/lib/types'

const RANK_COLORS_MAP: Record<Rank, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  legend: '#00f0ff',
  god: '#d4af37',
}

interface NeonBadgeProps {
  rank: Rank
  size?: 'sm' | 'md' | 'lg'
}

export default function NeonBadge({ rank, size = 'md' }: NeonBadgeProps) {
  const color = RANK_COLORS_MAP[rank]
  const label = RANK_LABELS[rank]

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }

  return (
    <span
      className={`rank-badge ${sizeClasses[size]} ${rank === 'god' ? 'animate-gold-pulse' : ''}`}
      style={{
        color,
        borderColor: color,
        textShadow: `0 0 8px ${color}`,
        boxShadow: rank === 'god' ? `0 0 12px ${color}` : undefined,
      }}
    >
      {label}
    </span>
  )
}
