// Serializable content shapes shared by the server loader and the client terminal.

export interface SiteConfig {
  name: string
  url: string
  author: string
  tagline: string
  description: string
  twitter: string
  /** Main commands, in slash-menu and home-screen order. */
  nav: string[]
  /** One or two sentences on what I'm doing right now, shown on the home screen. */
  now: string
  /** Contact links shown in the persistent contact strip on /research and /work. */
  contact: { email: string; calendar: string; linkedin: string }
  /** Display order for project clusters on /work. Unlisted clusters follow. */
  projectClusters: string[]
  /** Short status tags on the home page, e.g. "open to research", each linking to a command. */
  availability: Array<{ label: string; command: string }>
  /** One line per section for the home page's "where to go" list, keyed by command name. */
  guide?: Record<string, string>
  /** Profile URLs elsewhere (GitHub, LinkedIn, X...), for search engines' structured data. */
  profiles?: string[]
}

export interface Link {
  label: string
  href: string
}

export interface Page {
  name: string
  title: string
  description: string
  /** Longer description for search results and link previews; falls back to description. */
  seo?: string
  aliases: string[]
  /** Fun pages (/music, /bjj, /camera) join the menu once /fun has been run. */
  fun: boolean
  /** Emoji shown for fun pages in the fun row. */
  emoji?: string
  /** Suggested follow-up commands. */
  next: string[]
  updated?: string
  html: string
  text: string
  /** The Markdown source, for plain-text outputs like /llms-full.txt. */
  raw: string
}

export interface Metric {
  value: string
  label: string
}

/** A skill and where it was actually used. `where` is a project slug, a page name, "research" or "research/<slug>". */
export interface Skill {
  name: string
  evidence: Array<{ where: string; note: string }>
}

export interface Tool {
  name: string
  /** One line on what it was used for or what I found. */
  note?: string
  href?: string
}

export interface ToolGroup {
  group: string
  /** Fold the group behind a "show" toggle (for long reading lists). */
  collapsed?: boolean
  tools: Tool[]
}

/** One experiment; the log lists them under their thread, in file order. */
export interface Experiment {
  title: string
  result: string
  /** The research thread (content/research/<slug>.md) it belongs to. */
  thread: string
}

export interface SkillGroup {
  group: string
  skills: Skill[]
}

/**
 * A /work timeline entry that isn't a project page: a role that lives elsewhere on the site
 * (independent research → /research) or a stretch between jobs (the mats → /bjj).
 */
export interface TimelineEntry {
  title: string
  period: string
  summary: string
  /** "role" draws like a job; "break" is quieter. */
  kind: "role" | "break"
  /** Command it links to, e.g. "/research". */
  command?: string
  combines: string[]
  /** Sorts among projects by their `order`. */
  order: number
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
  /** The disciplines this work brought together, e.g. ["jiu-jitsu", "vision AI"]. */
  combines: string[]
  /** Headline numbers, shown as a row on the project page and inline on /work. */
  metrics: Metric[]
  /** Built alongside the main work; listed separately on /work. */
  side: boolean
  /** A few concrete lines on what I did, shown under the entry on /work. */
  highlights: string[]
  /** Slugs of blog posts about this work. */
  posts: string[]
  html: string
  text: string
  /** The Markdown source, for plain-text outputs like /llms-full.txt. */
  raw: string
}

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  /** Optional grouping, e.g. "research"; gets its own /blog/<category> page. */
  category?: string
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
  /** Short headline results, shown on the /research card. */
  highlights: string[]
  /** Shown instead of the date when the work spans time, e.g. "Aug – Oct 2026". */
  period?: string
  /** published | current | completed | superseded */
  status?: string
  /** A short name for tight spots like the home page (YAML: short_title). */
  shortTitle?: string
  /** The question this piece of work asked. */
  question?: string
  /** One line on what it found. */
  finding?: string
  /** What the result led to next (YAML: led_to). */
  ledTo?: string
  /** Slugs of blog posts about this work (YAML: post, or posts as a list). */
  posts: string[]
  /** One line of context on the venue, e.g. what kind of conference it is (YAML: venue_note). */
  venueNote?: string
  metrics: Metric[]
  html: string
  text: string
  /** The Markdown source, for plain-text outputs like /llms-full.txt. */
  raw: string
}

export interface Photo {
  /** Path under public/, e.g. /photos/palms.jpg (web-sized, metadata stripped). */
  src: string
  width: number
  height: number
  alt: string
  caption?: string
}

export interface Track {
  artist: string
  title: string
  /** YouTube video id (official artist, "Topic" or VEVO upload), played through YouTube's embed. */
  youtube: string
  /** Where it comes from: a record on the shelf, a band seen live, or both. */
  source: "vinyl" | "live" | "both"
}

export interface Fight {
  event: string
  date: string
  location?: string
  wins: number
  losses: number
  note: string
  /** Blog slug with the story, if any. */
  essay?: string
}

export interface VinylRecord {
  artist: string | null
  album: string
  genre: string
  note?: string | null
}

export interface LogEntry {
  date: string
  /** First line/bullet, used in previews. */
  summary: string
  html: string
  text: string
  /** The Markdown source, for plain-text outputs like /llms-full.txt. */
  raw: string
}

export interface SiteData {
  config: SiteConfig
  pages: Page[]
  projects: Project[]
  posts: Post[]
  research: ResearchItem[]
  logs: LogEntry[]
  photos: Photo[]
  playlist: Track[]
  fights: Fight[]
  gigs: string[]
  records: VinylRecord[]
  /** content/skills.json: skills grouped, each with evidence. */
  skills: SkillGroup[]
  /** content/timeline.json: /work timeline entries that aren't project pages. */
  timeline: TimelineEntry[]
  /** content/research-data.json: data worked with and built, each with where it was used. */
  researchData: SkillGroup[]
  /** content/research-methods.json: methods and models, each with where it was used. */
  researchMethods: SkillGroup[]
  /** content/research-tools.json: every tool tested or read, grouped. */
  researchTools: ToolGroup[]
  /** content/experiments.json: the experiment log, in the order they were run. */
  experiments: Experiment[]
  /** Optional text from content/<collection>/_intro.md (above) and _outro.md (below). */
  intros: { work: string; blog: string; research: string }
  outros: { work: string; blog: string; research: string }
  /** Markdown source of the intros and outros, for plain-text outputs. */
  notes: { workIntro: string; workOutro: string; researchIntro: string; researchOutro: string }
}
