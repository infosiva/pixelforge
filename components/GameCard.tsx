import Link from 'next/link'
import { Play, Heart, RotateCcw } from 'lucide-react'
import type { Game } from '@/lib/types'

const GENRE_COLORS: Record<string, string> = {
  platformer: '#f59e0b',
  shooter:    '#ef4444',
  puzzle:     '#10b981',
  rpg:        '#8b5cf6',
  arcade:     '#ec4899',
  other:      '#6366f1',
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n/1000).toFixed(1)}k`
  return String(n)
}

export default function GameCard({ game }: { game: Game }) {
  const color = GENRE_COLORS[game.genre] ?? '#6366f1'
  return (
    <Link href={`/play/${game.id}`} className="group block card-hover card-3d rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', background: '#0d0d1a' }}>
        {game.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={game.thumbnailUrl} alt={game.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: color + '20', border: `1px solid ${color}40` }}>
              <span className="text-3xl">{genreEmoji(game.genre)}</span>
            </div>
          </div>
        )}
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center animate-pulse-glow"
            style={{ background: color }}>
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>
        {/* Genre badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
            style={{ background: color + '25', color, border: `1px solid ${color}40` }}>
            {game.genre}
          </span>
        </div>
        {/* Age rating badge */}
        <div className="absolute bottom-2 left-2">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-black"
            style={{ background: 'rgba(0,0,0,0.7)', color: game.ageRating === '8+' ? '#4ade80' : game.ageRating === '12+' ? '#facc15' : '#fb923c' }}>
            {game.ageRating ?? '8+'}
          </span>
        </div>
        {/* Remix badge */}
        {game.remixedFromId && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
              <RotateCcw className="w-2.5 h-2.5 inline mr-0.5" />remix
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-bold text-sm text-white line-clamp-1 mb-0.5 group-hover:text-purple-300 transition-colors">
          {game.title}
        </h3>
        <p className="text-xs text-white/40 line-clamp-2 leading-relaxed mb-2">{game.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-white/25">by {game.authorName}</span>
          <div className="flex items-center gap-2.5 text-[11px] text-white/30">
            <span className="flex items-center gap-1"><Play className="w-3 h-3" />{formatCount(game.playCount)}</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatCount(game.likeCount)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function genreEmoji(genre: string): string {
  const map: Record<string, string> = {
    platformer: '🏃', shooter: '🔫', puzzle: '🧩', rpg: '⚔️', arcade: '👾', other: '🎮',
  }
  return map[genre] ?? '🎮'
}
