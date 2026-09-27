// Every piece of content has a URL, and every URL maps to the command that renders it.
// Both the server (static params, metadata, sitemap) and the terminal (pushState, popstate,
// link interception) use this one table, so they can never disagree.

import type { SiteData } from "./site-types"

export interface Route {
  path: string
  /** Canonical command input that renders this route, e.g. "open graicie". */
  input: string
  title: string
  description: string
}

/** Command names implemented in code; content pages cannot reuse them. */
export const RESERVED_COMMANDS = [
  "work",
  "projects",
  "writing",
  "log",
  "logs",
  "whativedone",
  "open",
  "cat",
  "help",
  "search",
  "ls",
  "history",
  "alias",
  "theme",
  "clear",
  "share",
]

export function getRoutes(data: SiteData): Route[] {
  return [
    ...data.pages.map((page) => ({
      path: `/${page.name}`,
      input: page.name,
      title: page.title,
      description: page.description,
    })),
    { path: "/work", input: "work", title: "Work", description: "Current projects and portfolio" },
    ...data.projects.map((project) => ({
      path: `/work/${project.slug}`,
      input: `open ${project.slug}`,
      title: project.title,
      description: project.summary,
    })),
    { path: "/writing", input: "writing", title: "Writing", description: "Essays and short meditations" },
    ...data.posts.map((post) => ({
      path: `/writing/${post.slug}`,
      input: `open ${post.slug}`,
      title: post.title,
      description: post.excerpt,
    })),
    { path: "/log", input: "log", title: "Log", description: "What I've been doing, week by week" },
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
