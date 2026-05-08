/**
 * POST /api/generate
 * Body: { prompt, genre }
 * 1. Generate game code via Groq
 * 2. Generate thumbnail via fal.ai (optional)
 * 3. Store HTML in Vercel Blob or memory
 * 4. Save game metadata
 * Returns: { gameId, title, htmlUrl }
 */
import { NextRequest, NextResponse } from 'next/server'
import { generateGameCode, generateGameMeta } from '@/lib/ai'
import { generateBackground } from '@/lib/assets'
import { saveGame, storeGameHtml } from '@/lib/db'
import type { Game, GenerateRequest, AgeRating } from '@/lib/types'

const BLOCKED = ['nude', 'naked', 'sex', 'porn', 'gore', 'kill real', 'hack', 'bomb']

function isBlocked(text: string): boolean {
  return BLOCKED.some(w => text.toLowerCase().includes(w))
}

function validateGameHtml(html: string): boolean {
  return html.includes('new Phaser.Game(') || html.includes('new Phaser.Game (')
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as GenerateRequest & { ageRating?: AgeRating }
  const { prompt, genre } = body
  const ageRating: AgeRating = body.ageRating ?? '8+'

  if (!prompt?.trim() || !genre) {
    return NextResponse.json({ error: 'prompt and genre required' }, { status: 400 })
  }
  if (prompt.length > 500) {
    return NextResponse.json({ error: 'Prompt too long (max 500 chars)' }, { status: 400 })
  }
  if (isBlocked(prompt)) {
    return NextResponse.json({ error: 'Prompt not allowed' }, { status: 400 })
  }

  const gameId = crypto.randomUUID()
  const seed = Math.abs(gameId.split('').reduce((a, c) => a + c.charCodeAt(0), 0))

  // Run code gen + meta gen + bg gen in parallel
  let falFailed = false
  const [htmlRaw, meta, bgUrl] = await Promise.all([
    generateGameCode(prompt, genre, ageRating),
    generateGameMeta(prompt, genre, ageRating),
    generateBackground(`${genre} game ${prompt.slice(0, 40)}`, seed).then(url => {
      if (!url) falFailed = true
      return url
    }).catch(() => { falFailed = true; return '' }),
  ])

  let html = htmlRaw
  if (!validateGameHtml(html)) {
    // Retry once
    html = await generateGameCode(prompt, genre, ageRating).catch(() => '')
    if (!validateGameHtml(html)) {
      return NextResponse.json({ error: 'Game generation failed — try a different prompt' }, { status: 500 })
    }
  }

  const htmlUrl = await storeGameHtml(gameId, html)

  const game: Game = {
    id:           gameId,
    title:        meta.title ?? prompt.slice(0, 40),
    description:  meta.description ?? prompt,
    prompt,
    htmlUrl,
    thumbnailUrl: bgUrl,
    genre,
    ageRating,
    status:       'published',
    authorId:     'anonymous',
    authorName:   'Anonymous',
    playCount:    0,
    likeCount:    0,
    remixCount:   0,
    createdAt:    new Date().toISOString(),
    publishedAt:  new Date().toISOString(),
  }

  await saveGame(game).catch(e => console.error('[db] save failed:', e))

  return NextResponse.json({
    gameId,
    title: game.title,
    htmlUrl,
    warnings: falFailed ? ['thumbnail_generation_failed'] : undefined,
  })
}
