import { notFound } from 'next/navigation'
import { getGame, listGames } from '@/lib/db'
import { CURATED_GAMES } from '@/lib/curatedGames'
import GamePlayer from './GamePlayer'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const game = await getGame(id).catch(() => null)
  if (!game) return { title: 'Play Game' }
  return {
    title: game.title,
    description: game.description,
    openGraph: { title: game.title, description: game.description, images: game.thumbnailUrl ? [game.thumbnailUrl] : [] },
  }
}

export default async function PlayPage({ params, searchParams }: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ new?: string }>
}) {
  const { id } = await params
  const { new: isNew } = await searchParams

  // Curated built-in games — served from local data, no DB needed
  if (id.startsWith('builtin-') || id.startsWith('demo-')) {
    const curated = CURATED_GAMES.find(g => g.id === id)
    if (curated) {
      const more = await listGames(6).catch(() => [])
      return <GamePlayer game={curated} moreGames={more} isNew={false} />
    }
    // demo- IDs without a curated match: serve demo snake
    const demoGame = {
      id,
      title: 'Demo Game',
      description: 'A sample game from the arcade',
      prompt: 'demo',
      htmlUrl: '',
      thumbnailUrl: '',
      genre: 'arcade' as const,
      ageRating: '8+' as const,
      status: 'published' as const,
      authorId: 'ai',
      authorName: 'PixelForge AI',
      playCount: 999,
      likeCount: 88,
      remixCount: 10,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
    }
    const more = await listGames(6).catch(() => [])
    return <GamePlayer game={demoGame} moreGames={more} isNew={false} demoMode />
  }

  const game = await getGame(id).catch(() => null)
  if (!game || game.status !== 'published') notFound()

  const more = await listGames(6).catch(() => [])
  const suggestions = more.filter(g => g.id !== id).slice(0, 5)

  return <GamePlayer game={game} moreGames={suggestions} isNew={!!isNew} />
}
