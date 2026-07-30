/**
 * Returns the URL only if it is a usable http(s) link, otherwise null.
 *
 * Env values reach the bundle verbatim, so this is the gate that stops a typo or a
 * pasted `javascript:` value from ever being rendered as an href.
 *
 * A bare hostname ("tool.example.net/path") is treated as https rather than
 * rejected — omitting the scheme is the easy mistake to make in a .env, and
 * silently hiding the tool behind "Coming soon" is a confusing way to report it.
 * Anything that already carries a scheme is left alone, so `javascript:` and
 * `data:` still fall through to the protocol check below.
 */
export function safeHref(raw: string | undefined): string | null {
  const trimmed = raw?.trim()
  if (!trimmed) return null

  // `(?!\d)` keeps "localhost:3000" out of this branch — the URL spec would read
  // "localhost" as the scheme, when it is really a host and port.
  const hasScheme = /^[a-zA-Z][a-zA-Z\d+.-]*:(?!\d)/.test(trimmed)
  // Leading "/" means a path, not a host — not something we can repair.
  const candidate = hasScheme || trimmed.startsWith('/') ? trimmed : `https://${trimmed}`

  try {
    const { protocol } = new URL(candidate)
    return protocol === 'http:' || protocol === 'https:' ? candidate : null
  } catch {
    return null
  }
}
