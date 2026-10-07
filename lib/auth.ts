/**
 * Auth + guest session utilities for PixelForge.
 * - Guest fingerprint: stored in localStorage, sent to auth-api /guest/track
 * - Auth: JWT stored in localStorage, magic-link via auth-api /magic/*
 * - AUTH_API: VPS auth-api base URL
 */

export const AUTH_API = 'http://31.97.56.148:3110'
export const PRODUCT  = 'pixelforge'

// ── Fingerprint ─────────────────────────────────────────────────────────────

function makeFingerprint(): string {
  const rand = Math.random().toString(36).slice(2) + Date.now().toString(36)
  return 'pf_' + rand
}

export function getFingerprint(): string {
  if (typeof window === 'undefined') return ''
  let fp = localStorage.getItem('pf_fp')
  if (!fp) { fp = makeFingerprint(); localStorage.setItem('pf_fp', fp) }
  return fp
}

// ── Guest usage tracking ─────────────────────────────────────────────────────

export async function trackUsage(action: string): Promise<number> {
  const fp = getFingerprint()
  if (!fp) return 0
  try {
    const res = await fetch(`${AUTH_API}/guest/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint: fp, product: PRODUCT, action }),
    })
    const data = await res.json()
    return data.count ?? 0
  } catch {
    return 0
  }
}

export async function getUsageCount(action: string): Promise<number> {
  const fp = getFingerprint()
  if (!fp) return 0
  try {
    const res = await fetch(`${AUTH_API}/guest/usage?fingerprint=${fp}&product=${PRODUCT}&action=${encodeURIComponent(action)}`)
    const data = await res.json()
    return data.count ?? 0
  } catch {
    return 0
  }
}

// ── JWT / User ───────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number
  username: string
  email: string
  site: string
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('pf_token')
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('pf_user')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem('pf_token', token)
  localStorage.setItem('pf_user', JSON.stringify(user))
}

export function clearAuth() {
  localStorage.removeItem('pf_token')
  localStorage.removeItem('pf_user')
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

// ── Magic link ───────────────────────────────────────────────────────────────

export async function sendMagicCode(email: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${AUTH_API}/magic/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, site: PRODUCT }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data.error ?? 'Failed to send code' }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Network error — check connection' }
  }
}

export async function verifyMagicCode(email: string, code: string): Promise<{ ok: boolean; user?: AuthUser; error?: string }> {
  try {
    const res = await fetch(`${AUTH_API}/magic/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, site: PRODUCT }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data.error ?? 'Invalid code' }
    saveAuth(data.token, data.user)
    return { ok: true, user: data.user }
  } catch {
    return { ok: false, error: 'Network error — check connection' }
  }
}

// ── Guest limit check ────────────────────────────────────────────────────────
// Gate: guests can play freely, but creating a game requires registration after N free builds.
// Signup requirement disabled for now (NEXT_PUBLIC_SIGNUP_GATE=off) — toggle via Vercel env, no redeploy needed.
// Guest code bypasses the gate entirely regardless of the flag — for inviting testers.

export const FREE_BUILDS_LIMIT = 1  // 1 free build, then must register

// ── Guest/admin code (hub-generated, per-project, 24h TTL) ──────────────────
// Codes are minted from the hub dashboard via auth-api /admin-code/generate.
// Redeeming stores the privilege state (tier + aiLimit) in localStorage, keyed
// by fingerprint so /admin-code/status can restore it across sessions.

export interface GuestPrivilege {
  active: boolean
  tier?: string
  aiLimit?: number | null
  expiresAt?: number
}

const GUEST_PRIV_KEY = 'pf_guest_priv'

export async function redeemGuestCode(code: string): Promise<{ ok: boolean; error?: string }> {
  const fp = getFingerprint()
  try {
    const res = await fetch(`${AUTH_API}/admin-code/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim(), project: PRODUCT, fingerprint: fp }),
    })
    const data = await res.json()
    if (!res.ok || !data.valid) return { ok: false, error: data.error ?? 'Invalid code' }
    const priv: GuestPrivilege = { active: true, tier: data.tier, aiLimit: data.aiLimit, expiresAt: data.expiresAt }
    if (typeof window !== 'undefined') localStorage.setItem(GUEST_PRIV_KEY, JSON.stringify(priv))
    return { ok: true }
  } catch {
    return { ok: false, error: 'Network error — check connection' }
  }
}

export function getCachedGuestPrivilege(): GuestPrivilege {
  if (typeof window === 'undefined') return { active: false }
  try {
    const raw = localStorage.getItem(GUEST_PRIV_KEY)
    if (!raw) return { active: false }
    const priv: GuestPrivilege = JSON.parse(raw)
    if (!priv.expiresAt || priv.expiresAt < Date.now()) return { active: false }
    return priv
  } catch {
    return { active: false }
  }
}

// Re-checks with auth-api (call on app load) — restores/expires privilege across devices/sessions.
export async function refreshGuestPrivilege(): Promise<GuestPrivilege> {
  const fp = getFingerprint()
  try {
    const res = await fetch(`${AUTH_API}/admin-code/status?project=${PRODUCT}&fingerprint=${fp}`)
    const data = await res.json()
    const priv: GuestPrivilege = data.active
      ? { active: true, tier: data.tier, aiLimit: data.aiLimit, expiresAt: data.expiresAt }
      : { active: false }
    if (typeof window !== 'undefined') {
      if (priv.active) localStorage.setItem(GUEST_PRIV_KEY, JSON.stringify(priv))
      else localStorage.removeItem(GUEST_PRIV_KEY)
    }
    return priv
  } catch {
    return getCachedGuestPrivilege()
  }
}

export function hasGuestAccess(): boolean {
  return getCachedGuestPrivilege().active
}

export async function checkBuildGate(): Promise<'allowed' | 'requires_auth'> {
  if (process.env.NEXT_PUBLIC_SIGNUP_GATE === 'off') return 'allowed'
  if (isLoggedIn() || hasGuestAccess()) return 'allowed'
  const count = await getUsageCount('game_created')
  return count >= FREE_BUILDS_LIMIT ? 'requires_auth' : 'allowed'
}
