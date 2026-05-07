/**
 * POST /api/generate
 * Body: { prompt, genre }
 * 1. Generate game code via Groq
 * 2. Generate thumbnail via fal.ai
 * 3. Store HTML in Vercel Blob
 * 4. Save game metadata
 * Returns: { gameId }
 */
import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { generateGameCode, generateGameMeta } from '@/lib/ai'
import { generateBackground } from '@/lib/assets'
import { saveGame } from '@/lib/db'
import type { Game, GenerateRequest, AgeRating } from '@/lib/types'

// Blocklist for prompt safety
const BLOCKED = ['nude', 'naked', 'sex', 'porn', 'gore', 'kill real', 'hack', 'bomb']

function isBlocked(text: string): boolean {
  const t = text.toLowerCase()
  return BLOCKED.some(w => t.includes(w))
}

function validateGameHtml(html: string): boolean {
  return html.includes('new Phaser.Game(') || html.includes('new Phaser.Game ({')
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
  const [htmlRaw, meta, bgUrl] = await Promise.all([
    generateGameCode(prompt, genre, ageRating),
    generateGameMeta(prompt, genre, ageRating),
    generateBackground(`${genre} game ${prompt.slice(0, 40)}`, seed).catch(() => ''),
  ])

  if (!validateGameHtml(htmlRaw)) {
    // Retry once
    const retry = await generateGameCode(prompt, genre, ageRating).catch(() => '')
    if (!validateGameHtml(retry)) {
      return NextResponse.json({ error: 'Game generation failed — please try a different prompt' }, { status: 500 })
    }
  }

  // Store HTML in Vercel Blob
  const htmlBlob = await put(
    `pixelforge/games/${gameId}/game.html`,
    htmlRaw,
    { access: 'public', contentType: 'text/html' }
  ).catch(() => null)

  if (!htmlBlob) {
    return NextResponse.json({ error: 'Storage error — try again' }, { status: 500 })
  }

  const game: Game = {
    id:           gameId,
    title:        meta.title ?? prompt.slice(0, 40),
    description:  meta.description ?? prompt,
    prompt,
    htmlUrl:      htmlBlob.url,
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

  return NextResponse.json({ gameId, title: game.title, htmlUrl: htmlBlob.url })
}
