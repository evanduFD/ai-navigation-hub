# AI Navigation Hub

A single entry point to the internal AI tools our department runs. It is a pure
front-end launcher — no auth and no backend, because every destination tool already
handles its own sign-in. All this does is help people find and open them fast.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in the real URLs
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on http://localhost:5173 |
| `npm run build` | Typecheck, then production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Oxlint |

## Configuring tool URLs

Every destination lives in an env var. Copy `.env.example` to `.env` and fill it in:

```
VITE_URL_CHATBOT_ANALYTICS
VITE_URL_VOICEBOT_ANALYTICS
VITE_URL_EMAILBOT_ANALYTICS
VITE_URL_MCP_WORKSPACE
VITE_URL_QA_AGENT
VITE_URL_OUTBOUND_CALLER
VITE_URL_REPRICER_PORTAL
VITE_URL_NEWSLETTER
```

A var that is missing, blank, or not a valid `http(s)` URL does **not** produce a
broken link. The tool still appears on the page as a disabled *Coming soon* card,
and in dev the console names the env var to set. That keeps the page honest while
URLs are still being collected.

A value with no scheme (`tool.example.net`) is read as `https://` rather than
rejected, since leaving off the scheme is an easy mistake and hiding the tool is a
confusing way to report it. Values that already carry a scheme are left alone, so
`javascript:` and friends still fail the check.

> [!IMPORTANT]
> Vite inlines `VITE_*` values into the JS bundle **at build time**. They are
> plaintext in the shipped assets and readable by anyone who can load the page.
> Never put a token, key, or credential in these vars, and note that changing a URL
> requires a rebuild and redeploy — it is not runtime-configurable.
>
> If any internal hostname is itself sensitive, host the hub behind the same
> boundary as the tools (VPN or SSO-gated static hosting) rather than on a public URL.

## Adding a tool

1. Add one entry to the `DEFS` array in [src/data/tools.ts](src/data/tools.ts) —
   pick a `category`, a [lucide](https://lucide.dev) `icon`, and some `keywords` to
   make it findable.
2. Add the matching key to [.env.example](.env.example), your `.env`, and the
   `ImportMetaEnv` interface in [src/vite-env.d.ts](src/vite-env.d.ts).

The registry is the single source of truth — the grid, the category counts, and the
command palette all read from it. To change the grouping instead, edit
[src/data/categories.ts](src/data/categories.ts).

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Ctrl`/`⌘` + `K` | Command palette |
| `/` | Focus the search box |
| `?` | Shortcuts cheatsheet |
| `↑` `↓` | Move through palette results |
| `↵` | Open the highlighted tool |
| `Esc` | Close the palette, or clear the search |

## Deploying

Build and serve `dist/` as static files. There is no router, so no SPA rewrite rule
is needed.

If the hub is served from a subpath (e.g. `https://intranet/ai-hub/`), set
`base: '/ai-hub/'` in [vite.config.ts](vite.config.ts) or every asset will 404. In
CI, set the seven env vars in the build environment rather than committing a `.env`.

## Notes on the implementation

- **Stack** — Vite + React + TypeScript, Tailwind CSS v4 (CSS-first, no
  `tailwind.config.js`), `motion` for animation, `lucide-react` for icons.
- **Theming** — dark by default. Both themes are driven by CSS custom properties on
  `:root` / `:root.dark`, so the toggle flips one class. A small inline script in
  `index.html` applies the stored choice before first paint to avoid a flash.
- **Motion** — the aurora drifts on `transform` only so it stays on the compositor,
  and it pauses while a modal is open. The entrance cascade runs once on mount;
  filtering afterwards animates layout without re-running the stagger.
- **Accessibility** — the palette is a combobox/listbox with
  `aria-activedescendant` (focus never leaves the input), the page behind a modal is
  `inert`, cards are real `<a>` elements so middle-click and open-in-new-tab work,
  and `prefers-reduced-motion` freezes the aurora rather than stranding it mid-frame.
