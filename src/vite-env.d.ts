/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_URL_NEWSLETTER?: string
  readonly VITE_URL_CHATBOT_ANALYTICS?: string
  readonly VITE_URL_VOICEBOT_ANALYTICS?: string
  readonly VITE_URL_EMAILBOT_ANALYTICS?: string
  readonly VITE_URL_REPRICER_PORTAL?: string
  readonly VITE_URL_MCP_WORKSPACE?: string
  readonly VITE_URL_QA_AGENT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
