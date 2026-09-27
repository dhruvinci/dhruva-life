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
  return <h2 className="text-foreground font-semibold text-xl leading-snug">{children}</h2>
}

/** Terminal-style tag, e.g. [AI]. */
function Tag({ children, tone = "ochre" }: { children: React.ReactNode; tone?: "ochre" | "muted" | "accent" }) {
  const toneClass = { ochre: "text-ochre", muted: "text-muted-foreground", accent: "text-accent" }[tone]
  return <span className={`text-xs ${toneClass}`}>[{children}]</span>
}

function statusTone(status: string) {
  return status === "Archived" ? "muted" : "accent"
}

function ExternalLinks({ links }: { links: Project["links"] }) {
  if (links.length === 0) return null
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {links.map((link) => (
        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
          {link.label} ↗
        </a>
      ))}
    </div>
  )
}

/** Previous/next links at the bottom of a post or project. */
function Sequence({ items, index, back }: { items: Array<{ title: string; command: string }>; index: number; back: React.ReactNode }) {
  const previous = items[index - 1]
  const next = items[index + 1]
  return (
    <nav aria-label="More" className="border-t border-border pt-4 mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
      <div>{previous && <CommandLink command={previous.command}>← {previous.title}</CommandLink>}</div>
      <div className="sm:text-center">{back}</div>
      <div className="sm:text-right">{next && <CommandLink command={next.command}>{next.title} →</CommandLink>}</div>
    </nav>
  )
}

function PageView({ page }: { page: Page }) {
  return (
    <article className="space-y-4">
      <Heading>{page.title}</Heading>
      {page.updated && <p className="text-muted-foreground text-xs">updated {formatDate(page.updated)}</p>}
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
    <div className="space-y-7">
      <Heading>Work</Heading>
      {clusters.map((cluster) => {
        const projects = data.projects.filter((project) => project.cluster === cluster)
        if (projects.length === 0) return null
        return (
          <section key={cluster} className="space-y-4">
            <h3 className="text-ochre text-xs uppercase tracking-widest">{cluster}</h3>
            {projects.map((project) => (
              <div key={project.slug} className="group/item">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <CommandLink command={`open ${project.slug}`} className="text-foreground font-medium hover:text-accent">
                    {project.title} <span className="text-muted-foreground group-hover/item:text-accent">→</span>
                  </CommandLink>
                  <Tag tone="muted">{project.period ?? project.year}</Tag>
                  <Tag tone={statusTone(project.status)}>{project.status.toLowerCase()}</Tag>
                </div>
                <p className="text-muted-foreground mt-1 max-w-[65ch]">{project.summary}</p>
              </div>
            ))}
          </section>
        )
      })}
    </div>
  )
}

function ProjectView({ project, data }: { project: Project; data: SiteData }) {
  const index = data.projects.indexOf(project)
  const facts = [
    ["role", project.role],
    ["when", project.period ?? project.year],
    ["stack", project.stack.join(", ")],
  ].filter(([, value]) => value)

  return (
    <article className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-x-3">
          <Tag>{project.cluster}</Tag>
          <Tag tone={statusTone(project.status)}>{project.status.toLowerCase()}</Tag>
        </div>
        <Heading>{project.title}</Heading>
        <p className="font-serif text-lg max-w-[65ch]">{project.summary}</p>
      </div>
      <dl className="grid grid-cols-[4.5rem_1fr] gap-x-3 gap-y-1 text-sm">
        {facts.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-muted-foreground">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {project.cover && (
        // eslint-disable-next-line @next/next/no-img-element -- static export-friendly, images live in public/
        <img src={project.cover} alt={`${project.title} screenshot`} className="rounded border border-border w-full" />
      )}
      {project.html && <Markdown html={project.html} />}
      <ExternalLinks links={project.links} />
      <Sequence
        items={data.projects.map((item) => ({ title: item.title, command: `open ${item.slug}` }))}
        index={index}
        back={<CommandLink command="work">all work</CommandLink>}
      />
    </article>
  )
}

function WritingView({ data }: { data: SiteData }) {
  return (
    <div className="space-y-5">
      <Heading>Writing</Heading>
      {data.posts.map((post) => (
        <div key={post.slug} className="group/item">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <CommandLink command={`open ${post.slug}`} className="text-foreground font-medium hover:text-accent">
              {post.title} <span className="text-muted-foreground group-hover/item:text-accent">→</span>
            </CommandLink>
            <Tag tone="muted">{formatDate(post.date)}</Tag>
          </div>
          <p className="text-muted-foreground mt-1 max-w-[65ch]">{post.excerpt}</p>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">
        <a href="/feed.xml" className="hover:text-accent">
          rss ↗
        </a>
      </p>
    </div>
  )
}

function PostView({ post, data }: { post: Post; data: SiteData }) {
  const index = data.posts.indexOf(post)
  return (
    <article className="space-y-5">
      <div className="space-y-2">
        <Tag tone="muted">{formatDate(post.date)}</Tag>
        <Heading>{post.title}</Heading>
      </div>
      <Markdown html={post.html} />
      <Sequence
        items={data.posts.map((item) => ({ title: item.title, command: `open ${item.slug}` }))}
        index={index}
        back={<CommandLink command="writing">all writing</CommandLink>}
      />
    </article>
  )
}

function LogView({ data }: { data: SiteData }) {
  return (
    <div className="space-y-6">
      <Heading>Log</Heading>
      {data.logs.map((entry) => (
        <section key={entry.date} className="grid sm:grid-cols-[7.5rem_1fr] gap-x-4 gap-y-1">
          <h3 className="text-olive text-sm">{formatDate(entry.date)}</h3>
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
        if (project) return { title: project.title, next: ["work", "contact"], content: <ProjectView project={project} data={data} /> }

        const post = data.posts.find((item) => item.slug === slug)
        if (post) return { title: post.title, next: ["writing", "work"], content: <PostView post={post} data={data} /> }

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
