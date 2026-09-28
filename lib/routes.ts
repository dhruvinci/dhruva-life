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
      description: `Research by ${author} on vision-language models and human movement: a CAISc 2026 paper on faithful movement understanding, plus ongoing experiments.`,
      kind: "index",
    },
    ...data.research.map((item): Route => ({
      path: `/research/${item.slug}`,
      input: `/research ${item.slug}`,
      title: item.title,
      description: item.summary,
      kind: "research",
      date: item.date,
      eyebrow: [item.kind === "paper" ? "Paper" : item.kind === "ongoing" ? "Ongoing research" : "Experiment", item.venue ?? formatDate(item.date)].join(" · "),
    })),
    {
      path: "/work",
      input: "/work",
      title: "Work",
      description: `What ${author} has built: kakashi.ai, Zopu.ai, Dehidden (acquired by Polygon), PwC and pushit.tv, most recent first.`,
      kind: "index",
    },
    ...data.projects.map((project): Route => ({
      path: `/work/${project.slug}`,
      input: `/work ${project.slug}`,
      title: project.title,
      description: project.summary,
      kind: "project",
      eyebrow: [project.role ?? project.cluster, project.period ?? project.year].join(" · "),
    })),
    {
      path: "/blog",
      input: "/blog",
      title: "Blog",
      description: `${data.posts.length} essays by ${author} on vision AI, building startups, jiu-jitsu and music, written since 2021.`,
      kind: "index",
    },
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
