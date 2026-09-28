import type React from "react"
import type { SiteData } from "@/lib/site-types"
import { Logo } from "@/components/logo"
import { CommandLink } from "./command-link"

/**
 * The boot screen: name, "Loading identity...", tagline, sections, hint. Lines type in
 * one after another every time the home screen loads. Once there's output below, it collapses
 * to a single line.
 */
export function Welcome({ data, compact }: { data: SiteData; compact: boolean }) {
  const { config } = data

  if (compact) {
    return (
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- intercepted by the terminal to go home */}
        <a href="/" className="inline-flex items-center gap-2 self-center font-medium hover:text-accent">
          <Logo className="h-4 w-4" />
          {config.name}
        </a>
        <span className="text-orange">{config.tagline}</span>
      </header>
    )
  }

  const paper = data.research.find((item) => item.kind === "paper")
  const inProgress = data.research.find((item) => item.kind !== "paper")
  const post = data.posts[0]
  const quickLinks = [
    inProgress && { label: "in progress", command: `/research ${inProgress.slug}`, title: inProgress.title },
    paper && { label: "paper", command: `/research ${paper.slug}`, title: paper.title },
    post && { label: "latest post", command: `/blog ${post.slug}`, title: post.title },
  ].filter(Boolean) as Array<{ label: string; command: string; title: string }>

  const lines: React.ReactNode[] = [
    <span key="name" className="inline-flex items-center gap-2.5 font-medium">
      <Logo className="h-6 w-6" />
      {config.name}
    </span>,
    <span key="loading" className="text-muted-foreground">
      Loading identity<span className="loading-dots" aria-hidden />
    </span>,
    <div key="tagline" className="space-y-2">
      <p className="text-orange font-medium text-lg sm:text-xl">{config.tagline}</p>
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {config.availability.map((item) => (
          <CommandLink key={item.label} command={item.command} className="text-olive hover:underline">
            <span aria-hidden>● </span>
            {item.label}
          </CommandLink>
        ))}
      </p>
    </div>,
    <span key="rule" className="block h-px w-full bg-border" />,
    <section key="now" aria-label="Currently" className="space-y-2">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">currently</p>
      <p className="font-serif text-base max-w-[62ch]">{config.now}</p>
      <ul className="space-y-1 pt-1">
        {quickLinks.map((link) => (
          <li key={link.command} className="grid grid-cols-[1.25rem_7.5rem_1fr] gap-x-2">
            <span className="text-muted-foreground" aria-hidden>
              ⎿
            </span>
            <span className="text-gold">[{link.label}]</span>
            <CommandLink command={link.command} className="text-foreground hover:text-accent">
              {link.title}
            </CommandLink>
          </li>
        ))}
      </ul>
    </section>,
    <nav key="nav" aria-label="Sections" className="flex flex-wrap gap-x-5 gap-y-2 text-base">
      {config.nav.map((name) => (
        <CommandLink key={name} command={`/${name}`} className="text-orange hover:underline">
          {name}
        </CommandLink>
      ))}
    </nav>,
    <span key="hint" className="text-muted-foreground text-xs">
      Click around, or type <span className="text-orange">/</span> to see everything.
    </span>,
  ]

  return (
    <header className="space-y-4 text-sm sm:pt-[10vh]">
      {lines.map((line, index) => (
        <div key={index} className="intro-line" style={{ "--i": index } as React.CSSProperties}>
          {line}
        </div>
      ))}
    </header>
  )
}
