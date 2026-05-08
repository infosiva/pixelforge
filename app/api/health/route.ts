/**
 * GET /api/health
 * Checks reachability of all external integrations:
 * - auth-api (VPS 31.97.56.148:3110)
 * - fal.ai (key configured)
 * - Vercel Blob (key configured)
 * Returns per-service status + overall ok flag.
 */
import { NextResponse } from 'next/server'

const AUTH_API = 'http://31.97.56.148:3110'

async function checkAuthApi(): Promise<{ ok: boolean; latencyMs?: number; error?: string }> {
  const start = Date.now()
  try {
    const res = await fetch(`${AUTH_API}/health`, { signal: AbortSignal.timeout(4000) })
    const latencyMs = Date.now() - start
    if (!res.ok) return { ok: false, latencyMs, error: `HTTP ${res.status}` }
    return { ok: true, latencyMs }
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'unreachable' }
  }
}

async function checkFal(): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.FAL_KEY) return { ok: false, error: 'FAL_KEY not set' }
  // Key present — can't ping without incurring cost; treat as ok if configured
  return { ok: true }
}

async function checkBlob(): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { ok: false, error: 'BLOB_READ_WRITE_TOKEN not set' }
  return { ok: true }
}

export async function GET() {
  const [authApi, fal, blob] = await Promise.all([
    checkAuthApi(),
    checkFal(),
    checkBlob(),
  ])

  const services = { authApi, fal, blob }
  const allOk = Object.values(services).every(s => s.ok)

  return NextResponse.json(
    { ok: allOk, services, ts: new Date().toISOString() },
    { status: allOk ? 200 : 207 }
  )
}
