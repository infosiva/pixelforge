'use client'
import { useState } from 'react'
import GameCard from './GameCard'
import type { Game, GameGenre } from '@/lib/types'

const GENRES: { label: string; value: GameGenre | 'all'; icon: string; color: string }[] = [
  { label: 'All',         value: 'all',         icon: '🕹️', color: '#a78bfa' },
  { label: 'Arcade',      value: 'arcade',      icon: '👾', color: '#f472b6' },
  { label: 'Shooter',     value: 'shooter',     icon: '🚀', color: '#f87171' },
  { label: 'Platformer',  value: 'platformer',  icon: '🏃', color: '#fbbf24' },
  { label: 'Puzzle',      value: 'puzzle',      icon: '🧩', color: '#34d399' },
  { label: 'RPG',         value: 'rpg',         icon: '⚔️', color: '#a78bfa' },
  { label: 'Educational', value: 'educational', icon: '🎓', color: '#4ade80' },
]

export default function ArcadeGrid({ games }: { games: Game[] }) {
  const [genre, setGenre] = useState<GameGenre | 'all'>('all')
  const filtered = genre === 'all' ? games : games.filter(g => g.genre === genre)
  const activeGenre = GENRES.find(g => g.value === genre)!

  return (
    <section id="arcade" className="ag-section">

      {/* Section header */}
      <div className="ag-header">
        <div className="ag-title-group">
          <div className="ag-eyebrow">ARCADE</div>
          <h2 className="ag-title">All Games</h2>
        </div>
        <div className="ag-count-badge">
          <span className="ag-count-dot" />
          {filtered.length} available
        </div>
      </div>

      {/* Genre filter — horizontal scroll pill tabs */}
      <div className="ag-filter-wrap">
        <div className="ag-filter-inner">
          {GENRES.map(g => (
            <button
              key={g.value}
              onClick={() => setGenre(g.value)}
              className={`ag-pill ${genre === g.value ? 'ag-pill-active' : ''}`}
              style={{ '--pill-color': g.color } as React.CSSProperties}
            >
              <span className="ag-pill-icon">{g.icon}</span>
              {g.label}
              {genre === g.value && (
                <span className="ag-pill-count">
                  {g.value === 'all' ? games.length : games.filter(x => x.genre === g.value).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid or empty */}
      {filtered.length === 0 ? (
        <div className="ag-empty">
          <span className="ag-empty-icon">🎮</span>
          <p>No games in this genre yet.</p>
          <a href="/create" className="ag-empty-link">Build the first one →</a>
        </div>
      ) : (
        <div className="ag-grid">
          {filtered.map((game, i) => (
            <GameCard key={game.id} game={game} featured={i === 0 && genre === 'all'} />
          ))}
        </div>
      )}

      <style>{`
        .ag-section {
          margin-bottom: 80px;
        }

        /* Header */
        .ag-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 20px; gap: 12px; flex-wrap: wrap;
        }
        .ag-title-group { display: flex; align-items: baseline; gap: 10px; }
        .ag-eyebrow {
          font-size: 10px; font-weight: 900; color: rgba(167,139,250,0.6);
          letter-spacing: 0.12em;
          background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.2);
          padding: 2px 8px; border-radius: 4px;
          display: none; /* shown via title group */
        }
        .ag-title {
          font-size: 28px; font-weight: 900; color: #fff;
          letter-spacing: -0.03em; line-height: 1;
        }
        .ag-count-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: 12px; color: rgba(255,255,255,0.35);
          font-weight: 600;
        }
        .ag-count-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
          animation: ag-dot-pulse 2s ease-in-out infinite;
        }
        @keyframes ag-dot-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

        /* Filter pills */
        .ag-filter-wrap {
          margin-bottom: 24px;
          overflow-x: auto; -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .ag-filter-wrap::-webkit-scrollbar { display: none; }
        .ag-filter-inner {
          display: flex; gap: 8px;
          width: max-content; min-width: 100%;
          padding-bottom: 4px;
        }
        .ag-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 10px;
          font-size: 13px; font-weight: 700;
          cursor: pointer; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.45);
          transition: all 0.15s; white-space: nowrap;
          font-family: inherit;
        }
        .ag-pill:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.8);
          transform: translateY(-1px);
        }
        .ag-pill-active {
          background: rgba(var(--pill-color, 167,139,250), 0.12) !important;
          border-color: color-mix(in srgb, var(--pill-color, #a78bfa) 40%, transparent) !important;
          color: var(--pill-color, #a78bfa) !important;
          box-shadow: 0 0 16px color-mix(in srgb, var(--pill-color, #a78bfa) 25%, transparent);
        }
        .ag-pill-icon { font-size: 14px; }
        .ag-pill-count {
          background: rgba(255,255,255,0.12);
          padding: 1px 6px; border-radius: 99px;
          font-size: 10px; font-weight: 900;
          color: rgba(255,255,255,0.6);
        }

        /* Grid */
        .ag-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(260px, 45vw), 1fr));
          gap: 16px;
        }

        /* First card featured when "all" selected */
        .ag-grid > *:first-child {
          grid-column: span 1;
        }

        /* Empty state */
        .ag-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 72px 20px; gap: 12px;
          background: rgba(255,255,255,0.02);
          border: 1px dashed rgba(255,255,255,0.08);
          border-radius: 16px;
          text-align: center;
        }
        .ag-empty-icon { font-size: 40px; }
        .ag-empty p { font-size: 15px; color: rgba(255,255,255,0.3); }
        .ag-empty-link {
          font-size: 14px; color: #a78bfa; font-weight: 700;
          text-decoration: none; transition: color 0.15s;
        }
        .ag-empty-link:hover { color: #c4b5fd; }

        @media (max-width: 640px) {
          .ag-title { font-size: 22px; }
          .ag-grid { grid-template-columns: repeat(auto-fill, minmax(min(160px, 45vw), 1fr)); gap: 12px; }
        }
      `}</style>
    </section>
  )
}
