// Serializable content shapes shared by the server loader and the client terminal.

export interface SiteConfig {
  name: string
  url: string
  author: string
  tagline: string
  description: string
  twitter: string
  /** Commands shown as the primary navigation, in order. */
  nav: string[]
  /** Mobile quick-action chips shown before any command has run. */
  quickActions: string[]
  /** Display order for project clusters on /work. Unlisted clusters follow. */
  projectClusters: string[]
  secrets: {
    /** Number of distinct commands a visitor runs before secret hints appear in help. */
    hintsAfter: number
    hints: Array<{ hint: string; command: string }>
  }
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
  /** Suggested follow-up commands (mobile chips). */
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
  html: string
  text: string
}

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  html: string
  text: string
  raw: string
}

export interface LogEntry {
  date: string
  html: string
  text: string
}

export interface SiteData {
  config: SiteConfig
  pages: Page[]
  projects: Project[]
  posts: Post[]
  logs: LogEntry[]
}
