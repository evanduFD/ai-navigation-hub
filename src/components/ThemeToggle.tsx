import { Moon, Sun } from 'lucide-react'

export function ThemeToggle({ theme, onToggle }: { theme: 'dark' | 'light'; onToggle: () => void }) {
  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={onToggle}
      className="grid size-9 place-items-center rounded-full border text-muted transition-colors duration-500 ease-[var(--ease-smooth)] hover:[background:var(--hub-card-hover)] hover:text-fg"
      style={{ borderColor: 'var(--hub-border)' }}
    >
      {dark ? (
        <Moon className="size-4" strokeWidth={1.75} aria-hidden />
      ) : (
        <Sun className="size-4" strokeWidth={1.75} aria-hidden />
      )}
      <span className="sr-only">Switch to {dark ? 'light' : 'dark'} theme</span>
    </button>
  )
}
