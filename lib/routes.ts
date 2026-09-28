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
export const RESERVED_COMMANDS = ["work", "blog", "research", "fun", "theme"]

export function getRoutes(data: SiteData): Route[] {
  return [
    ...data.pages.map((page) => ({
      path: `/${page.name}`,
      input: `/${page.name}`,
      title: page.title,
      description: page.description,
    })),
    { path: "/research", input: "/research", title: "Research", description: "Papers, experiments, and open questions" },
    ...data.research.map((item) => ({
      path: `/research/${item.slug}`,
      input: `/research ${item.slug}`,
      title: item.title,
      description: item.summary,
    })),
    { path: "/work", input: "/work", title: "Work", description: "What I've built, most recent first" },
    ...data.projects.map((project) => ({
      path: `/work/${project.slug}`,
      input: `/work ${project.slug}`,
      title: project.title,
      description: project.summary,
    })),
    { path: "/blog", input: "/blog", title: "Blog", description: "Essays, one or more a quarter since 2021" },
    ...data.posts.map((post) => ({
      path: `/blog/${post.slug}`,
      input: `/blog ${post.slug}`,
      title: post.title,
      description: post.excerpt,
    })),
    { path: "/fun", input: "/fun", title: "Fun", description: "Music, jiu-jitsu, photos and themes" },
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
