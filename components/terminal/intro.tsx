import type React from "react"
import { formatDate } from "@/lib/commands/content"
import type { SiteData } from "@/lib/site-types"
import { CommandLink } from "./command-link"

function firstSentence(text: string, max = 140) {
  const sentence = text.split(/(?<=[.!?])\s/)[0] ?? text
  return sentence.length > max ? `${sentence.slice(0, max).trimEnd()}…` : sentence
}

/** Home screen: who this is, what's fresh, and where to go. */
export function Intro({ data }: { data: SiteData }) {
  const { config } = data
  const post = data.posts[0]
  const paper = data.research[0]
  const now = data.pages.find((page) => page.name === "now")
  const log = data.logs[0]

  const latest = [
    paper && {
      key: "research",
      label: "research",
      command: `open ${paper.slug}`,
      title: paper.title,
      meta: [paper.venue, formatDate(paper.date)].filter(Boolean).join(" · "),
    },
    post && {
      key: "writing",
      label: "writing",
      command: `open ${post.slug}`,
      title: post.title,
      meta: formatDate(post.date),
    },
    now && {
      key: "now",
      label: "now",
      command: "now",
      title: firstSentence(now.text),
      meta: now.updated ? formatDate(now.updated) : undefined,
    },
    log && {
      key: "log",
      label: "log",
      command: "log",
      title: log.summary,
      meta: formatDate(log.date),
    },
  ].filter(Boolean) as Array<{ key: string; label: string; command: string; title: string; meta?: string }>

  const lines = [
    <h1 key="name" className="text-2xl font-semibold tracking-tight">
      {config.author}
    </h1>,
    <p key="tagline" className="font-serif text-xl text-muted-foreground max-w-[40ch]">
      {config.tagline}.
    </p>,
    config.availability.length > 0 && (
      <p key="availability" className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
        {config.availability.map((item) => (
          <CommandLink key={item.label} command={item.command} className="text-olive hover:underline">
            <span aria-hidden>● </span>
            {item.label}
          </CommandLink>
        ))}
      </p>
    ),
    <section key="latest" aria-label="Latest" className="pt-4 space-y-3">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground">latest</h2>
      <ul className="space-y-3">
        {latest.map((item) => (
          <li key={item.key} className="grid grid-cols-[5.5rem_1fr] gap-x-3">
            <span className="text-ochre text-sm">[{item.label}]</span>
            <span>
              <CommandLink command={item.command} className="text-foreground hover:text-accent">
                {item.title}
              </CommandLink>
              {item.meta && <span className="text-muted-foreground text-xs ml-2">{item.meta}</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>,
    <nav key="nav" aria-label="Explore" className="pt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
      {config.nav.map((command) => (
        <CommandLink key={command} command={command} className="text-accent hover:underline">
          {command}
        </CommandLink>
      ))}
    </nav>,
    <p key="hint" className="text-muted-foreground text-xs">
      Click around, type <CommandLink command="help" className="text-accent hover:underline" />, or press ⌘K to jump anywhere.
    </p>,
  ].filter(Boolean) as React.ReactNode[]

  return (
    <div className="space-y-4 sm:pt-[8vh]">
      {lines.map((line, index) => (
        <div key={index} className="intro-line" style={{ "--i": index } as React.CSSProperties}>
          {line}
        </div>
      ))}
    </div>
  )
}
