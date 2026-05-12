import Link from 'next/link'
import { Play, Wand2, Gamepad2, Zap, Sparkles, ArrowRight, Trophy, Users, Star } from 'lucide-react'
import ArcadeGrid from '@/components/ArcadeGrid'
import HeroSection from '@/components/HeroSection'
import { listGames } from '@/lib/db'
import { CURATED_GAMES } from '@/lib/curatedGames'

export default async function HomePage() {
  let liveGames: Awaited<ReturnType<typeof listGames>> = []
  try { liveGames = await listGames(12) } catch {}
  const allGames = [...CURATED_GAMES, ...liveGames]

  return (
    <>
      {/* ── ANIMATED MESH BACKGROUND ── */}
      <div className="pf-bg" aria-hidden>
        <div className="pf-blob pf-blob1" />
        <div className="pf-blob pf-blob2" />
        <div className="pf-blob pf-blob3" />
        <div className="pf-scanlines" />
        <div className="pf-grid-lines" />
      </div>

      <div className="pf-wrap">

        {/* ── HERO ── */}
        <HeroSection featuredGames={CURATED_GAMES.slice(0, 4)} />

        {/* ── LIVE TICKER ── */}
        <div className="ticker-bar">
          <span className="ticker-label">🔴 LIVE</span>
          <div className="ticker-track">
            <div className="ticker-items">
              {[
                '⚡ Player just built "Galaxy Defender"',
                '🏆 New high score on Neon Snake: 48,200',
                '🎮 Typing Racer — WPM record: 94',
                '👾 Space Blaster — wave 23 reached',
                '🃏 Card Battle — AI undefeated streak: 7',
                '🗼 Tower Defense — wave 10 cleared',
                '🚀 New game published: "Pixel Knight"',
              ].map((t, i) => <span key={i} className="ticker-item">{t}</span>)}
              {/* duplicate for seamless loop */}
              {[
                '⚡ Player just built "Galaxy Defender"',
                '🏆 New high score on Neon Snake: 48,200',
                '🎮 Typing Racer — WPM record: 94',
                '👾 Space Blaster — wave 23 reached',
                '🃏 Card Battle — AI undefeated streak: 7',
                '🗼 Tower Defense — wave 10 cleared',
                '🚀 New game published: "Pixel Knight"',
              ].map((t, i) => <span key={`b${i}`} className="ticker-item">{t}</span>)}
            </div>
          </div>
        </div>

        {/* ── STATS ROW ── */}
        <div className="stats-row">
          {[
            { value: '15+', label: 'Games', icon: '🕹️' },
            { value: '15s',  label: 'To build', icon: '⚡' },
            { value: '100%', label: 'Free to play', icon: '🎮' },
            { value: 'AI',   label: 'Powered', icon: '🤖' },
          ].map(s => (
            <div key={s.label} className="stat-chip">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── ARCADE GRID ── */}
        <ArcadeGrid games={allGames} />

        {/* ── BUILD CTA ── */}
        <section className="build-cta">
          <div className="build-cta-inner">
            <div className="build-cta-glow" />
            <div className="build-cta-content">
              <div className="build-cta-badge">AI POWERED</div>
              <h2 className="build-cta-title">Build your own game<br />in 15 seconds</h2>
              <p className="build-cta-desc">
                Type any idea. AI writes the code, generates pixel art, publishes to the arcade instantly. No coding required.
              </p>
              <div className="build-cta-examples">
                {['"Space game where you fight dinosaurs"', '"Puzzle with gravity flip"', '"Tower defense in medieval castle"'].map(ex => (
                  <span key={ex} className="example-pill">{ex}</span>
                ))}
              </div>
              <Link href="/create" className="build-cta-btn">
                <Wand2 size={18} /> Start Building Free
              </Link>
            </div>
            <div className="build-cta-visual">
              <div className="code-window">
                <div className="code-dots"><span /><span /><span /></div>
                <div className="code-lines">
                  <div className="code-line"><span className="c-kw">describe</span><span className="c-str">("space dinosaur shooter")</span></div>
                  <div className="code-line c-comment">// AI is generating...</div>
                  <div className="code-line"><span className="c-fn">generateGame</span><span className="c-dim">(prompt)</span></div>
                  <div className="code-line c-comment">// ✅ Game ready in 12s</div>
                  <div className="code-line"><span className="c-kw">publish</span><span className="c-str">("arcade")</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTROLLER GUIDE ── */}
        <section className="controller-section">
          <div className="controller-header">
            <span className="section-eyebrow">🎮 CONTROLLER READY</span>
            <h3 className="section-title">Plug in any gamepad</h3>
            <p className="section-sub">Xbox, PlayStation, or any USB gamepad — every game supports controllers out of the box.</p>
          </div>
          <div className="controller-grid">
            {[
              { emoji: '🟢', title: 'Xbox', hint: 'USB or Bluetooth — hold Xbox button 3s to pair', color: '#4ade80' },
              { emoji: '🔵', title: 'PlayStation', hint: 'USB-C or hold PS + Share to enter pairing mode', color: '#60a5fa' },
              { emoji: '⚪', title: 'Any USB pad', hint: 'Plug in → open game → press any button to activate', color: '#c4b5fd' },
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
        <Wand2 size={22} />
        <span>Build a Game</span>
      </Link>

      <style>{`
        .pf-bg {
          position: fixed; inset: 0; z-index: 0;
          overflow: hidden; pointer-events: none;
          background: #07060f;
        }
        .pf-blob {
          position: absolute; border-radius: 50%;
          filter: blur(80px); will-change: transform;
        }
        .pf-blob1 {
          width: 900px; height: 900px;
          top: -20%; left: -15%;
          background: radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 65%);
          animation: blob1 20s ease-in-out infinite;
        }
        .pf-blob2 {
          width: 700px; height: 700px;
          top: 10%; right: -10%;
          background: radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 65%);
          animation: blob2 25s ease-in-out infinite;
        }
        .pf-blob3 {
          width: 600px; height: 600px;
          bottom: -5%; left: 30%;
          background: radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 65%);
          animation: blob3 18s ease-in-out infinite;
        }
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(60px,-40px) scale(1.08)} 66%{transform:translate(-30px,50px) scale(0.95)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-50px,60px) scale(1.1)} 70%{transform:translate(40px,-30px) scale(0.92)} }
        @keyframes blob3 { 0%,100%{transform:translate(0,0) scale(1)} 30%{transform:translate(40px,50px) scale(0.9)} 60%{transform:translate(-35px,-40px) scale(1.12)} }
        .pf-scanlines {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
          pointer-events: none;
        }
        .pf-grid-lines {
          position: absolute; inset: 0; opacity: 0.03;
          background-image: linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .pf-wrap {
          position: relative; z-index: 1;
          max-width: 1280px; margin: 0 auto;
          padding: 0 20px;
        }

        /* TICKER */
        .ticker-bar {
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 10px 16px;
          overflow: hidden; margin-bottom: 28px;
        }
        .ticker-label {
          font-size: 10px; font-weight: 900; color: #f87171;
          letter-spacing: 0.1em; flex-shrink: 0;
          background: rgba(248,113,113,0.12);
          border: 1px solid rgba(248,113,113,0.25);
          padding: 3px 8px; border-radius: 5px;
          margin-right: 12px;
          animation: pulse-red 2s ease-in-out infinite;
        }
        @keyframes pulse-red { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .ticker-track { flex: 1; overflow: hidden; }
        .ticker-items {
          display: flex; gap: 0;
          animation: ticker-scroll 40s linear infinite;
          width: max-content;
        }
        .ticker-item {
          font-size: 12px; color: rgba(255,255,255,0.45);
          padding: 0 32px; white-space: nowrap;
          font-weight: 500;
        }
        @keyframes ticker-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

        /* STATS */
        .stats-row {
          display: flex; gap: 12px; flex-wrap: wrap;
          margin-bottom: 40px;
        }
        .stat-chip {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          flex: 1; min-width: 120px;
        }
        .stat-icon { font-size: 18px; }
        .stat-value { font-size: 18px; font-weight: 900; color: #fff; letter-spacing: -0.02em; }
        .stat-label { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 500; }

        /* BUILD CTA */
        .build-cta { margin: 60px 0; }
        .build-cta-inner {
          position: relative; border-radius: 24px; overflow: hidden;
          background: linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(236,72,153,0.06) 100%);
          border: 1px solid rgba(124,58,237,0.25);
          display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
          padding: 48px; align-items: center;
        }
        .build-cta-glow {
          position: absolute; top: -100px; left: -100px;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 65%);
          filter: blur(60px); pointer-events: none;
        }
        .build-cta-badge {
          display: inline-flex; padding: 4px 12px; border-radius: 99px;
          background: rgba(124,58,237,0.2); border: 1px solid rgba(167,139,250,0.3);
          font-size: 10px; font-weight: 900; color: #c4b5fd;
          letter-spacing: 0.1em; margin-bottom: 16px;
        }
        .build-cta-title {
          font-size: clamp(28px, 4vw, 40px); font-weight: 900;
          color: #fff; letter-spacing: -0.03em; line-height: 1.1;
          margin-bottom: 14px;
        }
        .build-cta-desc {
          font-size: 15px; color: rgba(255,255,255,0.5);
          line-height: 1.6; margin-bottom: 20px;
        }
        .build-cta-examples {
          display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;
        }
        .example-pill {
          font-size: 12px; color: rgba(255,255,255,0.45);
          padding: 5px 12px; border-radius: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          font-style: italic;
        }
        .build-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #ec4899);
          color: #fff; font-weight: 800; font-size: 15px;
          text-decoration: none; transition: all 0.2s;
          box-shadow: 0 0 32px rgba(124,58,237,0.4);
        }
        .build-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 48px rgba(124,58,237,0.6);
        }
        /* code window */
        .code-window {
          background: #0d0d1a; border: 1px solid rgba(124,58,237,0.2);
          border-radius: 14px; overflow: hidden;
          box-shadow: 0 0 60px rgba(124,58,237,0.15);
        }
        .code-dots {
          display: flex; gap: 6px; padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .code-dots span {
          width: 10px; height: 10px; border-radius: 50%;
        }
        .code-dots span:nth-child(1) { background: #ff5f57; }
        .code-dots span:nth-child(2) { background: #febc2e; }
        .code-dots span:nth-child(3) { background: #28c840; }
        .code-lines { padding: 20px; display: flex; flex-direction: column; gap: 10px; font-family: monospace; font-size: 13px; }
        .code-line { line-height: 1.5; }
        .c-kw { color: #a78bfa; }
        .c-str { color: #4ade80; }
        .c-fn { color: #60a5fa; }
        .c-dim { color: rgba(255,255,255,0.35); }
        .c-comment { color: rgba(255,255,255,0.25); font-style: italic; }

        /* CONTROLLER */
        .controller-section { margin-bottom: 80px; }
        .controller-header { text-align: center; margin-bottom: 28px; }
        .section-eyebrow {
          font-size: 11px; font-weight: 900; color: #7c3aed;
          letter-spacing: 0.1em; display: block; margin-bottom: 8px;
        }
        .section-title {
          font-size: 24px; font-weight: 900; color: #fff;
          letter-spacing: -0.02em; margin-bottom: 8px;
        }
        .section-sub { font-size: 14px; color: rgba(255,255,255,0.4); }
        .controller-grid {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 12px;
          margin-bottom: 16px;
        }
        .controller-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 20px;
          transition: border-color 0.2s, background 0.2s;
        }
        .controller-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: var(--accent, rgba(124,58,237,0.4));
        }
        .ctrl-emoji { font-size: 28px; display: block; margin-bottom: 10px; }
        .ctrl-title { font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 6px; }
        .ctrl-hint { font-size: 12px; color: rgba(255,255,255,0.4); line-height: 1.5; }
        .controller-tip {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; border-radius: 10px;
          background: rgba(74,222,128,0.06);
          border: 1px solid rgba(74,222,128,0.15);
          font-size: 12px; color: rgba(255,255,255,0.4);
        }

        .mobile-fab {
          display: none;
        }
        @media (max-width: 768px) {
          .build-cta-inner { grid-template-columns: 1fr; padding: 28px 20px; gap: 24px; }
          .build-cta-visual { display: none; }
          .controller-grid { grid-template-columns: 1fr; }
          .stats-row { gap: 8px; }
          .stat-chip { min-width: calc(50% - 4px); }
          .mobile-fab {
            display: flex; align-items: center; gap: 10;
            position: fixed; bottom: 20px; right: 20px; z-index: 100;
            padding: 14px 22px; border-radius: 50px;
            background: linear-gradient(135deg,#7c3aed,#ec4899);
            color: #fff; font-weight: 900; font-size: 15px;
            text-decoration: none;
            box-shadow: 0 4px 24px rgba(124,58,237,0.55), 0 0 0 1px rgba(255,255,255,0.1);
            animation: fab-bounce 3s ease-in-out infinite;
          }
          @keyframes fab-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        }
      `}</style>
    </>
  )
}
