import { ArrowUpRight } from 'lucide-react'
import { CATEGORY_BY_ID } from '../data/categories'
import type { Tool } from '../data/tools'
import { useSpotlight } from '../hooks/useSpotlight'

const SHELL =
  'hub-card group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border p-5 text-left transition-[border-color,background-color,transform] duration-300 ease-[var(--ease-out-expo)]'

const HOVER =
  'hover:-translate-y-0.5 hover:[border-color:var(--hub-border-strong)] hover:[background:var(--hub-card-hover)] focus-within:[border-color:var(--hub-border-strong)] motion-reduce:hover:translate-y-0'

export function ToolCard({ tool }: { tool: Tool }) {
  const { ref, spotlight } = useSpotlight<HTMLDivElement>()
  const accent = CATEGORY_BY_ID[tool.category].accent
  const Icon = tool.icon
  const available = tool.status === 'available'

  return (
    <div
      ref={ref}
      {...(available ? spotlight : {})}
      className={available ? `${SHELL} ${HOVER}` : `${SHELL} cursor-not-allowed opacity-70`}
      aria-disabled={available ? undefined : true}
      style={{
        background: 'var(--hub-card)',
        borderColor: 'var(--hub-border)',
        ...({ '--glow': '0', '--mx': '50%', '--my': '50%' } as React.CSSProperties),
      }}
    >
      {/* Composited glow: a fixed-size gradient translated into place, so only
          transform and opacity change and the card itself never repaints. */}
      {available && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-40 size-80 rounded-full transition-opacity duration-300 [will-change:transform,opacity] motion-reduce:hidden"
          style={{
            background: `radial-gradient(circle at center, ${accent} 0%, transparent 65%)`,
            transform: 'translate3d(var(--mx), var(--my), 0)',
            opacity: 'calc(var(--glow) * 0.18)',
          }}
        />
      )}

      <div className="relative flex items-start justify-between gap-3">
        <span
          className="grid size-10 shrink-0 place-items-center rounded-xl border transition-colors duration-300"
          style={{
            borderColor: 'var(--hub-border)',
            background: `color-mix(in oklab, ${accent} 12%, transparent)`,
            color: available ? accent : 'var(--hub-muted)',
          }}
        >
          <Icon className="size-5" strokeWidth={1.75} aria-hidden />
        </span>

        {available ? (
          <ArrowUpRight
            aria-hidden
            className="size-4 shrink-0 translate-y-1 text-muted opacity-0 transition-all duration-300 ease-[var(--ease-out-expo)] group-hover:translate-y-0 group-hover:opacity-100"
          />
        ) : (
          <span
            className="shrink-0 rounded-full border px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-muted uppercase"
            style={{ borderColor: 'var(--hub-border-strong)' }}
          >
            Coming soon
          </span>
        )}
      </div>

      <div className="relative space-y-1.5">
        <h3 className="text-[0.975rem] leading-snug font-semibold tracking-tight">{tool.name}</h3>
        <p className="text-[0.8rem] leading-relaxed text-muted">{tool.blurb}</p>
      </div>

      {/* A stretched overlay keeps the whole card clickable while the anchor stays a
          real <a>, so Cmd-click, middle-click and "open in new tab" all still work. */}
      {tool.status === 'available' ? (
        <a
          href={tool.href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 rounded-2xl"
        >
          <span className="sr-only">{tool.name} (opens in a new tab)</span>
        </a>
      ) : (
        <span className="sr-only">{tool.name} is not available yet</span>
      )}
    </div>
  )
}
