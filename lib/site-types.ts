// Serializable content shapes shared by the server loader and the client terminal.

export interface SiteConfig {
  name: string
  url: string
  author: string
  tagline: string
  description: string
  twitter: string
  /** Order of commands in the slash menu and /help. */
  nav: string[]
  /** Suggested commands shown under /help output. */
  quickActions: string[]
  /** Display order for project clusters on /work. Unlisted clusters follow. */
  projectClusters: string[]
  /** Short status tags on the home page, e.g. "open to research", each linking to a command. */
  availability: Array<{ label: string; command: string }>
}

export interface Link {
  label: string
  href: string
}

export interface Page {
  name: string
  title: string
  description: string
  aliases: string[]
  /** false keeps the page reachable by URL but out of the slash menu (e.g. /music). */
  listed: boolean
  /** Suggested follow-up commands. */
  next: string[]
  updated?: string
  html: string
  text: string
}

export interface Project {
  slug: string
  title: string
  cluster: string
  status: string
  year: string
  summary: string
  links: Link[]
  order: number
  /** Optional case-study details, shown on the project page when present. */
  role?: string
  period?: string
  stack: string[]
  /** Image under public/, e.g. /images/graicie.png */
  cover?: string
  html: string
  text: string
}

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  /** Estimated reading time in minutes. */
  minutes: number
  html: string
  text: string
  raw: string
}

export interface ResearchItem {
  slug: string
  title: string
  date: string
  /** paper | experiment | ongoing | note — shown as a tag. */
  kind: string
  venue?: string
  summary: string
  links: Link[]
  bibtex?: string
  html: string
  text: string
}

export interface LogEntry {
  date: string
  /** First line/bullet, used in previews. */
  summary: string
  html: string
  text: string
}

export interface SiteData {
  config: SiteConfig
  pages: Page[]
  projects: Project[]
  posts: Post[]
  research: ResearchItem[]
  logs: LogEntry[]
  /** Optional intro text from content/<collection>/_intro.md. */
  intros: { work: string; writing: string; research: string }
}
