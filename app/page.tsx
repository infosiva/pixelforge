import Link from 'next/link'
import { Wand2 } from 'lucide-react'
import Hero from '@/components/Hero'
import GameRow from '@/components/GameRow'
import ArcadeGrid from '@/components/ArcadeGrid'
import { listGames } from '@/lib/db'
import { CURATED_GAMES } from '@/lib/curatedGames'
import { loadSiteTheme, getCopy } from '@/lib/theme-loader'

// Archetype: media-gallery (Hero -> carousel strip -> wall -> CTA band)
export default async function HomePage() {
  let live: Awaited<ReturnType<typeof listGames>> = []
  try { live = await listGames(24) } catch { /* Blob store optional: show built-in games */ }
  const theme = await loadSiteTheme('pixelforge')
  const seen = new Set(CURATED_GAMES.map(g => g.title.toLowerCase()))
  const unique = live.filter(g => !seen.has(g.title.toLowerCase()) && seen.add(g.title.toLowerCase()))
  const all = [...CURATED_GAMES, ...unique]
  const newest = unique.slice(0, 10)

  return (
    <div className="pf-wrap">
      <Hero
        headline={getCopy(theme, 'headline', 'Describe a game. Play it.')}
        sub={getCopy(theme, 'subheadline', 'Type an idea in plain English. An AI writes a playable browser game from it. Or just jump into the arcade.')}
        cta={getCopy(theme, 'ctaPrimary', 'Build a game')}
      />

      <GameRow title="Featured" games={CURATED_GAMES.slice(0, 10)} />
      {newest.length > 0 && <GameRow title="Built by the community" games={newest} />}

      <ArcadeGrid games={all} />

      <section className="cta-band" aria-labelledby="cta-h">
        <h2 id="cta-h">Got a game in your head?</h2>
        <p>Describe it, let the AI build it, play it in your browser.</p>
        <Link href="/create" className="cta-band-btn"><Wand2 size={18} /> Build a game</Link>
      </section>

      <style>{`
        .pf-wrap { max-width: 1100px; margin: 0 auto; padding: 0 16px 56px; }
        .cta-band { margin-top: 56px; padding: 44px 24px; text-align: center; border-radius: 24px; border: 1px solid rgba(163,230,53,.3); background: radial-gradient(ellipse at 50% 0%, rgba(163,230,53,.18), transparent 65%), rgba(12,18,10,.7); }
        .cta-band h2 { font-family: 'Press Start 2P', monospace; font-size: clamp(16px, 3vw, 24px); line-height: 1.4; margin: 0 0 12px; color: #fff; }
        .cta-band p { color: rgba(255,255,255,.75); margin: 0 0 22px; }
        .cta-band-btn { display: inline-flex; align-items: center; gap: 9px; min-height: 52px; padding: 0 26px; border-radius: 14px; font-weight: 800; text-decoration: none; color: #0a0c08; background: linear-gradient(135deg, #d9f99d, #a3e635 55%, #84cc16); transition: transform .12s; }
        .cta-band-btn:active { transform: scale(.97); }
        .cta-band-btn:focus-visible { outline: 2px solid #22d3ee; outline-offset: 3px; }
      `}</style>
    </div>
  )
}
