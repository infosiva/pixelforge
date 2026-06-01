'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Play } from 'lucide-react'
import type { Game } from '@/lib/types'
import { WordReveal, ScratchUnderline } from '@/components/TextReveal'

const GENRE_CHIPS = [
  { id: 'platformer', label: 'Platformer', emoji: '🏃', color: '#a855f7', starter: 'A side-scrolling platformer where you jump over obstacles and collect coins in a neon city' },
  { id: 'shooter',    label: 'Shooter',    emoji: '🔫', color: '#22d3ee', starter: 'A top-down space shooter where you defend Earth from alien waves with power-up weapons' },
  { id: 'puzzle',     label: 'Puzzle',     emoji: '🧩', color: '#4ade80', starter: 'A sliding block puzzle game with gravity mechanics where you clear a path to the exit' },
  { id: 'rpg',        label: 'RPG',        emoji: '⚔️', color: '#f59e0b', starter: 'An RPG adventure where a tiny knight explores dungeons, battles skeletons, and finds treasure' },
] as const

const TERMINAL_LINES = [
  { text: '> describe "space dino shooter"',  color: '#22d3ee',  delay: 0    },
  { text: '  parsing game concept...',         color: '#666a8a',  delay: 600  },
  { text: '  generating game logic...',        color: '#666a8a',  delay: 1200 },
  { text: '  building Phaser scene...',        color: '#666a8a',  delay: 1800 },
  { text: '  rendering pixel sprites...',      color: '#666a8a',  delay: 2400 },
  { text: '✓ game ready [8.3s]',               color: '#4ade80',  delay: 3000 },
  { text: '> launching in browser...',         color: '#22d3ee',  delay: 3600 },
]

const EXAMPLE_PROMPTS = [
  '"Space game where you fight dinosaurs"',
  '"Puzzle with gravity flip mechanic"',
  '"Tower defense in medieval castle"',
  '"Side-scroller with double jump"',
  '"Bullet hell with power-ups"',
]

function TerminalWindow() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  const [promptIdx, setPromptIdx] = useState(0)

  useEffect(() => {
    // Cursor blink
    const cursor = setInterval(() => setShowCursor(c => !c), 530)

    // Reveal lines one by one
    const timers: ReturnType<typeof setTimeout>[] = []
    TERMINAL_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), TERMINAL_LINES[i].delay + 400))
    })

    // Reset and cycle prompts
    const reset = setTimeout(() => {
      setVisibleLines(0)
      setPromptIdx(p => (p + 1) % EXAMPLE_PROMPTS.length)
    }, 5800)

    return () => {
      clearInterval(cursor)
      timers.forEach(clearTimeout)
      clearTimeout(reset)
    }
  }, [promptIdx])

  const lines = TERMINAL_LINES.map((l, i) => ({
    ...l,
    text: i === 0 ? `> describe ${EXAMPLE_PROMPTS[promptIdx]}` : l.text,
  }))

  return (
    <div className="terminal-wrap">
      {/* CRT monitor bezel */}
      <div className="crt-bezel">
        <div className="crt-screen">
          {/* scanline overlay */}
          <div className="crt-scanlines" aria-hidden />
          {/* screen content */}
          <div className="crt-content">
            {/* title bar */}
            <div className="term-bar">
              <div className="term-dots">
                <span style={{ background: '#ff5f57' }} />
                <span style={{ background: '#febc2e' }} />
                <span style={{ background: '#28c840' }} />
              </div>
              <span className="term-title">pixelforge — game-builder</span>
            </div>
            {/* terminal output */}
            <div className="term-body">
              {lines.slice(0, visibleLines).map((line, i) => (
                <div key={i} className="term-line" style={{ color: line.color }}>
                  {line.text}
                  {i === visibleLines - 1 && (
                    <span className="term-cursor" style={{ opacity: showCursor ? 1 : 0 }}>▊</span>
                  )}
                </div>
              ))}
              {visibleLines === 0 && (
                <div className="term-line" style={{ color: '#22d3ee' }}>
                  {'> '}<span className="term-cursor" style={{ opacity: showCursor ? 1 : 0 }}>▊</span>
                </div>
              )}
            </div>
            {/* mini game preview that "appears" after generation */}
            <div className="game-preview" style={{ opacity: visibleLines >= 7 ? 1 : 0 }}>
              <div className="game-preview-inner">
                <span className="preview-emoji">🦕</span>
                <div className="preview-beams">
                  <div className="beam beam1" />
                  <div className="beam beam2" />
                  <div className="beam beam3" />
                </div>
                <span className="preview-label">PLAYING NOW</span>
              </div>
            </div>
          </div>
        </div>
        {/* CRT stand */}
        <div className="crt-stand" />
        <div className="crt-base" />
      </div>
    </div>
  )
}

function CoinInsertBtn({ href }: { href: string }) {
  const [inserting, setInserting] = useState(false)

  function handleClick() {
    setInserting(true)
    setTimeout(() => setInserting(false), 800)
  }

  return (
    <Link href={href} className={`coin-btn${inserting ? ' coin-inserting' : ''}`} onClick={handleClick}>
      <span className="coin-icon" aria-hidden>🪙</span>
      <span className="coin-text">INSERT COIN — BUILD FREE</span>
      <span className="coin-glow" aria-hidden />
    </Link>
  )
}

import type { ContentOverrides } from '@/lib/content'

export default function HeroSection({ featuredGames, overrides = {} }: { featuredGames: Game[]; overrides?: ContentOverrides }) {
  const [mounted, setMounted] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  useEffect(() => { setMounted(true) }, [])

  function handleGenreChip(chip: typeof GENRE_CHIPS[number]) {
    setSelectedGenre(chip.id === selectedGenre ? null : chip.id)
  }

  return (
    <section className="hero-section">
      {/* ── LEFT: headline + CTAs ── */}
      <div className="hero-left">
        <div className="hero-badge">
          <span className="badge-dot" />
          FREE · NO ACCOUNT · NO DOWNLOAD
        </div>

        <h1 className="hero-h1" aria-label={overrides.headline ?? 'Describe your game. Play it in 30 seconds. No engine knowledge required.'}>
          {overrides.headline ? (
            <WordReveal text={overrides.headline} className="h1-override" highlightColor="#22d3ee" />
          ) : (
            <div className="h1-lines">
              <WordReveal
                text="Describe your game."
                stagger={0.07}
                className="h1-top"
              />
              <div className="h1-bottom-wrap">
                <WordReveal
                  text="Play it in 30 seconds."
                  stagger={0.07}
                  highlight={[3, 4]}
                  highlightColor="#22d3ee"
                  className="h1-bottom"
                />
              </div>
            </div>
          )}
        </h1>

        <p className="hero-sub">
          {overrides.subheadline ?? (
            <>AI turns your idea into a playable Phaser 3 browser game instantly — platformer, puzzle, shooter, yours to keep.&nbsp;<strong style={{ color: '#22d3ee' }}>No engine knowledge required.</strong></>
          )}
        </p>

        {/* Genre chip selector — 4 arcade-style buttons */}
        <div className="genre-chips-row" role="group" aria-label="Pick a genre to start">
          {GENRE_CHIPS.map(chip => (
            <button
              key={chip.id}
              type="button"
              className={`genre-chip${selectedGenre === chip.id ? ' genre-chip-active' : ''}`}
              style={selectedGenre === chip.id ? {
                borderColor: chip.color,
                background: `${chip.color}18`,
                color: chip.color,
                boxShadow: `0 0 16px ${chip.color}40`,
              } : {}}
              onClick={() => handleGenreChip(chip)}
              aria-pressed={selectedGenre === chip.id}
            >
              <span className="gc-emoji">{chip.emoji}</span>
              <span className="gc-label">{chip.label}</span>
            </button>
          ))}
        </div>

        {/* CTAs */}
        <div className="hero-ctas">
          <CoinInsertBtn
            href={selectedGenre
              ? `/create?genre=${selectedGenre}&prompt=${encodeURIComponent(GENRE_CHIPS.find(c => c.id === selectedGenre)?.starter ?? '')}`
              : '/create'}
          />
          <a href="#arcade" className="hero-browse-btn">
            <Play size={14} fill="currentColor" /> Browse Arcade
          </a>
        </div>

        {/* Try demo button */}
        <div className="try-demo-row">
          <a href="#arcade" className="try-demo-btn">
            <span className="try-demo-icon">▶</span>
            Try a demo game first →
          </a>
        </div>

        {/* Trust badge */}
        <div className="trust-badge">
          <span className="trust-icon">⚡</span>
          <span>Build time: ~30 seconds</span>
          <span className="trust-sep">·</span>
          <span className="trust-icon">🕹️</span>
          <span>15+ games live</span>
          <span className="trust-sep">·</span>
          <span className="trust-icon">🎮</span>
          <span>Controller ready</span>
        </div>
      </div>

      {/* ── RIGHT: CRT terminal ── */}
      <div className="hero-right" aria-hidden={!mounted}>
        {mounted && <TerminalWindow />}
      </div>

      {/* ── MOBILE: vertical wizard steps ── */}
      <div className="mobile-wizard" aria-label="How it works">
        {[
          { step: '01', icon: '✏️', title: 'Describe',  desc: 'Type any game idea in plain English' },
          { step: '02', icon: '🤖', title: 'AI Builds', desc: 'AI writes code + generates pixel art' },
          { step: '03', icon: '▶️', title: 'Play',       desc: 'Game launches instantly in your browser' },
        ].map((s, i) => (
          <div key={s.step} className="wizard-step">
            <div className="wz-connector" style={{ opacity: i === 0 ? 0 : 1 }} />
            <div className="wz-icon">{s.icon}</div>
            <div className="wz-body">
              <span className="wz-num">{s.step}</span>
              <span className="wz-title">{s.title}</span>
              <span className="wz-desc">{s.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        /* ── HERO LAYOUT ── */
        .hero-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: center;
          padding: 60px 0 48px;
        }

        /* ── BADGE ── */
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px; border-radius: 99px; margin-bottom: 24px;
          background: rgba(34,211,238,0.08);
          border: 1px solid rgba(34,211,238,0.25);
          font-size: 9px; font-weight: 900;
          color: #22d3ee; letter-spacing: 0.1em;
          font-family: 'Press Start 2P', monospace;
        }
        .badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80; box-shadow: 0 0 8px #4ade80;
          animation: dot-pulse 2s ease-in-out infinite;
          display: inline-block; flex-shrink: 0;
        }
        @keyframes dot-pulse { 0%,100%{opacity:1;box-shadow:0 0 8px #4ade80} 50%{opacity:0.3;box-shadow:0 0 2px #4ade80} }

        /* ── HEADLINE ── */
        .hero-h1 {
          display: flex; flex-direction: column; gap: 4px;
          margin-bottom: 20px;
          font-family: 'Press Start 2P', monospace;
          line-height: 1.3;
        }
        /* h1 lines wrapper */
        .h1-lines {
          display: flex; flex-direction: column; gap: 4px;
        }
        /* row 1: white */
        .h1-top {
          font-size: clamp(22px, 3.5vw, 40px);
          color: rgba(255,255,255,0.9);
          transform-origin: bottom center;
        }
        /* row 2: gradient wrap */
        .h1-bottom-wrap {
          display: block;
        }
        .h1-bottom {
          font-size: clamp(22px, 3.5vw, 40px);
          background: linear-gradient(135deg, #a855f7, #22d3ee);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: none;
          filter: drop-shadow(0 0 20px rgba(168,85,247,0.5));
          transform-origin: bottom center;
        }
        /* override headline (Edge Config) */
        .h1-override {
          font-size: clamp(22px, 3.5vw, 40px);
          color: rgba(255,255,255,0.9);
        }

        /* ── SUB ── */
        .hero-sub {
          font-size: 15px; color: rgba(255,255,255,0.52);
          line-height: 1.7; margin-bottom: 24px; max-width: 420px;
        }

        /* ── CTAs ── */
        .hero-ctas {
          display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px;
        }

        /* COIN INSERT BUTTON */
        .coin-btn {
          position: relative; overflow: hidden;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 24px; border-radius: 6px;
          background: #050208;
          border: 2px solid #a855f7;
          color: #a855f7; font-weight: 900; font-size: 12px;
          text-decoration: none; cursor: pointer;
          font-family: 'Press Start 2P', monospace;
          letter-spacing: 0.04em;
          box-shadow: 0 0 20px rgba(168,85,247,0.4), inset 0 0 20px rgba(168,85,247,0.05);
          transition: box-shadow 0.15s, transform 0.1s, border-color 0.15s;
          min-height: 52px;
        }
        .coin-btn:hover {
          border-color: #22d3ee;
          color: #22d3ee;
          box-shadow: 0 0 32px rgba(34,211,238,0.5), inset 0 0 32px rgba(34,211,238,0.05);
        }
        .coin-btn:active, .coin-inserting {
          transform: scale(0.97);
        }
        .coin-icon {
          font-size: 18px;
          animation: coin-spin 3s linear infinite;
        }
        @keyframes coin-spin {
          0%   { transform: rotateY(0deg);   }
          50%  { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }
        .coin-inserting .coin-icon {
          animation: coin-insert 0.5s ease both;
        }
        @keyframes coin-insert {
          0%   { transform: translateY(0) scale(1);    opacity: 1; }
          40%  { transform: translateY(6px) scale(0.8); opacity: 0.5; }
          60%  { transform: translateY(-4px) scale(1.2); opacity: 1; }
          100% { transform: translateY(0) scale(1);    opacity: 1; }
        }
        .coin-glow {
          position: absolute; inset: -2px;
          background: linear-gradient(135deg, #a855f7, #22d3ee);
          border-radius: 6px; z-index: -1; opacity: 0;
          transition: opacity 0.15s;
        }
        .coin-btn:hover .coin-glow { opacity: 0.12; }

        /* Browse btn */
        .hero-browse-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 20px; border-radius: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6); font-weight: 700; font-size: 13px;
          text-decoration: none; transition: all 0.15s;
          min-height: 52px;
        }
        .hero-browse-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          color: #fff;
        }

        /* ── GENRE CHIPS ── */
        .genre-chips-row {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 8px; margin-bottom: 20px;
        }
        .genre-chip {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 12px 8px; border-radius: 10px; cursor: pointer;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 700;
          transition: border-color 0.2s, background 0.2s, color 0.2s, transform 0.15s, box-shadow 0.2s;
          font-family: system-ui, sans-serif;
          letter-spacing: 0.02em; text-transform: uppercase;
        }
        .genre-chip:hover {
          border-color: rgba(168,85,247,0.5);
          background: rgba(168,85,247,0.1);
          color: rgba(255,255,255,0.9);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(168,85,247,0.2);
        }
        .genre-chip:active { transform: scale(0.96) translateY(0); }
        .genre-chip-active {
          transform: translateY(-2px);
        }
        .gc-emoji { font-size: 22px; line-height: 1; }
        .gc-label { font-size: 10px; }

        /* ── TRY DEMO ── */
        .try-demo-row { margin-bottom: 20px; }
        .try-demo-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.4); text-decoration: none;
          transition: color 0.15s;
        }
        .try-demo-btn:hover { color: rgba(255,255,255,0.7); }
        .try-demo-icon {
          font-size: 9px; color: #a855f7;
        }

        /* ── TRUST BADGE ── */
        .trust-badge {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 600;
        }
        .trust-icon { font-size: 13px; }
        .trust-sep { color: rgba(255,255,255,0.15); }

        /* ── CRT TERMINAL ── */
        .terminal-wrap {
          display: flex; flex-direction: column; align-items: center;
        }
        .crt-bezel {
          background: linear-gradient(145deg, #1a1428 0%, #0d0b14 100%);
          border-radius: 20px 20px 8px 8px;
          padding: 14px 14px 10px;
          border: 2px solid rgba(168,85,247,0.3);
          box-shadow:
            0 0 40px rgba(168,85,247,0.2),
            0 0 80px rgba(168,85,247,0.08),
            inset 0 0 20px rgba(0,0,0,0.8);
          width: 100%; max-width: 500px;
          position: relative;
        }
        .crt-screen {
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid rgba(34,211,238,0.2);
          position: relative;
          background: #04020a;
          box-shadow: inset 0 0 30px rgba(34,211,238,0.06);
        }
        .crt-scanlines {
          position: absolute; inset: 0; z-index: 5; pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.15) 2px,
            rgba(0,0,0,0.15) 4px
          );
        }
        .crt-content { position: relative; z-index: 1; }

        /* Terminal bar */
        .term-bar {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 12px; background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .term-dots { display: flex; gap: 5px; }
        .term-dots span {
          width: 9px; height: 9px; border-radius: 50%; display: block;
        }
        .term-title {
          font-size: 9px; color: rgba(255,255,255,0.25);
          font-family: monospace; letter-spacing: 0.05em;
          margin: 0 auto;
        }

        /* Terminal body */
        .term-body {
          padding: 16px 18px; min-height: 180px;
          font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.8;
        }
        .term-line { white-space: pre; }
        .term-cursor {
          display: inline-block;
          color: #22d3ee;
          transition: opacity 0.1s;
        }

        /* Mini game preview panel */
        .game-preview {
          margin: 0 18px 14px;
          border: 1px solid rgba(34,211,238,0.3);
          border-radius: 6px;
          background: rgba(34,211,238,0.04);
          overflow: hidden;
          transition: opacity 0.6s ease;
        }
        .game-preview-inner {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 14px; position: relative;
        }
        .preview-emoji { font-size: 24px; }
        .preview-beams {
          flex: 1; display: flex; flex-direction: column; gap: 5px;
        }
        .beam {
          height: 6px; border-radius: 3px;
          background: linear-gradient(90deg, #22d3ee, transparent);
          animation: beam-scan 1.5s ease-in-out infinite;
        }
        .beam1 { width: 70%; }
        .beam2 { width: 45%; animation-delay: 0.3s; }
        .beam3 { width: 60%; animation-delay: 0.6s; }
        @keyframes beam-scan {
          0%,100% { opacity: 0.4; transform: scaleX(1); }
          50%      { opacity: 1;   transform: scaleX(1.05); }
        }
        .preview-label {
          font-size: 8px; font-family: 'Press Start 2P', monospace;
          color: #22d3ee; letter-spacing: 0.06em;
          animation: preview-blink 1.2s ease-in-out infinite;
        }
        @keyframes preview-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        /* CRT stand + base */
        .crt-stand {
          width: 40px; height: 14px; margin: 0 auto;
          background: linear-gradient(to bottom, #1a1428, #0d0b14);
          border: 1px solid rgba(168,85,247,0.2);
          border-top: none;
        }
        .crt-base {
          width: 110px; height: 10px; margin: 0 auto;
          background: linear-gradient(to bottom, #1a1428, #0d0b14);
          border: 1px solid rgba(168,85,247,0.2);
          border-radius: 0 0 6px 6px;
        }

        /* ── MOBILE WIZARD ── */
        .mobile-wizard { display: none; }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .hero-section {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 40px 0 32px;
          }
          .hero-right { display: none; }
          .hero-h1 { }
          .h1-top, .h1-bottom { font-size: clamp(18px, 5.5vw, 30px); }
        }

        @media (max-width: 640px) {
          .hero-section { padding: 28px 0 20px; gap: 20px; }
          .hero-badge { font-size: 7px; padding: 4px 10px; }
          .h1-top, .h1-bottom { font-size: clamp(16px, 5vw, 22px); }
          .hero-sub { font-size: 13px; }
          .coin-btn { font-size: 9px; padding: 12px 16px; min-height: 48px; }
          .genre-chip { font-size: 8px; padding: 10px 6px; }
          .gc-emoji { font-size: 18px; }
          .genre-chips-row { gap: 6px; }

          /* Show mobile wizard */
          .mobile-wizard {
            display: flex; flex-direction: column; gap: 0;
            margin-top: 24px;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 14px; overflow: hidden;
          }
          .wizard-step {
            display: flex; align-items: flex-start; gap: 14px;
            padding: 16px 18px; position: relative;
          }
          .wizard-step:not(:last-child) {
            border-bottom: 1px solid rgba(255,255,255,0.05);
          }
          .wz-connector {
            position: absolute; left: 28px; top: 0; bottom: 0;
            width: 1px; background: rgba(168,85,247,0.2);
          }
          .wz-icon {
            font-size: 20px; flex-shrink: 0; z-index: 1;
          }
          .wz-body {
            display: flex; flex-direction: column; gap: 2px;
          }
          .wz-num {
            font-size: 8px; font-family: 'Press Start 2P', monospace;
            color: #a855f7; letter-spacing: 0.06em;
          }
          .wz-title {
            font-size: 13px; font-weight: 800; color: #fff;
          }
          .wz-desc {
            font-size: 11px; color: rgba(255,255,255,0.4); line-height: 1.4;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .coin-icon, .badge-dot, .beam, .preview-label { animation: none; }
        }
      `}</style>
    </section>
  )
}
