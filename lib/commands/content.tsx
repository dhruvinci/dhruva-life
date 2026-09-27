import type React from "react"
import { CommandLink } from "@/components/terminal/command-link"
import { Markdown } from "@/components/terminal/markdown"
import type { Page, Post, Project, SiteData } from "@/lib/site-types"
import type { Command, CommandSection } from "./types"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Formatted by hand so server and client render identical text regardless of locale.
export function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number)
  return `${MONTHS[month - 1]} ${day}, ${year}`
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-accent font-semibold text-lg">{children}</h2>
}

function StatusBadge({ status }: { status: string }) {
  const active = status === "Active" || status === "Concept"
  return (
    <span className={`text-xs px-2 py-0.5 rounded ${active ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  )
}

function ExternalLinks({ links }: { links: Project["links"] }) {
  if (links.length === 0) return null
  return (
    <div className="flex flex-wrap gap-3 text-sm">
      {links.map((link) => (
        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          {link.label} ↗
        </a>
      ))}
    </div>
  )
}

function PageView({ page }: { page: Page }) {
  return (
    <article className="space-y-4">
      <Heading>{page.title}</Heading>
      {page.updated && <p className="text-muted-foreground text-xs">Updated {formatDate(page.updated)}</p>}
      <Markdown html={page.html} />
    </article>
  )
}

function WorkView({ data }: { data: SiteData }) {
  const clusters = [
    ...data.config.projectClusters,
    ...data.projects.map((project) => project.cluster).filter((cluster) => !data.config.projectClusters.includes(cluster)),
  ].filter((cluster, index, all) => all.indexOf(cluster) === index)

  return (
    <div className="space-y-6">
      <Heading>Work</Heading>
      {clusters.map((cluster) => {
        const projects = data.projects.filter((project) => project.cluster === cluster)
        if (projects.length === 0) return null
        return (
          <section key={cluster} className="space-y-3">
            <h3 className="text-muted-foreground text-xs uppercase tracking-wide">{cluster}</h3>
            {projects.map((project) => (
              <div key={project.slug} className="border-l-2 border-border pl-4">
                <div className="flex flex-wrap items-center gap-2">
                  <CommandLink command={`open ${project.slug}`} className="text-foreground font-medium hover:text-accent hover:underline">
                    {project.title}
                  </CommandLink>
                  <span className="text-muted-foreground text-xs">{project.year}</span>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-muted-foreground mt-1">{project.summary}</p>
              </div>
            ))}
          </section>
        )
      })}
    </div>
  )
}

function ProjectView({ project }: { project: Project }) {
  return (
    <article className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Heading>{project.title}</Heading>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{project.cluster}</span>
        <StatusBadge status={project.status} />
      </div>
      <p className="text-muted-foreground text-xs">{project.year}</p>
      <p>{project.summary}</p>
      {project.html && <Markdown html={project.html} />}
      <ExternalLinks links={project.links} />
      <p className="text-sm">
        <CommandLink command="work">← all work</CommandLink>
      </p>
    </article>
  )
}

function WritingView({ data }: { data: SiteData }) {
  return (
    <div className="space-y-4">
      <Heading>Writing</Heading>
      {data.posts.map((post) => (
        <div key={post.slug} className="border-l-2 border-border pl-4">
          <CommandLink command={`open ${post.slug}`} className="text-foreground font-medium hover:text-accent hover:underline">
            {post.title}
          </CommandLink>
          <p className="text-muted-foreground mt-1">{post.excerpt}</p>
          <p className="text-muted-foreground text-xs mt-1">{formatDate(post.date)}</p>
        </div>
      ))}
    </div>
  )
}

function PostView({ post }: { post: Post }) {
  return (
    <article className="space-y-4">
      <Heading>{post.title}</Heading>
      <p className="text-muted-foreground text-xs">{formatDate(post.date)}</p>
      <Markdown html={post.html} />
      <p className="text-sm">
        <CommandLink command="writing">← all writing</CommandLink>
      </p>
    </article>
  )
}

function LogView({ data }: { data: SiteData }) {
  return (
    <div className="space-y-5">
      <Heading>Log</Heading>
      {data.logs.map((entry) => (
        <section key={entry.date} className="border-l-2 border-border pl-4 space-y-2">
          <h3 className="text-accent font-medium">{formatDate(entry.date)}</h3>
          <Markdown html={entry.html} />
        </section>
      ))}
    </div>
  )
}

export function createContentCommands(data: SiteData): Command[] {
  const sectionFor = (name: string): CommandSection => (data.config.nav.includes(name) ? "explore" : "more")
  const slugs = () => [...data.projects.map((project) => project.slug), ...data.posts.map((post) => post.slug)]

  const pageCommands: Command[] = data.pages.map((page) => ({
    name: page.name,
    description: page.description,
    aliases: page.aliases,
    section: sectionFor(page.name),
    run: () => ({ title: page.title, next: page.next, content: <PageView page={page} /> }),
  }))

  return [
    ...pageCommands,
    {
      name: "work",
      description: "Current projects and portfolio",
      aliases: ["projects"],
      section: sectionFor("work"),
      run: () => ({
        title: "Work",
        next: data.projects.slice(0, 2).map((project) => `open ${project.slug}`).concat("writing"),
        content: <WorkView data={data} />,
      }),
    },
    {
      name: "writing",
      description: "Essays and short meditations",
      section: sectionFor("writing"),
      run: () => ({
        title: "Writing",
        next: data.posts.slice(0, 2).map((post) => `open ${post.slug}`).concat("work"),
        content: <WritingView data={data} />,
      }),
    },
    {
      name: "log",
      description: "What I've been doing, week by week",
      aliases: ["logs", "whativedone"],
      section: sectionFor("log"),
      run: () => ({ title: "Log", next: ["now", "work"], content: <LogView data={data} /> }),
    },
    {
      name: "open",
      description: "Open a project, post, or page",
      usage: "open <slug>",
      section: "utility",
      complete: () => slugs(),
      run: (args) => {
        const slug = args[0]?.toLowerCase()
        if (!slug) return { tone: "error", content: "Usage: open <slug>. Try work or writing to see what's there." }

        const project = data.projects.find((item) => item.slug === slug)
        if (project) return { title: project.title, next: ["work", "contact"], content: <ProjectView project={project} /> }

        const post = data.posts.find((item) => item.slug === slug)
        if (post) return { title: post.title, next: ["writing", "work"], content: <PostView post={post} /> }

        const page = data.pages.find((item) => item.name === slug)
        if (page) return { title: page.title, next: page.next, content: <PageView page={page} /> }

        return { tone: "error", content: `Nothing called "${slug}". Try work or writing to see what's there.` }
      },
    },
    {
      name: "cat",
      description: "Print a post's raw Markdown",
      usage: "cat <slug>",
      section: "utility",
      complete: () => data.posts.map((post) => post.slug),
      run: (args) => {
        const post = data.posts.find((item) => item.slug === args[0]?.toLowerCase())
        if (!post) return { tone: "error", content: args[0] ? `File not found: ${args[0]}` : "Usage: cat <slug>" }
        return {
          content: (
            <pre className="whitespace-pre-wrap text-muted-foreground">
              {`---\ntitle: ${post.title}\ndate: ${post.date}\nexcerpt: ${post.excerpt}\n---\n\n${post.raw}`}
            </pre>
          ),
        }
      },
    },
  ]
}
