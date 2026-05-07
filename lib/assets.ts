import { fal } from '@fal-ai/client'

if (process.env.FAL_KEY) {
  fal.config({ credentials: process.env.FAL_KEY })
}

export async function generateSprite(subject: string, seed: number): Promise<string> {
  if (!process.env.FAL_KEY) return ''
  try {
    const result = await fal.subscribe('fal-ai/flux/schnell', {
      input: {
        prompt: `16-bit pixel art ${subject}, game sprite, transparent background, clean pixel edges, retro RPG style, vibrant colors, centered, white background, simple`,
        image_size: { width: 512, height: 512 },
        num_inference_steps: 4,
        seed,
        enable_safety_checker: true,
      },
    }) as { data: { images: Array<{ url: string }> } }
    return result.data?.images?.[0]?.url ?? ''
  } catch (e) {
    console.error('[fal] sprite gen failed:', e)
    return ''
  }
}

export async function generateBackground(scene: string, seed: number): Promise<string> {
  if (!process.env.FAL_KEY) return ''
  try {
    const result = await fal.subscribe('fal-ai/flux/schnell', {
      input: {
        prompt: `16-bit pixel art game background, ${scene}, side-scrolling, wide landscape, no characters, detailed environment, retro game art style, vivid colors`,
        image_size: { width: 1024, height: 512 },
        num_inference_steps: 4,
        seed,
        enable_safety_checker: true,
      },
    }) as { data: { images: Array<{ url: string }> } }
    return result.data?.images?.[0]?.url ?? ''
  } catch (e) {
    console.error('[fal] bg gen failed:', e)
    return ''
  }
}
