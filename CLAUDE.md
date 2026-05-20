# CLAUDE.md

This file gives coding agents quick context for working in this repository.

## Project Overview

`dhruva.life` is a terminal-style personal website built with Next.js. Visitors explore the site by typing commands instead of navigating pages.

## Development Commands

- `pnpm dev` - Start the development server
- `pnpm typecheck` - Run TypeScript
- `pnpm lint` - Run ESLint
- `pnpm build` - Build for production
- `pnpm start` - Start the production server after a build

Use `pnpm`; the lockfile is `pnpm-lock.yaml`.

## Architecture

- `app/page.tsx` mounts the boot screen, theme toggle, and terminal.
- `hooks/use-terminal.tsx` owns terminal state, history, discovery unlocks, and custom event listeners.
- `lib/commands.tsx` owns command execution, utility commands, aliases, search/open behavior, and animated easter eggs.
- `lib/terminal-config.tsx` types and renders structured content from JSON.
- `content/terminal-config.json` is the editable content source for static command output, projects, writing, logs, help copy, and unlock hints.
- `lib/animations.tsx` contains React-driven ASCII/terminal animations.

## Content Editing

Prefer editing `content/terminal-config.json` for copy/content changes. The JSON config supports structured blocks such as headings, paragraphs, link lists, key/value lists, project lists, post lists, log lists, quote lists, directory lists, and notices.

Keep behavior in TypeScript when a command needs runtime logic, browser APIs, localStorage, aliases, search, or animation.

## Command System

- Command matching is case-insensitive.
- Built-in aliases are declared in JSON; user aliases are stored in localStorage.
- Discovery state is driven by command metadata (`tier` and `unlockGroup`).
- Generated command links dispatch `terminal-command`; replay buttons dispatch `replayCommand`; clear can be handled through `terminal-clear`.

## Styling

- Tailwind CSS 4 via `app/globals.css`
- Custom earthy terminal palette: terracotta, sage, olive, ochre, teal-stone
- JetBrains Mono loaded in `app/layout.tsx`

## Verification Expectations

Before shipping meaningful changes, run:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

For terminal behavior changes, smoke test boot, `help`, basic/advanced unlocks, JSON-backed commands, generated links, `clear`, `search`, `open`, aliases, replay, and theme switching.
