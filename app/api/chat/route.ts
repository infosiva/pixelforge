import { NextRequest } from 'next/server'
import { CHAT_LIMITER } from '@/lib/rateLimit'

export const runtime = 'nodejs'
export const maxDuration = 30

// System prompt lives server-side only: never accept one from the client.
const SYSTEM = `You are ForgeBot, the assistant for PixelForge, a browser game builder. Users describe a game in plain English, an AI writes a playable Phaser 3 game, and it opens in the browser. There is also an arcade of games to play, controller support, and a training page.
Help with: writing good game prompts (genre, mechanics, win condition, visual style), how building works, tips for arcade games, and gamepad setup.
Be short and specific. Do not promise build times, quotas or prices you do not know. If asked about anything outside PixelForge or games, reply: "I'm trained for PixelForge. For that, try Google or ChatGPT!"`

type Msg = { role: 'user' | 'assistant'; content: string }

const FALLBACK = 'Chat is busy right now. Please try again in a moment.'

async function oai(url: string, key: string, model: string, msgs: Msg[]): Promise<string | null> {
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, max_tokens: 400, temperature: 0.7, messages: [{ role: 'system', content: SYSTEM }, ...msgs] }),
      signal: AbortSignal.timeout(15000),
    })
    if (!r.ok) return null
    return (await r.json()).choices?.[0]?.message?.content?.trim() || null
  } catch { return null }
}

async function gemini(key: string, msgs: Msg[]): Promise<string | null> {
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: msgs.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
        generationConfig: { maxOutputTokens: 400, temperature: 0.7 },
      }),
      signal: AbortSignal.timeout(15000),
    })
    if (!r.ok) return null
    return (await r.json()).candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null
  } catch { return null }
}

const text = (body: string, status = 200, extra: Record<string, string> = {}) =>
  new Response(body, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', ...extra } })

export async function POST(req: NextRequest) {
  const limited = CHAT_LIMITER.check(req)
  if (limited) return text('Chat limit reached (60 messages per hour). Please try again later.', 429, { 'Retry-After': limited.headers.get('Retry-After') ?? '60' })

  let msgs: Msg[] = []
  try {
    const body = await req.json()
    msgs = (Array.isArray(body?.messages) ? body.messages : [])
      .filter((m: Msg) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
      .slice(-12)
      .map((m: Msg) => ({ role: m.role, content: m.content.slice(0, 2000) }))
  } catch { /* fall through to empty */ }
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return text('Ask me something about building or playing games.', 400)

  const { GROQ_API_KEY: groq, GEMINI_API_KEY: gem, CEREBRAS_API_KEY: cer } = process.env
  const out =
    (groq && (await oai('https://api.groq.com/openai/v1/chat/completions', groq, 'llama-3.3-70b-versatile', msgs))) ||
    (gem && (await gemini(gem, msgs))) ||
    (cer && (await oai('https://api.cerebras.ai/v1/chat/completions', cer, 'llama-3.3-70b', msgs))) ||
    FALLBACK
  return text(out)
}
