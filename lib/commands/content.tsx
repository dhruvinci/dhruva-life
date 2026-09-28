import type React from "react"
import { CommandLink } from "@/components/terminal/command-link"
import { CopyButton } from "@/components/terminal/copy-button"
import { Markdown } from "@/components/terminal/markdown"
import type { Page, Post, Project, ResearchItem, SiteData } from "@/lib/site-types"
import type { Command, MenuItem } from "./types"

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
  return ["Archived", "Past", "Acquired"].includes(status) ? "muted" : "accent"
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

function PageView({ page, children }: { page: Page; children?: React.ReactNode }) {
  return (
    <article className="space-y-4">
      <Heading>{page.title}</Heading>
      {page.updated && <p className="text-muted-foreground text-xs">updated {formatDate(page.updated)}</p>}
      <Markdown html={page.html} />
      {children}
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
      {data.intros.work && <Markdown html={data.intros.work} />}
      {clusters.map((cluster) => {
        const projects = data.projects.filter((project) => project.cluster === cluster)
        if (projects.length === 0) return null
        return (
          <section key={cluster} className="space-y-4">
            <h3 className="text-ochre text-xs uppercase tracking-widest">{cluster}</h3>
            {projects.map((project) => (
              <div key={project.slug} className="group/item">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <CommandLink command={`/work ${project.slug}`} className="text-foreground font-medium hover:text-accent">
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
        items={data.projects.map((item) => ({ title: item.title, command: `/work ${item.slug}` }))}
        index={index}
        back={<CommandLink command="/work">all work</CommandLink>}
      />
    </article>
  )
}

function WritingView({ data }: { data: SiteData }) {
  const years = [...new Set(data.posts.map((post) => post.date.slice(0, 4)))]

  return (
    <div className="space-y-7">
      <Heading>Writing</Heading>
      {data.intros.writing && <Markdown html={data.intros.writing} />}
      {years.map((year) => (
        <section key={year} className="space-y-4">
          <h3 className="text-ochre text-xs uppercase tracking-widest">{year}</h3>
          {data.posts
            .filter((post) => post.date.startsWith(year))
            .map((post) => (
              <div key={post.slug} className="group/item">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <CommandLink command={`/writing ${post.slug}`} className="text-foreground font-medium hover:text-accent">
                    {post.title} <span className="text-muted-foreground group-hover/item:text-accent">→</span>
                  </CommandLink>
                  <Tag tone="muted">{formatDate(post.date)}</Tag>
                </div>
                <p className="text-muted-foreground mt-1 max-w-[65ch]">{post.excerpt}</p>
              </div>
            ))}
        </section>
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
        <Tag tone="muted">
          {formatDate(post.date)} · {post.minutes} min read
        </Tag>
        <Heading>{post.title}</Heading>
      </div>
      <Markdown html={post.html} />
      <Sequence
        items={data.posts.map((item) => ({ title: item.title, command: `/writing ${item.slug}` }))}
        index={index}
        back={<CommandLink command="/writing">all writing</CommandLink>}
      />
    </article>
  )
}

function RecentLog({ data }: { data: SiteData }) {
  if (data.logs.length === 0) return null
  return (
    <section className="space-y-4 pt-2">
      <h3 className="text-ochre text-xs uppercase tracking-widest">Recently</h3>
      {data.logs.map((entry) => (
        <div key={entry.date} className="grid sm:grid-cols-[7.5rem_1fr] gap-x-4 gap-y-1">
          <h4 className="text-olive text-sm">{formatDate(entry.date)}</h4>
          <Markdown html={entry.html} />
        </div>
      ))}
    </section>
  )
}

function ResearchView({ data }: { data: SiteData }) {
  return (
    <div className="space-y-6">
      <Heading>Research</Heading>
      {data.intros.research && <Markdown html={data.intros.research} />}
      <div className="space-y-5">
        {data.research.map((item) => (
          <div key={item.slug} className="group/item">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <Tag tone="accent">{item.kind}</Tag>
              <CommandLink command={`/research ${item.slug}`} className="text-foreground font-medium hover:text-accent">
                {item.title} <span className="text-muted-foreground group-hover/item:text-accent">→</span>
              </CommandLink>
            </div>
            <p className="text-muted-foreground mt-1 max-w-[65ch]">{item.summary}</p>
            <p className="text-muted-foreground text-xs mt-1">
              {[item.venue, formatDate(item.date)].filter(Boolean).join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResearchItemView({ item, data }: { item: ResearchItem; data: SiteData }) {
  const index = data.research.indexOf(item)
  return (
    <article className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-x-3">
          <Tag tone="accent">{item.kind}</Tag>
          {item.venue && <Tag>{item.venue}</Tag>}
          <Tag tone="muted">{formatDate(item.date)}</Tag>
        </div>
        <Heading>{item.title}</Heading>
        <p className="font-serif text-lg max-w-[65ch]">{item.summary}</p>
      </div>
      <ExternalLinks links={item.links} />
      {item.html && <Markdown html={item.html} />}
      {item.bibtex && (
        <p className="text-sm text-muted-foreground">
          <CopyButton text={item.bibtex} label="Copy BibTeX" />
        </p>
      )}
      <Sequence
        items={data.research.map((entry) => ({ title: entry.title, command: `/research ${entry.slug}` }))}
        index={index}
        back={<CommandLink command="/research">all research</CommandLink>}
      />
    </article>
  )
}

function notFound(kind: string, command: string, arg: string) {
  return {
    tone: "error" as const,
    content: (
      <p>
        No {kind} called &quot;{arg}&quot;. Type <span className="text-accent">/{command} </span> (with a space) to pick one.
      </p>
    ),
  }
}

const withSlash = (commands: string[]) => commands.map((command) => (command.startsWith("/") ? command : `/${command}`))

export function createContentCommands(data: SiteData): Command[] {
  const pageCommands: Command[] = data.pages.map((page) => ({
    name: page.name,
    description: page.description,
    aliases: page.aliases,
    hidden: !page.listed,
    run: () => ({
      title: page.title,
      next: withSlash(page.next),
      content: <PageView page={page}>{page.name === "now" && <RecentLog data={data} />}</PageView>,
    }),
  }))

  const researchItems = (): MenuItem[] =>
    data.research.map((item) => ({ value: `/research ${item.slug}`, label: item.title, description: item.kind }))
  const projectItems = (): MenuItem[] =>
    data.projects.map((project) => ({ value: `/work ${project.slug}`, label: project.title, description: project.period ?? project.year }))
  const postItems = (): MenuItem[] =>
    data.posts.map((post) => ({ value: `/writing ${post.slug}`, label: post.title, description: formatDate(post.date) }))

  return [
    ...pageCommands,
    {
      name: "research",
      description: "Papers, experiments, and open questions",
      aliases: ["papers"],
      complete: researchItems,
      run: (args) => {
        const slug = args[0]?.toLowerCase()
        if (!slug) {
          return {
            title: "Research",
            next: data.research.slice(0, 2).map((item) => `/research ${item.slug}`).concat("/work"),
            content: <ResearchView data={data} />,
          }
        }
        const item = data.research.find((entry) => entry.slug === slug)
        if (!item) return notFound("research entry", "research", slug)
        return { title: item.title, next: ["/research", "/work"], content: <ResearchItemView item={item} data={data} /> }
      },
    },
    {
      name: "work",
      description: "What I've built, most recent first",
      aliases: ["projects"],
      complete: projectItems,
      run: (args) => {
        const slug = args[0]?.toLowerCase()
        if (!slug) {
          return {
            title: "Work",
            next: data.projects.slice(0, 2).map((project) => `/work ${project.slug}`).concat("/research"),
            content: <WorkView data={data} />,
          }
        }
        const project = data.projects.find((entry) => entry.slug === slug)
        if (!project) return notFound("project", "work", slug)
        return { title: project.title, next: ["/work", "/contact"], content: <ProjectView project={project} data={data} /> }
      },
    },
    {
      name: "writing",
      description: "Essays, one or more a quarter since 2021",
      complete: postItems,
      run: (args) => {
        const slug = args[0]?.toLowerCase()
        if (!slug) {
          return {
            title: "Writing",
            next: data.posts.slice(0, 2).map((post) => `/writing ${post.slug}`).concat("/research"),
            content: <WritingView data={data} />,
          }
        }
        const post = data.posts.find((entry) => entry.slug === slug)
        if (!post) return notFound("essay", "writing", slug)
        return { title: post.title, next: ["/writing", "/research"], content: <PostView post={post} data={data} /> }
      },
    },
  ]
}
