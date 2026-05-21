/**
 * POST /api/admin/purge?secret=<ADMIN_SECRET>
 * Deletes stale blobs: per-game meta.json files + orphaned game.html files
 * whose gameId doesn't appear in the index. Keeps games-index.json + game.html
 * for games in the index.
 */
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'No BLOB_READ_WRITE_TOKEN' }, { status: 500 })
  }

  const { list, del } = await import('@vercel/blob')

  // Get known game IDs from index
  const indexList = await list({ prefix: 'pixelforge/games-index.json' })
  let knownIds = new Set<string>()
  if (indexList.blobs.length) {
    try {
      const text = await fetch(indexList.blobs[0].url, { cache: 'no-store' }).then(r => r.text())
      const games = JSON.parse(text) as { id: string }[]
      for (const g of games) knownIds.add(g.id)
    } catch { /* index unreadable */ }
  }

  // List all blobs under pixelforge/
  let cursor: string | undefined
  const toDelete: string[] = []
  do {
    const page = await list({ prefix: 'pixelforge/', cursor, limit: 1000 })
    for (const blob of page.blobs) {
      const key = blob.pathname
      if (key === 'pixelforge/games-index.json') continue
      // Delete all meta.json (no longer written, can clean up old ones)
      if (key.endsWith('/meta.json')) { toDelete.push(blob.url); continue }
      // Delete game.html for games not in index
      const match = key.match(/pixelforge\/games\/([^/]+)\/game\.html$/)
      if (match && !knownIds.has(match[1])) { toDelete.push(blob.url); continue }
    }
    cursor = page.cursor
  } while (cursor)

  // Delete in batches of 100
  let deleted = 0
  for (let i = 0; i < toDelete.length; i += 100) {
    const batch = toDelete.slice(i, i + 100)
    await del(batch)
    deleted += batch.length
  }

  return NextResponse.json({ deleted, total: toDelete.length, knownGames: knownIds.size })
}
