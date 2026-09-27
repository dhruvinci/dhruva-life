import { CommandLink } from "@/components/terminal/command-link"
import { getRoutes, routeForPath } from "@/lib/routes"
import { storage } from "@/lib/storage"
import type { Command } from "./types"

interface SearchHit {
  kind: string
  title: string
  snippet: string
  command?: string
}

function snippet(text: string, term: string) {
  const index = text.toLowerCase().indexOf(term)
  if (index === -1) return text.slice(0, 140)
  const start = Math.max(0, index - 50)
  return `${start > 0 ? "…" : ""}${text.slice(start, index + term.length + 90)}…`
}

export const utilityCommands: Command[] = [
  {
    name: "search",
    description: "Search across all content",
    usage: "search <term>",
    section: "utility",
    run: (args, { data }) => {
      const term = args.join(" ").toLowerCase()
      if (!term) return { tone: "error", content: "Usage: search <term>" }

      const matches = (...fields: string[]) => fields.some((field) => field.toLowerCase().includes(term))
      const hits: SearchHit[] = [
        ...data.projects
          .filter((p) => matches(p.title, p.summary, p.cluster, p.status, p.text))
          .map((p) => ({ kind: "Project", title: p.title, snippet: p.summary, command: `open ${p.slug}` })),
        ...data.research
          .filter((r) => matches(r.title, r.summary, r.kind, r.venue ?? "", r.text))
          .map((r) => ({ kind: "Research", title: r.title, snippet: r.summary, command: `open ${r.slug}` })),
        ...data.posts
          .filter((p) => matches(p.title, p.excerpt, p.text))
          .map((p) => ({ kind: "Writing", title: p.title, snippet: snippet(p.text, term), command: `open ${p.slug}` })),
        ...data.pages
          .filter((p) => matches(p.title, p.description, p.text))
          .map((p) => ({ kind: "Page", title: p.title, snippet: snippet(p.text, term), command: p.name })),
        ...data.logs
          .filter((l) => matches(l.text))
          .map((l) => ({ kind: "Log", title: l.date, snippet: snippet(l.text, term), command: "log" })),
      ]

      if (hits.length === 0) return { tone: "error", content: `No results for "${term}".` }

      return {
        next: hits.flatMap((hit) => (hit.command ? [hit.command] : [])).slice(0, 3),
        content: (
          <div className="space-y-3">
            <p className="text-accent">
              {hits.length} result{hits.length === 1 ? "" : "s"} for &quot;{term}&quot;
            </p>
            {hits.map((hit) => (
              <div key={`${hit.kind}-${hit.title}`} className="border-l-2 border-border pl-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{hit.kind}</span>
                  {hit.command ? (
                    <CommandLink command={hit.command} className="font-medium hover:text-accent hover:underline">
                      {hit.title}
                    </CommandLink>
                  ) : (
                    <span className="font-medium">{hit.title}</span>
                  )}
                </div>
                <p className="text-muted-foreground mt-1">{hit.snippet}</p>
              </div>
            ))}
          </div>
        ),
      }
    },
  },
  {
    name: "ls",
    description: "List every page on the site",
    section: "utility",
    run: (_args, { data }) => ({
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
          {getRoutes(data).map((route) => (
            <div key={route.path}>
              <CommandLink command={route.input}>{route.path}</CommandLink>
            </div>
          ))}
        </div>
      ),
    }),
  },
  {
    name: "history",
    description: "Show command history",
    section: "utility",
    run: () => {
      const history = storage.getHistory()
      if (history.length === 0) return { tone: "error", content: "No command history yet." }
      const recent = history.slice(-10)
      const offset = history.length - recent.length

      return {
        content: (
          <div className="space-y-1">
            {recent.map((command, index) => (
              <div key={`${command}-${index}`}>
                <span className="text-muted-foreground mr-3">{offset + index + 1}</span>
                <CommandLink command={command} className="hover:text-accent hover:underline" />
              </div>
            ))}
          </div>
        ),
      }
    },
  },
  {
    name: "alias",
    description: "Create your own shortcuts",
    usage: "alias <name>=<command>",
    section: "utility",
    run: (args, { registry }) => {
      const match = args.join(" ").match(/^([\w-]+)=(.+)$/)
      const aliases = storage.getAliases()

      if (!match) {
        if (Object.keys(aliases).length === 0) return { tone: "error", content: "No aliases yet. Usage: alias <name>=<command>" }
        return {
          content: (
            <div className="space-y-1">
              {Object.entries(aliases).map(([alias, command]) => (
                <div key={alias}>
                  <span className="text-accent">{alias}</span>
                  <span className="text-muted-foreground mx-2">=</span>
                  {command}
                </div>
              ))}
            </div>
          ),
        }
      }

      const [, alias, command] = match
      if (!registry.resolve(command.trim()).command) return { tone: "error", content: `Unknown command: ${command.trim()}` }
      storage.setAliases({ ...aliases, [alias]: command.trim() })
      return { tone: "success", content: `Alias set: ${alias} = ${command.trim()}` }
    },
  },
  {
    name: "theme",
    description: "Switch color theme",
    usage: "theme <dark|light|auto>",
    section: "utility",
    complete: () => ["dark", "light", "auto"],
    run: (args) => {
      const theme = args[0]?.toLowerCase()
      if (!theme || !["dark", "light", "auto"].includes(theme)) return { tone: "error", content: "Usage: theme <dark|light|auto>" }
      window.dispatchEvent(new CustomEvent("terminal-theme", { detail: theme }))
      return { tone: "success", content: `Theme set to ${theme}.` }
    },
  },
  {
    name: "share",
    description: "Copy a link to what you're looking at",
    section: "utility",
    run: () => {
      navigator.clipboard?.writeText(window.location.href).catch(() => {})
      return { tone: "success", content: `Copied ${window.location.href}` }
    },
  },
  {
    name: "cd",
    description: "Go to a path, e.g. cd work, cd .., cd ~",
    usage: "cd <path>",
    section: "utility",
    complete: (_prefix, data) => getRoutes(data).map((route) => route.path.slice(1)),
    run: (args, { data }) => {
      const target = args[0] ?? "~"
      if (target === "~" || target === "/") return { content: null, home: true }

      const current = typeof window === "undefined" ? "/" : window.location.pathname
      const path =
        target === ".."
          ? current.split("/").slice(0, -1).join("/") || "/"
          : target.startsWith("/")
            ? target
            : `${current === "/" ? "" : current}/${target}`.replace(/\/+/g, "/")

      if (path === "/") return { content: null, home: true }
      // Relative first (cd graicie from /work), then from the root (cd work from anywhere).
      const route = routeForPath(data, path) ?? routeForPath(data, `/${target}`)
      if (!route) return { tone: "error", content: `cd: no such path: ${target}. Try ls.` }
      return { content: null, redirect: route.input }
    },
  },
  {
    name: "clear",
    description: "Clear the screen",
    aliases: ["cls"],
    section: "utility",
    run: () => ({ content: null, clear: true }),
  },
]
