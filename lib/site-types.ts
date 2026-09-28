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
  /** Short headline results, shown on the /research card. */
  highlights: string[]
  html: string
  text: string
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
  /** Optional text from content/<collection>/_intro.md (above) and _outro.md (below). */
  intros: { work: string; blog: string; research: string }
  outros: { work: string; blog: string; research: string }
}
