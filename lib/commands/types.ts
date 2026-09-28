import type React from "react"
import type { SiteData } from "@/lib/site-types"
import type { Registry } from "./registry"

export interface CommandContext {
  data: SiteData
  registry: Registry
}

export interface CommandResult {
  content: React.ReactNode
  tone?: "error" | "success"
  /** Document title while this output is the latest. */
  title?: string
  /** Suggested follow-up commands, shown under the output. */
  next?: string[]
  clear?: boolean
}

/** One entry in the slash menu: what gets inserted, what's shown, and a hint. */
export interface MenuItem {
  value: string
  label: string
  description?: string
}

export interface Command {
  name: string
  description: string
  /** Hidden commands still run but don't appear in the slash menu or help. */
  hidden?: boolean
  aliases?: string[]
  /** Items offered after "/name ", e.g. essays for /writing. */
  complete?: (data: SiteData) => MenuItem[]
  run: (args: string[], ctx: CommandContext) => CommandResult
}
