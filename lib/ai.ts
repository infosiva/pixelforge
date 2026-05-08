import Groq from 'groq-sdk'
import type { GameGenre, AgeRating } from './types'

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null

const SYSTEM = `You are a Phaser 3 game expert. Generate complete, self-contained browser games suitable for all ages.
Rules:
- Output ONLY a single valid HTML file with no markdown fences
- Use Phaser 3.60 via CDN: https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js
- Canvas must be 800x500, backgroundColor: '#0a0a1a'
- Draw ALL graphics with Phaser Graphics API — no external image URLs
- MUST support keyboard arrows/WASD as primary input
- Add this EXACT script before new Phaser.Game to handle gamepad postMessage from parent:
  <script>
  window.addEventListener('message',function(e){
    if(e.data&&e.data.type==='GAMEPAD_KEY'){
      var t=e.data.down?'keydown':'keyup';
      var ev=new KeyboardEvent(t,{key:e.data.key,code:e.data.key,bubbles:true,cancelable:true});
      document.dispatchEvent(ev);
      window.dispatchEvent(ev);
    }
  });
  </script>
- Game must have MULTIPLE LEVELS or waves with increasing difficulty — not just one endless loop
- Each level should introduce new enemies, mechanics, or speed changes
- Game must start immediately, be playable within 5 seconds
- Show level number prominently when level changes
- Add score display top-left, lives/health top-right, level center-top — clean pixel font
- Smooth 60fps, polished code, particle effects for satisfying feedback
- On game over: show "GAME OVER" overlay with final score + level reached + "Press R to restart"
- On level complete: celebrate with particles/flash before loading next level
- When score changes, post to parent: window.parent.postMessage({type:'GAME_SCORE',score:N},'*')
- The game must contain exactly: new Phaser.Game({ at the start
- CONTENT RULES: No blood, gore, explicit violence, sexual content, or adult themes. Keep fun and family-friendly.`

const AGE_GUIDANCE: Record<AgeRating, string> = {
  '8+':  'Simple controls, forgiving difficulty, bright colours, cute characters. No violence — enemies just disappear with sparkles.',
  '12+': 'Moderate challenge, mild cartoon action OK (zap/pew sound, enemies flash then vanish). No blood or gore.',
  '16+': 'Can include strategic challenge, mild peril, competitive gameplay. Still no blood, gore, or adult content.',
}

export async function generateGameCode(prompt: string, genre: GameGenre, ageRating: AgeRating = '8+'): Promise<string> {
  const userPrompt = `Create a ${genre} game: ${prompt}
Age rating: ${ageRating}. Content guideline: ${AGE_GUIDANCE[ageRating]}
Make it fun, polished, and satisfying to play. Add sound effects via Phaser's built-in audio (no external files).
Add particle effects for satisfying juice (explosions, pickups, etc).
Output ONLY the HTML file.`

  if (!groq) throw new Error('GROQ_API_KEY not set')

  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user',   content: userPrompt },
    ],
    max_tokens: 8000,
    temperature: 0.7,
  })

  const code = res.choices[0]?.message?.content ?? ''
  return code.replace(/^```html?\n?/i, '').replace(/\n?```$/, '').trim()
}

export async function generateGameMeta(prompt: string, genre: GameGenre, ageRating: AgeRating = '8+'): Promise<{ title: string; description: string }> {
  if (!groq) return { title: prompt.slice(0, 40), description: prompt }

  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{
      role: 'user',
      content: `For a ${genre} game (age ${ageRating}) described as: "${prompt}"
Generate a catchy game title (max 5 words) and a one-sentence description (max 20 words).
Respond ONLY as JSON: {"title":"...","description":"..."}`,
    }],
    max_tokens: 100,
    temperature: 0.9,
    response_format: { type: 'json_object' },
  })

  try {
    return JSON.parse(res.choices[0]?.message?.content ?? '{}')
  } catch {
    return { title: prompt.slice(0, 40), description: prompt }
  }
}
