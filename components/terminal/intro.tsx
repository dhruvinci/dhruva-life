import type React from "react"
import { formatDate } from "@/lib/commands/content"
import type { SiteData } from "@/lib/site-types"
import { CommandLink } from "./command-link"

function firstSentence(text: string, max = 110) {
  const sentence = text.split(/(?<=[.!?])\s/)[0] ?? text
  return sentence.length > max ? `${sentence.slice(0, max).trimEnd()}…` : sentence
}

/**
 * The Claude Code-style welcome box. Full on the home screen (with a "latest" list);
 * a single line once there's output below it.
 */
export function Welcome({ data, compact }: { data: SiteData; compact: boolean }) {
  const { config } = data

  if (compact) {
    return (
      <div className="rounded-lg border border-border px-4 py-2 text-sm flex flex-wrap items-baseline gap-x-2">
        <span className="text-accent">✻</span>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- intercepted by the terminal to go home */}
        <a href="/" className="font-medium hover:text-accent">
          {config.author}
        </a>
        <span className="text-muted-foreground">· {config.tagline}</span>
      </div>
    )
  }

  const paper = data.research[0]
  const post = data.posts[0]
  const now = data.pages.find((page) => page.name === "now")
  const latest = [
    paper && { label: "research", command: `/research ${paper.slug}`, title: paper.title },
    post && { label: "writing", command: `/writing ${post.slug}`, title: post.title, meta: formatDate(post.date) },
    now && { label: "now", command: "/now", title: firstSentence(now.text), meta: now.updated ? formatDate(now.updated) : undefined },
  ].filter(Boolean) as Array<{ label: string; command: string; title: string; meta?: string }>

  const lines: React.ReactNode[] = [
    <section key="box" className="rounded-lg border border-accent/50 px-5 py-4 space-y-3">
      <p>
        <span className="text-accent">✻</span> Welcome to <span className="font-medium">{config.name}</span>
      </p>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{config.author}</h1>
        <p className="font-serif text-lg text-muted-foreground">{config.tagline}.</p>
      </div>
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {config.availability.map((item) => (
          <CommandLink key={item.label} command={item.command} className="text-olive hover:underline">
            <span aria-hidden>● </span>
            {item.label}
          </CommandLink>
        ))}
      </p>
      <p className="text-xs text-muted-foreground">
        Type <span className="text-accent">/</span> to explore, or start with <CommandLink command="/about" /> or{" "}
        <CommandLink command="/help" />.
      </p>
    </section>,
    <section key="latest" aria-label="Latest" className="space-y-2 px-1 text-sm">
      <h2 className="text-xs uppercase tracking-widest text-muted-foreground">latest</h2>
      {latest.map((item) => (
        <div key={item.label} className="grid grid-cols-[1.25rem_5.5rem_1fr] gap-x-2">
          <span className="text-muted-foreground" aria-hidden>
            ⎿
          </span>
          <span className="text-ochre">[{item.label}]</span>
          <span>
            <CommandLink command={item.command} className="text-foreground hover:text-accent">
              {item.title}
            </CommandLink>
            {item.meta && <span className="text-muted-foreground text-xs ml-2">{item.meta}</span>}
          </span>
        </div>
      ))}
    </section>,
  ]

  return (
    <div className="space-y-6 sm:pt-[6vh]">
      {lines.map((line, index) => (
        <div key={index} className="intro-line" style={{ "--i": index } as React.CSSProperties}>
          {line}
        </div>
      ))}
    </div>
  )
}
