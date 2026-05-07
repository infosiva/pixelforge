'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import GameCard from '@/components/GameCard'
import type { Game, GameGenre, AgeRating } from '@/lib/types'

const GENRES: Array<{ id: GameGenre | 'all'; label: string; emoji: string }> = [
  { id: 'all',        label: 'All',        emoji: '🎮' },
  { id: 'arcade',     label: 'Arcade',     emoji: '👾' },
  { id: 'platformer', label: 'Platformer', emoji: '🏃' },
  { id: 'shooter',    label: 'Shooter',    emoji: '🔫' },
  { id: 'puzzle',     label: 'Puzzle',     emoji: '🧩' },
  { id: 'rpg',        label: 'RPG',        emoji: '⚔️' },
]

const AGE_FILTERS: Array<{ id: AgeRating | 'all'; label: string }> = [
  { id: 'all', label: 'All ages' },
  { id: '8+',  label: '🟢 8+' },
  { id: '12+', label: '🟡 12+' },
  { id: '16+', label: '🟠 16+' },
]

export default function ArcadeSection({ games }: { games: Game[] }) {
  const [genre, setGenre] = useState<GameGenre | 'all'>('all')
  const [age, setAge]     = useState<AgeRating | 'all'>('all')

  const filtered = games.filter(g => {
    const matchGenre = genre === 'all' || g.genre === genre
    const matchAge   = age === 'all' || (g.ageRating ?? '8+') === age
    return matchGenre && matchAge
  })

  return (
    <section id="arcade">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white">🕹️ Arcade</h2>
        <Link href="/create" className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors font-semibold">
          Build yours <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Genre filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        {GENRES.map(g => (
          <button key={g.id} onClick={() => setGenre(g.id)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={genre === g.id
              ? { background: 'rgba(139,92,246,0.25)', border: '1px solid rgba(139,92,246,0.5)', color: '#c4b5fd' }
              : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>
            {g.emoji} {g.label}
          </button>
        ))}
      </div>

      {/* Age filter */}
      <div className="flex gap-2 mb-6">
        {AGE_FILTERS.map(a => (
          <button key={a.id} onClick={() => setAge(a.id)}
            className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
            style={age === a.id
              ? { background: 'rgba(250,204,21,0.15)', border: '1px solid rgba(250,204,21,0.4)', color: '#fde68a' }
              : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <p className="text-4xl mb-3">🎮</p>
          <p>No games match this filter yet</p>
          <Link href="/create" className="mt-3 inline-block text-sm text-purple-400 hover:text-purple-300">
            Build one →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  )
}
