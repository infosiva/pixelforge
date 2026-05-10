'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Mail, Loader2, CheckCircle2, Gamepad2, Wand2, Sparkles } from 'lucide-react'
import { sendMagicCode, verifyMagicCode, getUser, type AuthUser } from '@/lib/auth'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: (user: AuthUser) => void
  /** Why the modal was triggered — shown as context */
  reason?: 'create' | 'save' | 'leaderboard' | 'general'
}

const REASONS = {
  create:      { title: 'Create your game', sub: "You've hit the free build limit. Sign in to keep creating — it's free forever." },
  save:        { title: 'Save your progress', sub: 'Sign in to save games, track scores and access your arcade.' },
  leaderboard: { title: 'Join the leaderboard', sub: 'Sign in to post your score and compete with other players.' },
  general:     { title: 'Welcome to PixelForge', sub: 'Sign in for free to create games, save progress and more.' },
}

type Step = 'email' | 'code' | 'done'

export default function AuthModal({ open, onClose, onSuccess, reason = 'general' }: Props) {
  const [step, setStep]       = useState<Step>('email')
  const [email, setEmail]     = useState('')
  const [code, setCode]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [countdown, setCountdown] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const codeRef  = useRef<HTMLInputElement>(null)

  // Reset on open
  useEffect(() => {
    if (open) {
      setStep('email'); setEmail(''); setCode(''); setError(''); setLoading(false); setCountdown(0)
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open])

  // Focus code input when step changes
  useEffect(() => {
    if (step === 'code') setTimeout(() => codeRef.current?.focus(), 80)
  }, [step])

  // Resend countdown
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  if (!open) return null

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) { setError('Enter your email'); return }
    setLoading(true); setError('')
    const res = await sendMagicCode(email.trim())
    setLoading(false)
    if (!res.ok) { setError(res.error ?? 'Failed to send'); return }
    setStep('code'); setCountdown(60)
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = code.trim()
    if (trimmed.length !== 6) { setError('Enter the 6-digit code from your email'); return }
    setLoading(true); setError('')
    const res = await verifyMagicCode(email.trim(), trimmed)
    setLoading(false)
    if (!res.ok) { setError(res.error ?? 'Invalid code'); return }
    setStep('done')
    setTimeout(() => { onSuccess(res.user!) }, 1200)
  }

  async function handleResend() {
    if (countdown > 0) return
    setLoading(true); setError('')
    const res = await sendMagicCode(email.trim())
    setLoading(false)
    if (!res.ok) { setError(res.error ?? 'Failed to resend'); return }
    setCountdown(60); setCode('')
    codeRef.current?.focus()
  }

  const { title, sub } = REASONS[reason]

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 101,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px', pointerEvents: 'none',
      }}>
        <div style={{
          width: '100%', maxWidth: 420,
          background: '#13131f',
          border: '1px solid rgba(124,58,237,0.35)',
          borderRadius: 20,
          boxShadow: '0 0 80px rgba(124,58,237,0.2), 0 24px 64px rgba(0,0,0,0.6)',
          pointerEvents: 'auto',
          overflow: 'hidden',
        }}>

          {/* Header gradient strip */}
          <div style={{
            height: 4,
            background: 'linear-gradient(90deg,#7c3aed,#ec4899,#f59e0b)',
          }} />

          <div style={{ padding: '28px 28px 32px' }}>

            {/* Close */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: 16, right: 16,
                background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8,
                padding: '6px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            ><X size={16} /></button>

            {step === 'done' ? (
              /* ── Done ── */
              <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
                <CheckCircle2 size={52} color="#4ade80" style={{ marginBottom: 16 }} />
                <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8 }}>You're in! 🎉</p>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>Signed in as <strong style={{ color: '#a78bfa' }}>{email}</strong></p>
              </div>
            ) : (
              <>
                {/* Icon + title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(236,72,153,0.2))',
                    border: '1px solid rgba(124,58,237,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {reason === 'create' ? <Wand2 size={22} color="#a78bfa" /> : <Gamepad2 size={22} color="#a78bfa" />}
                  </div>
                  <div>
                    <p style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 3 }}>{title}</p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{sub}</p>
                  </div>
                </div>

                {/* Perks */}
                <div style={{
                  display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap',
                }}>
                  {['Free forever', 'No password', 'Instant access'].map(p => (
                    <span key={p} style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                      background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)',
                      color: '#c4b5fd',
                    }}>{p}</span>
                  ))}
                </div>

                {step === 'email' ? (
                  /* ── Email step ── */
                  <form onSubmit={handleSendCode}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                      Email address
                    </label>
                    <div style={{ position: 'relative', marginBottom: error ? 8 : 16 }}>
                      <Mail size={15} color="rgba(255,255,255,0.25)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                      <input
                        ref={inputRef}
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError('') }}
                        placeholder="you@example.com"
                        required
                        style={{
                          width: '100%', padding: '13px 14px 13px 40px',
                          borderRadius: 10, border: `1.5px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
                          background: '#0e0e1a', color: '#fff', fontSize: 14,
                          outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = '#7c3aed' }}
                        onBlur={e => { e.currentTarget.style.borderColor = error ? '#ef4444' : 'rgba(255,255,255,0.12)' }}
                      />
                    </div>
                    {error && <p style={{ fontSize: 12, color: '#f87171', marginBottom: 12 }}>⚠ {error}</p>}
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%', padding: '14px', borderRadius: 10, border: 'none',
                        background: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
                        color: '#fff', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        opacity: loading ? 0.7 : 1, fontFamily: 'inherit',
                      }}
                    >
                      {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending…</> : <><Sparkles size={15} /> Send login code</>}
                    </button>
                  </form>
                ) : (
                  /* ── Code step ── */
                  <form onSubmit={handleVerify}>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 16, lineHeight: 1.5 }}>
                      Code sent to <strong style={{ color: '#fff' }}>{email}</strong>.<br />
                      Check your inbox (and spam).
                    </p>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                      6-digit code
                    </label>
                    <input
                      ref={codeRef}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={code}
                      onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setError('') }}
                      placeholder="123456"
                      style={{
                        width: '100%', padding: '16px 14px', borderRadius: 10,
                        border: `1.5px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.12)'}`,
                        background: '#0e0e1a', color: '#fff',
                        fontSize: 28, fontWeight: 800, letterSpacing: '0.3em', textAlign: 'center',
                        outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box',
                        marginBottom: error ? 8 : 16,
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#7c3aed' }}
                      onBlur={e => { e.currentTarget.style.borderColor = error ? '#ef4444' : 'rgba(255,255,255,0.12)' }}
                    />
                    {error && <p style={{ fontSize: 12, color: '#f87171', marginBottom: 12 }}>⚠ {error}</p>}
                    <button
                      type="submit"
                      disabled={loading || code.length !== 6}
                      style={{
                        width: '100%', padding: '14px', borderRadius: 10, border: 'none',
                        background: code.length === 6 ? 'linear-gradient(135deg,#7c3aed,#5b21b6)' : 'rgba(255,255,255,0.06)',
                        color: code.length === 6 ? '#fff' : 'rgba(255,255,255,0.3)',
                        fontSize: 15, fontWeight: 800, cursor: code.length === 6 ? 'pointer' : 'not-allowed',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        fontFamily: 'inherit', transition: 'all 0.15s',
                      }}
                    >
                      {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Verifying…</> : 'Confirm & Sign In'}
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
                      <button type="button" onClick={() => { setStep('email'); setCode(''); setError('') }}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 12, cursor: 'pointer', padding: 0 }}>
                        ← Change email
                      </button>
                      <button type="button" onClick={handleResend} disabled={countdown > 0}
                        style={{ background: 'none', border: 'none', fontSize: 12, cursor: countdown > 0 ? 'not-allowed' : 'pointer', padding: 0, color: countdown > 0 ? 'rgba(255,255,255,0.2)' : '#a78bfa' }}>
                        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
