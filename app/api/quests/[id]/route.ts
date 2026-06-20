import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { calcMaleRatio } from '@/lib/utils'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const { data: quest, error } = await supabase
    .from('quests')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !quest) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(quest)
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const { data: quest } = await supabase
    .from('quests')
    .select('status')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!quest) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (quest.status !== 'pending') {
    return NextResponse.json({ error: 'このクエストは既に精算済みです' }, { status: 409 })
  }

  const { total_amount, male_payment } = body

  if (!total_amount || male_payment === undefined) {
    return NextResponse.json({ error: '金額を入力してください' }, { status: 400 })
  }

  const total = Number(total_amount)
  const male = Number(male_payment)

  if (male > total) {
    return NextResponse.json({ error: '支払額が合計を超えています' }, { status: 400 })
  }

  const male_payment_ratio = calcMaleRatio(total, male)

  const { data: updated, error } = await supabase
    .from('quests')
    .update({
      total_amount: total,
      male_payment: male,
      male_payment_ratio,
      status: 'awaiting_review',
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(updated)
}
