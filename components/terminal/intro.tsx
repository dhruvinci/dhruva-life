import type React from "react"
import type { SiteData } from "@/lib/site-types"
import { CommandLink } from "./command-link"

/**
 * The boot screen: name, "Loading identity...", tagline, sections, hint. Lines type in
 * one after another on a visitor's first visit. Once there's output below, it collapses
 * to a single line.
 */
export function Welcome({ data, compact }: { data: SiteData; compact: boolean }) {
  const { config } = data

  if (compact) {
    return (
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- intercepted by the terminal to go home */}
        <a href="/" className="font-medium hover:text-accent">
          {config.name}
        </a>
        <span className="text-terracotta">{config.tagline}</span>
      </header>
    )
  }

  const lines: React.ReactNode[] = [
    <span key="name" className="font-medium">
      {config.name}
    </span>,
    <span key="loading" className="text-muted-foreground">
      Loading identity<span className="loading-dots" aria-hidden />
    </span>,
    <div key="tagline" className="space-y-2">
      <p className="text-terracotta font-medium text-lg sm:text-xl">{config.tagline}</p>
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
    <nav key="nav" aria-label="Sections" className="flex flex-wrap gap-x-5 gap-y-2 text-base">
      {config.nav.map((name) => (
        <CommandLink key={name} command={`/${name}`} className="text-terracotta hover:underline">
          {name}
        </CommandLink>
      ))}
    </nav>,
    <span key="hint" className="text-muted-foreground text-xs">
      Click around, or type <span className="text-terracotta">/</span> to see everything.
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
