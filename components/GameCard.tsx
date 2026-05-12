'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { Play, Heart, Users, Gamepad2 } from 'lucide-react'
import type { Game } from '@/lib/types'

/* Per-genre visual identity */
const GENRE: Record<string, {
  bg: string; glow: string; glow2: string; emoji: string; label: string
  pattern: string; accent: string
}> = {
  arcade: {
    bg: 'linear-gradient(145deg,#2d0a1e 0%,#0f0009 100%)',
    glow: '#f472b6', glow2: '#ec4899', emoji: '👾', label: 'ARCADE',
    pattern: 'radial-gradient(circle at 20% 80%, rgba(244,114,182,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236,72,153,0.1) 0%, transparent 50%)',
    accent: '#f472b6',
  },
  shooter: {
    bg: 'linear-gradient(145deg,#2a0505 0%,#080010 100%)',
    glow: '#f87171', glow2: '#ef4444', emoji: '🚀', label: 'SHOOTER',
    pattern: 'radial-gradient(circle at 70% 30%, rgba(248,113,113,0.18) 0%, transparent 55%), radial-gradient(circle at 20% 70%, rgba(239,68,68,0.08) 0%, transparent 50%)',
    accent: '#f87171',
  },
  platformer: {
    bg: 'linear-gradient(145deg,#251500 0%,#0a0500 100%)',
    glow: '#fbbf24', glow2: '#f59e0b', emoji: '🏃', label: 'PLATFORMER',
    pattern: 'radial-gradient(circle at 30% 60%, rgba(251,191,36,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(245,158,11,0.1) 0%, transparent 50%)',
    accent: '#fbbf24',
  },
  puzzle: {
    bg: 'linear-gradient(145deg,#001a10 0%,#000a06 100%)',
    glow: '#34d399', glow2: '#10b981', emoji: '🧩', label: 'PUZZLE',
    pattern: 'radial-gradient(circle at 60% 40%, rgba(52,211,153,0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(16,185,129,0.08) 0%, transparent 50%)',
    accent: '#34d399',
  },
  rpg: {
    bg: 'linear-gradient(145deg,#100520 0%,#040010 100%)',
    glow: '#a78bfa', glow2: '#7c3aed', emoji: '⚔️', label: 'RPG',
    pattern: 'radial-gradient(circle at 40% 30%, rgba(167,139,250,0.2) 0%, transparent 55%), radial-gradient(circle at 80% 70%, rgba(124,58,237,0.1) 0%, transparent 50%)',
    accent: '#a78bfa',
  },
  educational: {
    bg: 'linear-gradient(145deg,#001c10 0%,#000a04 100%)',
    glow: '#4ade80', glow2: '#22c55e', emoji: '🎓', label: 'EDU',
    pattern: 'radial-gradient(circle at 50% 50%, rgba(74,222,128,0.15) 0%, transparent 55%)',
    accent: '#4ade80',
  },
  other: {
    bg: 'linear-gradient(145deg,#050a20 0%,#020510 100%)',
    glow: '#60a5fa', glow2: '#3b82f6', emoji: '🎮', label: 'GAME',
    pattern: 'radial-gradient(circle at 50% 50%, rgba(96,165,250,0.15) 0%, transparent 55%)',
    accent: '#60a5fa',
  },
}

function fmt(n: number) { return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n) }

export default function GameCard({ game, featured }: { game: Game; featured?: boolean }) {
  const g = GENRE[game.genre] ?? GENRE.other
  const cardRef = useRef<HTMLDivElement>(null)

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    // Skip 3D tilt on touch devices — hover events don't apply and can cause stuck states
    if (window.matchMedia('(hover: none)').matches) return
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-4px) scale(1.02)`
    card.style.setProperty('--mx', `${(x + 0.5) * 100}%`)
    card.style.setProperty('--my', `${(y + 0.5) * 100}%`)
  }

  function onMouseLeave() {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0) scale(1)'
  }

  return (
    <Link href={`/play/${game.id}`} className="gc-link">
      <div
        ref={cardRef}
        className={`gc ${featured ? 'gc-featured' : ''}`}
        style={{ '--glow': g.glow, '--glow2': g.glow2 } as React.CSSProperties}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Shine overlay on hover */}
        <div className="gc-shine" />

        {/* Cover */}
        <div className="gc-cover" style={{ background: g.bg }}>
          {/* Pattern bg */}
          <div className="gc-pattern" style={{ background: g.pattern }} />

          {/* Subtle grid */}
          <div className="gc-grid-overlay" />

          {/* Ambient glow */}
          <div className="gc-amb" style={{ background: `radial-gradient(circle, ${g.glow}30 0%, transparent 65%)` }} />

          {/* Thumbnail or emoji */}
          {game.thumbnailUrl
            ? <img src={game.thumbnailUrl} alt={game.title} className="gc-img" loading="lazy" />
            : (
              <div className="gc-emoji-wrap">
                <div className="gc-emoji-glow" style={{ background: g.glow }} />
                <span className="gc-emoji">{g.emoji}</span>
              </div>
            )
          }

          {/* Top: genre badge */}
          <div className="gc-top">
            <span className="gc-genre" style={{ background: `${g.glow}22`, color: g.glow, borderColor: `${g.glow}44` }}>
              {g.label}
            </span>
          </div>

          {/* Play overlay */}
          <div className="gc-play-overlay">
            <div className="gc-play-btn" style={{ background: `linear-gradient(135deg, ${g.glow}, ${g.glow2})` }}>
              <Play size={featured ? 22 : 18} color="#fff" fill="#fff" />
            </div>
            <span className="gc-play-text">PLAY NOW</span>
          </div>

          {/* Bottom accent bar */}
          <div className="gc-bar" style={{ background: `linear-gradient(90deg, ${g.glow}, ${g.glow2}, transparent)` }} />
        </div>

        {/* Info */}
        <div className="gc-info">
          <h3 className="gc-title">{game.title}</h3>
          <p className="gc-desc">{game.description}</p>
          <div className="gc-meta">
            <span className="gc-author">
              <Gamepad2 size={10} /> {game.authorName}
            </span>
            <div className="gc-stats">
              <span><Users size={10} /> {fmt(game.playCount)}</span>
              <span><Heart size={10} /> {fmt(game.likeCount)}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .gc-link { text-decoration: none; display: block; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
        .gc {
          background: #0e0e1a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; overflow: hidden;
          position: relative;
          transition: transform 0.15s ease, box-shadow 0.25s ease, border-color 0.2s;
          transform-style: preserve-3d;
          will-change: transform;
          cursor: pointer;
        }
        .gc:hover {
          box-shadow:
            0 28px 72px rgba(0,0,0,0.7),
            0 0 0 1px rgba(255,255,255,0.12),
            0 0 48px var(--glow, rgba(124,58,237,0.2));
          border-color: rgba(255,255,255,0.15);
        }
        .gc-featured { border-radius: 20px; }

        /* Shine */
        .gc-shine {
          position: absolute; inset: 0; z-index: 10;
          background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.06) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.2s;
          pointer-events: none; border-radius: inherit;
        }
        .gc:hover .gc-shine { opacity: 1; }

        /* Cover */
        .gc-cover {
          width: 100%; aspect-ratio: 16/9;
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .gc-featured .gc-cover { aspect-ratio: 16/8; }
        .gc-pattern {
          position: absolute; inset: 0; z-index: 0;
        }
        .gc-grid-overlay {
          position: absolute; inset: 0; z-index: 1; opacity: 0.06;
          background-image: linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .gc-amb {
          position: absolute; inset: 0; z-index: 2;
        }
        .gc-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; z-index: 3;
        }
        .gc-emoji-wrap {
          position: relative; z-index: 3;
          display: flex; align-items: center; justify-content: center;
        }
        .gc-emoji-glow {
          position: absolute; width: 100px; height: 100px;
          border-radius: 50%; filter: blur(40px); opacity: 0.45;
          transition: opacity 0.25s;
        }
        .gc:hover .gc-emoji-glow { opacity: 0.75; }
        .gc-emoji {
          font-size: 52px; line-height: 1;
          position: relative;
          filter: drop-shadow(0 4px 16px rgba(0,0,0,0.4));
          transition: transform 0.3s cubic-bezier(0.2,0,0,1.5);
        }
        .gc-featured .gc-emoji { font-size: 68px; }
        .gc:hover .gc-emoji { transform: scale(1.15) translateY(-4px); }

        /* Badges */
        .gc-top {
          position: absolute; top: 10px; left: 10px; z-index: 5;
        }
        .gc-genre {
          padding: 3px 8px; border-radius: 6px;
          font-size: 9px; font-weight: 900;
          letter-spacing: 0.09em; border: 1px solid;
          backdrop-filter: blur(4px);
        }

        /* Play overlay */
        .gc-play-overlay {
          position: absolute; inset: 0; z-index: 6;
          background: rgba(0,0,0,0.55);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 8px;
          opacity: 0; transition: opacity 0.2s;
          backdrop-filter: blur(2px);
        }
        .gc:hover .gc-play-overlay { opacity: 1; }
        .gc-play-btn {
          width: 48px; height: 48px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 32px rgba(255,255,255,0.25);
          transform: scale(0.8); transition: transform 0.2s cubic-bezier(0.2,0,0,1.5);
        }
        .gc-featured .gc-play-btn { width: 60px; height: 60px; }
        .gc:hover .gc-play-btn { transform: scale(1); }
        .gc-play-text {
          font-size: 11px; font-weight: 900; color: #fff;
          letter-spacing: 0.14em;
        }

        /* Accent bar */
        .gc-bar {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; opacity: 0; transition: opacity 0.25s;
          z-index: 5;
        }
        .gc:hover .gc-bar { opacity: 1; }

        /* Info */
        .gc-info { padding: 12px 14px 14px; }
        .gc-featured .gc-info { padding: 16px 18px 18px; }
        .gc-title {
          font-size: 14px; font-weight: 800; color: #fff;
          margin-bottom: 4px; letter-spacing: -0.01em;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .gc-featured .gc-title { font-size: 17px; margin-bottom: 6px; }
        .gc-desc {
          font-size: 11px; color: rgba(255,255,255,0.45);
          line-height: 1.5; margin-bottom: 10px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .gc-featured .gc-desc { font-size: 13px; }
        .gc-meta {
          display: flex; align-items: center;
          justify-content: space-between;
        }
        .gc-author {
          font-size: 10px; color: rgba(255,255,255,0.25);
          display: flex; align-items: center; gap: 4px;
        }
        .gc-stats {
          display: flex; gap: 10px;
          font-size: 10px; color: rgba(255,255,255,0.35);
        }
        .gc-stats span { display: flex; align-items: center; gap: 3px; }
      `}</style>
    </Link>
  )
}
