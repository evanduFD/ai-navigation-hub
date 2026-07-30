import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef } from 'react'

const SHORTCUTS = [
  { keys: ['Ctrl', 'K'], label: 'Open the command palette' },
  { keys: ['/'], label: 'Focus the search box' },
  { keys: ['?'], label: 'Show this cheatsheet' },
  { keys: ['↑', '↓'], label: 'Move through palette results' },
  { keys: ['↵'], label: 'Open the highlighted tool' },
  { keys: ['Esc'], label: 'Close the palette or clear search' },
]

export function ShortcutsOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreTo = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    restoreTo.current = document.activeElement as HTMLElement | null
    const frame = requestAnimationFrame(() => closeRef.current?.focus())

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', onKey)
      restoreTo.current?.focus()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-black/45" onClick={onClose} aria-hidden />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-title"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="hub-glass relative w-full max-w-sm rounded-2xl border p-6 shadow-2xl"
            style={{ borderColor: 'var(--hub-border-strong)' }}
          >
            <h2 id="shortcuts-title" className="text-sm font-semibold tracking-tight">
              Keyboard shortcuts
            </h2>

            <dl className="mt-5 space-y-3">
              {SHORTCUTS.map((shortcut) => (
                <div key={shortcut.label} className="flex items-center justify-between gap-4">
                  <dt className="text-[0.8rem] text-muted">{shortcut.label}</dt>
                  <dd className="flex shrink-0 gap-1">
                    {shortcut.keys.map((key) => (
                      <kbd
                        key={key}
                        className="rounded-md border px-1.5 py-0.5 font-sans text-[0.7rem]"
                        style={{ borderColor: 'var(--hub-border-strong)' }}
                      >
                        {key}
                      </kbd>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-xl border py-2 text-[0.8rem] font-medium transition-colors hover:[background:var(--hub-card-hover)]"
              style={{ borderColor: 'var(--hub-border-strong)' }}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
