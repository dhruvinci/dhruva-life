"use client"

import type React from "react"
import { useTerminalApi } from "./context"

interface CommandLinkProps {
  command: string
  children?: React.ReactNode
  className?: string
}

/**
 * A clickable command. Routed commands render as real <a href> links (crawlable,
 * cmd-click opens a tab, works without JS); the terminal intercepts plain clicks.
 * Everything else renders as a button that runs the command.
 */
export function CommandLink({ command, children, className = "text-accent hover:underline" }: CommandLinkProps) {
  const { run, pathFor } = useTerminalApi()
  const path = pathFor(command)
  const label = children ?? command

  if (path) {
    return (
      <a href={path} className={className}>
        {label}
      </a>
    )
  }

  return (
    <button type="button" onClick={() => run(command)} className={`${className} text-left`}>
      {label}
    </button>
  )
}
