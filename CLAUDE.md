# CLAUDE.md

Quick context for coding agents working in this repository.

## Project Overview

`dhruva.life` is a terminal-style personal website built with Next.js (App Router). Visitors type commands or click; every content command also has a real, statically generated URL.

## Commands

- `pnpm check` - typecheck + lint + build (run before pushing)
- `pnpm new <post "Title" | project "Title" | page "Title">` - scaffold content

Use `pnpm`. Pushing to `main` deploys to production via Vercel. The owner is fine with direct pushes to `main`.

## Content

Content lives only in `content/` as Markdown with YAML frontmatter, plus `content/site.json`. For content updates ("post this", "add a project", "change the tagline") use the content-update skill.

Never invent biographical facts, links, or numbers; ask.

## Architecture

`lib/routes.ts` is the single URL <-> command table used by static params, metadata, sitemap, and the terminal. Every route is statically generated with its command already run, so the HTML carries the content; after hydration the same commands run client-side and update the URL via `pushState`. A new routed command therefore needs an entry in `getRoutes`, not just a registry command, or it gets no URL.

A content page's file name becomes its command and URL; names in `RESERVED_COMMANDS` (`lib/routes.ts`) are taken. Keep the menu small: /about /research /work /blog /contact /fun. Pages with `fun: true` (/music, /bjj, /camera) plus /theme are always in the menu after the main six and show as emojis in the prompt bar. On phones the prompt is a tap-to-open command list with no typing. No navbar, no ⌘K, no aliases, by design. /research and /work show a persistent contact strip.

## SEO

`lib/seo.ts` owns titles (server metadata and the terminal's `document.title` both use it) and schema.org JSON-LD. Each route's `description` in `lib/routes.ts` is its search/preview text; pages can set a longer `seo:` in frontmatter. Social cards are rendered by `lib/og.tsx` with the fonts in `assets/fonts/`. `/llms.txt` and `/llms-full.txt` are generated from content (`lib/llms.ts`), so they update themselves.

## Styling

Deep orange (between Bitcoin and Goku orange) on neutral charcoal or paper, with gold, blue, olive and sage, defined per theme; every text color is >= 4.5:1 against background, card and muted surfaces, so keep that invariant when adding colors. Mono (JetBrains) for interface, serif (Newsreader) for anything read at length (`.md`, `font-serif`).

## Verification

There is no test suite; `pnpm check` is the gate. For terminal behavior changes, also run the `terminal-smoke-test` skill.
