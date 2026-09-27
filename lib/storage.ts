// Per-visitor state in localStorage. Every access is guarded: private windows and
// blocked storage should degrade to "no memory", never to a crash.

import type { Discovery } from "@/lib/commands/types"

const KEYS = {
  history: "terminal-history",
  aliases: "terminal-aliases",
  discovery: "terminal-discovery-v2",
  visited: "terminal-visited",
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable; the terminal still works for this page view.
  }
}

export const emptyDiscovery: Discovery = { commandsRun: [], eggsFound: [] }

export const storage = {
  getHistory: () => read<string[]>(KEYS.history, []),
  setHistory: (history: string[]) => write(KEYS.history, history),
  getAliases: () => read<Record<string, string>>(KEYS.aliases, {}),
  setAliases: (aliases: Record<string, string>) => write(KEYS.aliases, aliases),
  getDiscovery: () => ({ ...emptyDiscovery, ...read<Partial<Discovery>>(KEYS.discovery, {}) }),
  setDiscovery: (discovery: Discovery) => write(KEYS.discovery, discovery),
  markVisited: () => write(KEYS.visited, true),
}
