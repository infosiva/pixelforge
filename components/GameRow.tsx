'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import GameCard from './GameCard'
import type { Game } from '@/lib/types'

export default function GameRow({ title, icon, games }: { title: string; icon?: string; games: Game[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  if (games.length === 0) return null

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 560, behavior: 'smooth' })
  }

  return (
    <section className="gr-section" aria-label={title}>
      <div className="gr-header">
        <h2 className="gr-title">{icon && <span className="gr-icon">{icon}</span>}{title}</h2>
        <div className="gr-nav">
          <button onClick={() => scroll(-1)} aria-label="Scroll left" className="gr-nav-btn">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scroll(1)} aria-label="Scroll right" className="gr-nav-btn">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="gr-track" ref={trackRef}>
        {games.map(game => (
          <div className="gr-item" key={game.id}>
            <GameCard game={game} />
          </div>
        ))}
      </div>

      <style>{`
        .gr-section { margin-bottom: 40px; }
        .gr-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .gr-title {
          font-size: 20px; font-weight: 900; color: #fff;
          letter-spacing: -0.02em; display: flex; align-items: center; gap: 8px;
        }
        .gr-icon { font-size: 18px; }
        .gr-nav { display: flex; gap: 6px; }
        .gr-nav-btn {
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.15s;
        }
        .gr-nav-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .gr-nav-btn:active { transform: scale(0.97); }

        .gr-track {
          display: flex; gap: 16px; overflow-x: auto;
          scroll-snap-type: x proximity;
          -webkit-overflow-scrolling: touch; scrollbar-width: none;
          padding-bottom: 4px;
        }
        .gr-track::-webkit-scrollbar { display: none; }
        .gr-item {
          flex: 0 0 auto; width: 240px;
          scroll-snap-align: start;
        }

        @media (max-width: 640px) {
          .gr-title { font-size: 17px; }
          .gr-nav { display: none; }
          .gr-item { width: 168px; }
        }
      `}</style>
    </section>
  )
}
