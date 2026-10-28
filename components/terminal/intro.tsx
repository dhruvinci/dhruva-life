import type React from "react"
import type { SiteData } from "@/lib/site-types"
import { Logo } from "@/components/logo"
import { CommandLink } from "./command-link"
import { Markdown } from "./markdown"

/**
 * The header on every page: name (home), the main sections, and contact on the right.
 * The section you're in is highlighted.
 */
export function SiteHeader({ data, path }: { data: SiteData; path: string }) {
  const { config } = data
  const section = path.split("/")[1] ?? ""
  const funPages = new Set(data.pages.filter((page) => page.fun).map((page) => page.name))
  const current = funPages.has(section) || section === "theme" ? "fun" : section
  const sections = config.nav.filter((name) => name !== "contact")

  const linkClass = (name: string) =>
    name === current
      ? "text-foreground underline decoration-accent decoration-2 underline-offset-[6px]"
      : "text-accent hover:underline decoration-accent/60 underline-offset-[6px]"

  return (
    <header className="print:hidden flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- intercepted by the terminal to go home */}
      <a href="/" className="inline-flex items-center gap-2 font-medium text-foreground hover:text-accent">
        <Logo className="h-4 w-4" />
        {config.name}
      </a>
      <nav aria-label="Sections" className="order-3 sm:order-none flex w-full sm:w-auto flex-wrap gap-x-5 gap-y-1">
        {sections.map((name) => (
          <CommandLink key={name} command={`/${name}`} className={linkClass(name)}>
            {name}
          </CommandLink>
        ))}
      </nav>
      <CommandLink command="/contact" className={`ml-auto ${linkClass("contact")}`}>
        contact
      </CommandLink>
    </header>
  )
}

/**
 * The home screen: "Loading identity...", tagline, a short about, and what's current.
 * Lines type in one after another every time the home screen loads.
 */
export function Welcome({ data }: { data: SiteData }) {
  const { config } = data

  // Research threads live on /research (no sub-pages), so these all open it.
  const latest = [...data.research].filter((item) => item.kind !== "paper").sort((a, b) => b.date.localeCompare(a.date))[0]
  const paper = data.research.find((item) => item.kind === "paper")
  const post = data.posts[0]
  const quickLinks = [
    latest && { label: "researching", command: "/research", title: latest.title },
    paper && { label: "accepted", command: "/research", title: `${paper.shortTitle ?? paper.title}${paper.venue ? ` (${paper.venue})` : ""}` },
    post && { label: "latest post", command: `/blog ${post.slug}`, title: post.title },
  ].filter(Boolean) as Array<{ label: string; command: string; title: string }>
  // In the order site.json lists them: the sections a first-time visitor most likely wants come first.
  const guide = Object.keys(config.guide ?? {})

  // The first paragraph of /about, so the two never drift apart.
  const about = data.pages.find((page) => page.name === "about")
  const aboutLead = about?.html.split("</p>")[0]

  const lines: React.ReactNode[] = [
    <span key="loading" className="text-muted-foreground">
      Loading identity<span className="loading-dots" aria-hidden />
    </span>,
    <div key="tagline" className="space-y-2">
      <p className="text-foreground font-medium text-lg sm:text-xl">{config.tagline}</p>
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {config.availability.map((item) => (
          <CommandLink key={item.label} command={item.command} className="text-olive hover:underline">
            <span aria-hidden>● </span>
            {item.label}
          </CommandLink>
        ))}
      </p>
    </div>,
    aboutLead && (
      <div key="about" className="space-y-2 max-w-[62ch]">
        <div className="font-serif text-base [&_.md>p]:m-0">
          <Markdown html={`${aboutLead}</p>`} />
        </div>
        <CommandLink command="/about" className="text-accent hover:underline text-sm">
          more about me →
        </CommandLink>
      </div>
    ),
    <span key="rule" className="block h-px w-full bg-border" />,
    <section key="now" aria-label="Right now" className="space-y-2">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">right now</p>
      {config.now && <p className="font-serif text-base max-w-[62ch]">{config.now}</p>}
      <ul className="space-y-1">
        {quickLinks.map((link) => (
          <li key={link.command} className="grid grid-cols-[1.25rem_7.5rem_1fr] gap-x-2">
            <span className="text-muted-foreground" aria-hidden>
              ⎿
            </span>
            <span className="text-gold">[{link.label}]</span>
            <CommandLink command={link.command} className="text-accent hover:underline">
              {link.title}
            </CommandLink>
          </li>
        ))}
      </ul>
    </section>,
    guide.length > 0 && (
      <nav key="guide" aria-label="Where to go" className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">where to go</p>
        <ul className="divide-y divide-border/60 sm:divide-y-0">
          {guide.map((name) => (
            <li key={name}>
              <CommandLink
                command={`/${name}`}
                className="group grid grid-cols-[6.5rem_1fr] gap-x-3 py-2.5 sm:py-1 hover:text-accent"
              >
                <span className="text-accent group-hover:underline">/{name}</span>
                <span className="text-muted-foreground group-hover:text-foreground">{config.guide?.[name]}</span>
              </CommandLink>
            </li>
          ))}
        </ul>
      </nav>
    ),
  ].filter(Boolean)

  return (
    <div className="space-y-4 text-sm sm:pt-4">
      {lines.map((line, index) => (
        <div key={index} className="intro-line" style={{ "--i": index } as React.CSSProperties}>
          {line}
        </div>
      ))}
    </div>
  )
}
