'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wand2, Zap, Loader2 } from 'lucide-react'
import type { GameGenre, AgeRating } from '@/lib/types'

const GENRES: Array<{ id: GameGenre; label: string; emoji: string; desc: string; color: string; bg: string }> = [
  { id: 'arcade',     label: 'Arcade',      emoji: '👾', desc: 'Fast-paced classic fun',    color: '#f472b6', bg: '#2d0a20' },
  { id: 'platformer', label: 'Platformer',  emoji: '🏃', desc: 'Jump & run adventures',     color: '#fbbf24', bg: '#2d2000' },
  { id: 'shooter',    label: 'Shooter',     emoji: '🚀', desc: 'Blast enemies away',         color: '#f87171', bg: '#2d1010' },
  { id: 'puzzle',     label: 'Puzzle',      emoji: '🧩', desc: 'Brain-teasing challenges',   color: '#34d399', bg: '#002d20' },
  { id: 'rpg',        label: 'RPG',         emoji: '⚔️', desc: 'Story & exploration',        color: '#a78bfa', bg: '#150a30' },
  { id: 'other',      label: 'Surprise',    emoji: '🎲', desc: 'Let AI decide the genre',    color: '#60a5fa', bg: '#0a1030' },
]

const AGE_RATINGS: Array<{ id: AgeRating; label: string; hint: string; dot: string }> = [
  { id: '8+',  label: '8+',  hint: 'Cute, colourful, no violence',          dot: '#4ade80' },
  { id: '12+', label: '12+', hint: 'Mild action, cartoon combat',            dot: '#facc15' },
  { id: '16+', label: '16+', hint: 'Strategic, competitive, moderate peril', dot: '#fb923c' },
]

const PROMPTS: Array<{ text: string; genre: GameGenre }> = [
  { text: 'Ninja cat jumping over sushi on a neon Tokyo rooftop', genre: 'platformer' },
  { text: 'Space shooter with asteroid waves and a final boss',   genre: 'shooter'    },
  { text: 'Snake that grows collecting coffee cups in an office', genre: 'arcade'     },
  { text: 'Dungeon crawler — tiny wizard vs skeleton hordes',     genre: 'rpg'        },
  { text: 'Brick breaker in a haunted castle with ghost power-ups', genre: 'arcade'  },
  { text: 'Match 3 puzzle game with ice and fire elements',       genre: 'puzzle'     },
]

const STEPS = [
  '🧠 Understanding your idea…',
  '⚙️  Writing game logic & levels…',
  '🎨 Generating pixel art assets…',
  '🔊 Adding sound & effects…',
  '✨ Polishing gameplay feel…',
  '🚀 Publishing to arcade…',
]

export default function CreatePage() {
  const router = useRouter()
  const [prompt, setPrompt]       = useState('')
  const [genre, setGenre]         = useState<GameGenre>('arcade')
  const [ageRating, setAgeRating] = useState<AgeRating>('8+')
  const [loading, setLoading]     = useState(false)
  const [step, setStep]           = useState(0)
  const [error, setError]         = useState('')

  const activeGenre = GENRES.find(g => g.id === genre)!

  async function handleBuild() {
    if (!prompt.trim()) { setError('Describe your game first!'); return }
    setError(''); setLoading(true); setStep(0)
    const interval = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 2200)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), genre, ageRating }),
      })
      clearInterval(interval)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Generation failed')
      }
      const data = await res.json()
      router.push(`/play/${data.gameId}?new=1`)
    } catch (e: unknown) {
      clearInterval(interval)
      setLoading(false)
      setError(e instanceof Error ? e.message : 'Something went wrong — try again')
    }
  }

  /* ── Loading ── */
  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
      <div style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{
            width: 96, height: 96, borderRadius: 20, fontSize: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: activeGenre.bg,
            border: `2px solid ${activeGenre.color}60`,
            boxShadow: `0 0 40px ${activeGenre.color}30`,
          }}>
            {activeGenre.emoji}
          </div>
        </div>
        <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', textAlign: 'center', marginBottom: 6 }}>Building your game</p>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 28 }}>{STEPS[step]}</p>
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', marginBottom: 24 }}>
          <div style={{
            height: '100%', borderRadius: 2, transition: 'width 1s ease',
            width: `${((step + 1) / STEPS.length) * 100}%`,
            background: `linear-gradient(90deg,#7c3aed,${activeGenre.color})`,
          }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13,
              color: i <= step ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.2)',
              transition: 'color 0.4s',
            }}>
              <span style={{ width: 18, textAlign: 'center', flexShrink: 0 }}>
                {i < step
                  ? <span style={{ color: activeGenre.color, fontWeight: 700 }}>✓</span>
                  : i === step
                    ? <Loader2 size={14} style={{ display: 'inline', animation: 'spin 1s linear infinite', color: activeGenre.color }} />
                    : <span style={{ color: 'rgba(255,255,255,0.2)' }}>○</span>
                }
              </span>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  /* ── Form ── */
  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <div style={{ width: '100%', maxWidth: 640 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 99, marginBottom: 20,
            background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(167,139,250,0.35)',
            fontSize: 12, fontWeight: 700, color: '#c4b5fd',
          }}>
            ✨ AI Game Builder
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 10 }}>
            What game shall<br />we build?
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>Describe any idea — AI does the rest in ~15 seconds</p>
        </div>

        {/* Genre grid */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Genre</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
            {GENRES.map(g => (
              <button key={g.id} onClick={() => setGenre(g.id)}
                style={{
                  borderRadius: 10, padding: '12px 8px', textAlign: 'center',
                  cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                  background: genre === g.id ? g.bg : '#1c1c2e',
                  outline: genre === g.id ? `2px solid ${g.color}` : '2px solid transparent',
                  boxShadow: genre === g.id ? `0 0 20px ${g.color}25` : 'none',
                  transform: genre === g.id ? 'scale(1.06)' : 'scale(1)',
                }}>
                <div style={{ fontSize: 28, lineHeight: 1, marginBottom: 6 }}>{g.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: genre === g.id ? '#fff' : 'rgba(255,255,255,0.5)' }}>{g.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Age rating */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Age Rating</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {AGE_RATINGS.map(r => (
              <button key={r.id} onClick={() => setAgeRating(r.id)}
                style={{
                  borderRadius: 10, padding: '14px 12px', textAlign: 'left',
                  cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                  background: ageRating === r.id ? `${r.dot}18` : '#1c1c2e',
                  outline: ageRating === r.id ? `2px solid ${r.dot}80` : '2px solid transparent',
                  boxShadow: ageRating === r.id ? `0 0 16px ${r.dot}20` : 'none',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.dot, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{r.label}</span>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4, margin: 0 }}>{r.hint}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Describe your game</p>
          <textarea
            value={prompt}
            onChange={e => { setPrompt(e.target.value); setError('') }}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleBuild() }}
            placeholder={`e.g. ${PROMPTS[0].text}…`}
            rows={3}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 10, resize: 'none',
              background: '#14141f', color: '#fff', fontSize: 14, lineHeight: 1.6,
              border: `1.5px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.15)'}`,
              outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#7c3aed' }}
            onBlur={e => { e.currentTarget.style.borderColor = error ? '#ef4444' : 'rgba(255,255,255,0.15)' }}
          />
          {error && <p style={{ fontSize: 12, color: '#f87171', marginTop: 6 }}>⚠ {error}</p>}
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'right', marginTop: 4 }}>⌘+Enter to build</p>
        </div>

        {/* Inspiration chips */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>Need inspiration?</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PROMPTS.map(p => (
              <button key={p.text}
                onClick={() => { setPrompt(p.text); setGenre(p.genre) }}
                style={{
                  padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)',
                  background: '#1c1c2e', color: 'rgba(255,255,255,0.45)', fontSize: 12,
                  cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                }}>
                {p.text.length > 40 ? p.text.slice(0, 40) + '…' : p.text}
              </button>
            ))}
          </div>
        </div>

        {/* Build button */}
        <button onClick={handleBuild}
          style={{
            width: '100%', height: 56, borderRadius: 12, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 16, fontWeight: 900, color: '#fff', fontFamily: 'inherit',
            background: `linear-gradient(135deg,#7c3aed,${activeGenre.color})`,
            boxShadow: `0 0 32px ${activeGenre.color}35, 0 4px 16px rgba(0,0,0,0.4)`,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 0 48px ${activeGenre.color}50, 0 8px 24px rgba(0,0,0,0.5)` }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 0 32px ${activeGenre.color}35, 0 4px 16px rgba(0,0,0,0.4)` }}>
          <Wand2 size={18} />
          Build My {activeGenre.label} Game
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
          <Zap size={12} /> ~15 seconds · Published to arcade · Free forever
        </div>

      </div>
    </div>
  )
}
