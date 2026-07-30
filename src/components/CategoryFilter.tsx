import { motion, useReducedMotion } from 'motion/react'
import { CATEGORIES, type CategoryId } from '../data/categories'

type Props = {
  active: CategoryId | 'all'
  onChange: (next: CategoryId | 'all') => void
  counts: Record<CategoryId | 'all', number>
}

const CHIPS = [{ id: 'all' as const, label: 'All tools', accent: 'var(--hub-fg)' }, ...CATEGORIES]

export function CategoryFilter({ active, onChange, counts }: Props) {
  // Without layoutId the pill snaps instead of sliding, which is the correct
  // reduced-motion behaviour.
  const reduced = useReducedMotion()

  return (
    /* No overflow-hidden here — it would clip the pill while it travels. */
    <div className="flex flex-wrap items-center justify-center gap-2">
      {CHIPS.map((chip) => {
        const isActive = active === chip.id
        return (
          <button
            key={chip.id}
            type="button"
            onClick={() => onChange(chip.id)}
            aria-pressed={isActive}
            className="hub-chip relative isolate rounded-full border px-3.5 py-1.5 text-[0.8rem] font-medium transition-colors duration-300"
            style={{
              borderColor: isActive ? 'transparent' : 'var(--hub-border)',
              color: isActive ? 'var(--hub-bg)' : 'var(--hub-muted)',
            }}
          >
            {isActive && (
              <motion.span
                // The pill sits behind the label rather than wrapping it, so
                // motion's inverse-scale correction cannot distort the text.
                layoutId={reduced ? undefined : 'chip-indicator'}
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full"
                style={{ background: chip.accent }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">
              {chip.label}
              <span className="ml-1.5 opacity-60 tabular-nums">{counts[chip.id]}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
