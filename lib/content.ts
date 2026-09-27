// Server-only: reads content/ at build time and turns it into SiteData.
// Every Markdown file is validated here so a typo fails the build with a clear message
// instead of shipping a broken page.

import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { Marked } from "marked"
import type { LogEntry, Page, Post, Project, SiteConfig, SiteData } from "./site-types"
import { RESERVED_COMMANDS } from "./routes"

const CONTENT_DIR = path.join(process.cwd(), "content")
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const markdown = new Marked({
  gfm: true,
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens)
      const external = /^https?:\/\//.test(href)
      const attrs = [
        `href="${href}"`,
        title ? `title="${title}"` : "",
        external ? 'target="_blank" rel="noopener noreferrer"' : "",
      ]
      return `<a ${attrs.filter(Boolean).join(" ")}>${text}</a>`
    },
  },
})

class ContentError extends Error {
  constructor(file: string, message: string) {
    super(`content/${file}: ${message}`)
  }
}

function readDir(dir: string) {
  const full = path.join(CONTENT_DIR, dir)
  if (!fs.existsSync(full)) return []

  return fs
    .readdirSync(full)
    .filter((file) => file.endsWith(".md"))
    .sort()
    .map((file) => {
      const relative = `${dir}/${file}`
      const slug = file.replace(/\.md$/, "")
      if (!SLUG_PATTERN.test(slug)) {
        throw new ContentError(relative, `file name must be lowercase-with-dashes (got "${slug}")`)
      }
      const { data, content } = matter(fs.readFileSync(path.join(full, file), "utf8"))
      return { file: relative, slug, data: data as Record<string, unknown>, body: content.trim() }
    })
    // `draft: true` files show up in `pnpm dev` but are left out of production builds.
    .filter((entry) => !(entry.data.draft === true && process.env.NODE_ENV === "production"))
}

function renderMarkdown(body: string) {
  return markdown.parse(body, { async: false })
}

function plainText(body: string) {
  return body
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*(?:[-*+]|\d+\.|#+|>)\s+/gm, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

/** First line of a Markdown body as plain text, e.g. the first bullet of a log entry. */
function firstLine(body: string) {
  const line = body.split("\n").find((candidate) => plainText(candidate).length > 0) ?? ""
  return plainText(line)
}

function hasBody(body: string) {
  return plainText(body).length > 0
}

// YAML turns bare dates into Date objects; normalize everything to YYYY-MM-DD strings.
function toDateString(value: unknown, file: string, field: string) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  throw new ContentError(file, `"${field}" must be a date like 2026-01-31`)
}

function requireString(data: Record<string, unknown>, field: string, file: string) {
  const value = data[field]
  if (typeof value === "number") return String(value)
  if (typeof value !== "string" || !value.trim()) throw new ContentError(file, `missing "${field}"`)
  return value.trim()
}

function optionalString(data: Record<string, unknown>, field: string, file: string) {
  const value = data[field]
  if (value === undefined) return undefined
  if (typeof value === "number") return String(value)
  if (typeof value !== "string") throw new ContentError(file, `"${field}" must be text`)
  return value
}

function optionalStringList(data: Record<string, unknown>, field: string, file: string) {
  const value = data[field]
  if (value === undefined) return []
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new ContentError(file, `"${field}" must be a list like [work, writing]`)
  }
  return value as string[]
}

function loadPages(): Page[] {
  return readDir("pages").map(({ file, slug, data, body }) => {
    if (RESERVED_COMMANDS.includes(slug)) {
      throw new ContentError(file, `"${slug}" is a built-in command; rename the file`)
    }
    return {
      name: slug,
      title: requireString(data, "title", file),
      description: requireString(data, "description", file),
      aliases: optionalStringList(data, "aliases", file),
      next: optionalStringList(data, "next", file),
      updated: data.updated === undefined ? undefined : toDateString(data.updated, file, "updated"),
      html: renderMarkdown(body),
      text: plainText(body),
    }
  })
}

function loadProjects(): Project[] {
  return readDir("projects")
    .map(({ file, slug, data, body }) => {
      const links = data.links ?? []
      if (
        !Array.isArray(links) ||
        links.some((link) => typeof link?.label !== "string" || typeof link?.href !== "string")
      ) {
        throw new ContentError(file, `"links" must be a list of { label, href }`)
      }
      return {
        slug,
        title: requireString(data, "title", file),
        cluster: requireString(data, "cluster", file),
        status: requireString(data, "status", file),
        year: requireString(data, "year", file),
        summary: requireString(data, "summary", file),
        links,
        order: typeof data.order === "number" ? data.order : 999,
        role: optionalString(data, "role", file),
        period: optionalString(data, "period", file),
        stack: optionalStringList(data, "stack", file),
        cover: optionalString(data, "cover", file),
        html: hasBody(body) ? renderMarkdown(body) : "",
        text: plainText(body),
      }
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
}

function loadPosts(): Post[] {
  return readDir("writing")
    .map(({ file, slug, data, body }) => ({
      slug,
      title: requireString(data, "title", file),
      date: toDateString(data.date, file, "date"),
      excerpt: typeof data.excerpt === "string" ? data.excerpt : plainText(body).slice(0, 140),
      html: renderMarkdown(body),
      text: plainText(body),
      raw: body,
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}

function loadLogs(): LogEntry[] {
  return readDir("log")
    .map(({ file, slug, body }) => ({
      date: toDateString(slug, file, "file name"),
      summary: firstLine(body),
      html: renderMarkdown(body),
      text: plainText(body),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}

function loadConfig(): SiteConfig {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "site.json"), "utf8")) as SiteConfig
}

let cached: SiteData | undefined

export function getSiteData(): SiteData {
  if (cached && process.env.NODE_ENV === "production") return cached

  cached = {
    config: loadConfig(),
    pages: loadPages(),
    projects: loadProjects(),
    posts: loadPosts(),
    logs: loadLogs(),
  }
  return cached
}
