'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Swords, Target, Zap, BookOpen, ChevronDown } from 'lucide-react'

const GAMES = [
  { id: 'fortnite',      label: 'Fortnite',         emoji: '⚡', genre: 'Battle Royale' },
  { id: 'valorant',      label: 'Valorant',          emoji: '🎯', genre: 'Tactical FPS' },
  { id: 'marvel-rivals', label: 'Marvel Rivals',     emoji: '🦸', genre: 'Hero Shooter' },
  { id: 'cod-mobile',    label: 'COD Mobile',        emoji: '🔫', genre: 'FPS / Battle Royale' },
  { id: 'minecraft',     label: 'Minecraft',         emoji: '⛏️', genre: 'Survival / PvP' },
]

const LEVELS = [
  { id: 'beginner',     label: 'Beginner',     desc: 'New to the game' },
  { id: 'intermediate', label: 'Intermediate', desc: 'Know the basics' },
  { id: 'advanced',     label: 'Advanced',     desc: 'Ranked / competitive' },
]

const FOCUS_AREAS: Record<string, string[]> = {
  fortnite:        ['Building & Editing', 'Aim & Tracking', 'Zone Rotation', 'Loot Priority', 'End Game'],
  valorant:        ['Aim & Crosshair Placement', 'Agent Abilities', 'Map Control', 'Economy', 'Comms & Callouts'],
  'marvel-rivals': ['Hero Mechanics', 'Team Composition', 'Positioning', 'Ability Combos', 'Counter-Picking'],
  'cod-mobile':    ['Gunsmith & Loadout', 'Movement & Strafing', 'BR Drop & Rotation', 'Ranked Push', 'Scorestreaks'],
  minecraft:       ['PvP Combat', 'Speedrunning', 'Resource Management', 'Redstone Logic', 'Crystal PvP'],
}

interface Tip {
  title: string
  body: string
  pro: string
}

type State = 'idle' | 'loading' | 'done' | 'error'

export default function TrainPage() {
  const [game, setGame]   = useState('')
  const [level, setLevel] = useState('')
  const [focus, setFocus] = useState('')
  const [state, setState] = useState<State>('idle')
  const [tips, setTips]   = useState<Tip[]>([])
  const [error, setError] = useState('')

  async function generate() {
    if (!game || !level) return
    setState('loading')
    setError('')
    try {
      const res = await fetch('/api/train-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, level, focus }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setTips(data.tips ?? [])
      setState('done')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed')
      setState('error')
    }
  }

  const selectedGame = GAMES.find(g => g.id === game)
  const focusOptions = game ? (FOCUS_AREAS[game] ?? []) : []

  return (
    <div style={{ minHeight: '100dvh', background: '#050208' }}>
      <Navbar />

      {/* Aurora blobs */}
      <div style={{ position: 'fixed', top: '5%', left: '5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 99,
            background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)',
            fontSize: 12, fontWeight: 700, color: '#a855f7', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: 20,
          }}>
            <BookOpen size={12} /> Game Training Lab
          </div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,54px)', fontWeight: 900, letterSpacing: '-1.5px', color: '#fff', lineHeight: 1.1, marginBottom: 14 }}>
            Level up your<br />
            <span style={{ color: '#a855f7' }}>game IQ.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', maxWidth: 460 }}>
            Get Groq-powered skill tips tailored to your game, level, and focus area.
          </p>
        </div>

        {/* Game picker */}
        <section style={{ marginBottom: 36 }}>
          <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 14 }}>
            1. Pick your game
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {GAMES.map(g => (
              <button
                key={g.id}
                onClick={() => { setGame(g.id); setFocus('') }}
                style={{
                  padding: '12px 18px', borderRadius: 10, border: '1px solid',
                  borderColor: game === g.id ? '#a855f7' : 'rgba(255,255,255,0.08)',
                  background: game === g.id ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.03)',
                  color: game === g.id ? '#d8b4fe' : 'rgba(255,255,255,0.6)',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'all 0.15s cubic-bezier(0.23,1,0.32,1)',
                }}
              >
                <span style={{ fontSize: 18 }}>{g.emoji}</span>
                <div style={{ textAlign: 'left' }}>
                  <div>{g.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.5, marginTop: 1 }}>{g.genre}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Level picker */}
        <section style={{ marginBottom: 36 }}>
          <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 14 }}>
            2. Your skill level
          </label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {LEVELS.map(l => (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                style={{
                  padding: '12px 20px', borderRadius: 10, border: '1px solid',
                  borderColor: level === l.id ? '#a855f7' : 'rgba(255,255,255,0.08)',
                  background: level === l.id ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.03)',
                  color: level === l.id ? '#d8b4fe' : 'rgba(255,255,255,0.6)',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s cubic-bezier(0.23,1,0.32,1)',
                }}
              >
                <div>{l.label}</div>
                <div style={{ fontSize: 11, opacity: 0.5, marginTop: 1 }}>{l.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Focus area */}
        {focusOptions.length > 0 && (
          <section style={{ marginBottom: 36 }}>
            <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: 14 }}>
              3. Focus area (optional)
            </label>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <select
                value={focus}
                onChange={e => setFocus(e.target.value)}
                style={{
                  appearance: 'none', padding: '12px 40px 12px 16px', borderRadius: 10,
                  border: '1px solid rgba(168,85,247,0.25)',
                  background: 'rgba(168,85,247,0.06)', color: focus ? '#d8b4fe' : 'rgba(255,255,255,0.4)',
                  fontSize: 14, cursor: 'pointer', outline: 'none', minWidth: 240,
                  fontFamily: 'inherit',
                }}
              >
                <option value="">Any area</option>
                {focusOptions.map(f => <option key={f} value={f} style={{ background: '#1a1a2e' }}>{f}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#a855f7', pointerEvents: 'none' }} />
            </div>
          </section>
        )}

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={!game || !level || state === 'loading'}
          style={{
            padding: '14px 36px', borderRadius: 10, border: 'none',
            background: game && level ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'rgba(255,255,255,0.07)',
            color: game && level ? '#fff' : 'rgba(255,255,255,0.25)',
            fontSize: 15, fontWeight: 800, cursor: game && level ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s cubic-bezier(0.23,1,0.32,1)',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: game && level ? '0 4px 20px rgba(168,85,247,0.35)' : 'none',
          }}
        >
          <Zap size={16} />
          {state === 'loading' ? 'Generating tips...' : 'Get Training Tips →'}
        </button>

        {/* Error */}
        {state === 'error' && (
          <div style={{ marginTop: 20, padding: '14px 18px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: 14 }}>
            {error}
          </div>
        )}

        {/* Tips */}
        {state === 'done' && tips.length > 0 && (
          <div style={{ marginTop: 40, animation: 'tip-fade 0.3s cubic-bezier(0.23,1,0.32,1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              {selectedGame && <span style={{ fontSize: 24 }}>{selectedGame.emoji}</span>}
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                {selectedGame?.label} — {level} tips
                {focus ? ` / ${focus}` : ''}
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {tips.map((tip, i) => (
                <div
                  key={i}
                  style={{
                    padding: '22px 24px', borderRadius: 14,
                    background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)',
                    animation: `tip-fade 0.3s cubic-bezier(0.23,1,0.32,1) ${i * 0.06}s both`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{
                      minWidth: 28, height: 28, borderRadius: 8,
                      background: 'rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 900, color: '#a855f7', marginTop: 2,
                    }}>
                      {i + 1}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{tip.title}</h3>
                      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, marginBottom: 10 }}>{tip.body}</p>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 10px', borderRadius: 6,
                        background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.2)',
                      }}>
                        <Target size={11} style={{ color: '#a855f7' }} />
                        <span style={{ fontSize: 12, color: '#c4b5fd', fontWeight: 600 }}>{tip.pro}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setState('idle'); setTips([]) }}
              style={{
                marginTop: 24, padding: '10px 20px', borderRadius: 8,
                background: 'transparent', border: '1px solid rgba(168,85,247,0.3)',
                color: '#a855f7', fontSize: 14, cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              Try another →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes tip-fade { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @media (prefers-reduced-motion: reduce) { * { animation:none!important; } }
      `}</style>
    </div>
  )
}
