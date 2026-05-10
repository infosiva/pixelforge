'use client'
import { useState } from 'react'
import GameCard from './GameCard'
import type { Game, GameGenre } from '@/lib/types'

const GENRES: { label: string; value: GameGenre | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: '🎓 Educational', value: 'educational' },
  { label: '🚀 Shooter', value: 'shooter' },
  { label: '🕹️ Arcade', value: 'arcade' },
  { label: '🏃 Platformer', value: 'platformer' },
  { label: '🧩 Puzzle', value: 'puzzle' },
  { label: '⚔️ RPG', value: 'rpg' },
]

export default function ArcadeGrid({ games }: { games: Game[] }) {
  const [genre, setGenre] = useState<GameGenre | 'all'>('all')
  const filtered = genre === 'all' ? games : games.filter(g => g.genre === genre)

  return (
    <section id="arcade" style={{ marginBottom: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>🕹️ Arcade</h2>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>{filtered.length} games</span>
      </div>

      {/* Genre filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {GENRES.map(g => (
          <button
            key={g.value}
            onClick={() => setGenre(g.value)}
            style={{
              padding: '7px 16px',
              borderRadius: 99,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'monospace',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.15s',
              background: genre === g.value
                ? (g.value === 'educational' ? 'linear-gradient(135deg,#15803d,#166534)' : 'linear-gradient(135deg,#7c3aed,#5b21b6)')
                : 'rgba(255,255,255,0.06)',
              color: genre === g.value ? '#fff' : 'rgba(255,255,255,0.5)',
              boxShadow: genre === g.value
                ? (g.value === 'educational' ? '0 0 16px rgba(74,222,128,0.3)' : '0 0 16px rgba(124,58,237,0.35)')
                : 'none',
            }}
          >
            {g.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 15 }}>
          No games in this genre yet. <a href="/create" style={{ color: '#a78bfa' }}>Build one!</a>
        </div>
      ) : (
        <div className="arcade-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 45vw), 1fr))', gap: 16 }}>
          {filtered.map(game => <GameCard key={game.id} game={game} />)}
        </div>
      )}
    </section>
  )
}
