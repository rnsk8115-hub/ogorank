import type { Rank, Rating, Profile } from './types'

export const EXP_TABLE: Record<Rating, number> = {
  god_gentleman: 150,
  gentleman: 100,
  normal: 10,
}

export const RANK_THRESHOLDS: { rank: Rank; minExp: number }[] = [
  { rank: 'legend', minExp: 5000 },
  { rank: 'gold', minExp: 2000 },
  { rank: 'silver', minExp: 500 },
  { rank: 'bronze', minExp: 0 },
]

export function calcBaseRank(totalExp: number): Exclude<Rank, 'god'> {
  if (totalExp >= 5000) return 'legend'
  if (totalExp >= 2000) return 'gold'
  if (totalExp >= 500) return 'silver'
  return 'bronze'
}

export function checkGodCondition(profile: Pick<Profile, 'total_exp' | 'god_gentleman_count' | 'gentleman_count' | 'normal_count'>): boolean {
  if (profile.total_exp < 10000) return false
  const totalReviews = profile.god_gentleman_count + profile.gentleman_count + profile.normal_count
  if (totalReviews === 0) return false
  const highRatingRatio = (profile.god_gentleman_count + profile.gentleman_count) / totalReviews
  return highRatingRatio >= 0.8
}

export function calcNewProfile(
  current: Pick<Profile, 'total_exp' | 'rank' | 'quest_count' | 'god_gentleman_count' | 'gentleman_count' | 'normal_count'>,
  rating: Rating
) {
  const expGained = EXP_TABLE[rating]
  const newTotalExp = current.total_exp + expGained

  const newCounts = {
    god_gentleman_count: current.god_gentleman_count + (rating === 'god_gentleman' ? 1 : 0),
    gentleman_count: current.gentleman_count + (rating === 'gentleman' ? 1 : 0),
    normal_count: current.normal_count + (rating === 'normal' ? 1 : 0),
    quest_count: current.quest_count + 1,
  }

  const newProfileData = {
    total_exp: newTotalExp,
    ...newCounts,
  }

  const isGod = checkGodCondition(newProfileData as Profile)
  const wasGod = current.rank === 'god'
  const newRank: Rank = isGod ? 'god' : calcBaseRank(newTotalExp)
  const god_rank_up_pending = isGod && !wasGod

  return {
    total_exp: newTotalExp,
    rank: newRank,
    god_rank_up_pending,
    exp_gained: expGained,
    ...newCounts,
  }
}

export function getNextRankInfo(totalExp: number, rank: Rank) {
  const nexts: Record<Rank, { nextRank: Rank | null; threshold: number | null; prevThreshold: number }> = {
    bronze: { nextRank: 'silver', threshold: 500, prevThreshold: 0 },
    silver: { nextRank: 'gold', threshold: 2000, prevThreshold: 500 },
    gold: { nextRank: 'legend', threshold: 5000, prevThreshold: 2000 },
    legend: { nextRank: 'god', threshold: 10000, prevThreshold: 5000 },
    god: { nextRank: null, threshold: null, prevThreshold: 10000 },
  }

  const info = nexts[rank]
  if (info.threshold === null) {
    return { nextRank: null, remaining: 0, progress: 100 }
  }

  const progress = Math.min(
    100,
    Math.round(((totalExp - info.prevThreshold) / (info.threshold - info.prevThreshold)) * 100)
  )

  return {
    nextRank: info.nextRank,
    remaining: Math.max(0, info.threshold - totalExp),
    progress,
  }
}

export function calcHighRatingRatio(profile: Pick<Profile, 'god_gentleman_count' | 'gentleman_count' | 'normal_count'>): number {
  const total = profile.god_gentleman_count + profile.gentleman_count + profile.normal_count
  if (total === 0) return 0
  return Math.round(((profile.god_gentleman_count + profile.gentleman_count) / total) * 100)
}
