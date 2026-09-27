import { routeForInput } from "@/lib/routes"
import type { SiteData } from "@/lib/site-types"
import { CommandLink } from "@/components/terminal/command-link"
import { createContentCommands } from "./content"
import { easterEggCommands } from "./easter-eggs"
import { helpCommand } from "./help"
import { utilityCommands } from "./utilities"
import type { Command, CommandContext, CommandResult } from "./types"

export interface Resolved {
  command?: Command
  /** The command word as typed (after user-alias expansion). */
  name: string
  args: string[]
  /** Command name + args, lowercased; matches Route.input for routed commands. */
  canonicalInput: string
}

export interface Execution {
  result: CommandResult
  resolved: Resolved
  path?: string
}

function tokenize(input: string) {
  const [name = "", ...args] = input.trim().split(/\s+/)
  return { name, args }
}

function editDistance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const current = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1))
      previous = current
    }
  }
  return row[b.length]
}

export function createRegistry(data: SiteData) {
  const commands: Command[] = [...createContentCommands(data), helpCommand, ...utilityCommands, ...easterEggCommands]
  const byName = new Map<string, Command>()

  for (const command of commands) {
    for (const name of [command.name, ...(command.aliases ?? [])]) {
      const key = name.toLowerCase()
      if (byName.has(key)) throw new Error(`Duplicate command name or alias: "${name}"`)
      byName.set(key, command)
    }
  }

  const find = (name: string) => byName.get(name.toLowerCase())

  function resolve(input: string, userAliases: Record<string, string> = {}, depth = 0): Resolved {
    const { name, args } = tokenize(input)
    const aliasKey = Object.keys(userAliases).find((alias) => alias.toLowerCase() === name.toLowerCase())

    // User aliases shadow built-ins, but only one level deep: no alias loops.
    if (aliasKey && depth === 0) {
      return resolve(`${userAliases[aliasKey]} ${args.join(" ")}`, userAliases, depth + 1)
    }

    const command = find(name)
    return {
      command,
      name,
      args,
      canonicalInput: [command?.name ?? name, ...args].join(" ").toLowerCase(),
    }
  }

  /** URL for a command input, if it renders routed content. */
  function pathFor(input: string) {
    return routeForInput(data, resolve(input).canonicalInput)?.path
  }

  /** Closest real command name for a typo, or undefined when nothing is close. */
  function closest(name: string) {
    const lower = name.toLowerCase()
    let best: { name: string; distance: number } | undefined
    for (const command of commands) {
      if (command.section === "secret") continue
      const distance = editDistance(lower, command.name)
      if (!best || distance < best.distance) best = { name: command.name, distance }
    }
    // Two edits covers the common typos (swapped letters, one missing) without wild guesses.
    const allowed = lower.length <= 2 ? 1 : Math.max(2, Math.floor(lower.length / 3))
    return best && best.distance <= allowed ? best.name : undefined
  }

  function suggest(input: string, userAliases: Record<string, string> = {}) {
    const query = input.toLowerCase().replace(/^\s+/, "")
    if (!query) return []

    const { name, args } = tokenize(query)
    const hasArgs = /\s/.test(query)

    if (hasArgs) {
      const command = find(name)
      const prefix = args.join(" ")
      return (command?.complete?.(prefix, data) ?? [])
        .filter((option) => option.startsWith(prefix))
        .map((option) => `${name} ${option}`)
        .slice(0, 5)
    }

    const names = commands
      .filter((command) => command.section !== "secret")
      .flatMap((command) => [command.name, ...(command.aliases ?? [])])

    return [...new Set([...names, ...Object.keys(userAliases)])].filter((option) => option.startsWith(query)).slice(0, 5)
  }

  function execute(input: string, ctx: Omit<CommandContext, "registry">, userAliases: Record<string, string> = {}): Execution {
    const resolved = resolve(input, userAliases)

    if (!resolved.command) {
      const suggestion = closest(resolved.name)
      return {
        resolved,
        result: {
          tone: "error",
          content: (
            <p>
              Command not found: {resolved.name}.{" "}
              {suggestion ? (
                <>
                  Did you mean <CommandLink command={suggestion} />?
                </>
              ) : (
                <>
                  Type <CommandLink command="help" /> for available commands.
                </>
              )}
            </p>
          ),
        },
      }
    }

    try {
      const result = resolved.command.run(resolved.args, { ...ctx, registry })
      return { resolved, result, path: result.tone === "error" ? undefined : routeForInput(data, resolved.canonicalInput)?.path }
    } catch (error) {
      return { resolved, result: { tone: "error", content: `Error running ${resolved.command.name}: ${String(error)}` } }
    }
  }

  const registry = { data, commands, find, resolve, pathFor, closest, suggest, execute }
  return registry
}

export type Registry = ReturnType<typeof createRegistry>
