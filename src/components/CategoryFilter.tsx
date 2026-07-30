import { motion, useReducedMotion } from 'motion/react'
import { CATEGORIES, type CategoryId } from '../data/categories'

type Props = {
  active: CategoryId | 'all'
  onChange: (next: CategoryId | 'all') => void
  counts: Record<CategoryId | 'all', number>
}

const CHIPS = [{ id: 'all' as const, label: 'All tools' }, ...CATEGORIES]

/** One brand-teal treatment for every chip, so selection reads as a single state. */
const ACTIVE_GLOW = `0 6px 22px -6px color-mix(in oklab, var(--color-brand) 75%, transparent),
   0 0 0 1px color-mix(in oklab, var(--color-brand) 45%, transparent)`

export function CategoryFilter({ active, onChange, counts }: Props) {
  // Without layoutId the pill snaps between chips, which is the correct
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
            // No transform on this button: it hosts the layoutId pill, and scaling
            // the parent would skew motion's layout-projection measurements.
            className={`hub-chip relative rounded-full border px-4 py-2 text-[0.8rem] transition-colors duration-300 ${
              isActive ? 'font-semibold' : 'font-medium text-muted hover:text-fg'
            }`}
            style={{
              borderColor: isActive ? 'transparent' : 'var(--hub-border-strong)',
              background: isActive ? undefined : 'var(--hub-card)',
              color: isActive ? 'oklch(0.16 0.012 265)' : undefined,
              boxShadow: isActive ? ACTIVE_GLOW : undefined,
            }}
          >
            {isActive && (
              <motion.span
                // The pill sits behind the label rather than wrapping it, so
                // motion's inverse-scale correction cannot distort the text.
                layoutId={reduced ? undefined : 'chip-indicator'}
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'linear-gradient(135deg, var(--color-brand), color-mix(in oklab, var(--color-brand) 70%, white))',
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {chip.label}
              <span
                className="rounded-full px-1.5 text-[0.7rem] tabular-nums"
                style={{
                  background: isActive ? 'oklch(0.16 0.012 265 / 0.16)' : 'var(--hub-spotlight)',
                }}
              >
                {counts[chip.id]}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
