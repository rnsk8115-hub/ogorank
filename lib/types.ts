export type Rank = 'bronze' | 'silver' | 'gold' | 'legend' | 'god'
export type Rating = 'god_gentleman' | 'gentleman' | 'normal'
export type QuestStatus = 'pending' | 'awaiting_review' | 'completed' | 'expired'

export interface Profile {
  id: string
  nickname: string
  avatar_url: string | null
  total_exp: number
  rank: Rank
  quest_count: number
  god_gentleman_count: number
  gentleman_count: number
  normal_count: number
  god_rank_up_pending: boolean
  created_at: string
  updated_at: string
}

export interface Quest {
  id: string
  user_id: string
  store_name: string
  store_address: string | null
  genre: string
  scheduled_date: string
  status: QuestStatus
  total_amount: number | null
  male_payment: number | null
  male_payment_ratio: number | null
  share_token: string
  expires_at: string
  created_at: string
  updated_at: string
  profile?: Profile
}

export interface Review {
  id: string
  quest_id: string
  rating: Rating
  exp_awarded: number
  created_at: string
}

export const RANK_LABELS: Record<Rank, string> = {
  bronze: 'ブロンズ',
  silver: 'シルバー',
  gold: 'ゴールド',
  legend: 'レジェンド',
  god: 'GOD',
}

export const RATING_LABELS: Record<Rating, string> = {
  god_gentleman: '神紳士',
  gentleman: '紳士',
  normal: '普通',
}

export const GENRE_OPTIONS = [
  'レストラン',
  'カフェ',
  '居酒屋',
  'バー',
  'イタリアン',
  'フレンチ',
  '焼肉',
  '寿司',
  'その他',
]
