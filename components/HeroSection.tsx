'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play, Wand2, ChevronRight } from 'lucide-react'
import type { Game } from '@/lib/types'

const GENRE_COLORS: Record<string, { bg: string; glow: string; emoji: string }> = {
  arcade:      { bg: 'linear-gradient(145deg,#4a0932,#1a0315)', glow: '#f472b6', emoji: '👾' },
  shooter:     { bg: 'linear-gradient(145deg,#3d0a0a,#120206)', glow: '#f87171', emoji: '🚀' },
  platformer:  { bg: 'linear-gradient(145deg,#3a2200,#160d00)', glow: '#fbbf24', emoji: '🏃' },
  puzzle:      { bg: 'linear-gradient(145deg,#003322,#001510)', glow: '#34d399', emoji: '🧩' },
  rpg:         { bg: 'linear-gradient(145deg,#1a0a40,#0a0420)', glow: '#a78bfa', emoji: '⚔️' },
  educational: { bg: 'linear-gradient(145deg,#003320,#001a10)', glow: '#4ade80', emoji: '🎓' },
  other:       { bg: 'linear-gradient(145deg,#0a1840,#040820)', glow: '#60a5fa', emoji: '🎮' },
}

const ROTATING_WORDS = ['Build.', 'Play.', 'Create.', 'Share.', 'Remix.']

function FloatingCard({ game, style, delay }: { game: Game; style: React.CSSProperties; delay: number }) {
  const g = GENRE_COLORS[game.genre] ?? GENRE_COLORS.other
  return (
    <Link href={`/play/${game.id}`} style={{ textDecoration: 'none', ...style, display: 'block' }}>
      <div className="float-card" style={{ animationDelay: `${delay}s` }}>
        <div className="float-cover" style={{ background: g.bg }}>
          <div className="float-glow" style={{ background: g.glow }} />
          <span className="float-emoji">{g.emoji}</span>
          <div className="float-play"><Play size={14} color="#fff" fill="#fff" /></div>
        </div>
        <div className="float-info">
          <p className="float-title">{game.title}</p>
          <p className="float-genre">{game.genre.toUpperCase()}</p>
        </div>
      </div>
    </Link>
  )
}

export default function HeroSection({ featuredGames }: { featuredGames: Game[] }) {
  const [wordIdx, setWordIdx] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const iv = setInterval(() => setWordIdx(i => (i + 1) % ROTATING_WORDS.length), 2200)
    return () => clearInterval(iv)
  }, [])

  return (
    <section className="hero-section">
      {/* Left: text */}
      <div className="hero-left">
        <div className="hero-badge">
          <span className="badge-dot" />
          FREE TO PLAY · NO ACCOUNT NEEDED
        </div>

        <h1 className="hero-title">
          <span className="hero-title-line1">AI Arcade.</span>
          <span className="hero-title-line2">
            {mounted ? (
              <span key={wordIdx} className="rotating-word">
                {ROTATING_WORDS[wordIdx]}
              </span>
            ) : (
              <span className="rotating-word">{ROTATING_WORDS[0]}</span>
            )}
          </span>
        </h1>

        <p className="hero-desc">
          Browser arcade powered by AI. Play 12+ unique games instantly — or describe any idea and AI builds it playable in 15 seconds.
        </p>

        <div className="hero-ctas">
          <a href="#arcade" className="hero-btn-primary">
            <Play size={16} fill="#fff" /> Play Now — Free
          </a>
          <Link href="/create" className="hero-btn-secondary">
            <Wand2 size={15} /> Build with AI <ChevronRight size={14} />
          </Link>
        </div>

        <div className="hero-proof">
          {[
            { n: '15+', label: 'games' },
            { n: '15s', label: 'to build' },
            { n: '∞', label: 'possibilities' },
          ].map(p => (
            <div key={p.label} className="proof-item">
              <span className="proof-n">{p.n}</span>
              <span className="proof-label">{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: floating game cards */}
      <div className="hero-right" aria-hidden>
        <div className="cards-scene">
          {featuredGames.slice(0, 4).map((game, i) => {
            const positions = [
              { top: '0%',   left: '10%',  width: 160, rotate: '-6deg' },
              { top: '5%',   right: '5%',  width: 145, rotate: '5deg'  },
              { top: '52%',  left: '0%',   width: 150, rotate: '4deg'  },
              { top: '48%',  right: '8%',  width: 140, rotate: '-4deg' },
            ]
            const pos = positions[i]
            return (
              <FloatingCard
                key={game.id}
                game={game}
                style={{ position: 'absolute', width: pos.width, transform: `rotate(${pos.rotate})`, ...pos }}
                delay={i * 0.4}
              />
            )
          })}
          {/* Center glow orb */}
          <div className="scene-orb" />
          <div className="scene-ring" />
          <div className="scene-center-icon">🕹️</div>
        </div>
      </div>

      <style>{`
        .hero-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          padding: 64px 0 48px;
          min-height: 520px;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px; border-radius: 99px; margin-bottom: 24px;
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(167,139,250,0.25);
          font-size: 10px; font-weight: 900;
          color: #c4b5fd; letter-spacing: 0.08em;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80; box-shadow: 0 0 8px #4ade80;
          animation: dot-pulse 2s ease-in-out infinite;
          display: inline-block; flex-shrink: 0;
        }
        @keyframes dot-pulse { 0%,100%{opacity:1;box-shadow:0 0 8px #4ade80} 50%{opacity:0.4;box-shadow:0 0 3px #4ade80} }
        .hero-title {
          font-size: clamp(42px, 6vw, 76px);
          font-weight: 900; line-height: 1.0;
          letter-spacing: -0.04em; margin-bottom: 20px;
          color: #fff;
          display: flex; flex-direction: column; gap: 2px;
        }
        .hero-title-line1 {
          background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-title-line2 { display: block; }
        .rotating-word {
          display: inline-block;
          background: linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f97316 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: word-in 0.4s cubic-bezier(0.2, 0, 0, 1) both;
        }
        @keyframes word-in {
          from { opacity: 0; transform: translateY(16px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .hero-desc {
          font-size: 16px; color: rgba(255,255,255,0.5);
          line-height: 1.65; margin-bottom: 28px; max-width: 440px;
        }
        .hero-ctas { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 32px; }
        .hero-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          color: #fff; font-weight: 800; font-size: 15px;
          text-decoration: none; cursor: pointer;
          box-shadow: 0 0 32px rgba(124,58,237,0.45);
          transition: all 0.2s; border: none;
        }
        .hero-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 48px rgba(124,58,237,0.65);
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
        }
        .hero-btn-secondary {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 13px 22px; border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.7); font-weight: 700; font-size: 15px;
          text-decoration: none; transition: all 0.2s;
        }
        .hero-btn-secondary:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.25);
          color: #fff;
        }
        .hero-proof { display: flex; gap: 24px; }
        .proof-item { display: flex; flex-direction: column; gap: 2px; }
        .proof-n { font-size: 24px; font-weight: 900; color: #fff; letter-spacing: -0.02em; }
        .proof-label { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }

        /* FLOATING CARDS */
        .hero-right { position: relative; height: 480px; }
        .cards-scene { position: relative; width: 100%; height: 100%; }
        .scene-orb {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 200px; height: 200px; border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 65%);
          filter: blur(40px);
          animation: orb-pulse 4s ease-in-out infinite;
        }
        .scene-ring {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 140px; height: 140px; border-radius: 50%;
          border: 1px solid rgba(167,139,250,0.2);
          animation: ring-spin 12s linear infinite;
        }
        .scene-ring::after {
          content: '';
          position: absolute; top: -4px; left: 50%;
          width: 8px; height: 8px; border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 12px #a78bfa;
          transform: translateX(-50%);
        }
        @keyframes ring-spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes orb-pulse { 0%,100%{opacity:0.8;transform:translate(-50%,-50%) scale(1)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.12)} }
        .scene-center-icon {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          font-size: 40px; z-index: 2;
          filter: drop-shadow(0 0 20px rgba(167,139,250,0.6));
          animation: icon-float 3s ease-in-out infinite;
        }
        @keyframes icon-float { 0%,100%{transform:translate(-50%,-50%) translateY(0)} 50%{transform:translate(-50%,-50%) translateY(-8px)} }
        .float-card {
          background: #12121e;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; overflow: hidden;
          cursor: pointer;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          animation: card-float 4s ease-in-out infinite;
          transition: transform 0.2s, box-shadow 0.2s;
          will-change: transform;
        }
        .float-card:hover {
          transform: translateY(-8px) scale(1.05) !important;
          box-shadow: 0 30px 80px rgba(0,0,0,0.8);
          border-color: rgba(255,255,255,0.22);
          z-index: 10;
        }
        @keyframes card-float {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .float-cover {
          width: 100%; aspect-ratio: 16/10;
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .float-glow {
          position: absolute; width: 80px; height: 80px;
          border-radius: 50%; filter: blur(30px); opacity: 0.5;
          top: 50%; left: 50%; transform: translate(-50%,-50%);
        }
        .float-emoji { font-size: 32px; position: relative; z-index: 1; }
        .float-play {
          position: absolute; bottom: 8px; right: 8px; z-index: 2;
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(4px);
        }
        .float-info { padding: 8px 10px; }
        .float-title { font-size: 11px; font-weight: 800; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .float-genre { font-size: 9px; color: rgba(255,255,255,0.3); font-weight: 700; letter-spacing: 0.06em; margin-top: 2px; }

        @media (max-width: 900px) {
          .hero-section { grid-template-columns: 1fr; gap: 24px; padding: 40px 0 32px; min-height: auto; }
          .hero-right { display: none; }
          .hero-title { font-size: clamp(36px, 9vw, 56px); }
        }
        @media (max-width: 480px) {
          .hero-section { padding: 28px 0 24px; }
          .hero-proof { gap: 16px; }
        }
      `}</style>
    </section>
  )
}
