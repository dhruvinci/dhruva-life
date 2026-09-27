import type React from "react"
import type { SiteConfig } from "@/lib/site-types"
import { CommandLink } from "./command-link"
import Link from "next/link"

interface IntroProps {
  config: SiteConfig
  /** full on the home page; compact on deep links so the content is above the fold. */
  variant: "full" | "compact"
  dimmed: boolean
}

export function Intro({ config, variant, dimmed }: IntroProps) {
  if (variant === "compact") {
    return (
      <header className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 pr-12 text-sm transition-opacity ${dimmed ? "opacity-70" : ""}`}>
        <Link href="/" className="font-medium hover:text-accent">
          {config.name}
        </Link>
        <span className="text-terracotta">{config.tagline}</span>
      </header>
    )
  }

  const lines = [
    <span key="name" className="font-medium">
      {config.name}
    </span>,
    <span key="loading" className="text-muted-foreground">
      Loading identity...
    </span>,
    <span key="tagline" className="text-terracotta font-medium text-base">
      {config.tagline}
    </span>,
    <span key="rule" className="block h-px w-full bg-border" />,
    <nav key="nav" aria-label="Main" className="flex flex-wrap gap-x-4 gap-y-2">
      {config.nav.map((command) => (
        <CommandLink key={command} command={command}>
          {command}
        </CommandLink>
      ))}
    </nav>,
    <span key="hint" className="text-muted-foreground text-xs">
      Click around, or type <CommandLink command="help" /> to see everything.
    </span>,
  ]

  return (
    <header className={`space-y-3 pr-12 sm:pr-0 text-sm transition-opacity ${dimmed ? "opacity-70" : ""} sm:pt-[12vh]`}>
      {lines.map((line, index) => (
        <div key={index} className="intro-line" style={{ "--i": index } as React.CSSProperties}>
          {line}
        </div>
      ))}
    </header>
  )
}
