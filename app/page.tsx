import Link from 'next/link'
import { Wand2, Gamepad2 } from 'lucide-react'
import ArcadeGrid from '@/components/ArcadeGrid'
import HeroSection from '@/components/HeroSection'
import StatsStrip from '@/components/StatsStrip'
import { listGames } from '@/lib/db'
import { CURATED_GAMES } from '@/lib/curatedGames'
import { getContentOverrides } from '@/lib/content'

// Realistic-sounding recently-built game titles
const RECENTLY_BUILT = [
  { title: 'Neon Snake 3000',    genre: 'Arcade',      time: '12s', emoji: '🐍' },
  { title: 'Pixel Knight',       genre: 'Platformer',  time: '9s',  emoji: '⚔️' },
  { title: 'Gravity Flipper',    genre: 'Puzzle',      time: '11s', emoji: '🧩' },
  { title: 'Galaxy Defender',    genre: 'Shooter',     time: '8s',  emoji: '🚀' },
  { title: 'Tower of Doom',      genre: 'RPG',         time: '14s', emoji: '🗼' },
  { title: 'Turbo Racer X',      genre: 'Racing',      time: '10s', emoji: '🏎️' },
]

export default async function HomePage() {
  let liveGames: Awaited<ReturnType<typeof listGames>> = []
  try { liveGames = await listGames(12) } catch {}
  const allGames = [...CURATED_GAMES, ...liveGames]
  const overrides = await getContentOverrides()

  return (
    <>
      {/* ── BACKGROUND ── */}
      <div className="pf-bg" aria-hidden>
        <div className="pf-blob pf-blob1" />
        <div className="pf-blob pf-blob2" />
        <div className="pf-blob pf-blob3" />
        <div className="pf-scanlines" />
        <div className="pf-grid-lines" />
      </div>

      <div className="pf-wrap">

        {/* ── HERO ── */}
        <HeroSection featuredGames={CURATED_GAMES.slice(0, 4)} overrides={overrides} />

        {/* ── STATS STRIP ── */}
        <StatsStrip />

        {/* ── RECENTLY BUILT FEED ── */}
        <section className="recent-section" aria-label="Recently built games">
          <div className="recent-header">
            <span className="recent-live-dot" aria-hidden />
            <span className="recent-label">RECENTLY BUILT</span>
            <span className="recent-badge">by AI</span>
          </div>
          <div className="recent-grid">
            {RECENTLY_BUILT.map((g) => (
              <Link href="/create" key={g.title} className="recent-card">
                <span className="recent-emoji">{g.emoji}</span>
                <div className="recent-info">
                  <span className="recent-title">{g.title}</span>
                  <span className="recent-genre">{g.genre}</span>
                </div>
                <span className="recent-time">⚡ {g.time}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS (desktop only — mobile sees wizard in HeroSection) ── */}
        <section className="how-section desktop-how" aria-label="How it works">
          <div className="how-header">
            <span className="section-eyebrow">HOW IT WORKS</span>
            <h2 className="how-title">Three steps to your game</h2>
          </div>
          <div className="how-steps">
            {[
              { n: '01', icon: '✏️', title: 'Describe',  desc: 'Type any game idea — genre, mechanics, theme. Be creative.' },
              { n: '02', icon: '🤖', title: 'AI Builds',  desc: 'AI generates Phaser game code + pixel art assets in ~8 seconds.' },
              { n: '03', icon: '▶️', title: 'Play',        desc: 'Game launches in your browser. Share the link, remix it, keep playing.' },
            ].map((s, i) => (
              <div key={s.n} className="how-step">
                <div className="step-num">{s.n}</div>
                {i < 2 && <div className="step-arrow" aria-hidden>→</div>}
                <div className="step-icon">{s.icon}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── ARCADE GRID ── */}
        <ArcadeGrid games={allGames} />

        {/* ── BUILD CTA ── */}
        <section className="build-cta">
          <div className="build-cta-inner">
            <div className="build-cta-glow" />
            <div className="build-cta-content">
              <div className="build-cta-badge">AI POWERED</div>
              <h2 className="build-cta-title">Build your game<br />in 8 seconds</h2>
              <p className="build-cta-desc">
                Type any idea. AI writes Phaser 3 code, generates pixel art, and publishes to the arcade instantly.
              </p>
              <div className="build-cta-examples">
                {['"Space game where you fight dinosaurs"', '"Puzzle with gravity flip"', '"Tower defense in medieval castle"'].map(ex => (
                  <span key={ex} className="example-pill">{ex}</span>
                ))}
              </div>
              <Link href="/create" className="build-cta-btn">
                <Wand2 size={16} /> Start Building Free
              </Link>
            </div>
            <div className="build-cta-visual">
              <div className="code-window">
                <div className="code-dots">
                  <span style={{ background: '#ff5f57' }} />
                  <span style={{ background: '#febc2e' }} />
                  <span style={{ background: '#28c840' }} />
                </div>
                <div className="code-lines">
                  <div className="code-line"><span className="c-kw">describe</span><span className="c-str">("space dino shooter")</span></div>
                  <div className="code-line c-comment">// generating Phaser 3 scene...</div>
                  <div className="code-line"><span className="c-fn">buildGame</span><span className="c-dim">(prompt)</span></div>
                  <div className="code-line c-comment">// pixel art: ✓ | collision: ✓ | score: ✓</div>
                  <div className="code-line"><span className="c-kw">publish</span><span className="c-str">("arcade")</span><span className="c-dim"> // 8.3s</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTROLLER GUIDE ── */}
        <section className="controller-section">
          <div className="controller-header">
            <span className="section-eyebrow">CONTROLLER READY</span>
            <h3 className="section-title">Plug in any gamepad</h3>
            <p className="section-sub">Xbox, PlayStation, or USB — every game supports controllers out of the box.</p>
          </div>
          <div className="controller-grid">
            {[
              { emoji: '🟢', title: 'Xbox',         hint: 'USB or Bluetooth — hold Xbox button 3s to pair',     color: '#4ade80' },
              { emoji: '🔵', title: 'PlayStation',  hint: 'USB-C or hold PS + Share to enter pairing mode',     color: '#60a5fa' },
              { emoji: '⚪', title: 'Any USB pad',  hint: 'Plug in → open game → press any button to activate', color: '#c4b5fd' },
            ].map(c => (
              <div key={c.title} className="controller-card" style={{ '--accent': c.color } as React.CSSProperties}>
                <span className="ctrl-emoji">{c.emoji}</span>
                <p className="ctrl-title">{c.title}</p>
                <p className="ctrl-hint">{c.hint}</p>
              </div>
            ))}
          </div>
          <div className="controller-tip">
            <Gamepad2 size={14} />
            Left stick / D-pad = move &nbsp;·&nbsp; A/Cross = jump &nbsp;·&nbsp; B/Circle = fire &nbsp;·&nbsp; Start = pause
          </div>
        </section>

      </div>

      {/* ── MOBILE FAB ── */}
      <Link href="/create" className="mobile-fab" aria-label="Build a game">
        <span>🪙</span>
        <span>INSERT COIN</span>
      </Link>

      <style>{`
        /* BACKGROUND */
        .pf-bg {
          position: fixed; inset: 0; z-index: 0;
          overflow: hidden; pointer-events: none;
          background: #050208;
        }
        .pf-blob {
          position: absolute; border-radius: 50%;
          filter: blur(90px); will-change: transform;
        }
        .pf-blob1 {
          width: 800px; height: 800px; top: -15%; left: -10%;
          background: radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 65%);
          animation: blob1 22s ease-in-out infinite;
        }
        .pf-blob2 {
          width: 600px; height: 600px; top: 15%; right: -8%;
          background: radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 65%);
          animation: blob2 28s ease-in-out infinite;
        }
        .pf-blob3 {
          width: 500px; height: 500px; bottom: 5%; left: 35%;
          background: radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 65%);
          animation: blob3 18s ease-in-out infinite;
        }
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(50px,-40px) scale(1.06)} 66%{transform:translate(-25px,45px) scale(0.94)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-45px,55px) scale(1.08)} 70%{transform:translate(35px,-25px) scale(0.92)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 30%{transform:translate(35px,45px) scale(0.9)} 60%{transform:translate(-30px,-35px) scale(1.1)} }
        .pf-scanlines {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px);
        }
        .pf-grid-lines {
          position: absolute; inset: 0; opacity: 0.025;
          background-image: linear-gradient(rgba(168,85,247,0.8) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(168,85,247,0.8) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* WRAP */
        .pf-wrap {
          position: relative; z-index: 1;
          max-width: 1280px; margin: 0 auto;
          padding: 0 24px;
        }

        /* RECENTLY BUILT */
        .recent-section { margin-bottom: 48px; }
        .recent-header {
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
        }
        .recent-live-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #f87171; box-shadow: 0 0 8px #f87171;
          animation: live-pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes live-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .recent-label {
          font-size: 10px; font-weight: 900; color: rgba(255,255,255,0.5);
          letter-spacing: 0.12em; font-family: 'Press Start 2P', monospace;
        }
        .recent-badge {
          font-size: 9px; font-weight: 900; color: #a855f7;
          background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.3);
          padding: 2px 8px; border-radius: 4px;
          font-family: 'Press Start 2P', monospace; letter-spacing: 0.06em;
        }
        .recent-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
        }
        .recent-card {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 10px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          text-decoration: none;
          transition: border-color 0.15s, background 0.15s, transform 0.1s;
          cursor: pointer;
        }
        .recent-card:hover {
          border-color: rgba(168,85,247,0.35);
          background: rgba(168,85,247,0.06);
          transform: translateY(-2px);
        }
        .recent-emoji { font-size: 20px; flex-shrink: 0; }
        .recent-info { flex: 1; min-width: 0; }
        .recent-title {
          font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.85);
          display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .recent-genre {
          font-size: 10px; color: rgba(255,255,255,0.3); font-weight: 600;
          letter-spacing: 0.04em; display: block;
        }
        .recent-time {
          font-size: 10px; color: #22d3ee; font-weight: 700; flex-shrink: 0;
          font-family: monospace;
        }

        /* HOW IT WORKS */
        .how-section { margin-bottom: 56px; }
        .how-header { text-align: center; margin-bottom: 32px; }
        .section-eyebrow {
          font-size: 9px; font-weight: 900; color: #a855f7;
          letter-spacing: 0.12em; display: block; margin-bottom: 10px;
          font-family: 'Press Start 2P', monospace;
        }
        .how-title {
          font-size: 22px; font-weight: 900; color: #fff;
          letter-spacing: -0.02em;
          font-family: 'Press Start 2P', monospace;
        }
        .how-steps {
          display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: 0;
          align-items: start;
        }
        .how-step {
          padding: 24px 20px; text-align: center;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
        }
        .step-arrow {
          display: flex; align-items: center; justify-content: center;
          width: 40px; font-size: 20px; color: rgba(168,85,247,0.4);
          align-self: center; flex-shrink: 0;
        }
        .step-num {
          font-size: 9px; font-family: 'Press Start 2P', monospace;
          color: #a855f7; letter-spacing: 0.08em; margin-bottom: 10px; display: block;
        }
        .step-icon { font-size: 28px; display: block; margin-bottom: 10px; }
        .step-title { font-size: 14px; font-weight: 900; color: #fff; margin-bottom: 8px; display: block; }
        .step-desc { font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.6; }

        /* BUILD CTA */
        .build-cta { margin: 60px 0; }
        .build-cta-inner {
          position: relative; border-radius: 16px; overflow: hidden;
          background: linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(34,211,238,0.05) 100%);
          border: 1px solid rgba(168,85,247,0.25);
          display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
          padding: 48px; align-items: center;
        }
        .build-cta-glow {
          position: absolute; top: -80px; left: -80px;
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 65%);
          filter: blur(50px); pointer-events: none;
        }
        .build-cta-badge {
          display: inline-flex; padding: 4px 12px; border-radius: 4px;
          background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.35);
          font-size: 9px; font-weight: 900; color: #a855f7;
          letter-spacing: 0.1em; margin-bottom: 16px;
          font-family: 'Press Start 2P', monospace;
        }
        .build-cta-title {
          font-size: clamp(22px, 3.5vw, 36px); font-weight: 900;
          color: #fff; line-height: 1.15; margin-bottom: 14px;
          font-family: 'Press Start 2P', monospace;
        }
        .build-cta-desc {
          font-size: 14px; color: rgba(255,255,255,0.5);
          line-height: 1.6; margin-bottom: 20px;
        }
        .build-cta-examples {
          display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;
        }
        .example-pill {
          font-size: 11px; color: rgba(255,255,255,0.4);
          padding: 5px 12px; border-radius: 4px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          font-style: italic;
        }
        .build-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 24px; border-radius: 6px;
          background: #050208;
          border: 2px solid #a855f7;
          color: #a855f7; font-weight: 900; font-size: 12px;
          text-decoration: none;
          font-family: 'Press Start 2P', monospace;
          box-shadow: 0 0 24px rgba(168,85,247,0.35);
          transition: all 0.15s;
        }
        .build-cta-btn:hover {
          border-color: #22d3ee; color: #22d3ee;
          box-shadow: 0 0 36px rgba(34,211,238,0.45);
          transform: translateY(-2px);
        }
        .build-cta-btn:active { transform: scale(0.97); }

        /* Code window */
        .code-window {
          background: #050208; border: 1px solid rgba(168,85,247,0.2);
          border-radius: 12px; overflow: hidden;
          box-shadow: 0 0 40px rgba(168,85,247,0.12);
        }
        .code-dots {
          display: flex; gap: 6px; padding: 10px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .code-dots span { width: 9px; height: 9px; border-radius: 50%; }
        .code-lines {
          padding: 18px; display: flex; flex-direction: column;
          gap: 8px; font-family: 'Courier New', monospace; font-size: 12px;
        }
        .code-line { line-height: 1.6; }
        .c-kw  { color: #a855f7; }
        .c-str { color: #4ade80; }
        .c-fn  { color: #22d3ee; }
        .c-dim { color: rgba(255,255,255,0.3); }
        .c-comment { color: rgba(255,255,255,0.22); font-style: italic; }

        /* CONTROLLER */
        .controller-section { margin-bottom: 80px; }
        .controller-header { text-align: center; margin-bottom: 24px; }
        .section-title {
          font-size: 18px; font-weight: 900; color: #fff;
          letter-spacing: -0.01em; margin-bottom: 8px;
          font-family: 'Press Start 2P', monospace;
        }
        .section-sub { font-size: 13px; color: rgba(255,255,255,0.4); }
        .controller-grid {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 12px;
          margin-bottom: 14px;
        }
        .controller-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 18px;
          transition: border-color 0.15s, background 0.15s;
        }
        .controller-card:hover {
          background: rgba(255,255,255,0.045);
          border-color: var(--accent, rgba(168,85,247,0.35));
        }
        .ctrl-emoji { font-size: 26px; display: block; margin-bottom: 8px; }
        .ctrl-title { font-size: 13px; font-weight: 800; color: #fff; margin-bottom: 5px; }
        .ctrl-hint { font-size: 11px; color: rgba(255,255,255,0.38); line-height: 1.5; }
        .controller-tip {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; border-radius: 8px;
          background: rgba(34,211,238,0.04);
          border: 1px solid rgba(34,211,238,0.14);
          font-size: 11px; color: rgba(255,255,255,0.38);
        }

        /* MOBILE FAB */
        .mobile-fab { display: none; }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .build-cta-inner { grid-template-columns: 1fr; padding: 28px 20px; gap: 24px; }
          .build-cta-visual { display: none; }
          .controller-grid { grid-template-columns: 1fr 1fr; }
          .recent-grid { grid-template-columns: 1fr 1fr; }
          .how-steps { grid-template-columns: 1fr; gap: 12px; }
          .step-arrow { display: none; }
        }
        @media (max-width: 640px) {
          .pf-wrap { padding: 0 14px; padding-bottom: 80px; }
          .recent-grid { grid-template-columns: 1fr; }
          .controller-grid { grid-template-columns: 1fr; }
          .build-cta-title { font-size: 18px; }
          .desktop-how { display: none; }
          .mobile-fab {
            display: flex; align-items: center; gap: 8px;
            position: fixed; bottom: 16px; right: 16px; z-index: 100;
            padding: 11px 18px; border-radius: 6px;
            background: #050208;
            border: 2px solid #a855f7;
            color: #a855f7; font-weight: 900; font-size: 9px;
            text-decoration: none;
            font-family: 'Press Start 2P', monospace;
            box-shadow: 0 0 20px rgba(168,85,247,0.5);
          }
        }
      `}</style>
    </>
  )
}
