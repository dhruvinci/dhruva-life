"use client"

import { createContext, useContext } from "react"

export interface TerminalApi {
  /** "click" (default) replaces the screen like navigation; "typed" appends like a shell. */
  run: (input: string, source?: "typed" | "click") => void
  pathFor: (input: string) => string | undefined
}

export const TerminalContext = createContext<TerminalApi | null>(null)

export function useTerminalApi() {
  const api = useContext(TerminalContext)
  if (!api) throw new Error("useTerminalApi must be used inside <Terminal>")
  return api
}
