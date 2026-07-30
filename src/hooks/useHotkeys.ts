import { useEffect } from 'react'

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  )
}

type Handlers = {
  /** Cmd/Ctrl+K — fires even while a field has focus. */
  onPalette: () => void
  /** "?" and "/" — suppressed while typing so they can be entered literally. */
  onShortcuts: () => void
  onSearch: () => void
}

export function useHotkeys({ onPalette, onShortcuts, onSearch }: Handlers) {
  useEffect(() => {
    function handle(event: KeyboardEvent) {
      // IME composition sends real keydowns; acting on them steals characters
      // from anyone typing in a non-Latin script.
      if (event.isComposing) return

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onPalette()
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isTypingTarget(event.target)) return

      if (event.key === '?') {
        event.preventDefault()
        onShortcuts()
      } else if (event.key === '/') {
        event.preventDefault()
        onSearch()
      }
    }

    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [onPalette, onShortcuts, onSearch])
}
