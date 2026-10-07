# HANDOFF — pixelforge design + cleanup
**Date:** 2026-10-05  **Status:** COMPLETE (uncommitted, not deployed)

## DESIGN LOCK
- Accent: #a3e635 (arcade lime), secondary #22d3ee; bg #070a08. Palette check: free. Dark text (#0a0c08) on lime.
- Archetype: media-gallery (Hero -> carousel strip -> wall -> CTA band), floating nav.
- Animated bg: aurora + grain (globals.css), CSS-only, prefers-reduced-motion safe. Hero demo: CSS-only, labelled "Example prompt".
- Logo: pixel anvil (app/icon.svg, app/apple-icon.tsx, components/Logo.tsx). icon.tsx removed.
- Pricing: no tiers; app is free to use. Fake tiers/claims removed.
- AI pillars: chat = Groq -> Gemini -> Cerebras gateway in app/api/chat, 60/hr/IP, never 500. Exempt: eval/RAG (support chat only). Gaps stated, not faked.

## Resume
Done. Remaining: owner review, visual-qa.mjs, e2e after deploy.

## Runtime-switch + telemetry retrofit (2026-10-06)
Added: components/AnimatedBg.tsx, ConsentBanner.tsx, lib/telemetry.ts, app/api/usage/route.ts (204), data-layout on <html>, [data-layout] CSS variants in globals.css. Build green. Not verified: live hub switch, screenshots.


## OWASP LLM Top 10 dispositions (gate item 45, 2026-10-07; list recalled from memory, unverified)
- LLM01 prompt injection: lib/guard.ts present, NOT yet wired into routes; no output filtering or tool sandbox review done. PARTIAL.
- LLM02 sensitive info disclosure: `redact()` helper available; not applied to every log. PARTIAL.
- LLM04/10 DoS / unbounded consumption: per-IP rate limit where present; token budgets not enforced. PARTIAL.
- LLM05 improper output handling: model output rendered as text; not audited for HTML sinks. UNVERIFIED.
- LLM06 excessive agency: no tool-calling agents audited. UNVERIFIED.
- Others (supply chain, poisoning, embeddings, misinformation): not assessed.
