"use client"

import type React from "react"
import { useState } from "react"

export interface Block {
  id: string
  input: string
  content: React.ReactNode
  tone?: "error" | "success"
  /** URL of this output, when it is routed content. */
  path?: string
  notice?: string
}

const toneClasses = {
  error: "text-destructive",
  success: "text-olive",
}

export function OutputBlock({ block }: { block: Block }) {
  const [copied, setCopied] = useState(false)

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
    <section id={block.id} className="group scroll-mt-6">
      <div className="flex items-center gap-2 mb-3 text-sm">
        <span className="text-sage">$</span>
        <span className="flex-1 min-w-0 break-words">{block.input}</span>
        {block.path && (
          <button
            type="button"
            onClick={copyLink}
            className="shrink-0 text-xs text-muted-foreground hover:text-foreground md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
            aria-label={`Copy link to ${block.path}`}
          >
            {copied ? "copied ✓" : (
              <>
                ⧉<span className="hidden sm:inline"> {block.path}</span>
              </>
            )}
          </button>
        )}
      </div>
      <div className={`leading-relaxed pl-4 sm:pl-5 ${block.tone ? toneClasses[block.tone] : ""}`}>{block.content}</div>
      {block.notice && (
        <p role="status" className="mt-4 ml-4 sm:ml-5 text-sm text-teal-stone bg-teal-stone/10 border border-teal-stone/20 rounded px-3 py-2">
          {block.notice}
        </p>
      )}
    </section>
  )
}
