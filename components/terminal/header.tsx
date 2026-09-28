"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import type { SiteConfig } from "@/lib/site-types"
import { CommandLink } from "./command-link"

interface HeaderProps {
  config: SiteConfig
  path: string
  onFind: () => void
}

/** Sticky prompt-style header: `dhruva@life:~/work/graicie $`, every segment clickable. */
export function Header({ config, path, onFind }: HeaderProps) {
  const segments = path === "/" ? [] : path.slice(1).split("/")
  const [user, host] = config.name.split(".")
  const currentTop = segments[0]

  return (
    <header className="print:hidden sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-12 flex items-center gap-4 text-sm">
        <nav aria-label="Location" className="flex-1 min-w-0 truncate">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- intercepted by the terminal as `cd ~` */}
          <a href="/" className="text-sage hover:text-accent">
            {user}@{host}
          </a>
          <span className="text-muted-foreground">:</span>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- intercepted by the terminal as `cd ~` */}
          <a href="/" className="text-ochre hover:text-accent">
            ~
          </a>
          {segments.map((segment, index) => {
            const href = `/${segments.slice(0, index + 1).join("/")}`
            const last = index === segments.length - 1
            return (
              <span key={href}>
                <span className="text-muted-foreground">/</span>
                <a href={href} aria-current={last ? "page" : undefined} className={last ? "text-foreground" : "text-ochre hover:text-accent"}>
                  {segment}
                </a>
              </span>
            )
          })}
          <span className="text-muted-foreground"> $</span>
        </nav>

        <nav aria-label="Main" className="hidden md:flex items-center gap-3 text-xs">
          {config.nav.map((command) => (
            <CommandLink
              key={command}
              command={command}
              className={command === currentTop ? "text-foreground" : "text-muted-foreground hover:text-accent"}
            />
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onFind}
            className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Jump to a page"
            aria-keyshortcuts="Meta+K Control+K"
          >
            <span className="md:hidden">find</span>
            <span className="hidden md:inline">⌘K</span>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
