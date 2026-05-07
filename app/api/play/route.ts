import { NextRequest, NextResponse } from 'next/server'
import { incrementPlayCount } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { gameId } = await req.json().catch(() => ({}))
  if (!gameId) return NextResponse.json({ ok: false })
  await incrementPlayCount(gameId).catch(() => {})
  return NextResponse.json({ ok: true })
}
