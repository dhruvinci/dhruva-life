# dhruva.life

Terminal-style personal website for Dhruva Chakravarthi. It works like Claude Code: type `/` to open the command menu (on mobile, tap the bar; there is no typing), or just click around. Every page also has a real, server-rendered URL.

## Commands

| Command | What it shows |
|---|---|
| `/about` | Who I am |
| `/research` | Research statement and questions, then every thread latest first (each linking out to its GitHub / Hugging Face / paper / post), data, methods and tools - with a persistent contact strip. No sub-pages |
| `/work` | A timeline of roles (plus breaks), side projects, every skill with where it comes from, and education - each entry complete on the page, linking out to the company/code and related posts - with a persistent contact strip. No sub-pages |
| `/blog` | Essays since 2021, filterable by research / work / life |
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
  site.json               tagline, nav, availability tags, contact, "now" line, home "where to go" guide
  pages/<name>.md         one command + URL each (fun: true puts it under /fun)
  projects/<slug>.md      entries on /work (side: true puts them under side projects); _intro/_outro around the list
  timeline.json           /work timeline entries that aren't projects (the research role, breaks)
  skills.json             /work skills index: each skill with evidence (a project slug, a page, or research/<slug>)
  research/<slug>.md      entries on /research, latest first; _intro (statement + questions) and _outro
  experiments.json        the experiment log, listed under each research thread
  research-data.json      /research data section (same shape as skills.json)
  research-methods.json   /research methods section (same shape as skills.json)
  research-tools.json     /research tools section ({ group, collapsed?, tools: [{ name, note?, href? }] })
  blog/<slug>.md          /blog and /blog/<slug>; category: research | work | life
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

# projects/<slug>.md  (no page of its own; everything shows on /work)
title: kakashi.ai
cluster: Vision AI
status: Beta 1 complete            # Active | Past | Acquired | Prototype | ...
year: "2026"
period: Oct 2025 – 2026            # optional, shown instead of year
role: Founder & Engineer           # optional
summary: One sentence.
combines: [jiu-jitsu, vision AI]   # optional, shown as "jiu-jitsu × vision AI"
highlights: ["What I did, concretely"]   # optional bullets
metrics: [{ value: "377", label: beta users }]   # optional; quote the value
stack: [Gemini, React]             # optional
links: [{ label: kakashi.ai, href: https://kakashi.ai }]   # GitHub/HF links render as logos
posts: [shipping-kakashi]          # optional related blog posts
side: true                         # optional: list under side projects
order: 1                           # optional, lower first

# research/<slug>.md  (no page of its own; an entry on /research)
title: Engagement in 3D
date: 2026-10-01                   # sort key (latest first)
period: Oct 2026 – now             # optional, shown instead of the date
kind: ongoing                      # paper | experiment | ongoing
status: current                    # current | accepted | completed | superseded
venue: CAISc 2026                  # optional
venue_note: One line of context    # optional
short_title: For tight spots       # optional (home page)
question: The question it asked.
finding: One or two lines on what it found.
led_to: What it set up next.
summary: One sentence (search previews, llms.txt).
metrics: [{ value: "11.2 → 3.2 cm", label: distance, held out }]
links: [{ label: code, href: https://github.com/... }]   # first link is where skills point
post: leg-spaghetti                # optional related post (or posts: [a, b])
bibtex: |                          # optional, enables a BibTeX button
  @inproceedings{...}

# blog/<slug>.md
title: Essay title
date: 2026-09-27
category: research                 # research | work | life (adds a filter)
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
