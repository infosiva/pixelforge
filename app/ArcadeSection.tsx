'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import GameCard from '@/components/GameCard'
import type { Game, GameGenre, AgeRating } from '@/lib/types'

const PAGE_SIZE = 8

function getRatingScore(gameId: string): number {
  try {
    const r = localStorage.getItem(`rating-${gameId}`)
    if (r === 'up') return 1
    if (r === 'down') return -1
  } catch {}
  return 0
}

const GENRES: Array<{ id: GameGenre | 'all'; label: string; emoji: string }> = [
  { id: 'all',         label: 'All',        emoji: '🎮' },
  { id: 'arcade',      label: 'Arcade',     emoji: '👾' },
  { id: 'platformer',  label: 'Platform',   emoji: '🏃' },
  { id: 'shooter',     label: 'Shooter',    emoji: '🚀' },
  { id: 'puzzle',      label: 'Puzzle',     emoji: '🧩' },
  { id: 'rpg',         label: 'RPG',        emoji: '⚔️' },
  { id: 'educational', label: 'Edu',        emoji: '🎓' },
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
  const [page, setPage]   = useState(1)
  const [, forceUpdate]   = useState(0)
  const sentinelRef       = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1)
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  // reset page on filter change
  useEffect(() => { setPage(1) }, [genre, age])

  const filtered = games
    .filter(g =>
      (genre === 'all' || g.genre === genre) &&
      (age === 'all' || (g.ageRating ?? '8+') === age)
    )
    .sort((a, b) => getRatingScore(b.id) - getRatingScore(a.id))

  const visible = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < filtered.length

  // IntersectionObserver — load next page when sentinel scrolls into view
  const loadMore = useCallback(() => {
    if (hasMore) setPage(p => p + 1)
  }, [hasMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore()
    }, { rootMargin: '200px' })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <h2 className="section-heading">🕹️ All Games</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
            {filtered.length} games
          </span>
          <Link href="/create" style={{ fontSize: 13, color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>
            + Build →
          </Link>
        </div>
      </div>

      {/* Genre chips — scrollable */}
      <div className="filter-scroll scrollbar-hide" style={{ marginBottom: 8 }}>
        {GENRES.map(g => (
          <button key={g.id} onClick={() => setGenre(g.id)}
            className={`chip ${genre === g.id ? 'active' : ''}`}>
            <span>{g.emoji}</span> {g.label}
          </button>
        ))}
      </div>

      {/* Age chips */}
      <div className="filter-scroll scrollbar-hide" style={{ marginBottom: 24 }}>
        {AGES.map(a => (
          <button key={a.id} onClick={() => setAge(a.id)}
            className={`chip age-chip ${age === a.id ? 'active' : ''}`}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'rgba(255,255,255,0.25)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎮</div>
          <p style={{ marginBottom: 8 }}>No games in this category</p>
          <Link href="/create" style={{ color: '#a78bfa', fontSize: 14, textDecoration: 'none' }}>Build one →</Link>
        </div>
      ) : (
        <>
          <div className="arcade-grid">
            {visible.map(game => <GameCard key={game.id} game={game} />)}
          </div>
          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} style={{ height: 1 }} />
          {hasMore && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <button className="load-more-btn" onClick={() => setPage(p => p + 1)}>
                Load more games ↓
              </button>
            </div>
          )}
        </>
      )}
      <style>{`
        .arcade-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 14px;
        }
        @media (max-width: 640px) {
          .arcade-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
        @media (max-width: 340px) {
          .arcade-grid { grid-template-columns: 1fr; }
        }
        .scrollbar-hide { scrollbar-width: none; -webkit-overflow-scrolling: touch; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .filter-scroll {
          display: flex; gap: 6px;
          overflow-x: auto; -webkit-overflow-scrolling: touch;
          padding-bottom: 4px; padding-right: 14px;
          scrollbar-width: none;
        }
        .filter-scroll::-webkit-scrollbar { display: none; }
        .chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 13px; border-radius: 20px; white-space: nowrap;
          font-size: 13px; font-weight: 600; cursor: pointer; flex-shrink: 0;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.75);
          transition: all 0.15s; font-family: inherit;
        }
        .chip:hover { background: rgba(255,255,255,0.14); color: rgba(255,255,255,0.95); }
        .chip.active {
          background: rgba(124,58,237,0.25);
          border-color: rgba(167,139,250,0.45);
          color: #c4b5fd;
        }
        .age-chip { font-size: 12px; padding: 4px 10px; }
        .section-heading { font-size: 22px; font-weight: 900; color: #fff; letter-spacing: -0.02em; }
        .load-more-btn {
          padding: 10px 28px; border-radius: 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 600;
          cursor: pointer; font-family: inherit; transition: all 0.15s;
        }
        .load-more-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
      `}</style>
    </div>
  )
}
