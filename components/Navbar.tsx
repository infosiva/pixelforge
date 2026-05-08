'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gamepad2, Wand2, Trophy } from 'lucide-react'

export default function Navbar() {
  const path = usePathname()

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(14,14,22,0.96)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 8 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 16, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Gamepad2 size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 900, fontSize: 16, color: '#fff', letterSpacing: '-0.02em' }}>
            Pixel<span style={{ color: '#a78bfa' }}>Forge</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 6, fontSize: 14, fontWeight: 600,
            color: path === '/' ? '#fff' : 'rgba(255,255,255,0.55)',
            background: path === '/' ? 'rgba(255,255,255,0.08)' : 'transparent',
            textDecoration: 'none', transition: 'all 0.15s',
          }}>
            <Trophy size={14} /> Arcade
          </Link>
          <Link href="/create" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 6, fontSize: 14, fontWeight: 600,
            color: path === '/create' ? '#fff' : 'rgba(255,255,255,0.55)',
            background: path === '/create' ? 'rgba(255,255,255,0.08)' : 'transparent',
            textDecoration: 'none', transition: 'all 0.15s',
          }}>
            <Wand2 size={14} /> Create
          </Link>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* CTA */}
        <Link href="/create" className="btn-primary nav-cta" style={{ padding: '8px 16px', fontSize: 13 }}>
          <Wand2 size={13} /> Build a Game
        </Link>
      </div>
    </nav>
  )
}
