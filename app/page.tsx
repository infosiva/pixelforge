import Link from 'next/link'
import { Wand2, Play, Gamepad2, Zap, Users, RotateCcw, Star } from 'lucide-react'
import { listGames } from '@/lib/db'
import { CURATED_GAMES } from '@/lib/curatedGames'
import type { GameGenre } from '@/lib/types'
import ArcadeSection from './ArcadeSection'

const DEMO_GAMES = [
  { id: 'demo-1', title: 'Space Blaster', description: 'Survive waves of alien invaders. How long can you last?', prompt: 'space shooter game', genre: 'shooter' as GameGenre, ageRating: '8+' as const, status: 'published' as const, authorId: 'ai', authorName: 'PixelForge AI', thumbnailUrl: '', playCount: 1243, likeCount: 89, remixCount: 12, createdAt: new Date().toISOString(), htmlUrl: '', publishedAt: new Date().toISOString() },
  { id: 'demo-2', title: 'Neon Runner',   description: 'Endless runner in a cyberpunk city. Dodge, jump, survive.', prompt: 'endless runner neon', genre: 'platformer' as GameGenre, ageRating: '8+' as const, status: 'published' as const, authorId: 'ai', authorName: 'PixelForge AI', thumbnailUrl: '', playCount: 987, likeCount: 71, remixCount: 8, createdAt: new Date().toISOString(), htmlUrl: '', publishedAt: new Date().toISOString() },
  { id: 'demo-3', title: 'Block Smash',   description: 'Classic brick breaker with power-ups and 10 levels.', prompt: 'brick breaker', genre: 'arcade' as GameGenre, ageRating: '8+' as const, status: 'published' as const, authorId: 'ai', authorName: 'PixelForge AI', thumbnailUrl: '', playCount: 2102, likeCount: 134, remixCount: 21, createdAt: new Date().toISOString(), htmlUrl: '', publishedAt: new Date().toISOString() },
  { id: 'demo-4', title: 'Dungeon Quest', description: 'Top-down RPG. Fight monsters, collect loot, find the exit.', prompt: 'dungeon crawler rpg', genre: 'rpg' as GameGenre, ageRating: '12+' as const, status: 'published' as const, authorId: 'ai', authorName: 'PixelForge AI', thumbnailUrl: '', playCount: 654, likeCount: 55, remixCount: 6, createdAt: new Date().toISOString(), htmlUrl: '', publishedAt: new Date().toISOString() },
  { id: 'demo-5', title: 'Puzzle Rush',   description: 'Match colours against the clock. 30 levels of brain bending fun.', prompt: 'colour match puzzle', genre: 'puzzle' as GameGenre, ageRating: '8+' as const, status: 'published' as const, authorId: 'ai', authorName: 'PixelForge AI', thumbnailUrl: '', playCount: 876, likeCount: 62, remixCount: 9, createdAt: new Date().toISOString(), htmlUrl: '', publishedAt: new Date().toISOString() },
  { id: 'demo-6', title: 'Snake Evolved', description: 'Snake but with power-ups, speed boosts and a boss every 5 levels.', prompt: 'snake game with power ups', genre: 'arcade' as GameGenre, ageRating: '8+' as const, status: 'published' as const, authorId: 'ai', authorName: 'PixelForge AI', thumbnailUrl: '', playCount: 1531, likeCount: 112, remixCount: 17, createdAt: new Date().toISOString(), htmlUrl: '', publishedAt: new Date().toISOString() },
]

export default async function HomePage() {
  let liveGames: Awaited<ReturnType<typeof listGames>> = []
  try { liveGames = await listGames(12) } catch {}
  const games = [...CURATED_GAMES, ...liveGames, ...DEMO_GAMES].slice(0, 18)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">

      {/* Hero */}
      <section className="relative py-16 sm:py-28 text-center animate-fade-up overflow-hidden">
        {/* Floating 3D game icons behind hero */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          {['👾','🎮','🕹️','⚔️','🚀','🧩','🏆','🎯'].map((emoji, i) => (
            <span key={i} className="absolute text-2xl sm:text-3xl opacity-10 animate-float"
              style={{
                left: `${8 + i * 12}%`,
                top: `${10 + (i % 3) * 28}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3.5 + i * 0.4}s`,
                filter: 'blur(0.5px)',
              }}>
              {emoji}
            </span>
          ))}
        </div>

        <div className="relative">
          <span className="platform-badge mb-6 inline-block">PixelForge Platform</span>
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-[1.05] mb-5 tracking-tight">
            The arcade<br />
            <span className="text-gradient text-neon">built different.</span>
          </h1>
          <p className="text-base sm:text-lg text-white/45 max-w-lg mx-auto mb-10 leading-relaxed">
            Play hand-crafted games or describe any idea — AI builds a playable game in 15 seconds.
            Controller support. All ages. No downloads ever.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap mb-14">
            <a href="#arcade"
              className="btn-primary flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-black"
              style={{ fontSize: '1rem' }}>
              <Play className="w-5 h-5 fill-white" /> Play Now
            </a>
            <Link href="/create"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-white/70 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <Wand2 className="w-5 h-5" /> Build with AI
            </Link>
          </div>

          {/* Stat pills */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              { icon: Gamepad2, label: 'Controller ready' },
              { icon: Zap,      label: '15s to create' },
              { icon: Users,    label: 'Ages 8 to adult' },
              { icon: RotateCcw,label: 'Remix any game' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white/40"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Icon className="w-3 h-3 text-purple-400" /> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured games spotlight */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <h2 className="text-xl font-black text-white">Featured Games</h2>
          <span className="text-xs text-white/30 ml-auto">Curated · Always free · No account needed</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CURATED_GAMES.slice(0, 3).map((game, i) => {
            const emojis: Record<string, string> = { arcade:'👾', shooter:'🔫', platformer:'🏃', puzzle:'🧩', rpg:'⚔️', other:'🎮' }
            const colors: Record<string, string> = { arcade:'#ec4899', shooter:'#ef4444', platformer:'#f59e0b', puzzle:'#10b981', rpg:'#8b5cf6', other:'#6366f1' }
            const color = colors[game.genre] ?? '#8b5cf6'
            return (
              <Link key={game.id} href={`/play/${game.id}`}
                className={`featured-card card-3d rounded-3xl p-6 block group ${i === 0 ? 'sm:col-span-2' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 animate-float"
                    style={{ background: color + '20', border: `1px solid ${color}30`, animationDelay: `${i * 0.3}s` }}>
                    {emojis[game.genre]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: color + '20', color }}>
                        {game.genre}
                      </span>
                      <span className="text-[10px] text-white/30 font-semibold">{game.ageRating}</span>
                    </div>
                    <h3 className="font-black text-white text-lg leading-tight mb-1 group-hover:text-purple-300 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-sm text-white/40 leading-relaxed line-clamp-2">{game.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-white/25">by {game.authorName}</span>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white group-hover:text-white transition-all"
                    style={{ background: color + '25', border: `1px solid ${color}35` }}>
                    <Play className="w-3 h-3 fill-current" /> Play now
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Arcade — client component for live genre + age filter */}
      <ArcadeSection games={games} />

    </div>
  )
}
