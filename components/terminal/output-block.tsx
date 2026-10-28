"use client"

import type React from "react"
import { useState } from "react"
import { parentOf, routeForInput } from "@/lib/routes"
import type { SiteData } from "@/lib/site-types"
import { CommandLink } from "./command-link"

export interface Block {
  id: string
  input: string
  content: React.ReactNode
  tone?: "error" | "success"
  /** URL of this output, when it is routed content. */
  path?: string
  notice?: string
  /** Suggested follow-up commands. */
  next?: string[]
}

const toneClasses = {
  error: "text-destructive",
  success: "text-olive",
}

interface OutputBlockProps {
  block: Block
  data: SiteData
  /** Older blocks start collapsed to their command line; the latest is always open. */
  latest: boolean
}

export function OutputBlock({ block, data, latest }: OutputBlockProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState<boolean | null>(null)
  const open = expanded ?? latest
  const parent = parentOf(data, block.path)
  const seeAlso = (block.next ?? []).filter((command) => routeForInput(data, command)?.path !== parent.path)

  const copyLink = async () => {
    if (!block.path) return
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${block.path}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked; the URL bar already has the link.
    }
  }

  return (
    <section id={block.id} tabIndex={-1} aria-label={block.input} className="group scroll-mt-16">
      <div className="print:hidden flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setExpanded(!open)}
          aria-expanded={open}
          className="flex flex-1 min-w-0 items-center gap-2 text-left"
        >
          <span className="text-sage" aria-hidden>
            {latest || open ? "$" : "▸"}
          </span>
          <span className={`break-words min-w-0 ${open ? "text-foreground" : "text-muted-foreground"}`}>{block.input}</span>
        </button>
        {block.path && open && (
          <button
            type="button"
            onClick={copyLink}
            className="shrink-0 text-xs text-muted-foreground hover:text-foreground md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
            aria-label={`Copy link to ${block.path}`}
          >
            {copied ? (
              "copied ✓"
            ) : (
              <>
                ⧉<span className="hidden sm:inline"> copy link</span>
              </>
            )}
          </button>
        )}
      </div>

      {open && (
        <div className="mt-3 grid grid-cols-[1.25rem_1fr] print:mt-0 print:block">
          <span className="text-muted-foreground print:hidden" aria-hidden>
            ⎿
          </span>
          <div className="min-w-0">
          {latest && (
            <p className="print:hidden mb-4 text-xs">
              <a href={parent.path} className="text-muted-foreground hover:text-accent">
                ← {parent.label}
              </a>
            </p>
          )}
          <div className={`leading-relaxed ${block.tone ? toneClasses[block.tone] : ""}`}>{block.content}</div>
          {block.notice && (
            <p role="status" className="mt-4 text-sm text-blue bg-blue/10 border border-blue/25 rounded px-3 py-2">
              {block.notice}
            </p>
          )}
          {latest && (
            <nav aria-label="Go to" className="print:hidden mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-sm">
              <a href={parent.path} className="text-accent hover:underline">
                ← back to {parent.label}
              </a>
              {parent.path !== "/" && (
                // eslint-disable-next-line @next/next/no-html-link-for-pages -- intercepted by the terminal to go home
                <a href="/" className="text-accent hover:underline">
                  home
                </a>
              )}
              {seeAlso.length > 0 && (
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-muted-foreground">see also</span>
                  {seeAlso.map((command) => (
                    <CommandLink key={command} command={command} className="text-accent hover:underline">
                      {routeForInput(data, command)?.title ?? command}
                    </CommandLink>
                  ))}
                </span>
              )}
            </nav>
          )}
          </div>
        </div>
      )}
    </section>
  )
}
