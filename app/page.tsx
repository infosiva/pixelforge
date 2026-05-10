import Link from 'next/link'
import { Play, Wand2, Gamepad2, Zap, Sparkles, ArrowRight } from 'lucide-react'
import GameCard from '@/components/GameCard'
import ArcadeGrid from '@/components/ArcadeGrid'
import { listGames } from '@/lib/db'
import { CURATED_GAMES } from '@/lib/curatedGames'
import type { GameGenre } from '@/lib/types'

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

  const featured = CURATED_GAMES.slice(0, 6)

  return (
    <>
      {/* ── ANIMATED BLOB BACKGROUND ───────────────────────────────── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div className="pf-blob1" style={{ position: 'absolute', top: '-15%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 68%)', filter: 'blur(40px)' }} />
        <div className="pf-blob2" style={{ position: 'absolute', top: '20%', right: '-15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,0.15) 0%,transparent 68%)', filter: 'blur(40px)' }} />
        <div className="pf-blob3" style={{ position: 'absolute', bottom: '-10%', left: '35%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.12) 0%,transparent 68%)', filter: 'blur(40px)' }} />
        {/* Noise grain overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.025, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '0 16px' }} className="page-wrap">

        {/* ── HERO — compact, above fold ────────────────────────────── */}
        <section style={{ padding: '48px 0 32px', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 99, marginBottom: 24, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(167,139,250,0.28)', fontSize: 11, fontWeight: 700, color: '#c4b5fd', letterSpacing: '0.05em' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', display: 'inline-block' }} />
            FREE TO PLAY · NO ACCOUNT · CONTROLLER READY
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(38px,7vw,80px)', fontWeight: 900, lineHeight: 1.0, color: '#fff', letterSpacing: '-0.04em', marginBottom: 18 }}>
            Play.{' '}
            <span style={{ background: 'linear-gradient(135deg,#a78bfa 0%,#ec4899 50%,#f97316 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Create. Share.
            </span>
          </h1>

          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Browser arcade powered by AI. Describe any game idea — AI builds it playable in 15 seconds.
          </p>

          {/* CTAs */}
          <div className="hero-ctas" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
            <a href="#arcade" className="btn-primary" style={{ padding: '13px 28px', fontSize: 15, borderRadius: 12, fontWeight: 800, boxShadow: '0 0 28px rgba(124,58,237,0.45)' }}>
              <Play size={16} fill="#fff" /> Play Now — Free
            </a>
            <Link href="/create" className="btn-secondary" style={{ padding: '12px 24px', fontSize: 15, borderRadius: 12 }}>
              <Wand2 size={16} /> Build with AI
            </Link>
          </div>

          {/* Quick stats row */}
          <div className="hero-stats" style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: <Gamepad2 size={13} />, text: 'Controller support' },
              { icon: <Zap size={13} />,      text: '15s to create' },
              { icon: <Sparkles size={13} />, text: 'Remix any game' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                <span style={{ color: '#7c3aed' }}>{icon}</span> {text}
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURED GAME GRID — 3 cols, visible immediately ─────── */}
        <section id="arcade" style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
              🕹️ Featured Games
            </h2>
            <a href="#all-games" style={{ fontSize: 12, color: '#a78bfa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
              All games <ArrowRight size={12} />
            </a>
          </div>

          <div className="featured-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 45vw), 1fr))', gap: 14 }}>
            {featured.map(game => <GameCard key={game.id} game={game} />)}
          </div>
        </section>

        {/* ── BUILD WITH AI CTA ─────────────────────────────────────── */}
        <section style={{ marginBottom: 48 }}>
          <div style={{
            borderRadius: 20, padding: '28px 36px',
            background: 'linear-gradient(135deg,rgba(124,58,237,0.16) 0%,rgba(236,72,153,0.08) 100%)',
            border: '1px solid rgba(124,58,237,0.28)',
            display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{ fontSize: 48, lineHeight: 1, filter: 'drop-shadow(0 0 24px rgba(167,139,250,0.5))' }}>🤖</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>Build your game in 15 seconds</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 }}>
                Describe any idea. AI writes code, generates art, publishes to arcade. No coding needed.
              </p>
            </div>
            <Link href="/create" className="btn-primary" style={{ padding: '12px 24px', fontSize: 14, flexShrink: 0, borderRadius: 10, fontWeight: 800, boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
              <Wand2 size={15} /> Start Building
            </Link>
          </div>
        </section>

        {/* ── ALL GAMES ARCADE GRID ─────────────────────────────────── */}
        <div id="all-games">
          <ArcadeGrid games={arcadeGames} />
        </div>

        {/* ── CONTROLLER GUIDE ──────────────────────────────────────── */}
        <section style={{ marginBottom: 80 }}>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 40 }} />
          <div style={{
            background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(236,72,153,0.06))',
            border: '1px solid rgba(124,58,237,0.22)',
            borderRadius: 16, padding: '24px 28px', marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>🎮</span>
              <div>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Connect your game controller</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>Xbox, PlayStation, or any USB/Bluetooth gamepad — plug in and play</p>
              </div>
            </div>
            <div className="dev-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
              {[
                { emoji: '🟢', title: 'Xbox', hint: 'USB or Bluetooth — hold Xbox button 3s to pair' },
                { emoji: '🔵', title: 'PlayStation', hint: 'USB-C or hold PS+Share to enter pairing mode' },
                { emoji: '⚪', title: 'Any USB pad', hint: 'Plug in → open game → press any button' },
              ].map(({ emoji, title, hint }) => (
                <div key={title} style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{emoji}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{title}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{hint}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(74,222,128,0.07)', borderRadius: 8, border: '1px solid rgba(74,222,128,0.18)', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
              <span style={{ color: '#4ade80', fontWeight: 700 }}>Tip: </span>
              Left stick / D-pad = move · A/Cross = jump · B/Circle = fire · Start = pause
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
