---
name: content-update
description: Add or edit site content in content/ (log entries, posts, projects, pages, the now page) and publish it. Use when asked to "add a log entry", "post this", "update now", or publish content.
---

Content lives only in `content/` as Markdown with YAML frontmatter, plus `content/site.json`. See README.md for the frontmatter reference.

1. Edit or create the file under `content/` (use `pnpm new ...` for new files).
2. Use `draft: true` for anything not ready to publish; it only appears in `pnpm dev`.
3. For `content/pages/now.md`, also bump `updated:` to today's date.
4. Run `pnpm build`. `lib/content.ts` validates every file and fails with `content/<file>: <problem>` on bad input.
5. Commit and push to `main` if the user asked to publish.

Never invent biographical facts, links, or numbers; ask.
