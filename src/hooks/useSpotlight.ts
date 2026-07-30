import { useCallback, useEffect, useRef } from 'react'

/**
 * Cursor-following glow.
 *
 * The rect is read once on pointerenter and cached — calling
 * getBoundingClientRect() inside the move handler would force a synchronous
 * layout flush on every event. Moves only write CSS custom properties, coalesced
 * to one write per frame, and the glow element itself is translated, so nothing
 * repaints.
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const rect = useRef<DOMRect | null>(null)
  const frame = useRef(0)
  const next = useRef({ x: 0, y: 0 })

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const onPointerEnter = useCallback(() => {
    const el = ref.current
    if (!el) return
    rect.current = el.getBoundingClientRect()
    el.style.setProperty('--glow', '1')
  }, [])

  const onPointerMove = useCallback((event: React.PointerEvent<T>) => {
    const box = rect.current
    if (!box) return

    next.current = { x: event.clientX - box.left, y: event.clientY - box.top }
    if (frame.current) return

    frame.current = requestAnimationFrame(() => {
      frame.current = 0
      const el = ref.current
      if (!el) return
      el.style.setProperty('--mx', `${next.current.x}px`)
      el.style.setProperty('--my', `${next.current.y}px`)
    })
  }, [])

  const onPointerLeave = useCallback(() => {
    rect.current = null
    ref.current?.style.setProperty('--glow', '0')
  }, [])

  return { ref, spotlight: { onPointerEnter, onPointerMove, onPointerLeave } }
}
