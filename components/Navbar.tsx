'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gamepad2, Wand2, Trophy, Sparkles } from 'lucide-react'

export default function Navbar() {
  const path = usePathname()
  const active = (href: string) => path === href
    ? 'text-white font-semibold'
    : 'text-white/40 hover:text-white/80'

  return (
    <nav className="sticky top-0 z-50 flex items-center gap-4 px-4 sm:px-6 py-3"
      style={{ background: 'rgba(7,1,15,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
          <Gamepad2 className="w-4 h-4 text-white" />
        </div>
        <span className="font-black text-base text-white hidden sm:block">PixelForge<span className="text-gradient"> AI</span></span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1 flex-1">
        <Link href="/" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${active('/')}`}>
          <Trophy className="w-3.5 h-3.5" /> Arcade
        </Link>
        <Link href="/create" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${active('/create')}`}>
          <Wand2 className="w-3.5 h-3.5" /> Create
        </Link>
      </div>

      {/* CTA */}
      <Link href="/create"
        className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold">
        <Sparkles className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Build a Game</span>
        <span className="sm:hidden">Build</span>
      </Link>
    </nav>
  )
}
