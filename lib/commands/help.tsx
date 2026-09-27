import { CommandLink } from "@/components/terminal/command-link"
import type { Command, CommandSection } from "./types"

const SECTIONS: Array<{ section: CommandSection; title: string; marker: string; markerClass: string }> = [
  { section: "explore", title: "Explore", marker: "●", markerClass: "text-terracotta" },
  { section: "more", title: "Go deeper", marker: "◆", markerClass: "text-olive" },
  { section: "utility", title: "Utilities", marker: "▸", markerClass: "text-muted-foreground" },
]

export const helpCommand: Command = {
  name: "help",
  description: "Show available commands",
  aliases: ["?"],
  section: "utility",
  run: (_args, { data, registry, discovery }) => {
    const { hintsAfter, hints } = data.config.secrets
    const eggs = registry.commands.filter((command) => command.section === "secret")
    const explored = discovery.commandsRun.length
    const showHints = explored >= hintsAfter

    const ordered = (section: CommandSection) => {
      const commands = registry.commands.filter((command) => command.section === section)
      if (section !== "explore") return commands
      return [...commands].sort((a, b) => data.config.nav.indexOf(a.name) - data.config.nav.indexOf(b.name))
    }

    return {
      title: "Help",
      next: data.config.quickActions,
      content: (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            Click anything, or type it. Tab autocompletes, ↑/↓ walks history, and every page has its own URL.
          </p>

          {SECTIONS.map(({ section, title, marker, markerClass }) => (
            <section key={section}>
              <h3 className="font-medium mb-2">
                <span className={`${markerClass} mr-2`}>{marker}</span>
                {title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 pl-5">
                {ordered(section).map((command) => (
                  <div key={command.name}>
                    <CommandLink command={command.name} /> <span className="text-muted-foreground">- {command.description}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h3 className="font-medium mb-2 flex flex-wrap items-center gap-2">
              <span className="text-teal-stone">✧</span>
              Secrets
              <span className="text-xs bg-teal-stone/15 text-teal-stone px-2 py-0.5 rounded">
                {discovery.eggsFound.length}/{eggs.length} found
              </span>
            </h3>
            {showHints ? (
              <div className="space-y-1.5 pl-5">
                {hints.map((hint) => (
                  <div key={hint.command} className="italic text-teal-stone">
                    &quot;{hint.hint}&quot;{" "}
                    <CommandLink command={hint.command} className="not-italic text-muted-foreground hover:text-teal-stone hover:underline">
                      try {hint.command}
                    </CommandLink>
                  </div>
                ))}
                <p className="text-muted-foreground text-xs pt-1">There are more than these. Some are easy to guess.</p>
              </div>
            ) : (
              <p className="text-muted-foreground pl-5">
                Hidden commands exist. Hints appear here after you&apos;ve explored {hintsAfter} different commands (
                {explored}/{hintsAfter}).
              </p>
            )}
          </section>
        </div>
      ),
    }
  },
}
