# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`dhruva.life` is a terminal-style personal website built with Next.js 15 (App Router, React 19, Tailwind 4). Visitors type commands or click; every content command also has a real, statically generated URL.

## Commands

- `pnpm dev` - local server; `draft: true` content shows only here
- `pnpm check` - typecheck + lint + build (run before pushing); `pnpm typecheck`, `pnpm lint`, `pnpm build` run the steps alone
- `pnpm new <post "Title" | project "Title" | page "Title">` - scaffold content (research entries are created by hand)

Use `pnpm`. Pushing to `main` deploys to production via Vercel. The owner is fine with direct pushes to `main`.

## Content

Content lives only in `content/` as Markdown with YAML frontmatter, plus `content/site.json` and JSON files: `playlist.json`, `photos.json`, `fights.json`, `gigs.json`, `records.json`, and for /work and /research `timeline.json`, `skills.json`, `experiments.json`, `research-data.json`, `research-methods.json`, `research-tools.json`. README.md has the full frontmatter reference. For content updates ("post this", "add a project", "change the tagline") use the content-update skill; for writing essays or posts with Dhruva, use the essay skill.

`lib/content.ts` loads and validates everything at build time; bad input fails the build with `content/<file>: <problem>`. Rules it enforces: file names are lowercase-with-dashes and become slugs; slugs must be unique across `blog/`, `research/`, `projects/` and `pages/`; files starting with `_` (`_intro.md`, `_outro.md`) are not entries but render above/below the index; `photos.json` entries must exist under `public/`. Markdown is rendered once at build time with `marked` (GFM, raw HTML passes through) and injected via `components/terminal/markdown.tsx` inside `.md` styles in `app/globals.css`. Post images go in `public/images/blog/<slug>/` (not `public/blog/`, which would shadow the post's URL); inline SVG charts and `<figure>`/`<details>` use the theme-aware `.md` styles.

`/blog` is essays sorted by date; every post has a `category:` of `research`, `work` or `life`, which drives the filter buttons and `/blog/<category>` pages (categories can't reuse a post slug). `/research` and `/work` have no sub-pages: research threads are listed latest first and link out to GitHub / Hugging Face / the paper / a post; projects are complete entries on /work linking to the company or code. Old `/research/*` and `/work/*` URLs redirect to the index. Skills and research data/methods cite evidence by `where` (a project slug, a page, or `research/<slug>`), and the build fails if it doesn't resolve. Never name the technique-clip source app anywhere; research datasets are private ("available on request").

Never invent biographical facts, links, or numbers; ask. Write in Dhruva's voice, not an AI's.

## Architecture

`lib/routes.ts` is the single URL <-> command table used by static params, metadata, sitemap, and the terminal. Every route is statically generated (`app/[...slug]/page.tsx`, `dynamicParams = false`) with its command already run, so the HTML carries the content; after hydration the same commands run client-side and update the URL via `pushState`. A new routed command therefore needs an entry in `getRoutes`, not just a registry command, or it gets no URL.

Commands live in `lib/commands/` (`content.tsx` for about/work/research/blog, `fun.tsx` for fun pages, `registry.tsx` for resolution, menu order, typo suggestions); the terminal UI is `components/terminal/`. Internal links in Markdown (`[x](/work)`) are intercepted and run as commands.

A content page's file name becomes its command and URL; names in `RESERVED_COMMANDS` (`lib/routes.ts`) are taken. Keep the menu small: /about /research /work /blog /contact /fun. Pages with `fun: true` (/music, /bjj, /camera) plus /theme are always in the menu after the main six and show as emojis in the prompt bar. On phones the prompt is a tap-to-open command list with no typing. No navbar, no ⌘K, no aliases, by design. /research and /work show a persistent contact strip.

Retired or renamed URLs get a permanent redirect in `next.config.mjs`.

## SEO

`lib/seo.ts` owns titles (server metadata and the terminal's `document.title` both use it) and schema.org JSON-LD. Each route's `description` in `lib/routes.ts` is its search/preview text; pages can set a longer `seo:` in frontmatter. Social cards are rendered by `lib/og.tsx` (served from `app/og/[...slug]`) with the fonts in `assets/fonts/`. `/llms.txt` and `/llms-full.txt` (`lib/llms.ts`) and `/feed.xml` (blog posts only) are generated from content, so they update themselves.

## Styling

Deep orange (between Bitcoin and Goku orange) on neutral charcoal or paper, with gold, blue, olive and sage, defined per theme (`lib/themes.ts`: dark, light, matrix, pokemon, claude, amber); every text color is >= 4.5:1 against background, card and muted surfaces, so keep that invariant when adding colors. Mono (JetBrains) for interface, serif (Newsreader) for anything read at length (`.md`, `font-serif`).

## Verification

There is no test suite; `pnpm check` is the gate. Don't run it while `pnpm dev` is up: both write `.next`, and the dev server starts 404ing until it's restarted with `.next` cleared. For terminal behavior changes, also run the `terminal-smoke-test` skill.
