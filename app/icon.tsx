import { ImageResponse } from 'next/og'
export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
export default function Icon() {
  return new ImageResponse(
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: 'linear-gradient(135deg,#6d28d9,#7c3aed)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="8" height="8" rx="1.5" fill="white"/>
        <rect x="13" y="3" width="8" height="8" rx="1.5" fill="white" opacity="0.6"/>
        <rect x="3" y="13" width="8" height="8" rx="1.5" fill="white" opacity="0.6"/>
        <rect x="13" y="13" width="8" height="8" rx="1.5" fill="white"/>
      </svg>
    </div>
  )
}
