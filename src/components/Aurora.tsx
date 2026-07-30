// Anchored on the Frontier teal, with a deeper cyan and a light mint either side of
// it. Staying inside one hue family reads as brand colour rather than decoration.
const BLOBS = [
  {
    color: 'var(--color-brand)',
    animation: 'hub-drift-a 30s ease-in-out infinite',
    style: { top: '-18rem', left: '-10rem', width: '46rem', height: '46rem' },
  },
  {
    color: 'oklch(0.6 0.11 220)',
    animation: 'hub-drift-b 38s ease-in-out infinite',
    style: { top: '-8rem', right: '-14rem', width: '42rem', height: '42rem' },
  },
  {
    color: 'oklch(0.85 0.13 175)',
    animation: 'hub-drift-c 46s ease-in-out infinite',
    style: { top: '16rem', left: '32%', width: '38rem', height: '38rem' },
  },
]

// One small turbulence tile, rasterized once by the browser then repeated. Applying
// an SVG filter to a large element instead would be recomputed on every frame.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")"

export function Aurora({ paused }: { paused: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* contain:paint keeps the blur from dirtying the page; isolate stops the
          blend mode from reaching content behind this layer. */}
      <div
        className="absolute inset-0 [contain:paint] [isolation:isolate]"
        style={{
          opacity: 'var(--hub-aurora-opacity)',
          // Fades out down the page rather than ending on a hard horizontal edge.
          maskImage: 'linear-gradient(to bottom, black 0, black 45%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0, black 45%, transparent 95%)',
        }}
      >
        {BLOBS.map((blob) => (
          <div
            key={blob.animation}
            className="hub-blob absolute rounded-full [will-change:transform]"
            style={{
              ...blob.style,
              background: `radial-gradient(circle at center, ${blob.color} 0%, transparent 68%)`,
              filter: 'blur(72px)',
              mixBlendMode: 'var(--hub-aurora-blend)' as React.CSSProperties['mixBlendMode'],
              animation: blob.animation,
              animationPlayState: paused ? 'paused' : 'running',
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{ backgroundImage: GRAIN, opacity: 'var(--hub-grain-opacity)' }}
      />
    </div>
  )
}
