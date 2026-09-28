"use client"

import { useState } from "react"

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard blocked; nothing else to do.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:text-accent hover:border-accent/40"
    >
      {copied ? "copied ✓" : label}
    </button>
  )
}
