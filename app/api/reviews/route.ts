import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import type { Rating } from '@/lib/types'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const body = await request.json()
  const { quest_id, rating } = body as { quest_id: string; rating: Rating }

  if (!quest_id || !['god_gentleman', 'gentleman', 'normal'].includes(rating)) {
    return NextResponse.json({ error: '無効なリクエストです' }, { status: 400 })
  }

  const { data: result, error } = await supabase
    .rpc('submit_review', {
      p_quest_id: quest_id,
      p_rating: rating,
    })

  if (error) {
    if (error.message.includes('already_reviewed')) {
      return NextResponse.json({ error: '既に評価済みです' }, { status: 409 })
    }
    if (error.message.includes('invalid_status')) {
      return NextResponse.json({ error: 'このクエストは評価できません' }, { status: 409 })
    }
    if (error.message.includes('quest_not_found')) {
      return NextResponse.json({ error: 'クエストが見つかりません' }, { status: 404 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(result, { status: 201 })
}
