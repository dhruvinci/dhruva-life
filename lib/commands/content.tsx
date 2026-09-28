import type React from "react"
import { CommandLink } from "@/components/terminal/command-link"
import { CopyButton } from "@/components/terminal/copy-button"
import { FightRecord } from "@/components/fun/fight-record"
import { GigList } from "@/components/fun/gig-list"
import { RecordShelf } from "@/components/fun/record-shelf"
import { Gallery } from "@/components/terminal/gallery"
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

/**
 * A Markdown page. Extra content (fight record, gig list, gallery) goes where the page's
 * Markdown has <!-- slot -->, or at the end if there's no slot.
 */
function PageView({ page, children }: { page: Page; children?: React.ReactNode }) {
  const [before, after = ""] = page.html.split("<!-- slot -->")
  return (
    <article className="space-y-6">
      <Heading>{page.title}</Heading>
      {page.updated && <p className="text-muted-foreground text-xs">updated {formatDate(page.updated)}</p>}
      {before.trim() && <Markdown html={before} />}
      {children}
      {after.trim() && <Markdown html={after} />}
    </article>
  )
}

/** Components that some pages carry alongside their Markdown. */
function pageExtras(name: string, data: SiteData): React.ReactNode {
  if (name === "bjj") return <FightRecord fights={data.fights} />
  if (name === "camera") return <Gallery photos={data.photos} />
  if (name === "music") {
    return (
      <div className="space-y-12">
        <GigList gigs={data.gigs} />
        <RecordShelf records={data.records} />
      </div>
    )
  }
  return null
}

function WorkView({ data }: { data: SiteData }) {
  return (
    <div className="space-y-7">
      <Heading>Work</Heading>
      {data.intros.work && <Markdown html={data.intros.work} />}
      <ol className="space-y-6">
        {data.projects.map((project) => (
          <li key={project.slug} className="group/item border-l-2 border-border pl-4 hover:border-accent/60 transition-colors">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <CommandLink command={`/work ${project.slug}`} className="text-foreground font-medium hover:text-accent">
                {project.title} <span className="text-muted-foreground group-hover/item:text-accent">→</span>
              </CommandLink>
              <Tag tone={statusTone(project.status)}>{project.status.toLowerCase()}</Tag>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {[project.role, project.period ?? project.year].filter(Boolean).join(" · ")}
            </p>
            <p className="mt-1.5 max-w-[65ch]">{project.summary}</p>
          </li>
        ))}
      </ol>
      {data.outros.work && <Markdown html={data.outros.work} />}
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

function BlogView({ data }: { data: SiteData }) {
  const years = [...new Set(data.posts.map((post) => post.date.slice(0, 4)))]

  return (
    <div className="space-y-7">
      <Heading>Blog</Heading>
      {data.intros.blog && <Markdown html={data.intros.blog} />}
      {years.map((year) => (
        <section key={year} className="space-y-4">
          <h3 className="text-ochre text-xs uppercase tracking-widest">{year}</h3>
          {data.posts
            .filter((post) => post.date.startsWith(year))
            .map((post) => (
              <div key={post.slug} className="group/item">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <CommandLink command={`/blog ${post.slug}`} className="text-foreground font-medium hover:text-accent">
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
        items={data.posts.map((item) => ({ title: item.title, command: `/blog ${item.slug}` }))}
        index={index}
        back={<CommandLink command="/blog">all posts</CommandLink>}
      />
    </article>
  )
}


function ResearchView({ data }: { data: SiteData }) {
  const papers = data.research.filter((item) => item.kind === "paper")
  const ongoing = data.research.filter((item) => item.kind !== "paper")

  return (
    <div className="space-y-7">
      <Heading>Research</Heading>
      {data.intros.research && <Markdown html={data.intros.research} />}

      {papers.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-ochre text-xs uppercase tracking-widest">Published</h3>
          {papers.map((item) => (
            <div key={item.slug} className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="flex flex-wrap gap-x-3">
                {item.venue && <Tag>{item.venue}</Tag>}
                <Tag tone="muted">{formatDate(item.date)}</Tag>
              </div>
              <CommandLink command={`/research ${item.slug}`} className="block text-foreground font-medium hover:text-accent">
                {item.title} →
              </CommandLink>
              <p className="font-serif text-lg max-w-[65ch]">{item.summary}</p>
              {item.highlights.length > 0 && (
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="grid grid-cols-[1rem_1fr]">
                      <span aria-hidden>–</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                {item.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    {link.label} ↗
                  </a>
                ))}
                {item.bibtex && <CopyButton text={item.bibtex} label="Copy BibTeX" />}
              </div>
            </div>
          ))}
        </section>
      )}

      {ongoing.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-ochre text-xs uppercase tracking-widest">In progress</h3>
          {ongoing.map((item) => (
            <div key={item.slug} className="group/item border-l-2 border-border pl-4 hover:border-accent/60 transition-colors">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <CommandLink command={`/research ${item.slug}`} className="text-foreground font-medium hover:text-accent">
                  {item.title} <span className="text-muted-foreground group-hover/item:text-accent">→</span>
                </CommandLink>
                <Tag tone="accent">{item.kind}</Tag>
                <Tag tone="muted">{formatDate(item.date)}</Tag>
              </div>
              <p className="text-muted-foreground mt-1 max-w-[65ch]">{item.summary}</p>
            </div>
          ))}
        </section>
      )}

      {data.outros.research && <Markdown html={data.outros.research} />}
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
    fun: page.fun,
    emoji: page.emoji,
    run: () => ({
      title: page.title,
      next: withSlash(page.next),
      playMusic: page.name === "music",
      content: <PageView page={page}>{pageExtras(page.name, data)}</PageView>,
    }),
  }))

  const researchItems = (): MenuItem[] =>
    data.research.map((item) => ({ value: `/research ${item.slug}`, label: item.title, description: [item.kind, item.venue].filter(Boolean).join(' · ') }))
  const projectItems = (): MenuItem[] =>
    data.projects.map((project) => ({ value: `/work ${project.slug}`, label: project.title, description: project.period ?? project.year }))
  const postItems = (): MenuItem[] =>
    data.posts.map((post) => ({ value: `/blog ${post.slug}`, label: post.title, description: formatDate(post.date) }))

  return [
    ...pageCommands,
    {
      name: "research",
      description: "Vision-language models and human movement",
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
      description: data.projects.map((project) => project.title).join(", "),
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
      name: "blog",
      description: `${data.posts.length} essays since 2021`,
      complete: postItems,
      run: (args) => {
        const slug = args[0]?.toLowerCase()
        if (!slug) {
          return {
            title: "Blog",
            next: data.posts.slice(0, 2).map((post) => `/blog ${post.slug}`).concat("/research"),
            content: <BlogView data={data} />,
          }
        }
        const post = data.posts.find((entry) => entry.slug === slug)
        if (!post) return notFound("post", "blog", slug)
        return { title: post.title, next: ["/blog", "/research"], content: <PostView post={post} data={data} /> }
      },
    },
  ]
}
