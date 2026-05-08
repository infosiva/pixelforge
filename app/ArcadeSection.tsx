'use client'

import { useState } from 'react'
import Link from 'next/link'
import GameCard from '@/components/GameCard'
import type { Game, GameGenre, AgeRating } from '@/lib/types'

const GENRES: Array<{ id: GameGenre | 'all'; label: string; emoji: string }> = [
  { id: 'all',        label: 'All Games',  emoji: '🎮' },
  { id: 'arcade',     label: 'Arcade',     emoji: '👾' },
  { id: 'platformer', label: 'Platformer', emoji: '🏃' },
  { id: 'shooter',    label: 'Shooter',    emoji: '🚀' },
  { id: 'puzzle',     label: 'Puzzle',     emoji: '🧩' },
  { id: 'rpg',        label: 'RPG',        emoji: '⚔️' },
]

const AGES: Array<{ id: AgeRating | 'all'; label: string }> = [
  { id: 'all', label: 'All ages' },
  { id: '8+',  label: '8+' },
  { id: '12+', label: '12+' },
  { id: '16+', label: '16+' },
]

export default function ArcadeSection({ games }: { games: Game[] }) {
  const [genre, setGenre] = useState<GameGenre | 'all'>('all')
  const [age, setAge]     = useState<AgeRating | 'all'>('all')

  const filtered = games.filter(g =>
    (genre === 'all' || g.genre === genre) &&
    (age === 'all' || (g.ageRating ?? '8+') === age)
  )

  return (
    <div>
      {/* Header + filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <h2 className="section-heading">🕹️ Arcade</h2>
        <Link href="/create" style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>
          + Build your own →
        </Link>
      </div>

      {/* Genre chips */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 8 }} className="scrollbar-hide">
        {GENRES.map(g => (
          <button key={g.id} onClick={() => setGenre(g.id)}
            className={`chip ${genre === g.id ? 'active' : ''}`}>
            {g.emoji} {g.label}
          </button>
        ))}
      </div>

      {/* Age chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {AGES.map(a => (
          <button key={a.id} onClick={() => setAge(a.id)}
            className={`chip ${age === a.id ? 'active' : ''}`}
            style={{ fontSize: 12, padding: '4px 10px' }}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'rgba(255,255,255,0.25)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎮</div>
          <p style={{ marginBottom: 8 }}>No games match this filter</p>
          <Link href="/create" style={{ color: '#a78bfa', fontSize: 14, textDecoration: 'none' }}>Build one →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {filtered.map(game => <GameCard key={game.id} game={game} />)}
        </div>
      )}
    </div>
  )
}
