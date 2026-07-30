import type { Tool } from '../data/tools'

/**
 * Subsequence matcher weighting consecutive runs and word-boundary hits, so "vba"
 * ranks "Voicebot Analytics" above an incidentally scattered match. Returns null
 * when the needle is not a subsequence at all.
 */
export function fuzzyScore(haystack: string, needle: string): number | null {
  if (!needle) return 0

  const text = haystack.toLowerCase()
  let score = 0
  let cursor = 0
  let previous = -1

  for (const char of needle.toLowerCase()) {
    const found = text.indexOf(char, cursor)
    if (found === -1) return null

    if (found === previous + 1) score += 10
    if (found === 0 || /[\s\-_/.]/.test(text[found - 1] ?? '')) score += 14
    score -= Math.min(found - cursor, 10)

    previous = found
    cursor = found + 1
  }

  // Same query inside a shorter string is the tighter, better match.
  return score + Math.max(0, 36 - text.length)
}

/** Character indices of `haystack` consumed by `needle`, for highlight rendering. */
export function matchIndices(haystack: string, needle: string): number[] {
  if (!needle) return []

  const text = haystack.toLowerCase()
  const indices: number[] = []
  let cursor = 0

  for (const char of needle.toLowerCase()) {
    const found = text.indexOf(char, cursor)
    if (found === -1) return []
    indices.push(found)
    cursor = found + 1
  }

  return indices
}

/**
 * Best score across a tool's name, blurb and keywords, name weighted highest.
 *
 * Names and keywords match fuzzily so "vba" finds Voicebot Analytics. Blurbs are
 * deliberately substring-only: across seven long descriptions a subsequence match
 * hits almost everything, which made short queries like "mcp" return four results.
 */
export function scoreTool(tool: Tool, query: string): number | null {
  const trimmed = query.trim()
  if (!trimmed) return 0

  const name = fuzzyScore(tool.name, trimmed)
  if (name !== null) return name + 100

  const keyword = tool.keywords.reduce<number | null>((best, term) => {
    const value = fuzzyScore(term, trimmed)
    return value !== null && (best === null || value > best) ? value : best
  }, null)
  if (keyword !== null) return keyword + 40

  return tool.blurb.toLowerCase().includes(trimmed.toLowerCase()) ? 10 : null
}

/** Filters and ranks tools, keeping registry order when there is no query. */
export function searchTools(tools: Tool[], query: string): Tool[] {
  if (!query.trim()) return tools

  return tools
    .map((tool) => ({ tool, score: scoreTool(tool, query) }))
    .filter((entry): entry is { tool: Tool; score: number } => entry.score !== null)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.tool)
}
