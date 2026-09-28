import { CommandLink } from "@/components/terminal/command-link"
import type { SiteData } from "@/lib/site-types"
import { THEMES } from "@/lib/themes"
import type { Command } from "./types"

/** Order of the fun commands in the emoji row and the slash menu. Unlisted ones go last. */
export const FUN_ORDER = ["music", "bjj", "camera", "theme"]
export const funRank = (name: string) => (FUN_ORDER.indexOf(name) + 1 || 99)

/** The fun row: emoji commands, always shown in the prompt bar. */
export function funCommands(data: SiteData) {
  return [
    ...data.pages.filter((page) => page.fun).map((page) => ({ name: page.name, command: `/${page.name}`, emoji: page.emoji ?? "✦", label: page.name })),
    { name: "theme", command: "/theme", emoji: "🎨", label: "theme" },
  ].sort((a, b) => funRank(a.name) - funRank(b.name))
}

function ThemePicker() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {THEMES.map((theme) => (
        <CommandLink
          key={theme.name}
          command={`/theme ${theme.name}`}
          className="rounded border border-border bg-card px-3 py-2 text-left hover:border-accent/60"
        >
          <span className="text-foreground">{theme.label}</span>
          <span className="text-muted-foreground text-xs ml-2">{theme.description}</span>
        </CommandLink>
      ))}
    </div>
  )
}

export function createFunCommands(data: SiteData): Command[] {
  return [
    {
      name: "fun",
      description: "Music, jiu-jitsu, photos and themes",
      run: () => ({
        title: "Fun",
        content: (
          <div className="space-y-4">
            <p>The things I do when I&apos;m not working. They also live in the bar at the bottom.</p>
            <div className="flex flex-wrap gap-3">
              {funCommands(data).map((item) => (
                <CommandLink
                  key={item.command}
                  command={item.command}
                  className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card px-5 py-3 hover:border-accent/60"
                >
                  <span className="text-3xl" aria-hidden>
                    {item.emoji}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </CommandLink>
              ))}
            </div>
          </div>
        ),
      }),
    },
    {
      name: "theme",
      description: "Dress the site up: Matrix, Pokémon, Claude and more",
      fun: true,
      emoji: "🎨",
      complete: () => THEMES.map((theme) => ({ value: `/theme ${theme.name}`, label: theme.label, description: theme.description })),
      run: (args) => {
        const name = args[0]?.toLowerCase()
        if (!name) return { title: "Themes", content: <ThemePicker /> }
        const theme = THEMES.find((entry) => entry.name === name)
        if (!theme) return { tone: "error", content: <div className="space-y-3"><p>No theme called &quot;{name}&quot;. Pick one:</p><ThemePicker /></div> }
        window.dispatchEvent(new CustomEvent("terminal-theme", { detail: theme.name }))
        return { tone: "success", content: `${theme.label} theme on. ${theme.description}.` }
      },
    },
  ]
}
