import type { Command } from "./types"

export const utilityCommands: Command[] = [
  {
    name: "clear",
    description: "Clear the screen",
    run: () => ({ content: null, clear: true }),
  },
  {
    name: "theme",
    description: "Switch colours: /theme dark, light or auto",
    hidden: true,
    complete: () =>
      ["dark", "light", "auto"].map((mode) => ({ value: `/theme ${mode}`, label: mode, description: `${mode} theme` })),
    run: (args) => {
      const theme = args[0]?.toLowerCase()
      if (!theme || !["dark", "light", "auto"].includes(theme)) return { tone: "error", content: "Usage: /theme dark, light or auto" }
      window.dispatchEvent(new CustomEvent("terminal-theme", { detail: theme }))
      return { tone: "success", content: `Theme set to ${theme}.` }
    },
  },
]
