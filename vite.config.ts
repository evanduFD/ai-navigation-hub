import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Prints which tool URLs the build actually baked in.
 *
 * Vite inlines VITE_URL_* at build time, so if the host's environment does not
 * reach the build the values silently become undefined and every card renders as
 * "Coming soon" — a page that looks deliberate but is really a misconfiguration.
 * Logging the resolved set makes that obvious in the CI or Azure build log
 * instead of only on the deployed page.
 *
 * Discovers keys from the environment rather than hard-coding a list, so it
 * cannot drift out of step with src/data/tools.ts.
 */
function reportToolUrls(mode: string): Plugin {
  return {
    name: 'hub:report-tool-urls',
    apply: 'build',
    configResolved() {
      const env = loadEnv(mode, process.cwd(), 'VITE_')
      const keys = Object.keys(env)
        .filter((key) => key.startsWith('VITE_URL_'))
        .sort()

      if (keys.length === 0) {
        console.warn(
          '\n[hub] No VITE_URL_* values found for this build.\n' +
            '      Every tool will render as "Coming soon". If you expected the host to\n' +
            '      supply these, its settings are not reaching the build step.\n',
        )
        return
      }

      const blank = keys.filter((key) => !env[key]?.trim())
      const width = Math.max(...keys.map((key) => key.length))
      const lines = keys.map((key) => {
        const value = env[key]?.trim()
        return `      ${key.padEnd(width)}  ${value || '— coming soon'}`
      })

      console.log(
        `\n[hub] ${keys.length - blank.length}/${keys.length} tool URLs baked into this build:\n` +
          lines.join('\n') +
          '\n',
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), reportToolUrls(mode)],
}))
