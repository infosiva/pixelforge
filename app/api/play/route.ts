import { NextRequest, NextResponse } from 'next/server'
import { incrementPlayCount, getGameHtmlFromMemory } from '@/lib/db'

// GET /api/play?id=<gameId> — serve game HTML from memory (no-blob fallback)
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return new NextResponse('Missing id', { status: 400 })
  const html = getGameHtmlFromMemory(id)
  if (!html) return new NextResponse('Game not found', { status: 404 })
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

// POST /api/play — increment play count
export async function POST(req: NextRequest) {
  const { gameId } = await req.json().catch(() => ({}))
  if (!gameId) return NextResponse.json({ ok: false })
  await incrementPlayCount(gameId).catch(() => {})
  return NextResponse.json({ ok: true })
}
