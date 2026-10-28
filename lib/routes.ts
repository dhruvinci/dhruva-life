// Every piece of content has a URL, and every URL maps to the command that renders it.
// Both the server (static params, metadata, sitemap) and the terminal (pushState, popstate,
// link interception) use this one table, so they can never disagree.

import type { SiteData } from "./site-types"

export interface Route {
  path: string
  /** Canonical command input that renders this route, e.g. "open graicie". */
  input: string
  title: string
  /** Used for search results and link previews. */
  description: string
  /** What sort of page this is; decides structured data and preview type. */
  kind: "page" | "index" | "post" | "research" | "project"
  /** Publication date (YYYY-MM-DD), for posts and research. */
  date?: string
  /** Small label on the social card, e.g. "Essay · 12 Mar 2026". */
  eyebrow?: string
}

/** Command names implemented in code; content pages cannot reuse them. */
export const RESERVED_COMMANDS = ["work", "blog", "research", "fun", "theme"]

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/** Post categories in first-seen order (posts are newest first). */
/** Blog categories in a fixed order (research, work, life), then any others alphabetically. */
const CATEGORY_ORDER = ["research", "work", "life"]

export function blogCategories(data: SiteData) {
  const found = [...new Set(data.posts.flatMap((post) => (post.category ? [post.category] : [])))]
  const rank = (name: string) => (CATEGORY_ORDER.includes(name) ? CATEGORY_ORDER.indexOf(name) : CATEGORY_ORDER.length)
  return found.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
}

export function getRoutes(data: SiteData): Route[] {
  const { author } = data.config
  return [
    ...data.pages.map((page): Route => ({
      path: `/${page.name}`,
      input: `/${page.name}`,
      title: page.title,
      description: page.seo ?? page.description,
      kind: "page",
    })),
    {
      path: "/research",
      input: "/research",
      title: "Research",
      description: `Research by ${author} on how machines understand two people in contact: a CAISc 2026 paper on faithful movement understanding, and current work measuring engagement in 3D from video.`,
      kind: "index",
    },
    {
      path: "/work",
      input: "/work",
      title: "Work",
      description: `What ${author} has built: kakashi.ai, Zopu.ai, Dehidden (acquired by Polygon, now part of Layer-E), PwC and pushit.tv, most recent first.`,
      kind: "index",
    },
    {
      path: "/blog",
      input: "/blog",
      title: "Blog",
      description: `${data.posts.length} essays by ${author} on vision AI, building startups, jiu-jitsu and music, written since 2021.`,
      kind: "index",
    },
    ...blogCategories(data).map((category): Route => ({
      path: `/blog/${category}`,
      input: `/blog ${category}`,
      title: `Blog · ${category}`,
      description: `${capitalize(category)} essays by ${author}.`,
      kind: "index",
    })),
    ...data.posts.map((post): Route => ({
      path: `/blog/${post.slug}`,
      input: `/blog ${post.slug}`,
      title: post.title,
      description: post.excerpt,
      kind: "post",
      date: post.date,
      eyebrow: `Essay · ${formatDate(post.date)} · ${post.minutes} min read`,
    })),
    {
      path: "/fun",
      input: "/fun",
      title: "Fun",
      description: `Music, jiu-jitsu and photography: what ${author} does outside work, plus themes for this site.`,
      kind: "index",
    },
  ]
}

function normalizePath(path: string) {
  const trimmed = path.replace(/\/+$/, "")
  return trimmed === "" ? "/" : trimmed.toLowerCase()
}

export function routeForPath(data: SiteData, path: string) {
  const normalized = normalizePath(path)
  return getRoutes(data).find((route) => route.path === normalized)
}

export function routeForInput(data: SiteData, canonicalInput: string) {
  return getRoutes(data).find((route) => route.input === canonicalInput)
}

/** Where "back" goes from a page: its index (/blog/x → /blog), /fun for fun pages, otherwise home. */
export function parentOf(data: SiteData, path?: string): { path: string; label: string } {
  const segments = (path ?? "/").split("/").filter(Boolean)
  if (segments.length >= 2) {
    const index = routeForPath(data, `/${segments[0]}`)
    if (index) return { path: index.path, label: index.title.toLowerCase() }
  }
  if (segments.length === 1 && data.pages.some((page) => page.fun && page.name === segments[0])) return { path: "/fun", label: "fun" }
  return { path: "/", label: "home" }
}

/**
 * Where a skill's evidence points: a terminal command for site pages ("/research"), or a URL -
 * work and research entries link out (company site, GitHub, Hugging Face) rather than to sub-pages.
 * Undefined if it names nothing.
 */
export function evidenceTarget(data: SiteData, where: string) {
  const [first, second] = where.split("/")
  if (!second) {
    const project = data.projects.find((entry) => entry.slug === first)
    if (project) return project.links[0]?.href ?? "/work"
    if (first === "research" || data.pages.some((page) => page.name === first)) return `/${first}`
    return undefined
  }
  if (first === "research") {
    const item = data.research.find((entry) => entry.slug === second)
    return item ? (item.links[0]?.href ?? "/research") : undefined
  }
  if (first === "blog" && data.posts.some((post) => post.slug === second)) return `/blog ${second}`
  return undefined
}
