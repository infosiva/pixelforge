'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wand2, LayoutGrid, BookOpen } from 'lucide-react'
import Logo from './Logo'

const LINKS = [
  { href: '/', label: 'Arcade', Icon: LayoutGrid },
  { href: '/create', label: 'Create', Icon: Wand2 },
  { href: '/train', label: 'Train', Icon: BookOpen },
]

export default function Navbar() {
  const path = usePathname()
  return (
    <nav className="pf-nav" aria-label="Main">
      <div className="pf-nav-in">
        <Link href="/" className="pf-brand" aria-label="PixelForge home">
          <Logo size={30} />
          <span>Pixel<b>Forge</b></span>
        </Link>
        <div className="pf-links">
          {LINKS.map(({ href, label, Icon }) => (
            <Link key={href} href={href} aria-current={path === href ? 'page' : undefined} className={path === href ? 'on' : ''}>
              <Icon size={15} /> <span>{label}</span>
            </Link>
          ))}
        </div>
        <Link href="/create" className="pf-nav-cta"><Wand2 size={15} /> <span>Build a game</span></Link>
      </div>
      <style>{`
        .pf-nav { position: sticky; top: 12px; z-index: 90; margin: 12px auto 0; width: min(1100px, calc(100% - 24px));
          background: rgba(10,14,9,0.72); backdrop-filter: blur(18px); border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; }
        .pf-nav-in { display: flex; align-items: center; gap: 6px; padding: 8px 10px; }
        .pf-brand { display: flex; align-items: center; gap: 9px; text-decoration: none; margin-right: auto; color: #fff; font-weight: 800; font-size: 17px; letter-spacing: -0.02em; min-height: 44px; }
        .pf-brand b { color: #a3e635; font-weight: 800; }
        .pf-links { display: flex; gap: 2px; }
        .pf-links a { display: flex; align-items: center; gap: 6px; min-height: 44px; padding: 0 12px; border-radius: 12px; font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.72); text-decoration: none; transition: background .15s, color .15s; }
        .pf-links a:hover { color: #fff; background: rgba(255,255,255,0.07); }
        .pf-links a.on { color: #0a0c08; background: #a3e635; }
        .pf-nav-cta { display: flex; align-items: center; gap: 7px; min-height: 44px; padding: 0 16px; border-radius: 12px; background: rgba(163,230,53,0.12); border: 1px solid rgba(163,230,53,0.45); color: #d9f99d; font-weight: 700; font-size: 14px; text-decoration: none; transition: transform .12s; }
        .pf-nav-cta:active, .pf-links a:active { transform: scale(0.97); }
        .pf-nav a:focus-visible { outline: 2px solid #22d3ee; outline-offset: 2px; }
        @media (max-width: 640px) { .pf-links a span, .pf-nav-cta { display: none; } .pf-links a { padding: 0 13px; } }
        @media (prefers-reduced-motion: reduce) { .pf-nav a { transition: none; } }
      `}</style>
    </nav>
  )
}
