import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Same pixel anvil as app/icon.svg, drawn on a 16-unit grid scaled to 180px.
const u = 180 / 16
const lime = [[1, 5, 14, 2], [5, 7, 6, 3], [3, 10, 10, 2], [2, 12, 12, 1]]
const cyan = [[10, 1], [12, 2], [8, 2], [11, 3]]

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: 180, height: 180, background: '#0a0f08', display: 'flex', position: 'relative' }}>
        {lime.map(([x, y, w, h], i) => <div key={i} style={{ position: 'absolute', left: x * u, top: y * u, width: w * u, height: h * u, background: '#a3e635' }} />)}
        {cyan.map(([x, y], i) => <div key={i} style={{ position: 'absolute', left: x * u, top: y * u, width: u, height: u, background: '#22d3ee' }} />)}
      </div>
    ),
    size,
  )
}
