"use client"

import type React from "react"
import { useState } from "react"
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
  /** Older blocks start collapsed to their command line; the latest is always open. */
  latest: boolean
}

export function OutputBlock({ block, latest }: OutputBlockProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState<boolean | null>(null)
  const open = expanded ?? latest

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
            {latest ? "$" : open ? "▾" : "▸"}
          </span>
          <span className={`break-words min-w-0 ${open ? "" : "text-muted-foreground"}`}>{block.input}</span>
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
        <div className="mt-4 print:mt-0">
          <div className={`leading-relaxed ${block.tone ? toneClasses[block.tone] : ""}`}>{block.content}</div>
          {block.notice && (
            <p role="status" className="mt-4 text-sm text-teal-stone bg-teal-stone/10 border border-teal-stone/25 rounded px-3 py-2">
              {block.notice}
            </p>
          )}
          {latest && block.next && block.next.length > 0 && (
            <nav aria-label="Next" className="print:hidden mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
              <span className="text-muted-foreground">next:</span>
              {block.next.map((command) => (
                <CommandLink
                  key={command}
                  command={command}
                  className="rounded border border-border bg-card px-2 py-1 text-muted-foreground hover:text-accent hover:border-accent/40"
                />
              ))}
            </nav>
          )}
        </div>
      )}
    </section>
  )
}
