#!/usr/bin/env node
// Scaffold new content with the right file name and frontmatter.
//
//   pnpm new log                     -> content/log/<today>.md
//   pnpm new post "My Title"         -> content/writing/my-title.md
//   pnpm new project "Project Name"  -> content/projects/project-name.md
//   pnpm new page "Title"            -> content/pages/title.md (new command + URL)

import fs from "node:fs"
import path from "node:path"

const [kind, ...titleParts] = process.argv.slice(2)
const title = titleParts.join(" ").trim()
const today = new Date().toISOString().slice(0, 10)
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const templates = {
  log: () => [`log/${today}.md`, `- \n`],
  post: () => [
    `writing/${slugify(title)}.md`,
    `---\ntitle: ${title}\ndate: ${today}\nexcerpt: One line that shows up in the writing list.\n---\n\nWrite here.\n`,
  ],
  project: () => [
    `projects/${slugify(title)}.md`,
    `---\ntitle: ${title}\ncluster: AI\nstatus: Active\nyear: "${today.slice(0, 4)}"\nsummary: One sentence about what it is.\nlinks:\n  - label: Site\n    href: https://example.com\n---\n\nOptional longer write-up.\n`,
  ],
  page: () => [
    `pages/${slugify(title)}.md`,
    `---\ntitle: ${title}\ndescription: Shown next to the command in help.\nnext: [about, work]\n---\n\nWrite here.\n`,
  ],
}

if (!templates[kind] || (kind !== "log" && !title)) {
  console.error('Usage: pnpm new <log | post "Title" | project "Title" | page "Title">')
  process.exit(1)
}

const [relative, body] = templates[kind]()
const file = path.join(process.cwd(), "content", relative)

if (fs.existsSync(file)) {
  console.log(`Already exists: content/${relative}`)
} else {
  fs.writeFileSync(file, body)
  console.log(`Created content/${relative}`)
}
