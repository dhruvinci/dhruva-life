"use client"

import { createContext, useContext } from "react"

export interface TerminalApi {
  run: (input: string) => void
  pathFor: (input: string) => string | undefined
}

export const TerminalContext = createContext<TerminalApi | null>(null)

export function useTerminalApi() {
  const api = useContext(TerminalContext)
  if (!api) throw new Error("useTerminalApi must be used inside <Terminal>")
  return api
}
