import type React from "react"
import type { SiteData } from "@/lib/site-types"
import type { Registry } from "./registry"

export interface Discovery {
  /** Distinct canonical command names this visitor has run. */
  commandsRun: string[]
  eggsFound: string[]
}

export interface CommandContext {
  data: SiteData
  registry: Registry
  discovery: Discovery
}

export interface CommandResult {
  content: React.ReactNode
  tone?: "error" | "success"
  /** Document title while this output is the latest. */
  title?: string
  /** Suggested follow-up commands, shown as mobile chips. */
  next?: string[]
  clear?: boolean
  /** Go to the home screen (cd ~). */
  home?: boolean
  /** Run this input instead, e.g. `cd work` runs `work`. */
  redirect?: string
}

/** explore/more are content, utility is tooling, secret is hidden from help. */
export type CommandSection = "explore" | "more" | "utility" | "secret"

export interface Command {
  name: string
  description: string
  section: CommandSection
  aliases?: string[]
  usage?: string
  run: (args: string[], ctx: CommandContext) => CommandResult
  /** Completions for the argument, given what has been typed so far. */
  complete?: (argPrefix: string, data: SiteData) => string[]
}
