import { Command, Keyboard } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Aurora } from './components/Aurora'
import { CategoryFilter } from './components/CategoryFilter'
import { CommandPalette } from './components/CommandPalette'
import { Hero } from './components/Hero'
import { SearchBar } from './components/SearchBar'
import { ShortcutsOverlay } from './components/ShortcutsOverlay'
import { ThemeToggle } from './components/ThemeToggle'
import { ToolGrid } from './components/ToolGrid'
import { CATEGORIES, type CategoryId } from './data/categories'
import { TOOLS } from './data/tools'
import { useHotkeys } from './hooks/useHotkeys'
import { useTheme } from './hooks/useTheme'
import { searchTools } from './lib/fuzzy'

export default function App() {
  const { theme, toggle } = useTheme()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryId | 'all'>('all')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  // Drives the entrance cascade exactly once; filtering must not re-run it.
  const [firstRender, setFirstRender] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setFirstRender(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const visible = useMemo(() => {
    const scoped = category === 'all' ? TOOLS : TOOLS.filter((tool) => tool.category === category)
    return searchTools(scoped, query)
  }, [category, query])

  const counts = useMemo(() => {
    const matched = searchTools(TOOLS, query)
    return {
      all: matched.length,
      ...Object.fromEntries(
        CATEGORIES.map((entry) => [
          entry.id,
          matched.filter((tool) => tool.category === entry.id).length,
        ]),
      ),
    } as Record<CategoryId | 'all', number>
  }, [query])

  const availableCount = TOOLS.filter((tool) => tool.status === 'available').length

  const openPalette = useCallback(() => setPaletteOpen(true), [])
  const toggleShortcuts = useCallback(() => setShortcutsOpen((open) => !open), [])
  const focusSearch = useCallback(() => searchRef.current?.focus(), [])
  useHotkeys({ onPalette: openPalette, onShortcuts: toggleShortcuts, onSearch: focusSearch })

  const reset = useCallback(() => {
    setQuery('')
    setCategory('all')
  }, [])

  const modalOpen = paletteOpen || shortcutsOpen

  return (
    <>
      <Aurora paused={modalOpen} />

      {/* inert blocks focus, pointer and assistive-tech access to the page behind a
          modal in a single attribute — no hand-rolled focus trap required. */}
      <div inert={modalOpen || undefined}>
        <a
          href="#tools"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:border focus:px-3 focus:py-2 focus:text-sm focus:[background:var(--hub-bg)]"
        >
          Skip to tools
        </a>

        <header className="sticky top-0 z-30">
          <div className="hub-glass border-b" style={{ borderColor: 'var(--hub-border)' }}>
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
              <span className="flex items-center gap-2.5">
                {/* White plate keeps the charcoal half of the mark legible on the
                    dark theme, where it would otherwise disappear. */}
                <span className="grid size-7 place-items-center rounded-lg bg-white p-1">
                  <img src="/frontier-mark.png" alt="" aria-hidden className="size-full" />
                </span>
                <span className="text-[0.85rem] font-semibold tracking-tight">
                  AI Navigation Hub
                </span>
              </span>

              <span className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openPalette}
                  className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.75rem] text-muted transition-colors duration-300 hover:[background:var(--hub-card-hover)] hover:text-fg"
                  style={{ borderColor: 'var(--hub-border)' }}
                >
                  <Command className="size-3.5" strokeWidth={1.75} aria-hidden />
                  <span className="hidden sm:inline">Quick jump</span>
                  <kbd
                    aria-hidden
                    className="rounded border px-1 font-sans text-[0.65rem]"
                    style={{ borderColor: 'var(--hub-border-strong)' }}
                  >
                    ⌘K
                  </kbd>
                </button>

                <button
                  type="button"
                  onClick={() => setShortcutsOpen(true)}
                  className="hidden size-9 place-items-center rounded-full border text-muted transition-colors duration-300 hover:[background:var(--hub-card-hover)] hover:text-fg sm:grid"
                  style={{ borderColor: 'var(--hub-border)' }}
                >
                  <Keyboard className="size-4" strokeWidth={1.75} aria-hidden />
                  <span className="sr-only">Keyboard shortcuts</span>
                </button>

                <ThemeToggle theme={theme} onToggle={toggle} />
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 pb-24">
          <section className="flex flex-col items-center gap-8 pt-20 pb-16 sm:pt-28">
            <Hero availableCount={availableCount} totalCount={TOOLS.length} />
            <SearchBar
              value={query}
              onChange={setQuery}
              inputRef={searchRef}
              resultCount={visible.length}
            />
            <CategoryFilter active={category} onChange={setCategory} counts={counts} />
          </section>

          <div id="tools" className="scroll-mt-24">
            <ToolGrid tools={visible} firstRender={firstRender} onReset={reset} />
          </div>
        </main>

        {/* The wordmark now anchors the hero, so the footer stays text-only. */}
        <footer
          className="border-t px-5 py-8 text-center text-[0.75rem] text-muted"
          style={{ borderColor: 'var(--hub-border)' }}
        >
          Each tool keeps its own sign-in. Press{' '}
          <kbd
            className="rounded border px-1 font-sans"
            style={{ borderColor: 'var(--hub-border-strong)' }}
          >
            ?
          </kbd>{' '}
          for shortcuts.
        </footer>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <ShortcutsOverlay open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </>
  )
}
