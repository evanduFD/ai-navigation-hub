import { AnimatePresence, motion } from 'motion/react'
import { CornerDownLeft, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORY_BY_ID } from '../data/categories'
import { TOOLS, type Tool } from '../data/tools'
import { matchIndices, searchTools } from '../lib/fuzzy'
import { EASE_SMOOTH } from '../lib/motion'

const LISTBOX_ID = 'palette-listbox'
const optionId = (index: number) => `palette-option-${index}`

/** Bolds the characters the query actually matched. */
function Highlight({ text, query }: { text: string; query: string }) {
  const hits = useMemo(() => new Set(matchIndices(text, query)), [text, query])
  if (hits.size === 0) return <>{text}</>

  return (
    <>
      {Array.from(text).map((char, index) =>
        hits.has(index) ? (
          <mark key={index} className="bg-transparent font-semibold text-fg">
            {char}
          </mark>
        ) : (
          <span key={index}>{char}</span>
        ),
      )}
    </>
  )
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const restoreTo = useRef<HTMLElement | null>(null)

  // Unavailable tools stay listed but sort last — visible, never activatable.
  const results = useMemo(() => {
    const matched = searchTools(TOOLS, query)
    return [
      ...matched.filter((tool) => tool.status === 'available'),
      ...matched.filter((tool) => tool.status === 'unavailable'),
    ]
  }, [query])

  useEffect(() => setActiveIndex(0), [query])

  useEffect(() => {
    if (!open) return

    restoreTo.current = document.activeElement as HTMLElement | null
    setQuery('')
    setActiveIndex(0)

    // Motion mounts this with an animation; focusing on the next frame avoids
    // the call landing before the element is laid out.
    const frame = requestAnimationFrame(() => inputRef.current?.focus())

    const { overflow } = document.documentElement.style
    document.documentElement.style.overflow = 'hidden'

    return () => {
      cancelAnimationFrame(frame)
      document.documentElement.style.overflow = overflow
      restoreTo.current?.focus()
    }
  }, [open])

  // Keep the active row in view during arrow-key traversal.
  useEffect(() => {
    if (!open) return
    listRef.current
      ?.querySelector(`#${optionId(activeIndex)}`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open])

  const activate = useCallback(
    (tool: Tool | undefined) => {
      if (tool?.status !== 'available') return
      window.open(tool.href, '_blank', 'noopener,noreferrer')
      onClose()
    },
    [onClose],
  )

  const onKeyDown = (event: React.KeyboardEvent) => {
    // Mid-IME-composition keydowns must not be treated as navigation.
    if (event.nativeEvent.isComposing) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0))
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(Math.max(0, results.length - 1))
        break
      case 'Enter':
        event.preventDefault()
        activate(results[activeIndex])
        break
      case 'Escape':
      case 'Tab':
        event.preventDefault()
        onClose()
        break
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_SMOOTH }}
        >
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.42, ease: EASE_SMOOTH }}
            className="hub-glass relative w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl"
            style={{ borderColor: 'var(--hub-border-strong)' }}
          >
            <div
              className="flex items-center gap-3 border-b px-4"
              style={{ borderColor: 'var(--hub-border)' }}
            >
              <Search className="size-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden />
              <input
                ref={inputRef}
                role="combobox"
                aria-expanded
                aria-controls={LISTBOX_ID}
                aria-autocomplete="list"
                aria-activedescendant={results.length ? optionId(activeIndex) : undefined}
                aria-label="Search tools"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Jump to a tool…"
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-muted"
              />
            </div>

            <ul
              ref={listRef}
              role="listbox"
              id={LISTBOX_ID}
              aria-label="Tools"
              className="max-h-[45vh] list-none overflow-y-auto p-2"
            >
              {results.map((tool, index) => {
                const Icon = tool.icon
                const accent = CATEGORY_BY_ID[tool.category].accent
                const isActive = index === activeIndex
                const available = tool.status === 'available'

                return (
                  // Focus never leaves the input; aria-activedescendant conveys
                  // the active row, so options carry no tabIndex.
                  <li
                    key={tool.id}
                    role="option"
                    id={optionId(index)}
                    aria-selected={isActive}
                    aria-disabled={available ? undefined : true}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => activate(tool)}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-300 ease-[var(--ease-smooth)] ${
                      available ? '' : 'cursor-not-allowed opacity-55'
                    }`}
                    style={isActive ? { background: 'var(--hub-spotlight)' } : undefined}
                  >
                    <span
                      className="grid size-8 shrink-0 place-items-center rounded-lg"
                      style={{
                        background: `color-mix(in oklab, ${accent} 14%, transparent)`,
                        color: available ? accent : 'var(--hub-muted)',
                      }}
                    >
                      <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.85rem] text-muted">
                        <Highlight text={tool.name} query={query} />
                      </span>
                      <span className="block truncate text-[0.72rem] text-muted opacity-70">
                        {available ? CATEGORY_BY_ID[tool.category].label : 'Coming soon'}
                      </span>
                    </span>

                    {isActive && available && (
                      <CornerDownLeft className="size-3.5 shrink-0 text-muted" aria-hidden />
                    )}
                  </li>
                )
              })}

              {results.length === 0 && (
                <li className="px-3 py-8 text-center text-[0.82rem] text-muted">
                  No tools match “{query}”
                </li>
              )}
            </ul>

            <div
              className="flex items-center justify-between border-t px-4 py-2.5 text-[0.7rem] text-muted"
              style={{ borderColor: 'var(--hub-border)' }}
            >
              <span>
                {results.length} tool{results.length === 1 ? '' : 's'}
              </span>
              <span className="flex items-center gap-3">
                <span>↑↓ navigate</span>
                <span>↵ open</span>
                <span>esc close</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
