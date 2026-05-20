# dhruva.life

Terminal-style personal website for Dhruva Chakravarthi.

The app is intentionally simple: Next.js renders a stark terminal interface, TypeScript owns command behavior, and `content/terminal-config.json` owns the editable command copy, links, projects, writing, logs, and discovery text.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Structured JSON content config

## Local Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Editing Terminal Content

Most terminal content lives in:

```text
content/terminal-config.json
```

Use it to edit:

- command descriptions, tiers, aliases, and simple outputs
- project cards shown by `work`
- writing shown by `writing`, `open <slug>`, and `cat <slug>`
- logs shown by `whativedone`
- help journey text and unlock hints

Behavior commands remain in TypeScript because they need runtime logic:

```text
help, search, open, cat, clear, history, alias, theme, subscribe, share
```

Animated easter eggs also remain in code so the JSON stays friendly to edit.

## Project Shape

```text
app/                 Next app entrypoints
components/          Terminal UI
content/             Editable terminal config
hooks/               Terminal and theme state
lib/                 Command registry, renderer, animations
public/              Static public assets
```

## Deployment

The app is static-friendly and ready for Vercel. Run `pnpm build` before shipping so TypeScript and lint failures are not masked.
