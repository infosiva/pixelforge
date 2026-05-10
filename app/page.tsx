import Link from 'next/link'
import { Play, Wand2, Gamepad2, Zap, Users, Sparkles } from 'lucide-react'
import GameCard from '@/components/GameCard'
import ArcadeGrid from '@/components/ArcadeGrid'
import { listGames } from '@/lib/db'
import { CURATED_GAMES } from '@/lib/curatedGames'
import type { GameGenre } from '@/lib/types'
import { Spotlight } from '@/components/aceternity/spotlight'
import { BackgroundBeams } from '@/components/aceternity/background-beams'

const DEMO_GAMES = [
  { id: 'demo-1', title: 'Space Blaster',  description: 'Survive waves of alien invaders. How long can you last?',           prompt: 'space shooter',        genre: 'shooter'    as GameGenre, ageRating: '8+'  as const, status: 'published' as const, authorId: 'ai', authorName: 'PixelForge AI', thumbnailUrl: '', playCount: 1243, likeCount: 89,  remixCount: 12, createdAt: '', htmlUrl: '', publishedAt: '' },
  { id: 'demo-2', title: 'Neon Runner',    description: 'Endless runner in a cyberpunk city. Dodge, jump, survive.',         prompt: 'endless runner neon',  genre: 'platformer' as GameGenre, ageRating: '8+'  as const, status: 'published' as const, authorId: 'ai', authorName: 'PixelForge AI', thumbnailUrl: '', playCount: 987,  likeCount: 71,  remixCount: 8,  createdAt: '', htmlUrl: '', publishedAt: '' },
  { id: 'demo-4', title: 'Dungeon Quest',  description: 'Top-down RPG. Fight monsters, collect loot, find the exit.',       prompt: 'dungeon crawler rpg',  genre: 'rpg'        as GameGenre, ageRating: '12+' as const, status: 'published' as const, authorId: 'ai', authorName: 'PixelForge AI', thumbnailUrl: '', playCount: 654,  likeCount: 55,  remixCount: 6,  createdAt: '', htmlUrl: '', publishedAt: '' },
  { id: 'demo-5', title: 'Puzzle Rush',    description: 'Match colours against the clock. 30 levels of brain-bending fun.', prompt: 'colour match puzzle',  genre: 'puzzle'     as GameGenre, ageRating: '8+'  as const, status: 'published' as const, authorId: 'ai', authorName: 'PixelForge AI', thumbnailUrl: '', playCount: 876,  likeCount: 62,  remixCount: 9,  createdAt: '', htmlUrl: '', publishedAt: '' },
]

export default async function HomePage() {
  let liveGames: Awaited<ReturnType<typeof listGames>> = []
  try { liveGames = await listGames(12) } catch {}
  const arcadeGames = [...CURATED_GAMES, ...liveGames, ...DEMO_GAMES]

  const hero = CURATED_GAMES[0]          // Turbo Drift — hero card
  const featured = CURATED_GAMES.slice(1) // remaining 5 curated

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px' }} className="page-wrap">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="hero-section" style={{ padding: '64px 0 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <Spotlight className="-top-40 left-0 md:-top-20" fill="#a855f7" />
        <BackgroundBeams />
        {/* Background radial blobs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-40%', left: '10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)', filter: 'blur(1px)' }} />
          <div style={{ position: 'absolute', top: '0%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,0.1) 0%,transparent 70%)', filter: 'blur(1px)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Live badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, marginBottom: 32, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(167,139,250,0.25)', fontSize: 12, fontWeight: 700, color: '#c4b5fd', letterSpacing: '0.04em' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', display: 'inline-block' }} />
            FREE TO PLAY · NO ACCOUNT · CONTROLLER READY
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(44px,8vw,88px)', fontWeight: 900, lineHeight: 1.0, color: '#fff', letterSpacing: '-0.035em', marginBottom: 24 }}>
            Play.{' '}
            <span style={{ display: 'block', background: 'linear-gradient(135deg,#a78bfa 0%,#ec4899 50%,#f97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Create. Share.
            </span>
          </h1>

          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.65, fontWeight: 400 }}>
            Browser arcade with AI-powered game creation. Describe any idea — AI builds a playable game in 15 seconds.
          </p>

          {/* CTAs */}
          <div className="hero-ctas" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <a href="#arcade" className="btn-primary" style={{ padding: '15px 32px', fontSize: 16, borderRadius: 12, fontWeight: 800 }}>
              <Play size={17} fill="#fff" /> Play Now — Free
            </a>
            <Link href="/create" className="btn-secondary" style={{ padding: '14px 28px', fontSize: 16, borderRadius: 12 }}>
              <Wand2 size={17} /> Build with AI
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats" style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: <Gamepad2 size={15} />, text: 'Controller support' },
              { icon: <Zap size={15} />,      text: '15s to create' },
              { icon: <Users size={15} />,    text: 'Ages 8 to adult' },
              { icon: <Sparkles size={15} />, text: 'Remix any game' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}>
                <span style={{ color: '#7c3aed' }}>{icon}</span> {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HERO GAME CARD (full-width spotlight) ──────────────────────── */}
      <section style={{ marginBottom: 20 }}>
        <Link href={`/play/${hero.id}`} style={{ textDecoration: 'none', display: 'block' }}>
          <div className="hero-game-card">
            {/* Animated background */}
            <div className="hero-bg" />
            <div className="hero-glow" />

            <div className="hero-content">
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <span className="hero-badge hero-badge-featured">⭐ FEATURED</span>
                  <span className="hero-badge hero-badge-genre">RACING</span>
                </div>
                <h2 className="hero-title">{hero.title}</h2>
                <p className="hero-desc">{hero.description}</p>
                <div className="hero-play-btn">
                  <Play size={18} fill="#fff" color="#fff" /> Play Now
                </div>
              </div>
              <div className="hero-emoji-wrap">
                <span className="hero-emoji">🏎️</span>
              </div>
            </div>
          </div>
        </Link>

        <style>{`
          .hero-game-card {
            border-radius: 20px; overflow: hidden; cursor: pointer;
            position: relative; min-height: 220px;
            background: linear-gradient(145deg, #1a0535 0%, #0d0620 60%, #150230 100%);
            border: 1px solid rgba(167,139,250,0.2);
            transition: transform 0.3s cubic-bezier(.22,.68,0,1.1), box-shadow 0.3s;
          }
          .hero-game-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 32px 80px rgba(124,58,237,0.4), 0 0 60px rgba(124,58,237,0.15);
            border-color: rgba(167,139,250,0.4);
          }
          .hero-bg {
            position: absolute; inset: 0;
            background: repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(167,139,250,0.03) 60px, rgba(167,139,250,0.03) 61px),
                        repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(167,139,250,0.03) 60px, rgba(167,139,250,0.03) 61px);
          }
          .hero-glow {
            position: absolute; right: -60px; top: -60px;
            width: 400px; height: 400px; border-radius: 50%;
            background: radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%);
            pointer-events: none;
          }
          .hero-content {
            position: relative; z-index: 2;
            padding: 40px 44px; display: flex;
            align-items: center; justify-content: space-between; gap: 24px;
          }
          .hero-badge {
            padding: 4px 10px; border-radius: 6px;
            font-size: 10px; font-weight: 900; letter-spacing: 0.08em;
          }
          .hero-badge-featured {
            background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3);
          }
          .hero-badge-genre {
            background: rgba(167,139,250,0.15); color: #a78bfa; border: 1px solid rgba(167,139,250,0.3);
          }
          .hero-title {
            font-size: clamp(28px, 5vw, 48px); font-weight: 900;
            color: #fff; letter-spacing: -0.03em; margin-bottom: 10px;
          }
          .hero-desc {
            font-size: 15px; color: rgba(255,255,255,0.55);
            max-width: 420px; line-height: 1.55; margin-bottom: 24px;
          }
          .hero-play-btn {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 12px 24px; border-radius: 10px;
            background: linear-gradient(135deg,#7c3aed,#5b21b6);
            font-size: 15px; font-weight: 800; color: #fff;
            box-shadow: 0 0 24px rgba(124,58,237,0.4);
            transition: box-shadow 0.2s, transform 0.2s;
          }
          .hero-game-card:hover .hero-play-btn {
            box-shadow: 0 0 40px rgba(124,58,237,0.6);
            transform: scale(1.04);
          }
          .hero-emoji-wrap {
            flex-shrink: 0;
            filter: drop-shadow(0 0 40px rgba(167,139,250,0.4));
            transition: transform 0.3s;
          }
          .hero-game-card:hover .hero-emoji-wrap { transform: scale(1.1) rotate(-5deg); }
          .hero-emoji { font-size: clamp(72px, 10vw, 120px); line-height: 1; display: block; }
        `}</style>
      </section>

      {/* ── FEATURED GRID ─────────────────────────────────────────────── */}
      <section style={{ marginBottom: 64 }}>
        <div className="featured-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 45vw), 1fr))', gap: 14 }}>
          {featured.map(game => <GameCard key={game.id} game={game} />)}
        </div>
      </section>

      {/* ── BUILD CTA ────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 64 }}>
        <div className="build-cta" style={{ borderRadius: 16, padding: '36px 40px', background: 'linear-gradient(135deg,rgba(124,58,237,0.14) 0%,rgba(236,72,153,0.07) 100%)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 52, lineHeight: 1, filter: 'drop-shadow(0 0 20px rgba(167,139,250,0.5))' }}>🤖</div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' }}>Build your own game in 15 seconds</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
              Describe any idea. AI writes the code, generates art, publishes to the arcade. No coding needed. Others can remix your game.
            </p>
          </div>
          <Link href="/create" className="btn-primary" style={{ padding: '14px 28px', fontSize: 15, flexShrink: 0, borderRadius: 10, fontWeight: 800 }}>
            <Wand2 size={16} /> Start Building
          </Link>
        </div>
      </section>

      {/* ── ARCADE GRID ──────────────────────────────────────────────── */}
      <ArcadeGrid games={arcadeGames} />

      {/* ── DEV SECTION ──────────────────────────────────────────────── */}
      <section style={{ marginBottom: 80 }}>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 48 }} />

        {/* Controller connect instructions */}
        <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(236,72,153,0.06))', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 16, padding: '28px 32px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <span style={{ fontSize: 32 }}>🎮</span>
            <div>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>Connect your game controller</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Xbox, PlayStation, or any USB/Bluetooth gamepad — plug in and play</p>
            </div>
          </div>
          <div className="dev-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {[
              { emoji: '🟢', title: 'Xbox Controller', steps: ['Connect via USB cable, or', 'Pair via Bluetooth: hold Xbox button 3s until blinking, then pair in OS Bluetooth settings', 'Open any game — controller auto-detected'] },
              { emoji: '🔵', title: 'PlayStation (DualSense / DS4)', steps: ['Connect USB-C (DualSense) or micro-USB (DS4), or', 'Bluetooth: hold PS + Share buttons until light flashes, pair in OS settings', 'Works in Chrome / Edge / Firefox'] },
              { emoji: '⚪', title: 'Any USB Gamepad', steps: ['Plug in USB — Windows/Mac auto-installs driver', 'Open a game and press any button to activate', 'Left stick / D-pad = move, A/Cross = jump/fire'] },
            ].map(({ emoji, title, steps }) => (
              <div key={title} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>{emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{title}</span>
                </div>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, lineHeight: 1.5 }}>
                    <span style={{ color: '#a78bfa', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span> {s}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(74,222,128,0.08)', borderRadius: 8, border: '1px solid rgba(74,222,128,0.2)', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            <span style={{ color: '#4ade80', fontWeight: 700 }}>Tip: </span>
            Left stick or D-pad = move · A / Cross = confirm/jump · B / Circle = back/fire · Start = pause
          </div>
        </div>

        <div className="dev-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <div style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 28 }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🕹️</div>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.01em' }}>Submit your game</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: 18 }}>
              Built a browser game? Use the AI builder to publish it to the arcade instantly.
            </p>
            {['Self-contained HTML', 'Phaser 3 or Canvas', 'Keyboard + controller', 'Family-friendly (8+)'].map(r => (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 6 }}>
                <span style={{ color: '#4ade80', fontWeight: 800, fontSize: 11 }}>✓</span> {r}
              </div>
            ))}
            <div style={{ marginTop: 20 }}>
              <Link href="/create" className="btn-primary" style={{ fontSize: 13, padding: '10px 18px' }}>Open AI Builder</Link>
            </div>
          </div>

          <div style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 28 }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>⚡</div>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.01em' }}>PostMessage API</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: 16 }}>
              Games talk to the platform via postMessage for scores and controller input.
            </p>
            <div style={{ background: '#0a0a14', borderRadius: 10, padding: 18, fontFamily: 'monospace', fontSize: 12, color: '#86efac', border: '1px solid rgba(255,255,255,0.06)', lineHeight: 1.8 }}>
              <span style={{ color: 'rgba(255,255,255,0.28)' }}>// Report score to platform{'\n'}</span>
              {'window.parent.postMessage({'}{'\n'}
              {'  type: "GAME_SCORE",'}{'\n'}
              {'  score: 1500'}{'\n'}
              {'}, "*");'}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
