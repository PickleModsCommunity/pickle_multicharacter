# TEBBY.md - pickle_multicharacter

## Overview

`pickle_multicharacter` is a FiveM resource that provides a **loading screen UI** for GTA V roleplay servers. It is built as a React + TypeScript + Vite single-page application (NUI) rendered inside the FiveM CEF browser. The loading screen displays a YouTube video background, an animated server info panel (updates, team, rules), a progress bar, a music player widget, a color-theme picker, and an interactive keyboard layout showing server keybinds. The UI is entirely client-side; there is currently no Lua server or client script in this branch — the repo is at an early UI-only initialization state.

## Code design

### Architecture

- **Single NUI app** — all source lives under `web/`. The compiled output is served as the FiveM NUI page during server load.
- **React + Vite** — built with `@vitejs/plugin-react` and `@tailwindcss/vite`. TailwindCSS v4 is used for styling. shadcn/ui component primitives (`Badge`, `Button`, `Card`) are present.
- **Context-driven state** — `LoadingScreenContext` (defined in `web/src/components/loading/loading.tsx`) is the single shared state store. It holds: `blur`, `color` (primary + secondary RGBA), `progress`, `loadingDots`, `keyboardOpen`, and `keyboardTransition`. All child components consume it via the `useLoadingScreen()` hook.
- **Component tree**:
  ```
  App
  └── LoadingScreen
      └── LoadingScreenProvider   (context + state)
          └── LoadingScreenContent
              ├── YoutubePlayer      (iframe background)
              ├── ServerInfo panel   (Updates / Team / Rules tabs)
              │   ├── UpdatesList
              │   ├── ServerTeam
              │   └── ServerRules
              ├── KeyboardLayout     (interactive keybind overlay)
              ├── toolbar            (keyboard toggle, color picker)
              └── Progress bar / music widget / server branding
  ```
- **Framer Motion** (`motion` package) is used for animated expand/collapse of update entries and other transitions.
- **react-color `SketchPicker`** is used for the in-UI primary/secondary color customization panel.
- **No Lua scripts are present** on this branch — the resource is UI-only in its current state (likely pre-fxmanifest wiring).

### Main flows

1. **Loading progress** — a `setInterval` in `LoadingScreenContent` increments `progress` (0–100) and `loadingDots` (0–3) every second. This is placeholder logic; in production it would be driven by FiveM's `loadingScreen:progressUpdate` NUI message.
2. **Keyboard overlay** — clicking the keyboard toolbar icon calls `openKeyboard()`, which sets `keyboardOpen = true` with a CSS opacity transition managed by `keyboardTransition`. Closing mirrors this pattern.
3. **Color theme** — the `SketchPicker` writes RGBA arrays into `color.primary` / `color.secondary` in context; every `BlurCard` and keyboard key reads from context to apply `rgba(...)` inline styles.
4. **Blur toggle** — a checkbox in the color panel toggles `blur` in context; `BlurCard` conditionally applies `backdrop-blur-md`.
5. **Keybind tooltips** — `keyboard.tsx` highlights keys where `(index % 5) == 1` and shows a tooltip. This is a placeholder pattern; real keybind data is not yet wired.

### Conventions

- Path alias `@` maps to `web/src/` (configured in `vite.config.ts`).
- Utility: `cn()` from `web/src/lib/utils.ts` (clsx + tailwind-merge) is used for conditional class names.
- Components use named exports except the top-level `LoadingScreen` and `KeyboardLayout` which use default exports.
- Inline `style` props carry dynamic values (colors, transitions); Tailwind classes carry structural/static styling.
- `"use client"` directives appear at the top of some component files — these are Next.js conventions that have no effect in Vite but are harmless.

## Important files

| Path | Why it matters |
|------|---------------|
| `web/src/components/loading/loading.tsx` | Core entry point — contains `LoadingScreenProvider`, `LoadingScreenContext`, `useLoadingScreen`, `BlurCard`, `LoadingScreenContent`, and the default export `LoadingScreen`. Nearly all UI logic lives here. |
| `web/src/App.tsx` | React app root — mounts `LoadingScreen` inside a full-viewport dark wrapper. |
| `web/src/main.tsx` | Vite entry — bootstraps React into `#root`. |
| `web/src/components/keyboard/keyboard.tsx` | Interactive full keyboard overlay with per-key tooltip support; reads theme colors from context. |
| `web/src/components/updates/updates.tsx` | Animated collapsible update-log list rendered in the ServerInfo panel. |
| `web/src/components/loading/loading.css` | Custom scrollbar styles scoped to the loading screen. |
| `web/src/components/ui/badge.tsx` | shadcn/ui Badge primitive used across tabs and update dates. |
| `web/src/lib/utils.ts` | `cn()` helper — used everywhere for class merging. |
| `web/package.json` | Dependency manifest; lists React 19, Tailwind 4, Framer Motion, react-color, lucide-react. |
| `web/vite.config.ts` | Vite build config; defines the `@` alias and registers Tailwind + React plugins. |
| `web/index.html` | HTML shell; the Vite entry point that loads `main.tsx`. |

## Intended behaviors

- **Placeholder progress simulation** — the progress bar increments automatically via `setInterval` at 1 %/s. This is intentional scaffolding for development; it is not a bug. In a deployed FiveM resource it would be replaced by real NUI callback data from the game engine.
- **Hardcoded demo data** — `ServerInfo` in `loading.tsx` initializes `updates`, `members`, and `rules` with hardcoded placeholder arrays. These are meant to be replaced or driven by NUI messages; their presence is by design for UI prototyping.
- **Hardcoded YouTube URL and branding** — `YoutubePlayer` is initialized with a specific YouTube URL (`https://www.youtube.com/watch?v=FByBvNKpwAw`) and the "Pickle RP" branding block at the bottom is hardcoded. These are demo defaults, not bugs.
- **`(index % 5) == 1` keybind highlight** — keys at every 5th index position are highlighted and show a tooltip. This is placeholder logic illustrating the keybind system; it is not a real keybind mapping.
- **`useState` calls inside a `.map()` callback** — in `LoadingScreenContent`, the toolbar `.map()` calls `useState` and `useEffect` inside the map body. This violates React's Rules of Hooks and **is a genuine bug** (hooks must not be called conditionally or inside loops). However, it appears to function in practice because the toolbar array has a fixed length and React's reconciler happens to match state slots. A future agent fixing other things should not touch this without also fixing the hooks violation properly (extract each toolbar item to its own component).
- **`"use client"` directives** — appear in `updates.tsx` and `keyboard.tsx`. These are Next.js-specific and have no effect in a Vite build. They are harmless noise, not bugs.
- **No fxmanifest.lua** — this branch has no FiveM manifest file. The resource is not yet wired into the FiveM resource system. This is an initialization state, not a missing-file bug for the current branch.

## Common issues & fixes

| Issue | Likely cause | Fix |
|-------|-------------|-----|
| Loading screen never appears in-game | No `fxmanifest.lua` exists yet; NUI is not registered with FiveM | Add `fxmanifest.lua` with `ui_page 'web/index.html'` and the compiled output referenced correctly |
| Progress bar never reaches 100 % | Placeholder `setInterval` logic — it loops 0→100 on its own | Replace with a listener for `loadingScreen:progressUpdate` NUI events from the game |
| Color picker panel does not close on outside click | The `useRef`/`useEffect` click-outside logic is inside a `.map()` callback (hooks-in-loop bug) | Refactor each toolbar item into its own React component so hooks are called at the top level |
| Blank white screen on load | Vite dev server not running or `npm run build` output missing | Run `npm install && npm run build` inside `web/`; ensure `dist/` is present |
| YouTube background not visible | CSP on the FiveM server may block the YouTube iframe domain | Add `youtube.com` and `youtube-nocookie.com` to the server's CSP headers, or swap to a local video |
| Tailwind classes not applying | TailwindCSS v4 used via `@tailwindcss/vite`; using v3 PostCSS config alongside it will conflict | Keep only the `@tailwindcss/vite` plugin; do not add a `tailwind.config.js` or `postcss.config.js` |
| `useLoadingScreen` throws "must be used within a LoadingScreenProvider" | A component that consumes the context was rendered outside `<LoadingScreenProvider>` | Ensure all context consumers are descendants of `LoadingScreen` (which wraps `LoadingScreenProvider`) |
| Locale/text errors referencing `ERR_TRANSLATE_*` | Not applicable to this resource — there is no locale system here; those errors belong to `pickle_casinos` or `pickle_restaurants` | Check the correct resource; this repo has no locale files |

## Conventions

- **TypeScript throughout** — all source files use `.tsx` or `.ts`. Do not add plain `.js` files to `web/src/`.
- **Tailwind for structure, inline styles for dynamic values** — use Tailwind utility classes for layout, spacing, and static colors; use `style={{ ... }}` only for values that depend on runtime state (theme colors, progress widths, transition states).
- **`cn()` for class merging** — always use `cn(...)` from `@/lib/utils` when combining conditional classes; do not concatenate class strings manually.
- **Context access via `useLoadingScreen()`** — never import `LoadingScreenContext` directly; always go through the hook.
- **Component files** — one primary component per file; default export for the main component, named exports for helpers in the same file (e.g. `BlurCard` and `useLoadingScreen` in `loading.tsx`).
- **No new dependencies without updating `package.json`** — the lockfile (`package-lock.json`) must be kept in sync.
- **Do not compile the UI in this sandbox** — the NUI build (`npm run build` inside `web/`) must be delegated to CI. A GitHub Actions workflow should build and commit the `web/dist/` output when `web/src/**` changes.
- **Hook rules** — any new interactive component that needs per-item state (like toolbar items) must be extracted into its own named component, not implemented as a closure inside `.map()`.
