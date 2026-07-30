import { AnimatePresence, motion } from 'motion/react'
import { SearchX } from 'lucide-react'
import { CATEGORIES } from '../data/categories'
import type { Tool } from '../data/tools'
import { ToolCard } from './ToolCard'

type Props = {
  tools: Tool[]
  /** True only on the very first paint, so filtering never re-runs the cascade. */
  firstRender: boolean
  onReset: () => void
}

export function ToolGrid({ tools, firstRender, onReset }: Props) {
  const sections = CATEGORIES.map((category) => ({
    category,
    matches: tools.filter((tool) => tool.category === category.id),
  })).filter((section) => section.matches.length > 0)

  if (sections.length === 0) {
    return (
      <div
        className="hub-card mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border px-6 py-12 text-center"
        style={{ background: 'var(--hub-card)', borderColor: 'var(--hub-border)' }}
      >
        <SearchX className="size-6 text-muted" strokeWidth={1.5} aria-hidden />
        <p className="text-sm font-medium">No tools match that search</p>
        <p className="text-[0.8rem] text-muted">
          Try a different term, or clear the filters to see all seven.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-1 rounded-lg border px-3 py-1.5 text-[0.8rem] font-medium transition-colors hover:[background:var(--hub-card-hover)]"
          style={{ borderColor: 'var(--hub-border-strong)' }}
        >
          Clear filters
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-14">
      {sections.map(({ category, matches }, sectionIndex) => (
        <motion.section
          key={category.id}
          layout
          aria-labelledby={`section-${category.id}`}
          initial={firstRender ? 'hidden' : false}
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 + sectionIndex * 0.08 } },
          }}
        >
          <div className="mb-5 flex items-baseline gap-3">
            <span
              aria-hidden
              className="mt-2 h-px w-6 shrink-0 self-start"
              style={{ background: category.accent }}
            />
            <div className="space-y-1">
              <h2
                id={`section-${category.id}`}
                className="text-[0.95rem] font-semibold tracking-tight"
              >
                {category.label}
              </h2>
              <p className="text-[0.8rem] text-muted">{category.description}</p>
            </div>
          </div>

          <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {matches.map((tool) => (
                <motion.li
                  key={tool.id}
                  layout
                  className="m-0"
                  variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ToolCard tool={tool} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.section>
      ))}
    </div>
  )
}
