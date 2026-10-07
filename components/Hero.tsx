import Link from 'next/link'
import { Wand2 } from 'lucide-react'

/* media-gallery archetype: full-bleed hero. The right panel is a CSS-only animated example
   (labelled as such), not a claim about live output. */
export default function Hero({ headline, sub, cta }: { headline?: string; sub?: string; cta?: string }) {
  return (
    <section className="hero" aria-labelledby="hero-h">
      <div className="hero-copy">
        <p className="hero-eyebrow">AI game builder</p>
        <h1 id="hero-h">{headline ?? 'Describe a game. Play it.'}</h1>
        <p className="hero-sub">{sub ?? 'Type an idea in plain English. An AI writes a playable browser game from it. Or just jump into the arcade.'}</p>
        <div className="hero-actions">
          <Link href="/create" className="hero-cta"><Wand2 size={18} /> {cta ?? 'Build a game'}</Link>
          <a href="#arcade" className="hero-link">or browse the arcade</a>
        </div>
      </div>

      <div className="hero-demo" role="img" aria-label="Animated example: a prompt is typed, then a small pixel game plays">
        <div className="demo-prompt"><span className="demo-tag">Example prompt</span><span className="demo-type">Dodge falling blocks, collect stars</span></div>
        <div className="demo-screen">
          <i className="px p1" /><i className="px p2" /><i className="px p3" /><i className="px p4" />
          <i className="star s1" /><i className="star s2" />
          <i className="ship" />
          <div className="demo-floor" />
        </div>
      </div>

      <style>{`
        .hero { max-width: 1100px; margin: 0 auto; padding: 56px 16px 40px; display: grid; grid-template-columns: 1.05fr 1fr; gap: 40px; align-items: center; }
        .hero-eyebrow { display: inline-block; font-size: 12px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: #d9f99d; padding: 6px 12px; border: 1px solid rgba(163,230,53,.35); border-radius: 999px; background: rgba(163,230,53,.08); margin: 0 0 18px; }
        .hero h1 { font-family: 'Press Start 2P', monospace; font-size: clamp(26px, 5.4vw, 54px); line-height: 1.22; margin: 0 0 18px; background: linear-gradient(120deg, #fff 30%, #bef264 70%, #22d3ee); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .hero-sub { font-size: 17px; line-height: 1.55; color: rgba(255,255,255,.78); max-width: 46ch; margin: 0 0 26px; }
        .hero-actions { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
        .hero-cta { display: inline-flex; align-items: center; gap: 9px; min-height: 52px; padding: 0 26px; border-radius: 14px; font-weight: 800; font-size: 16px; text-decoration: none; color: #0a0c08; background: linear-gradient(135deg, #d9f99d, #a3e635 55%, #84cc16); box-shadow: 0 10px 34px rgba(163,230,53,.35); transition: transform .12s, box-shadow .2s; animation: hero-in .6s cubic-bezier(.2,.8,.2,1) both; }
        .hero-cta:hover { box-shadow: 0 14px 44px rgba(163,230,53,.5); transform: translateY(-1px); }
        .hero-cta:active { transform: scale(.97); }
        .hero-link { color: rgba(255,255,255,.75); font-size: 14px; text-decoration: underline; text-underline-offset: 4px; min-height: 44px; display: inline-flex; align-items: center; }
        .hero a:focus-visible { outline: 2px solid #22d3ee; outline-offset: 3px; }
        .hero-copy > * { animation: hero-in .6s cubic-bezier(.2,.8,.2,1) both; }
        .hero-copy > :nth-child(2) { animation-delay: .06s } .hero-copy > :nth-child(3) { animation-delay: .12s } .hero-copy > :nth-child(4) { animation-delay: .18s }
        @keyframes hero-in { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }

        .hero-demo { border-radius: 22px; padding: 14px; background: rgba(12,18,10,.7); border: 1px solid rgba(163,230,53,.28); box-shadow: 0 30px 80px rgba(0,0,0,.55), 0 0 60px rgba(163,230,53,.12); backdrop-filter: blur(10px); }
        .demo-prompt { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 12px; background: rgba(255,255,255,.06); font-size: 14px; color: #fff; margin-bottom: 12px; overflow: hidden; }
        .demo-tag { flex: none; font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #0a0c08; background: #22d3ee; padding: 3px 7px; border-radius: 6px; }
        .demo-type { white-space: nowrap; overflow: hidden; border-right: 2px solid #a3e635; width: 0; animation: demo-type 4s steps(34) .5s infinite alternate; }
        @keyframes demo-type { to { width: 34ch; } }
        .demo-screen { position: relative; aspect-ratio: 16/10; border-radius: 12px; overflow: hidden; background: linear-gradient(#0a1209, #05080a); image-rendering: pixelated; }
        .demo-screen::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(163,230,53,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(163,230,53,.07) 1px, transparent 1px); background-size: 16px 16px; }
        .px { position: absolute; top: -12%; width: 8%; aspect-ratio: 1; background: #22d3ee; box-shadow: 0 0 14px rgba(34,211,238,.6); animation: demo-fall 2.6s linear infinite; }
        .p1 { left: 12% } .p2 { left: 36%; animation-delay: -.9s } .p3 { left: 62%; animation-delay: -1.7s } .p4 { left: 84%; animation-delay: -.4s }
        .star { position: absolute; top: -12%; width: 5%; aspect-ratio: 1; background: #fde047; transform: rotate(45deg); animation: demo-fall 3.1s linear infinite; }
        .s1 { left: 24%; animation-delay: -1.2s } .s2 { left: 73%; animation-delay: -2.3s }
        @keyframes demo-fall { to { top: 100%; } }
        .ship { position: absolute; bottom: 12%; left: 10%; width: 9%; aspect-ratio: 1; background: #a3e635; box-shadow: 0 0 18px rgba(163,230,53,.8); animation: demo-ship 5.2s ease-in-out infinite; }
        @keyframes demo-ship { 0%,100% { left: 10% } 50% { left: 80% } }
        .demo-floor { position: absolute; left: 0; right: 0; bottom: 0; height: 9%; background: #a3e635; opacity: .85; }

        @media (max-width: 860px) { .hero { grid-template-columns: 1fr; padding-top: 32px; gap: 28px; } }
        @media (prefers-reduced-motion: reduce) {
          .hero-copy > *, .hero-cta { animation: none; }
          .px, .star, .ship { animation: none; top: 30%; }
          .ship { top: auto; }
          .demo-type { animation: none; width: 34ch; max-width: 100%; }
        }
      `}</style>
    </section>
  )
}
