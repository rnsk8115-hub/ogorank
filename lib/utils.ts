import type { Rank } from './types'

export function calcMaleRatio(totalAmount: number, malePayment: number): number {
  if (totalAmount === 0) return 0
  return Math.round((malePayment / totalAmount) * 100)
}

export function generateShareToken(): string {
  return crypto.randomUUID().replace(/-/g, '')
}

export function getQuestExpiresAt(): string {
  const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  return date.toISOString()
}

export function isQuestExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date()
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export const RANK_COLORS: Record<Rank, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  legend: '#00f0ff',
  god: '#d4af37',
}

export const RANK_GLOW_COLORS: Record<Rank, string> = {
  bronze: 'rgba(205,127,50,0.5)',
  silver: 'rgba(192,192,192,0.5)',
  gold: 'rgba(255,215,0,0.5)',
  legend: 'rgba(0,240,255,0.5)',
  god: 'rgba(212,175,55,0.7)',
}
