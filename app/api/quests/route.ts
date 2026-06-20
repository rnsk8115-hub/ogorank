import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import { generateShareToken, getQuestExpiresAt } from '@/lib/utils'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: quests, error } = await supabase
    .from('quests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(quests)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { store_name, store_address, genre, scheduled_date } = body

  if (!store_name || !genre || !scheduled_date) {
    return NextResponse.json({ error: '必須項目を入力してください' }, { status: 400 })
  }

  const share_token = generateShareToken()
  const expires_at = getQuestExpiresAt()

  const { data: quest, error } = await supabase
    .from('quests')
    .insert({
      user_id: user.id,
      store_name,
      store_address: store_address || null,
      genre,
      scheduled_date,
      share_token,
      expires_at,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(quest, { status: 201 })
}
