import {
  BadgeDollarSign,
  Mail,
  MessagesSquare,
  Newspaper,
  Phone,
  PhoneOutgoing,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { safeHref } from '../lib/url'
import type { CategoryId } from './categories'

type ToolDef = {
  id: string
  name: string
  blurb: string
  category: CategoryId
  icon: LucideIcon
  /** The env var name, quoted for dev warnings when it is missing. */
  envKey: string
  rawUrl: string | undefined
  keywords: readonly string[]
}

/**
 * The union is load-bearing: `href` is unreachable without narrowing on `status`,
 * so rendering a link to nowhere is a type error rather than a discipline problem.
 */
export type Tool = Omit<ToolDef, 'rawUrl' | 'envKey'> &
  ({ status: 'available'; href: string } | { status: 'unavailable'; href: null })

/**
 * Vite string-replaces only literal `import.meta.env.VITE_*` member expressions,
 * so every key is written out. A computed lookup silently yields undefined in
 * production builds while appearing to work in dev.
 */
const DEFS: ToolDef[] = [
  {
    id: 'chatbot-analytics',
    name: 'AI Chatbot Analytics',
    blurb: 'Conversation volume, resolution rate and escalation trends for web chat.',
    category: 'conversational',
    icon: MessagesSquare,
    envKey: 'VITE_URL_CHATBOT_ANALYTICS',
    rawUrl: import.meta.env.VITE_URL_CHATBOT_ANALYTICS,
    keywords: ['chat', 'web', 'conversations', 'deflection', 'dashboard'],
  },
  {
    id: 'voicebot-analytics',
    name: 'AI Voicebot Analytics',
    blurb: 'Call outcomes, containment and transcript-level insight for the phone line.',
    category: 'conversational',
    icon: Phone,
    envKey: 'VITE_URL_VOICEBOT_ANALYTICS',
    rawUrl: import.meta.env.VITE_URL_VOICEBOT_ANALYTICS,
    keywords: ['voice', 'call', 'phone', 'ivr', 'transcript', 'containment'],
  },
  {
    id: 'emailbot-analytics',
    name: 'AI Emailbot Analytics',
    blurb: 'Reply quality, turnaround time and hand-off rates across inbound mail.',
    category: 'conversational',
    icon: Mail,
    envKey: 'VITE_URL_EMAILBOT_ANALYTICS',
    rawUrl: import.meta.env.VITE_URL_EMAILBOT_ANALYTICS,
    keywords: ['email', 'inbox', 'mail', 'reply', 'turnaround'],
  },
  {
    id: 'mcp-workspace',
    name: 'MCP Workspace',
    blurb: 'Browse, connect and try the Model Context Protocol servers we run.',
    category: 'workbench',
    icon: Wrench,
    envKey: 'VITE_URL_MCP_WORKSPACE',
    rawUrl: import.meta.env.VITE_URL_MCP_WORKSPACE,
    keywords: ['mcp', 'model context protocol', 'server', 'tools', 'integration'],
  },
  {
    id: 'qa-agent',
    name: 'AI QA Agent',
    blurb: 'Automated review of agent transcripts against our quality rubric.',
    category: 'workbench',
    icon: ShieldCheck,
    envKey: 'VITE_URL_QA_AGENT',
    rawUrl: import.meta.env.VITE_URL_QA_AGENT,
    keywords: ['qa', 'quality', 'scoring', 'review', 'rubric', 'evaluation'],
  },
  {
    id: 'outbound-caller',
    name: 'AI Outbound Caller',
    blurb: 'Place and track outbound calls for the customer service team.',
    category: 'operations',
    icon: PhoneOutgoing,
    envKey: 'VITE_URL_OUTBOUND_CALLER',
    rawUrl: import.meta.env.VITE_URL_OUTBOUND_CALLER,
    keywords: [
      'outbound',
      'call',
      'dialer',
      'campaign',
      'customer service',
      'cs',
      'callback',
      'phone',
    ],
  },
  {
    id: 'repricer-portal',
    name: 'AI Repricer Portal',
    blurb: 'Monitor pricing rules, review suggested changes and push updates live.',
    category: 'operations',
    icon: BadgeDollarSign,
    envKey: 'VITE_URL_REPRICER_PORTAL',
    rawUrl: import.meta.env.VITE_URL_REPRICER_PORTAL,
    keywords: ['repricer', 'pricing', 'margin', 'catalog', 'rules', 'portal'],
  },
  {
    id: 'newsletter',
    name: 'AI Newsletter',
    blurb: 'The department digest — what shipped, what we learned, what is next.',
    category: 'operations',
    icon: Newspaper,
    envKey: 'VITE_URL_NEWSLETTER',
    rawUrl: import.meta.env.VITE_URL_NEWSLETTER,
    keywords: ['newsletter', 'digest', 'update', 'announcement', 'reading'],
  },
]

function resolve({ rawUrl, envKey, ...rest }: ToolDef): Tool {
  const href = safeHref(rawUrl)
  if (href) return { ...rest, status: 'available', href }

  if (import.meta.env.DEV) {
    console.warn(
      `[hub] ${rest.name} has no usable URL — set ${envKey} in .env (see .env.example). Rendering as "Coming soon".`,
    )
  }
  return { ...rest, status: 'unavailable', href: null }
}

export const TOOLS: Tool[] = DEFS.map(resolve)
