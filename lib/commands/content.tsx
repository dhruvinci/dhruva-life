import type React from "react"
import { CommandLink } from "@/components/terminal/command-link"
import { CopyButton } from "@/components/terminal/copy-button"
import { FightRecord } from "@/components/fun/fight-record"
import { GigList } from "@/components/fun/gig-list"
import { RecordShelf } from "@/components/fun/record-shelf"
import { PlaySong } from "@/components/fun/play-song"
import { Gallery } from "@/components/terminal/gallery"
import { Markdown } from "@/components/terminal/markdown"
import { blogCategories, evidenceTarget } from "@/lib/routes"
import type { Experiment, Metric, Page, Post, Project, SiteData, SkillGroup, TimelineEntry, ToolGroup } from "@/lib/site-types"
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
function Tag({ children, tone = "gold" }: { children: React.ReactNode; tone?: "gold" | "muted" | "accent" }) {
  const toneClass = { gold: "text-gold", muted: "text-muted-foreground", accent: "text-accent" }[tone]
  return <span className={`text-xs ${toneClass}`}>[{children}]</span>
}

function statusTone(status: string) {
  return ["Archived", "Past", "Acquired", "Beta 1 complete", "Prototype"].includes(status) ? "muted" : "accent"
}

const GITHUB_MARK =
  "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"

/** An outside link. GitHub and Hugging Face show their logo with a one-word label. */
function OutLink({ href, label }: { href: string; label: string }) {
  const host = href.includes("github.com") ? "github" : href.includes("huggingface.co") ? "hf" : undefined
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={href.replace(/^https?:\/\//, "")}
      className="inline-flex items-center gap-1.5 text-accent hover:underline"
    >
      {host === "github" && (
        <svg viewBox="0 0 16 16" aria-hidden className="h-3.5 w-3.5 fill-current">
          <path d={GITHUB_MARK} />
        </svg>
      )}
      {host === "hf" && <span aria-hidden>🤗</span>}
      {label}
      {!host && <span aria-hidden>↗</span>}
    </a>
  )
}

/** Outside links, then links to blog posts about the work. */
function LinkRow({ links, posts = [], data, extra }: { links: Project["links"]; posts?: string[]; data: SiteData; extra?: React.ReactNode }) {
  const writeups = posts.map((slug) => data.posts.find((post) => post.slug === slug)).filter((post): post is Post => Boolean(post))
  if (links.length === 0 && writeups.length === 0 && !extra) return null
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      {links.map((link) => (
        <OutLink key={link.href} href={link.href} label={link.label} />
      ))}
      {writeups.map((post) => (
        <CommandLink key={post.slug} command={`/blog ${post.slug}`} className="text-accent hover:underline">
          ✎ {post.title}
        </CommandLink>
      ))}
      {extra}
    </div>
  )
}

/** Previous/next links at the bottom of a post or project. */
function Sequence({ items, index }: { items: Array<{ title: string; command: string }>; index: number }) {
  const previous = items[index - 1]
  const next = items[index + 1]
  return (
    <nav aria-label="More" className="border-t border-border pt-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
      <div>{previous && <CommandLink command={previous.command}>← {previous.title}</CommandLink>}</div>
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
        {data.playlist.length > 0 && <PlaySong count={data.playlist.length} />}
        <RecordShelf records={data.records} />
        <GigList gigs={data.gigs} />
        <p className="font-mono text-sm text-muted-foreground">
          I also document the indie music scene on{" "}
          <a href="https://www.pushit.tv" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            pushit.tv ↗
          </a>
          : rehearsals, sets, and the people behind them.
        </p>
      </div>
    )
  }
  return null
}

/** "jiu-jitsu × vision AI × product" */
function Combines({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return <p className="text-xs text-gold">{items.join(" × ")}</p>
}

function MetricsInline({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) return null
  return (
    <p className="text-sm">
      {metrics.map((metric, index) => (
        <span key={metric.label}>
          {index > 0 && <span className="text-muted-foreground"> · </span>}
          <span className="text-accent">{metric.value}</span> <span className="text-muted-foreground">{metric.label}</span>
        </span>
      ))}
    </p>
  )
}

type TimelineRow = { kind: "project"; order: number; project: Project } | { kind: "entry"; order: number; entry: TimelineEntry }

/**
 * Work, most recent first, as one unbroken line: jobs, roles that live elsewhere on the site,
 * and the stretches between them. Side projects sit under the entry they belong to.
 */
function WorkView({ data }: { data: SiteData }) {
  const main = data.projects.filter((project) => !project.side)
  const unplaced = data.projects.filter((project) => project.side)
  const rows: TimelineRow[] = [
    ...main.map((project) => ({ kind: "project" as const, order: project.order, project })),
    ...data.timeline.map((entry) => ({ kind: "entry" as const, order: entry.order, entry })),
  ].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <Heading>Work</Heading>
        {data.intros.work && <Markdown html={data.intros.work} />}
      </div>

      <ol aria-label="Timeline">
        {rows.map((row, index) => {
          const last = index === rows.length - 1
          const period = row.kind === "project" ? (row.project.period ?? row.project.year) : row.entry.period
          const quiet = row.kind === "entry" && row.entry.kind === "break"
          return (
            <li key={row.kind === "project" ? row.project.slug : row.entry.title} className="grid grid-cols-1 sm:grid-cols-[8.5rem_1fr] sm:gap-x-4">
              <p className="hidden sm:block text-xs text-muted-foreground tabular-nums pt-1 text-right">{period}</p>
              <div className={`relative border-l-2 border-border pl-5 ${last ? "pb-1" : "pb-9"}`}>
                <span aria-hidden className={`absolute -left-[5px] top-2 h-2 w-2 rounded-full ${quiet ? "bg-muted-foreground" : "bg-accent"}`} />
                {/* On phones the date sits inside the line so the timeline stays unbroken. */}
                <p className="sm:hidden text-xs text-muted-foreground tabular-nums mb-1">{period}</p>
                {row.kind === "project" ? <ProjectEntry project={row.project} data={data} /> : <EntryView entry={row.entry} />}
              </div>
            </li>
          )
        })}
      </ol>

      {unplaced.length > 0 && (
        <section aria-labelledby="alongside" className="space-y-4">
          <h3 id="alongside" className="text-xs uppercase tracking-widest text-muted-foreground">
            side projects
          </h3>
          <SideProjects projects={unplaced} data={data} />
        </section>
      )}

      <EvidenceIndex data={data} groups={data.skills} id="skills" label="skills" note="Each one, and where it comes from." />

      {data.outros.work && <Markdown html={data.outros.work} />}
    </div>
  )
}

/** A timeline entry that isn't a project: a role that lives elsewhere on the site, or a break. */
function EntryView({ entry }: { entry: TimelineEntry }) {
  const title = entry.command ? (
    <CommandLink command={entry.command} className={entry.kind === "role" ? "text-foreground font-medium hover:text-accent" : "hover:text-accent"}>
      {entry.title} <span className="text-muted-foreground">→</span>
    </CommandLink>
  ) : (
    entry.title
  )
  if (entry.kind === "break") {
    return (
      <div className="space-y-1.5">
        <p className="text-muted-foreground">{title}</p>
        <p className="font-serif text-base max-w-[62ch] text-muted-foreground">{entry.summary}</p>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <p>{title}</p>
        <Combines items={entry.combines} />
        <p className="max-w-[65ch]">{entry.summary}</p>
      </div>
    </div>
  )
}

function SideProjects({ projects, data }: { projects: Project[]; data: SiteData }) {
  return (
    <ul className="space-y-6 border-l border-dashed border-border pl-4">
      {projects.map((project) => (
        <li key={project.slug}>
          <ProjectEntry project={project} data={data} />
        </li>
      ))}
    </ul>
  )
}

/** A role or project, complete on /work: what it was, what I did, the numbers, and links out. */
function ProjectEntry({ project, data }: { project: Project; data: SiteData }) {
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h4 className="text-foreground font-medium">{project.title}</h4>
        <Tag tone={statusTone(project.status)}>{project.status.toLowerCase()}</Tag>
        {project.side && <span className="text-xs text-muted-foreground tabular-nums">{project.period ?? project.year}</span>}
      </div>
      {project.role && <p className="text-sm text-muted-foreground">{project.role}</p>}
      <Combines items={project.combines} />
      <p className="max-w-[65ch]">{project.summary}</p>
      {project.highlights.length > 0 && (
        <ul className="space-y-1 text-sm text-muted-foreground max-w-[65ch]">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="grid grid-cols-[1rem_1fr]">
              <span aria-hidden>–</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}
      <MetricsInline metrics={project.metrics} />
      {project.stack.length > 0 && <p className="text-xs text-muted-foreground">stack: {project.stack.join(" · ")}</p>}
      <LinkRow links={project.links} posts={project.posts} data={data} />
    </div>
  )
}

/** A site command, or an outside URL (research threads live on GitHub / Hugging Face). */
function EvidenceLink({ target, children }: { target: string; children: React.ReactNode }) {
  if (target.startsWith("http")) {
    return (
      <a href={target} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
        {children} ↗
      </a>
    )
  }
  return (
    <CommandLink command={target} className="text-accent hover:underline">
      {children}
    </CommandLink>
  )
}

/** Named items (skills, datasets, methods), each with the work that shows it. */
function EvidenceIndex({ data, groups, id, label, note }: { data: SiteData; groups: SkillGroup[]; id: string; label: string; note: string }) {
  if (groups.length === 0) return null
  const titleOf = (where: string) => {
    const [first, second] = where.split("/")
    const research = data.research.find((item) => item.slug === second)
    // Papers go by venue ("CAISc 2026 paper"); their full titles are too long for a link.
    if (research) return research.kind === "paper" && research.venue ? `${research.venue} paper` : research.title
    if (second) return data.posts.find((post) => post.slug === second)?.title ?? where
    return data.projects.find((project) => project.slug === first)?.title ?? data.pages.find((page) => page.name === first)?.title ?? first
  }
  return (
    <section aria-labelledby={id} className="space-y-6">
      <div className="space-y-1">
        <h3 id={id} className="text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </h3>
        <p className="text-sm text-muted-foreground">{note}</p>
      </div>
      {groups.map((group) => (
        <div key={group.group} className="space-y-3">
          <h4 className="text-sm text-gold">{group.group}</h4>
          <dl className="space-y-3">
            {group.skills.map((skill) => (
              <div key={skill.name} className="grid grid-cols-1 sm:grid-cols-[14rem_1fr] sm:gap-x-4 gap-y-1">
                <dt className="text-foreground text-sm">{skill.name}</dt>
                <dd className="space-y-1">
                  {skill.evidence.map((item) => (
                    <p key={item.where + item.note} className="text-sm">
                      <EvidenceLink target={evidenceTarget(data, item.where) ?? "/work"}>{titleOf(item.where)}</EvidenceLink>
                      <span className="text-muted-foreground"> - {item.note}</span>
                    </p>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </section>
  )
}

/** "all · research · ..." links above the blog list; the current one isn't a link. */
/** Filter buttons above the blog list: all, research, work, life - each with its count. */
function CategoryLinks({ data, current }: { data: SiteData; current?: string }) {
  const categories = blogCategories(data)
  if (categories.length === 0) return null
  const count = (name?: string) => data.posts.filter((post) => !name || post.category === name).length
  const items = [{ label: "all", command: "/blog", count: count(), active: !current }, ...categories.map((name) => ({ label: name, command: `/blog ${name}`, count: count(name), active: name === current }))]
  return (
    <nav aria-label="Filter posts" className="flex flex-wrap gap-2 text-sm">
      {items.map((item) =>
        item.active ? (
          <span key={item.label} aria-current="page" className="rounded-md border border-accent bg-accent/10 px-3 py-1.5 text-foreground">
            {item.label} <span className="text-muted-foreground tabular-nums">{item.count}</span>
          </span>
        ) : (
          <CommandLink
            key={item.label}
            command={item.command}
            className="rounded-md border border-border px-3 py-1.5 text-muted-foreground hover:border-accent/60 hover:text-foreground"
          >
            {item.label} <span className="tabular-nums">{item.count}</span>
          </CommandLink>
        ),
      )}
    </nav>
  )
}

function BlogView({ data, category }: { data: SiteData; category?: string }) {
  const posts = category ? data.posts.filter((post) => post.category === category) : data.posts
  const years = [...new Set(posts.map((post) => post.date.slice(0, 4)))]

  return (
    <div className="space-y-7">
      <Heading>{category ? `Blog · ${category}` : "Blog"}</Heading>
      {!category && data.intros.blog && <Markdown html={data.intros.blog} />}
      <CategoryLinks data={data} current={category} />
      {years.map((year) => (
        <section key={year} className="space-y-4">
          <h3 className="text-gold text-xs uppercase tracking-widest">{year}</h3>
          {posts
            .filter((post) => post.date.startsWith(year))
            .map((post) => (
              <div key={post.slug} className="group/item">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <CommandLink command={`/blog ${post.slug}`} className="text-foreground font-medium hover:text-accent">
                    {post.title} <span className="text-muted-foreground group-hover/item:text-accent">→</span>
                  </CommandLink>
                  <Tag tone="muted">{formatDate(post.date)}</Tag>
                  {post.category && <Tag tone="accent">{post.category}</Tag>}
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
        <div className="flex flex-wrap gap-x-3">
          <Tag tone="muted">
            {formatDate(post.date)} · {post.minutes} min read
          </Tag>
          {post.category && (
            <CommandLink command={`/blog ${post.category}`}>
              <Tag tone="accent">{post.category}</Tag>
            </CommandLink>
          )}
        </div>
        <Heading>{post.title}</Heading>
      </div>
      <Markdown html={post.html} />
      <Sequence
        items={data.posts.map((item) => ({ title: item.title, command: `/blog ${item.slug}` }))}
        index={index}
      />
    </article>
  )
}


/** A thread's experiments, in the order they were run. Collapsed to a count on /research. */
function ExperimentList({ experiments, collapsed = false }: { experiments: Experiment[]; collapsed?: boolean }) {
  if (experiments.length === 0) return null
  const list = (
    <ol className="space-y-2 pt-2">
      {experiments.map((experiment) => (
        <li key={experiment.title} className="grid grid-cols-[1.25rem_1fr] text-sm">
          <span aria-hidden className="text-muted-foreground">
            ⎿
          </span>
          <span>
            <span className="text-foreground">{experiment.title}</span>
            <span className="text-muted-foreground"> - {experiment.result}</span>
          </span>
        </li>
      ))}
    </ol>
  )
  const label = `${experiments.length} experiment${experiments.length === 1 ? "" : "s"}`
  if (collapsed) {
    return (
      <details className="group">
        <summary className="cursor-pointer list-none text-xs text-muted-foreground hover:text-accent">
          <span className="group-open:hidden">▸ {label}</span>
          <span className="hidden group-open:inline">▾ {label}</span>
        </summary>
        {list}
      </details>
    )
  }
  return (
    <section aria-label="Experiments" className="space-y-1">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      {list}
    </section>
  )
}

/** Every tool tried: used ones with a line on what for, read ones as links. */
function ToolsList({ groups }: { groups: ToolGroup[] }) {
  if (groups.length === 0) return null
  return (
    <section aria-labelledby="tools" className="space-y-6">
      <div className="space-y-1">
        <h3 id="tools" className="text-xs uppercase tracking-widest text-muted-foreground">
          tools
        </h3>
        <p className="text-sm text-muted-foreground">Everything I&apos;ve run, compared, or read closely enough to decide.</p>
      </div>
      {groups.map((group) => {
        const list = (
          <ul className="space-y-1.5">
            {group.tools.map((tool) => (
              <li key={tool.name} className="text-sm">
                {tool.href ? (
                  <a href={tool.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    {tool.name} ↗
                  </a>
                ) : (
                  <span className="text-foreground">{tool.name}</span>
                )}
                {tool.note && <span className="text-muted-foreground"> - {tool.note}</span>}
              </li>
            ))}
          </ul>
        )
        return group.collapsed ? (
          <details key={group.group} className="group space-y-2">
            <summary className="cursor-pointer list-none text-sm text-gold hover:text-accent">
              <span className="group-open:hidden">▸ </span>
              <span className="hidden group-open:inline">▾ </span>
              {group.group} <span className="text-muted-foreground">({group.tools.length})</span>
            </summary>
            {list}
          </details>
        ) : (
          <div key={group.group} className="space-y-2">
            <h4 className="text-sm text-gold">{group.group}</h4>
            {list}
          </div>
        )
      })}
    </section>
  )
}

/** Research, latest first. Each piece's `ledTo` points up the list, at the newer work it set up. */
const researchPath = (data: SiteData) => [...data.research].sort((a, b) => b.date.localeCompare(a.date))

function researchStatusTone(status?: string) {
  return ["current", "published", "accepted", "in progress"].includes(status ?? "") ? "accent" : "muted"
}

/**
 * One page, no sub-pages: the statement and questions, then every thread in the order it happened,
 * each linking out to its repo, model, paper or post. Then data, methods and tools.
 */
function ResearchView({ data }: { data: SiteData }) {
  const path = researchPath(data)

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <Heading>Research</Heading>
        {data.intros.research && <Markdown html={data.intros.research} />}
      </div>

      <section aria-labelledby="work-so-far" className="space-y-5">
        <div className="space-y-1">
          <h3 id="work-so-far" className="text-xs uppercase tracking-widest text-muted-foreground">
            the work so far
          </h3>
          <p className="text-sm text-muted-foreground">
            Latest first; each result set up a later question. {data.experiments.length} experiments, with the negative results kept.
          </p>
        </div>
        <ol>
          {path.map((item, index) => {
            const last = index === path.length - 1
            const when = item.period ?? formatDate(item.date)
            const lit = researchStatusTone(item.status) === "accent"
            return (
              <li key={item.slug} id={item.slug} className="grid grid-cols-1 sm:grid-cols-[8.5rem_1fr] sm:gap-x-4 scroll-mt-24">
                <p className="hidden sm:block text-xs text-muted-foreground tabular-nums pt-1 text-right">{when}</p>
                <div className={`relative border-l-2 border-border pl-5 ${last ? "pb-1" : "pb-8"}`}>
                  <span aria-hidden className={`absolute -left-[5px] top-2 h-2 w-2 rounded-full ${lit ? "bg-accent" : "bg-muted-foreground"}`} />
                  <p className="sm:hidden text-xs text-muted-foreground tabular-nums mb-1">{when}</p>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h4 className="text-foreground font-medium">{item.title}</h4>
                      {item.status && <Tag tone={researchStatusTone(item.status)}>{item.status}</Tag>}
                      {item.venue && <Tag>{item.venue}</Tag>}
                    </div>
                    {item.venueNote && <p className="text-xs text-muted-foreground max-w-[65ch]">{item.venueNote}</p>}
                    {item.question && <p className="font-serif text-base italic max-w-[62ch]">{item.question}</p>}
                    <p className="text-sm max-w-[65ch]">{item.finding ?? item.summary}</p>
                    <MetricsInline metrics={item.metrics} />
                    <LinkRow links={item.links} posts={item.posts} data={data} extra={item.bibtex && <CopyButton text={item.bibtex} label="BibTeX" />} />
                    {item.ledTo && index > 0 && <p className="text-sm text-gold max-w-[65ch]">led to: {item.ledTo}</p>}
                    <ExperimentList experiments={data.experiments.filter((experiment) => experiment.thread === item.slug)} collapsed />
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      <EvidenceIndex data={data} groups={data.researchData} id="data" label="data" note="What I've worked with, what I've built, and how it was labelled." />
      <EvidenceIndex data={data} groups={data.researchMethods} id="methods" label="methods" note="How the work gets done, and where each method shows up." />
      <ToolsList groups={data.researchTools} />

      {data.outros.research && <Markdown html={data.outros.research} />}
    </div>
  )
}

function notFound(kind: string, command: string, arg: string) {
  return {
    tone: "error" as const,
    content: (
      <p>
        No {kind} called &quot;{arg}&quot;. <CommandLink command={`/${command}`}>See them all →</CommandLink>
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

  const postItems = (): MenuItem[] => [
    ...blogCategories(data).map((category) => ({ value: `/blog ${category}`, label: `[${category}]`, description: "category" })),
    ...data.posts.map((post) => ({ value: `/blog ${post.slug}`, label: post.title, description: formatDate(post.date) })),
  ]

  return [
    ...pageCommands,
    {
      name: "research",
      description: "How machines can understand people moving and interacting",
      run: () => ({
        title: "Research",
        next: ["/work", "/blog research"],
        content: <ResearchView data={data} />,
      }),
    },
    {
      name: "work",
      description: "Independent research, Zopu.ai, Dehidden, PwC, and side projects",
      run: () => ({
        title: "Work",
        next: ["/research", "/contact"],
        content: <WorkView data={data} />,
      }),
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
        if (blogCategories(data).includes(slug)) {
          return { title: `Blog · ${slug}`, next: ["/blog", "/research"], content: <BlogView data={data} category={slug} /> }
        }
        const post = data.posts.find((entry) => entry.slug === slug)
        if (!post) return notFound("post", "blog", slug)
        return { title: post.title, next: ["/blog", "/research"], content: <PostView post={post} data={data} /> }
      },
    },
  ]
}
