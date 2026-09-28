import { routeForInput } from "@/lib/routes"
import type { SiteData } from "@/lib/site-types"
import { CommandLink } from "@/components/terminal/command-link"
import { createContentCommands } from "./content"
import { helpCommand } from "./help"
import { utilityCommands } from "./utilities"
import type { Command, CommandContext, CommandResult, MenuItem } from "./types"

export interface Resolved {
  command?: Command
  /** The command word as typed, without the leading slash. */
  name: string
  args: string[]
  /** "/name args", lowercased; matches Route.input for routed commands. */
  canonicalInput: string
}

export interface Execution {
  result: CommandResult
  resolved: Resolved
  path?: string
}

function tokenize(input: string) {
  const [name = "", ...args] = input.trim().replace(/^\//, "").split(/\s+/)
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
  const commands: Command[] = [...createContentCommands(data), helpCommand, ...utilityCommands]
  const byName = new Map<string, Command>()

  for (const command of commands) {
    for (const name of [command.name, ...(command.aliases ?? [])]) {
      const key = name.toLowerCase()
      if (byName.has(key)) throw new Error(`Duplicate command name or alias: "${name}"`)
      byName.set(key, command)
    }
  }

  const find = (name: string) => byName.get(name.toLowerCase())

  /** Commands shown in the slash menu and in /help, in the configured order. */
  const menuCommands = () => {
    const visible = commands.filter((command) => !command.hidden)
    const order = [...data.config.nav, "help", "clear"]
    return visible.sort((a, b) => (order.indexOf(a.name) + 1 || 99) - (order.indexOf(b.name) + 1 || 99))
  }

  function resolve(input: string): Resolved {
    const { name, args } = tokenize(input)
    const command = find(name)
    return {
      command,
      name,
      args,
      canonicalInput: `/${[command?.name ?? name, ...args].join(" ")}`.toLowerCase(),
    }
  }

  /** URL for a command input, if it renders routed content. */
  function pathFor(input: string) {
    return routeForInput(data, resolve(input).canonicalInput)?.path
  }

  /** Closest menu command for a typo, or undefined when nothing is close. */
  function closest(name: string) {
    const lower = name.toLowerCase()
    let best: { name: string; distance: number } | undefined
    for (const command of menuCommands()) {
      const distance = editDistance(lower, command.name)
      if (!best || distance < best.distance) best = { name: command.name, distance }
    }
    const allowed = lower.length <= 2 ? 1 : Math.max(2, Math.floor(lower.length / 3))
    return best && best.distance <= allowed ? best.name : undefined
  }

  /**
   * What the slash menu shows for the current input:
   * "/wr" -> matching commands; "/writing see" -> matching essays.
   */
  function menu(input: string): MenuItem[] {
    if (!input.startsWith("/")) return []
    const body = input.slice(1)
    const spaceAt = body.indexOf(" ")

    if (spaceAt === -1) {
      const prefix = body.toLowerCase()
      return menuCommands()
        .filter((command) => command.name.startsWith(prefix))
        .map((command) => ({ value: `/${command.name}`, label: `/${command.name}`, description: command.description }))
    }

    const command = find(body.slice(0, spaceAt))
    const query = body.slice(spaceAt + 1).trim().toLowerCase()
    const items = command?.complete?.(data) ?? []
    return items.filter(
      (item) =>
        !query ||
        item.value.toLowerCase().split(" ").slice(1).join(" ").startsWith(query) ||
        item.label.toLowerCase().includes(query),
    )
  }

  function execute(input: string, ctx: Omit<CommandContext, "registry">): Execution {
    const resolved = resolve(input)
    const slashed = input.trim().startsWith("/")

    if (!resolved.command) {
      const suggestion = closest(resolved.name)
      return {
        resolved,
        result: {
          tone: "error",
          content: slashed ? (
            <p>
              Unknown command /{resolved.name}.{" "}
              {suggestion ? (
                <>
                  Did you mean <CommandLink command={`/${suggestion}`} />?
                </>
              ) : (
                <>
                  Type <span className="text-accent">/</span> to see what&apos;s here.
                </>
              )}
            </p>
          ) : (
            <p>
              Commands start with a slash. Type <span className="text-accent">/</span> to see them
              {suggestion ? (
                <>
                  , or try <CommandLink command={`/${suggestion}`} />
                </>
              ) : null}
              .
            </p>
          ),
        },
      }
    }

    try {
      const result = resolved.command.run(resolved.args, { ...ctx, registry })
      return { resolved, result, path: result.tone === "error" ? undefined : routeForInput(data, resolved.canonicalInput)?.path }
    } catch (error) {
      return { resolved, result: { tone: "error", content: `Error running /${resolved.command.name}: ${String(error)}` } }
    }
  }

  const registry = { data, commands, find, menuCommands, resolve, pathFor, closest, menu, execute }
  return registry
}

export type Registry = ReturnType<typeof createRegistry>
