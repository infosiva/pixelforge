// Pixel anvil mark. Same geometry as app/icon.svg.
export default function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden>
      <rect width="16" height="16" rx="3" fill="#0a0f08" />
      <g fill="#a3e635"><rect x="1" y="5" width="14" height="2" /><rect x="5" y="7" width="6" height="3" /><rect x="3" y="10" width="10" height="2" /><rect x="2" y="12" width="12" height="1" /></g>
      <g fill="#22d3ee"><rect x="10" y="1" width="1" height="1" /><rect x="12" y="2" width="1" height="1" /><rect x="8" y="2" width="1" height="1" /><rect x="11" y="3" width="1" height="1" /></g>
    </svg>
  )
}
