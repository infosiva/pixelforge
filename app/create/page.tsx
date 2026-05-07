'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wand2, Sparkles, Gamepad2, ChevronRight, Loader2 } from 'lucide-react'
import type { GameGenre, AgeRating } from '@/lib/types'

const GENRES: Array<{ id: GameGenre; label: string; emoji: string; desc: string }> = [
  { id: 'arcade',     label: 'Arcade',      emoji: '👾', desc: 'Classic fast-paced fun' },
  { id: 'platformer', label: 'Platformer',  emoji: '🏃', desc: 'Jump & run adventures' },
  { id: 'shooter',    label: 'Shooter',     emoji: '🔫', desc: 'Blast enemies away'     },
  { id: 'puzzle',     label: 'Puzzle',      emoji: '🧩', desc: 'Brain-teasing challenges'},
  { id: 'rpg',        label: 'RPG',         emoji: '⚔️', desc: 'Story & exploration'    },
  { id: 'other',      label: 'Surprise me', emoji: '🎲', desc: 'Let AI decide'           },
]

const PROMPTS = [
  'A ninja cat jumping over sushi on a Tokyo rooftop',
  'Retro space shooter with asteroid waves and boss fights',
  'Angry birds style but with penguins launching at igloos',
  'A snake that grows when collecting coffee cups',
  'Brick breaker in a haunted castle with ghost power-ups',
  'Dungeon crawler where you play as a tiny wizard',
]

const STEPS = [
  '🧠 Understanding your idea…',
  '⚙️  Writing game logic…',
  '🎨 Generating pixel art…',
  '🔊 Adding sound effects…',
  '✨ Polishing the experience…',
  '🚀 Publishing to arcade…',
]

export default function CreatePage() {
  const router = useRouter()
  const [prompt, setPrompt]       = useState('')
  const [genre, setGenre]         = useState<GameGenre>('arcade')
  const [ageRating, setAgeRating] = useState<AgeRating>('8+')
  const [loading, setLoading]     = useState(false)
  const [step, setStep]       = useState(0)
  const [error, setError]     = useState('')

  async function handleBuild() {
    if (!prompt.trim()) { setError('Describe your game first!'); return }
    setError('')
    setLoading(true)
    setStep(0)

    // Animate steps
    const interval = setInterval(() => {
      setStep(s => Math.min(s + 1, STEPS.length - 1))
    }, 2200)

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

  if (loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="glass rounded-3xl p-10 text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-pulse-glow"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}>
          <Gamepad2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">Building your game…</h2>
        <p className="text-sm text-white/40 mb-8">{STEPS[step]}</p>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: 'linear-gradient(90deg,#7c3aed,#ec4899)' }} />
        </div>
        <div className="space-y-1.5">
          {STEPS.map((s, i) => (
            <div key={i} className={`flex items-center gap-2 text-xs transition-all ${i <= step ? 'text-white/70' : 'text-white/15'}`}>
              {i < step ? '✓' : i === step ? <Loader2 className="w-3 h-3 animate-spin inline" /> : '○'}
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
          style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
          <Sparkles className="w-3.5 h-3.5" /> AI Game Builder
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">What game shall we build?</h1>
        <p className="text-white/40">Describe any game idea — AI does the rest in ~15 seconds</p>
      </div>

      {/* Genre selector */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 block">Genre</label>
        <div className="grid grid-cols-3 gap-2">
          {GENRES.map(g => (
            <button key={g.id} onClick={() => setGenre(g.id)}
              className="p-3 rounded-xl text-left transition-all"
              style={genre === g.id
                ? { background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.5)' }
                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xl mb-1">{g.emoji}</div>
              <div className={`text-xs font-bold ${genre === g.id ? 'text-purple-300' : 'text-white/60'}`}>{g.label}</div>
              <div className="text-[10px] text-white/25 mt-0.5">{g.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Age rating */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 block">Age Rating</label>
        <div className="flex gap-2">
          {(['8+', '12+', '16+'] as AgeRating[]).map(r => (
            <button key={r} onClick={() => setAgeRating(r)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={ageRating === r
                ? { background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.5)', color: '#c4b5fd' }
                : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}>
              {r === '8+' ? '🟢' : r === '12+' ? '🟡' : '🟠'} {r}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-white/20 mt-1.5">
          {ageRating === '8+' ? 'Family-friendly — cute characters, no violence' : ageRating === '12+' ? 'Mild action — cartoon combat, no blood' : 'Moderate challenge — strategic, competitive'}
        </p>
      </div>

      {/* Prompt input */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 block">Describe your game</label>
        <textarea
          value={prompt}
          onChange={e => { setPrompt(e.target.value); setError('') }}
          onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleBuild() }}
          placeholder="e.g. A ninja cat jumping over sushi on a neon Tokyo rooftop…"
          rows={3}
          className="w-full rounded-2xl p-4 text-sm text-white placeholder-white/25 outline-none resize-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}` }}
        />
        {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
        <div className="text-[11px] text-white/20 mt-1.5 text-right">⌘+Enter to build</div>
      </div>

      {/* Prompt suggestions */}
      <div className="mb-8">
        <p className="text-xs text-white/25 mb-2">Need inspiration?</p>
        <div className="flex flex-wrap gap-2">
          {PROMPTS.map(p => (
            <button key={p} onClick={() => setPrompt(p)}
              className="text-xs px-3 py-1.5 rounded-full transition-all hover:text-white/70 text-white/30"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {p.length > 40 ? p.slice(0, 40) + '…' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Build button */}
      <button onClick={handleBuild}
        className="btn-primary w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-black">
        <Wand2 className="w-5 h-5" />
        Build My Game
        <ChevronRight className="w-4 h-4" />
      </button>

      <p className="text-center text-xs text-white/20 mt-4">
        Your game will be published to the arcade and playable by everyone.
      </p>
    </div>
  )
}
