@AGENTS.md

# PixelForge AI — AI Gaming Platform

## What This Is
Browser-only AI gaming platform. Users describe a game → AI builds it → publish to arcade → others play & remix.
Gamepad/controller support built-in. Works like a console arcade.

## Stack
- Next.js 15 App Router, Tailwind, TypeScript
- Phaser 3.60 (CDN in iframe) for game runtime
- Groq llama-3.3-70b for game code generation
- fal.ai flux/schnell for pixel art assets
- Vercel Blob for HTML/asset storage

## Key Files
| File | Purpose |
|------|---------|
| `app/page.tsx` | Arcade homepage |
| `app/create/page.tsx` | AI game builder UI |
| `app/play/[id]/GamePlayer.tsx` | Game iframe + gamepad controls |
| `app/api/generate/route.ts` | Core generation: Groq + fal.ai + Blob |
| `lib/ai.ts` | Game code + meta generation |
| `lib/assets.ts` | fal.ai sprite/bg generation |
| `lib/db.ts` | Vercel Blob game store |
| `lib/gamepad.ts` | Gamepad/controller support |

## Env Vars
- GROQ_API_KEY
- FAL_KEY
- BLOB_READ_WRITE_TOKEN
