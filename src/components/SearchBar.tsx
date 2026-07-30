import { Search, X } from 'lucide-react'
import type { RefObject } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
  inputRef: RefObject<HTMLInputElement | null>
  resultCount: number
}

export function SearchBar({ value, onChange, inputRef, resultCount }: Props) {
  return (
    <div className="relative w-full max-w-xl">
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted"
        strokeWidth={1.75}
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && value) {
            event.preventDefault()
            onChange('')
          }
        }}
        placeholder="Search tools…"
        aria-label="Search tools"
        autoComplete="off"
        spellCheck={false}
        className="hub-glass w-full rounded-full border py-3 pr-24 pl-11 text-sm outline-none transition-colors duration-500 ease-[var(--ease-smooth)] placeholder:text-muted focus:[border-color:var(--hub-border-strong)] [&::-webkit-search-cancel-button]:hidden"
        style={{ borderColor: 'var(--hub-border)' }}
      />

      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange('')
            inputRef.current?.focus()
          }}
          className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:[background:var(--hub-card-hover)] hover:text-fg"
        >
          <X className="size-3.5" aria-hidden />
          <span className="sr-only">Clear search</span>
        </button>
      ) : (
        <kbd
          aria-hidden
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md border px-1.5 py-0.5 font-sans text-[0.7rem] text-muted"
          style={{ borderColor: 'var(--hub-border-strong)' }}
        >
          /
        </kbd>
      )}

      {/* Announces result counts to screen readers without stealing focus. */}
      <p role="status" aria-live="polite" className="sr-only">
        {value ? `${resultCount} tool${resultCount === 1 ? '' : 's'} match ${value}` : ''}
      </p>
    </div>
  )
}
