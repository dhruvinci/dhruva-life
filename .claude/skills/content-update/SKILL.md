---
name: content-update
description: Add or edit site content in content/ (posts, projects, research, pages, playlist, photos, site.json) and publish it. Use when asked to "post this", "add a project", "update about", or publish content.
---

Content lives only in `content/` as Markdown with YAML frontmatter, plus `site.json`, `playlist.json` and `photos.json`. See README.md for the frontmatter reference.

1. Edit or create the file under `content/` (use `pnpm new post|project|page "Title"` for new files).
2. Use `draft: true` for anything not ready to publish; it only appears in `pnpm dev`.
3. Run `pnpm build`. `lib/content.ts` validates every file and fails with `content/<file>: <problem>` on bad input.
4. Stage only the files you changed (not `git add -A`), commit, and push to `main` if the user asked to publish.

Never invent biographical facts, links, or numbers; ask. Write essays in Dhruva's voice, not an AI's.
