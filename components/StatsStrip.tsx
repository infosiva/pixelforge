'use client'
import { useEffect, useState } from 'react'

interface Stats {
  games: number
  genres: number
}

function readStats(): Stats {
  try {
    const raw = localStorage.getItem('pf_games')
    if (!raw) return { games: 0, genres: 0 }
    const parsed = JSON.parse(raw)
    const games: number = Array.isArray(parsed) ? parsed.length : (parsed.count ?? 0)
    const genreSet: Set<string> = new Set(
      Array.isArray(parsed)
        ? parsed.map((g: { genre?: string }) => g.genre).filter((v): v is string => Boolean(v))
        : []
    )
    return { games, genres: genreSet.size }
  } catch {
    return { games: 0, genres: 0 }
  }
}

export default function StatsStrip() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    setStats(readStats())
    // Also re-read when storage changes (e.g. user builds a game in another tab)
    function onStorage(e: StorageEvent) {
      if (e.key === 'pf_games') setStats(readStats())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Don't render until mounted (SSR safety)
  if (stats === null) return null

  const gamesLabel = stats.games === 1 ? 'game built' : 'games built'
  const genresLabel = stats.genres === 1 ? 'genre tried' : 'genres tried'

  return (
    <div className="pf-stats-strip" aria-label="Your arcade stats">
      <div className="pf-stats-inner">
        <span className="pf-stats-pill">
          <span className="pf-stats-num">{stats.games}</span>
          <span className="pf-stats-lbl">{gamesLabel}</span>
        </span>
        <span className="pf-stats-sep" aria-hidden>·</span>
        <span className="pf-stats-pill">
          <span className="pf-stats-num">{stats.genres}</span>
          <span className="pf-stats-lbl">{genresLabel}</span>
        </span>
        <span className="pf-stats-tag">YOUR ARCADE</span>
      </div>
      <style>{`
        .pf-stats-strip {
          margin-bottom: 20px;
        }
        .pf-stats-inner {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 6px 16px; border-radius: 8px;
          background: rgba(74,222,128,0.06);
          border: 1px solid rgba(74,222,128,0.2);
        }
        .pf-stats-pill {
          display: inline-flex; align-items: baseline; gap: 5px;
        }
        .pf-stats-num {
          font-size: 15px; font-weight: 900;
          color: #4ade80;
          font-family: 'Press Start 2P', monospace;
          line-height: 1;
          text-shadow: 0 0 12px rgba(74,222,128,0.5);
        }
        .pf-stats-lbl {
          font-size: 10px; font-weight: 600;
          color: rgba(74,222,128,0.65);
          letter-spacing: 0.04em;
        }
        .pf-stats-sep {
          color: rgba(74,222,128,0.25); font-size: 12px;
        }
        .pf-stats-tag {
          font-size: 8px; font-weight: 900;
          color: rgba(74,222,128,0.45);
          letter-spacing: 0.12em;
          font-family: 'Press Start 2P', monospace;
          border-left: 1px solid rgba(74,222,128,0.15);
          padding-left: 10px;
          margin-left: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .pf-stats-num { text-shadow: none; }
        }
      `}</style>
    </div>
  )
}
