'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BG = 'rgba(255,255,255,0.98)'
const BORDER = '#e2e8f0'
const BOTTOM_OFFSET = 84

export default function FloatingChatWrapper() {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [msgs, setMsgs] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "I'm ForgeBot. Ask me about game creation, pixel art, or publishing your game!" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const msgsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  async function send() {
    if (!input.trim() || loading) return
    const userMsg = input
    setMsgs(m => [...m, { role: 'user', text: userMsg }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userMsg }] }),
      })
      const data = await res.json()
      setMsgs(m => [...m, { role: 'bot', text: data.text || 'Happy to help!' }])
    } catch {
      setMsgs(m => [...m, { role: 'bot', text: 'Try again in a moment!' }])
    } finally {
      setLoading(false)
    }
  }

  const panelStyle: React.CSSProperties = isMobile ? {
    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9998,
    width: '100%', height: `calc(100dvh - ${BOTTOM_OFFSET}px)`,
    borderRadius: '16px 16px 0 0',
    background: BG,
    border: `1px solid ${BORDER}`,
    boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    animation: 'pixelforge-slide-bottom 0.3s cubic-bezier(0.23,1,0.32,1)',
  } : {
    position: 'fixed', bottom: 88, right: 24, zIndex: 9998,
    width: 320, height: 420, borderRadius: 16,
    background: BG,
    border: `1px solid ${BORDER}`,
    boxShadow: '0 8px 40px rgba(236,72,153,0.15)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    animation: 'pixelforge-slide-up 0.22s ease-out',
  }

  return (
    <>
      <style>{`
        @keyframes pixelforge-slide-bottom {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes pixelforge-slide-up {
          from { transform: translateY(12px) scale(0.97); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pixelforge-panel { animation: none !important; }
        }
      `}</style>
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
        aria-label="Open PixelForge AI chat"
        style={{ position: 'fixed', bottom: 24, right: 24, width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg,#ec4899,#db2777)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(236,72,153,0.35)', zIndex: 9999, fontSize: 20 }}
      >
        {open ? '✕' : '🎮'}
      </motion.button>
      <AnimatePresence>
        {open && (
          <div className="pixelforge-panel" style={panelStyle}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontSize: 13, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ec4899', display: 'inline-block' }} />
              ForgeBot
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? '#ec4899' : '#f1f5f9',
                  color: m.role === 'user' ? '#fff' : '#0f172a',
                  padding: '8px 12px', borderRadius: 10, fontSize: 12.5, maxWidth: '85%', lineHeight: 1.5,
                }}>{m.text}</div>
              ))}
              {loading && <div style={{ alignSelf: 'flex-start', background: '#f1f5f9', padding: '8px 12px', borderRadius: 10, fontSize: 12, color: '#94a3b8' }}>…</div>}
              <div ref={msgsEndRef} />
            </div>
            <div style={{ padding: '10px 12px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 8, flexShrink: 0, paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about game ideas, pixel art, publishing…"
                style={{ flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0',
                  borderRadius: 8, padding: '7px 10px', fontSize: isMobile ? 16 : 12, color: '#0f172a', outline: 'none' }} />
              <button onClick={send} disabled={loading}
                style={{ background: '#ec4899', border: 'none', borderRadius: 8, padding: '7px 13px', fontSize: 13, color: '#fff', cursor: 'pointer', fontWeight: 700 }}>→</button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
