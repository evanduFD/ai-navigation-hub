export type CategoryId = 'conversational' | 'workbench' | 'operations'

export type Category = {
  id: CategoryId
  label: string
  description: string
  /** CSS color value used for the accent glow, icon tint and section rule. */
  accent: string
}

export const CATEGORIES: Category[] = [
  {
    id: 'conversational',
    label: 'Conversational Analytics',
    description: 'How our bots are performing across every channel we answer on.',
    accent: 'var(--color-accent-conversational)',
  },
  {
    id: 'workbench',
    label: 'Agent Workbench',
    description: 'Where we build, wire up and stress-test the agents themselves.',
    accent: 'var(--color-accent-workbench)',
  },
  {
    id: 'operations',
    label: 'Operations & Intelligence',
    description: 'Day-to-day operational surfaces and the reporting around them.',
    accent: 'var(--color-accent-operations)',
  },
]

export const CATEGORY_BY_ID: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((category) => [category.id, category]),
) as Record<CategoryId, Category>
