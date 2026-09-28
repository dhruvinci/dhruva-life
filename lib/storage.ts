// Per-visitor state in localStorage. Every access is guarded: private windows and
// blocked storage should degrade to "no memory", never to a crash.

const KEYS = {
  history: "terminal-history",
  fun: "terminal-fun",
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

export const storage = {
  getHistory: () => read<string[]>(KEYS.history, []),
  setHistory: (history: string[]) => write(KEYS.history, history),
  getFun: () => read<boolean>(KEYS.fun, false),
  setFun: () => write(KEYS.fun, true),
}
