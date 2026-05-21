/**
 * POST /api/refine
 * Body: { gameId, htmlUrl, request, genre, ageRating }
 * Fetches the current game HTML, sends it to AI with the refinement request,
 * stores the new HTML, updates the game record, returns { htmlUrl }.
 */
import { NextRequest, NextResponse } from 'next/server'
import { callAI } from '@/lib/ai'
import { storeGameHtml, getGame, saveGame } from '@/lib/db'
import type { AgeRating } from '@/lib/types'

const SYSTEM = `You are an expert Phaser 3 game developer making targeted changes to an existing game.
The user will provide the full current HTML/JS game code and a specific change request.
Return ONLY the complete updated HTML file — no explanation, no markdown fences, no commentary.
Preserve all existing gameplay mechanics unless the user explicitly asks to change them.
Keep the same Phaser 3 CDN URL and overall structure.`

function validateGameHtml(html: string): boolean {
  return html.includes('new Phaser.Game(') || html.includes('new Phaser.Game (')
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as {
    gameId?: string
    htmlUrl?: string
    request?: string
    genre?: string
    ageRating?: AgeRating
  }

  const { gameId, htmlUrl, request, genre = 'arcade', ageRating = '8+' } = body

  if (!gameId || !htmlUrl || !request?.trim()) {
    return NextResponse.json({ error: 'gameId, htmlUrl, and request are required' }, { status: 400 })
  }
  if (request.length > 300) {
    return NextResponse.json({ error: 'Request too long (max 300 chars)' }, { status: 400 })
  }

  // Fetch current game HTML
  let currentHtml = ''
  try {
    const res = await fetch(htmlUrl, { cache: 'no-store' })
    if (!res.ok) throw new Error(`fetch ${res.status}`)
    currentHtml = await res.text()
  } catch (e) {
    return NextResponse.json({ error: 'Could not load current game HTML' }, { status: 500 })
  }

  if (currentHtml.length > 60_000) {
    // Truncate very large games to fit context
    currentHtml = currentHtml.slice(0, 60_000)
  }

  const userMessage = `Current game HTML:\n\`\`\`html\n${currentHtml}\n\`\`\`\n\nChange request: ${request}\n\nGenre: ${genre}, Age rating: ${ageRating}`

  let newHtml = ''
  try {
    const result = await callAI(SYSTEM, [{ role: 'user', content: userMessage }], 5000, 'best')
    newHtml = result.text.replace(/^```html?\s*/i, '').replace(/\s*```\s*$/, '').trim()
  } catch (e: unknown) {
    return NextResponse.json({ error: 'AI refinement failed — try again' }, { status: 500 })
  }

  if (!validateGameHtml(newHtml)) {
    return NextResponse.json({ error: 'Refined game invalid — try a different request' }, { status: 500 })
  }

  // Store refined HTML under same gameId (overwrites previous version)
  const newHtmlUrl = await storeGameHtml(gameId, newHtml)

  // Update game record
  const game = await getGame(gameId)
  if (game) {
    game.htmlUrl = newHtmlUrl
    await saveGame(game).catch(() => {})
  }

  return NextResponse.json({ htmlUrl: newHtmlUrl })
}
