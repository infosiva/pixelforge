/**
 * Game store — Vercel Blob when BLOB_READ_WRITE_TOKEN is set,
 * otherwise falls back to in-memory (games lost on redeploy, OK for MVP).
 */
import type { Game } from './types'

const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN

// In-memory fallback (single serverless instance; good enough for demos)
const memStore = new Map<string, Game>()

// ── Blob helpers (lazy import so build doesn't fail without token) ─────────────
async function blobPut(key: string, body: string, contentType: string): Promise<string | null> {
  try {
    const { put } = await import('@vercel/blob')
    const result = await put(key, body, { access: 'public', contentType, allowOverwrite: true })
    return result.url
  } catch {
    return null
  }
}

async function blobGet(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    return res.ok ? res.text() : null
  } catch {
    return null
  }
}

async function blobList(prefix: string): Promise<string[]> {
  try {
    const { list } = await import('@vercel/blob')
    const { blobs } = await list({ prefix })
    return blobs.map(b => b.url)
  } catch {
    return []
  }
}

// ── Public API ─────────────────────────────────────────────────────────────────
export async function saveGame(game: Game): Promise<void> {
  memStore.set(game.id, game)
  if (!hasBlob) return
  await blobPut(`pixelforge/games/${game.id}/meta.json`, JSON.stringify(game), 'application/json')
  // Update index
  const existing = await listGames(200)
  const updated = [game, ...existing.filter(g => g.id !== game.id)]
  await blobPut('pixelforge/games-index.json', JSON.stringify(updated), 'application/json')
}

export async function listGames(limit = 50): Promise<Game[]> {
  if (!hasBlob) {
    return [...memStore.values()]
      .filter(g => g.status === 'published')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)
  }
  try {
    const urls = await blobList('pixelforge/games-index.json')
    if (!urls.length) return []
    const text = await blobGet(urls[0])
    if (!text) return []
    const games: Game[] = JSON.parse(text)
    return games.filter(g => g.status === 'published').slice(0, limit)
  } catch {
    return []
  }
}

export async function getGame(id: string): Promise<Game | null> {
  if (memStore.has(id)) return memStore.get(id)!
  if (!hasBlob) return null
  try {
    const urls = await blobList(`pixelforge/games/${id}/meta.json`)
    if (!urls.length) return null
    const text = await blobGet(urls[0])
    return text ? JSON.parse(text) : null
  } catch {
    return null
  }
}

export async function storeGameHtml(gameId: string, html: string): Promise<string> {
  if (hasBlob) {
    const url = await blobPut(`pixelforge/games/${gameId}/game.html`, html, 'text/html')
    if (url) return url
  }
  // No blob — store in memory and serve via /api/play?id=
  memStore.set(`html:${gameId}`, { id: `html:${gameId}` } as any)
  // Store html content separately
  ;(globalThis as any).__pixelforgeHtml ??= new Map<string, string>()
  ;(globalThis as any).__pixelforgeHtml.set(gameId, html)
  return `/api/play?id=${gameId}`
}

export function getGameHtmlFromMemory(gameId: string): string | null {
  return (globalThis as any).__pixelforgeHtml?.get(gameId) ?? null
}

export async function incrementPlayCount(id: string): Promise<void> {
  const game = await getGame(id)
  if (!game) return
  game.playCount = (game.playCount || 0) + 1
  await saveGame(game)
}
