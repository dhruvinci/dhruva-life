import { CommandLink } from "@/components/terminal/command-link"
import type { Command } from "./types"

export const helpCommand: Command = {
  name: "help",
  description: "Show all commands",
  aliases: ["?"],
  run: (_args, { data, registry }) => ({
    title: "Help",
    next: data.config.quickActions,
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-[7rem_1fr] gap-x-4 gap-y-1.5">
          {registry.menuCommands().map((command) => (
            <div key={command.name} className="contents">
              <CommandLink command={`/${command.name}`} />
              <span className="text-muted-foreground">{command.description}</span>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground text-xs">
          Type <span className="text-accent">/</span> anytime to open this list. Add a space after /work, /research or /writing to
          pick an item. ↑/↓ for history. /theme light or /theme dark to switch colours.
        </p>
      </div>
    ),
  }),
}
