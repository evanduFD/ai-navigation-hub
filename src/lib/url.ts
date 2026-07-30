/**
 * Returns the URL only if it is a usable http(s) link, otherwise null.
 *
 * Env values reach the bundle verbatim, so this is the gate that stops a typo or a
 * pasted `javascript:` value from ever being rendered as an href.
 */
export function safeHref(raw: string | undefined): string | null {
  const trimmed = raw?.trim()
  if (!trimmed) return null

  try {
    const { protocol } = new URL(trimmed)
    return protocol === 'http:' || protocol === 'https:' ? trimmed : null
  } catch {
    return null
  }
}
