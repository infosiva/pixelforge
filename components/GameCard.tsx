'use client'
import Link from 'next/link'
import { Play, Heart, Users } from 'lucide-react'
import type { Game } from '@/lib/types'

const GENRE: Record<string, { grad: string; glow: string; emoji: string; label: string }> = {
  arcade:     { grad: 'linear-gradient(145deg,#4a0932 0%,#1a0315 100%)', glow: '#f472b6', emoji: '👾', label: 'ARCADE' },
  shooter:    { grad: 'linear-gradient(145deg,#3d0a0a 0%,#120206 100%)', glow: '#f87171', emoji: '🚀', label: 'SHOOTER' },
  platformer: { grad: 'linear-gradient(145deg,#3a2200 0%,#160d00 100%)', glow: '#fbbf24', emoji: '🏃', label: 'PLATFORMER' },
  puzzle:     { grad: 'linear-gradient(145deg,#003322 0%,#001510 100%)', glow: '#34d399', emoji: '🧩', label: 'PUZZLE' },
  rpg:        { grad: 'linear-gradient(145deg,#1a0a40 0%,#0a0420 100%)', glow: '#a78bfa', emoji: '⚔️', label: 'RPG' },
  other:      { grad: 'linear-gradient(145deg,#0a1840 0%,#040820 100%)', glow: '#60a5fa', emoji: '🎮', label: 'GAME' },
}

function fmt(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n) }

export default function GameCard({ game, large }: { game: Game; large?: boolean }) {
  const g = GENRE[game.genre] ?? GENRE.other

  return (
    <Link href={`/play/${game.id}`} className="game-card-link">
      <div className="game-card" data-glow={g.glow}>
        {/* Cover art area */}
        <div className="game-cover" style={{ background: g.grad }}>
          {/* Ambient glow blob */}
          <div className="cover-glow" style={{ background: g.glow }} />

          {game.thumbnailUrl
            ? <img src={game.thumbnailUrl} alt={game.title} className="cover-img" loading="lazy" />
            : <div className="cover-emoji">{g.emoji}</div>
          }

          {/* Top badges */}
          <div className="cover-top">
            <span className="genre-badge" style={{ background: g.glow + '28', color: g.glow, borderColor: g.glow + '50' }}>
              {g.label}
            </span>
          </div>

          {/* Play button overlay */}
          <div className="play-overlay">
            <div className="play-btn" style={{ background: g.glow }}>
              <Play size={large ? 22 : 18} color="#fff" fill="#fff" />
            </div>
            <span className="play-label">PLAY NOW</span>
          </div>
        </div>

        {/* Info */}
        <div className="game-info">
          <h3 className="game-title">{game.title}</h3>
          <p className="game-desc">{game.description}</p>
          <div className="game-meta">
            <span className="meta-author">by {game.authorName}</span>
            <div className="meta-stats">
              <span><Users size={10} /> {fmt(game.playCount)}</span>
              <span><Heart size={10} /> {fmt(game.likeCount)}</span>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="card-accent" style={{ background: `linear-gradient(90deg, ${g.glow}, transparent)` }} />
      </div>

      <style>{`
        .game-card-link { text-decoration: none; display: block; }
        .game-card {
          background: #12121e;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          position: relative;
          transition: transform 0.25s cubic-bezier(.22,.68,0,1.2), box-shadow 0.25s;
        }
        .game-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 24px 64px rgba(0,0,0,0.7), 0 0 40px var(--glow-color, rgba(124,58,237,0.25));
          border-color: rgba(255,255,255,0.18);
        }
        .game-cover {
          width: 100%; aspect-ratio: 16/9;
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .cover-glow {
          position: absolute; width: 120px; height: 120px;
          border-radius: 50%; filter: blur(50px); opacity: 0.35;
          top: 50%; left: 50%; transform: translate(-50%,-50%);
          transition: opacity 0.25s;
        }
        .game-card:hover .cover-glow { opacity: 0.6; }
        .cover-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; z-index: 1;
        }
        .cover-emoji {
          font-size: ${large ? '72px' : '52px'}; line-height: 1;
          z-index: 1; filter: drop-shadow(0 0 20px rgba(255,255,255,0.15));
          transition: transform 0.25s;
        }
        .game-card:hover .cover-emoji { transform: scale(1.12); }
        .cover-top {
          position: absolute; top: 10px; left: 10px; z-index: 3;
          display: flex; gap: 6px;
        }
        .genre-badge {
          padding: 3px 8px; border-radius: 5px;
          font-size: 9px; font-weight: 900;
          letter-spacing: 0.08em; border: 1px solid;
        }
        .play-overlay {
          position: absolute; inset: 0; z-index: 4;
          background: rgba(0,0,0,0.6);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 8px;
          opacity: 0; transition: opacity 0.2s;
        }
        .game-card:hover .play-overlay { opacity: 1; }
        .play-btn {
          width: ${large ? '56px' : '44px'}; height: ${large ? '56px' : '44px'};
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 24px rgba(255,255,255,0.3);
          transform: scale(0.85); transition: transform 0.2s;
        }
        .game-card:hover .play-btn { transform: scale(1); }
        .play-label {
          font-size: 11px; font-weight: 900; color: #fff;
          letter-spacing: 0.12em; opacity: 0.9;
        }
        .game-info { padding: ${large ? '16px 18px' : '10px 12px'}; }
        .game-title {
          font-size: ${large ? '17px' : '13px'}; font-weight: 800;
          color: #fff; margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          letter-spacing: -0.01em;
        }
        .game-desc {
          font-size: ${large ? '13px' : '11px'}; color: rgba(255,255,255,0.5);
          margin-bottom: 8px; line-height: 1.45;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .game-meta {
          display: flex; align-items: center;
          justify-content: space-between;
        }
        .meta-author { font-size: 11px; color: rgba(255,255,255,0.28); }
        .meta-stats {
          display: flex; gap: 10px;
          font-size: 11px; color: rgba(255,255,255,0.38);
        }
        .meta-stats span {
          display: flex; align-items: center; gap: 3px;
        }
        .card-accent {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; opacity: 0; transition: opacity 0.25s;
        }
        .game-card:hover .card-accent { opacity: 1; }
      `}</style>
    </Link>
  )
}
