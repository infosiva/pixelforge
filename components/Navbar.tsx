'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Gamepad2, Wand2, Trophy, User, LogOut, BookOpen } from 'lucide-react'
import { getUser, clearAuth, type AuthUser } from '@/lib/auth'
import AuthModal from './AuthModal'

export default function Navbar() {
  const path = usePathname()
  const [user, setUser]         = useState<AuthUser | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { setUser(getUser()) }, [])

  function handleLogout() {
    clearAuth()
    setUser(null)
    setMenuOpen(false)
  }

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 90,
        background: 'rgba(14,14,22,0.96)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: 56, gap: 8 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 16, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg,#6d28d9,#7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Gamepad2 size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 900, fontSize: 16, color: '#fff', letterSpacing: '-0.02em' }}>
              Pixel<span style={{ color: '#7c3aed' }}>Forge</span>
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
            <Link href="/train" style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 6, fontSize: 14, fontWeight: 600,
              color: path === '/train' ? '#fff' : 'rgba(255,255,255,0.55)',
              background: path === '/train' ? 'rgba(255,255,255,0.08)' : 'transparent',
              textDecoration: 'none', transition: 'all 0.15s',
            }}>
              <BookOpen size={14} /> Train
            </Link>
          </div>

          <div style={{ flex: 1 }} />

          {/* Auth area */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(m => !m)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
                  borderRadius: 8, border: '1px solid rgba(124,58,237,0.35)',
                  background: 'rgba(124,58,237,0.1)', cursor: 'pointer', color: '#c4b5fd',
                  fontSize: 13, fontWeight: 600,
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 900, color: '#fff', flexShrink: 0,
                }}>
                  {user.username[0].toUpperCase()}
                </div>
                <span className="hide-xs">{user.username}</span>
              </button>
              {menuOpen && (
                <>
                  <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 88 }} />
                  <div style={{
                    position: 'absolute', top: '110%', right: 0, zIndex: 89,
                    background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12, padding: 8, minWidth: 180,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                  }}>
                    <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 8 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{user.username}</p>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                        padding: '9px 12px', borderRadius: 8, border: 'none', background: 'none',
                        color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                onClick={() => setAuthOpen(true)}
                className="nav-cta"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                <User size={13} /> <span className="hide-xs">Sign in</span>
              </button>
              <Link href="/create" className="btn-primary nav-cta" style={{ padding: '8px 16px', fontSize: 13 }}>
                <Wand2 size={13} /> <span className="hide-xs">Build a Game</span>
              </Link>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={u => { setUser(u); setAuthOpen(false) }}
        reason="general"
      />
    </>
  )
}
