import { NextRequest, NextResponse } from 'next/server'
import { AI_LIMITER } from '@/lib/rateLimit'
import Groq from 'groq-sdk'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const limited = AI_LIMITER.check(req); if (limited) return limited
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  try {
    const { game, level, focus } = await req.json()
    if (!game || !level) return NextResponse.json({ error: 'game and level required' }, { status: 400 })

    const focusNote = focus ? ` Focus specifically on: ${focus}.` : ''

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 800,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are a top esports coach. Return JSON only. No markdown.',
        },
        {
          role: 'user',
          content: `Give 4 actionable skill tips for a ${level} player in ${game}.${focusNote}

Return JSON: { "tips": [ { "title": "short title", "body": "2-3 sentence explanation with specific mechanics", "pro": "one pro-player habit to copy" } ] }`,
        },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? '{}'
    const data = JSON.parse(raw)
    return NextResponse.json({ tips: data.tips ?? [] })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
