# dhruva.life

Terminal-style personal website for Dhruva Chakravarthi. It works like Claude Code: type `/` to open the command menu (on mobile, tap the bar; there is no typing), or just click around. Every page also has a real, server-rendered URL.

## Commands

| Command | What it shows |
|---|---|
| `/about` | Who I am |
| `/research` | Published paper, work in progress, code - with a persistent contact strip |
| `/work` | Every role as a case study, plus education and skills - with a persistent contact strip |
| `/blog` | Essays, one or more a quarter since 2021 |
| `/contact` | How to reach me |
| `/fun` | The fun commands below, which also sit as emojis in the prompt bar |

Fun: 🎵 `/music` (records, gigs, and a YouTube player of songs from both that keeps playing) · 🤼 `/bjj` (fights, gyms, links) · 📷 `/camera` (cameras and a photo gallery) · 🎨 `/theme` (dark, light, matrix, pokemon, claude, amber).

## Updating the site

All content is in `content/`. Pushing to `main` deploys (Vercel). If a file is malformed, the build fails with a message naming the file, and the live site stays as it was.

| To... | Do this |
|---|---|
| Publish a post | `pnpm new post "Title"`, then write in `content/blog/<slug>.md` |
| Add a project | `pnpm new project "Name"`, then fill in the frontmatter |
| Add research | Create `content/research/<slug>.md` (see below) |
| Edit about / contact / music / bjj / camera | Edit the file in `content/pages/` |
| Change the player's songs | Edit `content/playlist.json` (YouTube video ids) |
| Add gallery photos | Put images in `public/photos/` and list them in `content/photos.json` |
| Change tagline, main menu, contact links, profile links | Edit `content/site.json` |

**Drafts:** `draft: true` in frontmatter shows a file in `pnpm dev` only.

**From a phone:** open the file on github.com, tap the pencil, edit, commit to `main`.

### Content reference

```text
content/
  site.json               tagline, main menu order, availability tags, contact links
  pages/<name>.md         one command + URL each (fun: true puts it under /fun)
  projects/<slug>.md      /work and /work/<slug>; _intro.md above the list, _outro.md below
  research/<slug>.md      /research and /research/<slug>; same _intro/_outro
  blog/<slug>.md          /blog and /blog/<slug>
  playlist.json           songs for the /music player
  photos.json             the /camera gallery
```

```yaml
# pages/<name>.md
title: Music
description: Shown in the slash menu
seo: Longer line for Google and link previews   # optional
fun: true                          # optional: a fun command (emoji row + /fun)
emoji: "🎵"                        # optional: its emoji in the fun row
next: [bjj, camera]                # optional follow-up links

# projects/<slug>.md
title: kakashi.ai
cluster: Vision AI
status: Active                     # Active | Past | Acquired | ...
year: "2026"
period: Oct 2025 – now             # optional, shown instead of year
role: Founder & Engineer           # optional
summary: One sentence.
stack: [Gemini, React]             # optional
links: [{ label: Site, href: https://example.com }]   # optional
order: 1                           # optional, lower first

# research/<slug>.md
title: Paper title
date: 2026-07-15
kind: paper                        # paper | experiment | ongoing
venue: CAISc 2026                  # optional
summary: One sentence.
highlights: ["headline result"]    # optional, shown on the /research card
links: [{ label: Paper, href: ... }]
bibtex: |                          # optional, enables "Copy BibTeX"
  @inproceedings{...}

# blog/<slug>.md
title: Essay title
date: 2026-09-27
excerpt: Optional one-liner.
```

Link to other parts of the site with plain paths, e.g. `[my projects](/work)`; the terminal runs those in place.

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm check        # typecheck + lint + build
```

## How it works

```text
content/**             Markdown, site.json, playlist.json, photos.json
lib/content.ts         server-only loader: parses + validates content, renders Markdown to HTML
lib/routes.ts          the URL <-> command table used by everything below
lib/themes.ts          the /theme palettes (colours live in app/globals.css)
lib/commands/          registry (slash parsing, menu, execute), content commands, /fun and /theme
components/terminal/   terminal, boot intro, prompt + slash menu, output blocks, music player, gallery
app/[...slug]/         every content route, statically generated
app/og/[...slug]/      per-page social card images
app/feed.xml/          RSS for the blog
app/llms.txt/          map of the site for LLMs (and llms-full.txt with every page's text)
lib/seo.ts             page titles and schema.org structured data
```

- Each route is statically generated with its command already run, so the HTML contains the content.
- Commands typed or picked from the menu append below like a terminal; clicking links in the content replaces the screen like a website. Back/forward replay the matching command.
- Per-visitor state (command history, theme) lives in `localStorage` and is optional.
- Every text colour in every theme is at least 4.5:1 against its backgrounds (WCAG AA).
