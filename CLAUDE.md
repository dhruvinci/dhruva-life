# CLAUDE.md

Quick context for coding agents working in this repository.

## Project Overview

`dhruva.life` is a terminal-style personal website built with Next.js (App Router). Visitors type commands or click; every content command also has a real, statically generated URL.

## Commands

- `pnpm dev` - development server
- `pnpm check` - typecheck + lint + build (run before pushing)
- `pnpm new <log | post "Title" | project "Title" | page "Title">` - scaffold content

Use `pnpm`. Pushing to `main` deploys to production via Vercel. The owner is fine with direct pushes to `main`.

## Content updates (most common task)

Content lives only in `content/` as Markdown with YAML frontmatter, plus `content/site.json`. See README.md for the frontmatter reference. When asked to "add a log entry", "post this", "update now", etc.:

1. Edit or create the file under `content/` (use `pnpm new ...` for new files).
2. For `content/pages/now.md`, also bump `updated:` to today's date.
3. Run `pnpm build`. `lib/content.ts` validates every file and fails with `content/<file>: <problem>` on bad input.
4. Commit and push to `main` if the user asked to publish.

Never invent biographical facts, links, or numbers; ask.

## Architecture

- `lib/content.ts` - server-only loader and validator; renders Markdown to HTML at build time.
- `lib/routes.ts` - single URL <-> command table used by static params, metadata, sitemap, and the terminal.
- `lib/commands/` - `registry.tsx` (resolve, aliases, suggestions, execute), `content.tsx` (page/work/writing/log/open/cat), `help.tsx`, `utilities.tsx`, `easter-eggs.tsx`.
- `components/terminal/` - `terminal.tsx` owns state, pushState/popstate, link interception; `prompt.tsx` is the input + mobile cockpit; `context.tsx` exposes `run`/`pathFor`; `command-link.tsx` renders routed commands as real `<a href>`.
- `app/page.tsx` (home) and `app/[...slug]/page.tsx` (all content routes, `dynamicParams = false`).

A content page's file name becomes its command and URL; names in `RESERVED_COMMANDS` (`lib/routes.ts`) are taken. Easter eggs have section `"secret"` and stay out of help/autocomplete.

## Styling

Tailwind CSS 4 via `app/globals.css`. Earthy palette: terracotta, sage, olive, ochre, teal-stone. Markdown output is styled by the `.md` rules at the bottom of `globals.css`. JetBrains Mono loaded in `app/layout.tsx`, which also has the inline pre-paint theme script.

## Verification

Run `pnpm check`. For terminal behavior changes, smoke test: home intro, `help`, clicking nav links (URL changes without reload), back/forward, deep-link reload (e.g. `/work/graicie`), tab completion, typo suggestion, `search`, `alias`, an easter egg, `clear`, theme toggle, and the mobile menu at phone width.
