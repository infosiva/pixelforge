import { NextRequest, NextResponse } from 'next/server'

interface Entry { count: number; resetAt: number }
const store = new Map<string, Entry>()

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [k, v] of store) if (v.resetAt < now) store.delete(k)
  }, 5 * 60 * 1000)
}

export function rateLimit(opts: { windowMs?: number; max?: number; message?: string } = {}) {
  const windowMs = opts.windowMs ?? 60_000
  const max      = opts.max ?? 20
  const msg      = opts.message ?? 'Too many requests, please try again later.'
  const id       = Math.random().toString(36).slice(2) // per-limiter key so limiters do not share counters

  return {
    check(req: NextRequest): NextResponse | null {
      const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
        req.headers.get('x-real-ip') ??
        'unknown'
      const now = Date.now()
      const key = id + ':' + ip
      const e = store.get(key)
      if (!e || e.resetAt < now) { store.set(key, { count: 1, resetAt: now + windowMs }); return null }
      e.count++
      if (e.count > max) {
        return NextResponse.json({ error: msg }, {
          status: 429,
          headers: { 'Retry-After': String(Math.ceil((e.resetAt - now) / 1000)) },
        })
      }
      return null
    },
  }
}

export const AI_LIMITER  = rateLimit({ windowMs: 60_000, max: 10, message: 'Rate limit: max 10 requests per minute. Try again shortly.' })
export const API_LIMITER = rateLimit({ windowMs: 60_000, max: 30 })
export const CHAT_LIMITER = rateLimit({ windowMs: 3_600_000, max: 60, message: 'Chat limit reached (60 messages per hour). Try again later.' })
export const FEEDBACK_LIMITER = rateLimit({ windowMs: 3_600_000, max: 20 })
