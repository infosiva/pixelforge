/**
 * Simple file-based game store for MVP.
 * Swap for Supabase/Neon when ready to scale.
 * Games stored as JSON in /tmp (Vercel ephemeral) — Blob for persistence.
 */
import { put, list, getDownloadUrl } from '@vercel/blob'
import type { Game, GameAsset } from './types'

const GAMES_INDEX_KEY = 'pixelforge/games-index.json'

export async function saveGame(game: Game): Promise<void> {
  // Save game metadata to blob
  await put(
    `pixelforge/games/${game.id}/meta.json`,
    JSON.stringify(game),
    { access: 'public', contentType: 'application/json' }
  )
  // Update index
  const existing = await listGames()
  const updated = [game, ...existing.filter(g => g.id !== game.id)]
  await put(
    GAMES_INDEX_KEY,
    JSON.stringify(updated),
    { access: 'public', contentType: 'application/json', allowOverwrite: true }
  )
}

export async function listGames(limit = 50): Promise<Game[]> {
  try {
    const { blobs } = await list({ prefix: GAMES_INDEX_KEY })
    if (!blobs.length) return []
    const url = blobs[0].url
    const res = await fetch(url, { next: { revalidate: 30 } })
    if (!res.ok) return []
    const games: Game[] = await res.json()
    return games
      .filter(g => g.status === 'published')
      .slice(0, limit)
  } catch {
    return []
  }
}

export async function getGame(id: string): Promise<Game | null> {
  try {
    const { blobs } = await list({ prefix: `pixelforge/games/${id}/meta.json` })
    if (!blobs.length) return null
    const res = await fetch(blobs[0].url, { cache: 'no-store' })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function incrementPlayCount(id: string): Promise<void> {
  const game = await getGame(id)
  if (!game) return
  game.playCount = (game.playCount || 0) + 1
  await saveGame(game)
}
