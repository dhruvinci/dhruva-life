# dhruva.life

Terminal-style personal website for Dhruva Chakravarthi. Visitors can type commands or just click; every piece of content also has a real URL (`/work`, `/writing/<slug>`, ...) that is server-rendered, shareable, and indexable.

## Updating the site

All content is Markdown in `content/`. Pushing to `main` deploys (Vercel). If a file is malformed, the build fails with a message naming the file and the problem, and the live site stays as it was.

| To...                         | Do this                                                            |
| ----------------------------- | ------------------------------------------------------------------ |
| Add a log entry               | `pnpm new log`, then write bullets in `content/log/<today>.md`     |
| Publish a post                | `pnpm new post "Title"`, then write in `content/writing/<slug>.md` |
| Add a project                 | `pnpm new project "Name"`, then fill in the frontmatter            |
| Update "now"                  | Edit `content/pages/now.md` and bump `updated:`                    |
| Edit about/contact/etc.       | Edit the file in `content/pages/`                                  |
| Add a whole new command + URL | `pnpm new page "Title"` (file name becomes the command and `/path`) |
| Change nav, tagline, hints    | Edit `content/site.json`                                           |

**From a phone:** open the file on github.com, tap the pencil, edit, commit to `main`. For a new post, use "Add file → Create new file" in `content/writing/` and copy the frontmatter from an existing post.

### Content reference

```text
content/
  site.json            name, tagline, nav order, mobile quick actions, project cluster order, secret hints
  pages/<name>.md      one command + URL each: /about, /now, /contact, /stack, ...
  projects/<slug>.md   shown on /work, detail at /work/<slug>
  writing/<slug>.md    shown on /writing, detail at /writing/<slug>
  log/<YYYY-MM-DD>.md  shown on /log, newest first
```

Frontmatter by type:

```yaml
# pages/<name>.md
title: Now                        # heading
description: What I'm doing now   # shown in help
updated: 2026-09-27               # optional, shows "Updated ..."
aliases: [whatsup]                # optional extra command names
next: [work, log]                 # optional follow-up chips on mobile

# projects/<slug>.md
title: Graicie
cluster: AI                       # grouping on /work (order set in site.json)
status: Active                    # Active | Concept | Archived | anything
year: "2025"
summary: One sentence.
order: 1                          # optional, lower first
links:                            # optional
  - label: Site
    href: https://example.com

# writing/<slug>.md
title: Entropy and Order
date: 2025-07-28
excerpt: Optional; defaults to the first ~140 characters.
```

Bodies are regular Markdown. Link to other parts of the site with plain paths, e.g. `[my projects](/work)`; the terminal runs those as commands in place.

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm check        # typecheck + lint + build
```

## How it works

```text
content/**            Markdown + site.json (the only place content lives)
lib/content.ts        server-only loader: parses + validates content, renders Markdown to HTML
lib/routes.ts         the URL <-> command table used by everything below
lib/commands/         command registry, one file per concern (content, help, utilities, easter eggs)
components/terminal/  the terminal UI (client component, server-rendered on first load)
app/page.tsx          home
app/[...slug]/        every content route, statically generated from content/
app/sitemap.ts        generated from the same route table
```

- Each route is statically generated with its command already "run", so the HTML contains the content (SEO, link previews, works without JS).
- After hydration, commands run client-side. Routed commands update the URL with `history.pushState`; back/forward replay the matching command; plain clicks on internal links are intercepted and run in place, modified clicks open new tabs normally.
- Per-visitor state (history, aliases, discovered secrets, theme) lives in `localStorage` and is optional.
