"use client"

import type React from "react"
import {
  ProjectDetail,
  defaultMobileActions,
  WritingPostDetail,
  configuredCommands,
  logs,
  mobileMenuGroups,
  projects,
  renderConfiguredCommand,
  terminalConfig,
  writingPosts,
  type CommandCategory,
  type CommandTier,
  type ConfigCommand,
  type TerminalAction,
  type UnlockGroup,
} from "@/lib/terminal-config"
import { AnimatedASCII, CompileAnimation, DeployAnimation, MatrixRain, PulseBanner, ReplayButton } from "./animations"

export interface CommandResult {
  content: React.ReactNode
  type?: "command" | "error" | "success"
  unlockMessage?: React.ReactNode
  action?: "clear"
  actions?: TerminalAction[]
}

export interface DiscoveryState {
  basicCommandsUsed: number
  advancedCommandsUsed: number
  advancedUnlocked: boolean
  easterEggsFound: string[]
  showingHints: boolean
}

export interface Command {
  name: string
  description: string
  category: CommandCategory
  tier: CommandTier
  aliases?: string[]
  unlockGroup?: UnlockGroup
  execute: (args: string[], discoveryState?: DiscoveryState) => CommandResult
}

export interface ResolvedCommand {
  command?: Command
  canonicalInput: string
  canonicalName: string
  args: string[]
}

const getAliases = (): Record<string, string> => {
  if (typeof window === "undefined") return {}

  try {
    const saved = localStorage.getItem("terminal-aliases")
    return saved ? (JSON.parse(saved) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

const setAlias = (alias: string, command: string) => {
  const aliases = getAliases()
  aliases[alias] = command
  localStorage.setItem("terminal-aliases", JSON.stringify(aliases))
}

const configuredContentCommands: Command[] = configuredCommands.map((command: ConfigCommand) => ({
  ...command,
  execute: () => ({
    content: renderConfiguredCommand(command),
    actions: command.actions,
  }),
}))

const getConfiguredCommand = (name: string) => configuredCommands.find((command) => command.name === name)

function runTerminalCommand(command: string) {
  window.dispatchEvent(new CustomEvent("terminal-command", { detail: command }))
}

function CommandNameButton({
  command,
  tone = "accent",
}: {
  command: Command
  tone?: "accent" | "olive" | "teal"
}) {
  const colorClass = tone === "olive" ? "text-olive" : tone === "teal" ? "text-teal-stone" : "text-accent"

  return (
    <button
      type="button"
      onClick={() => runTerminalCommand(command.name)}
      className={`${colorClass} hover:underline max-md:rounded max-md:border max-md:border-border/60 max-md:bg-muted/20 max-md:px-2 max-md:py-1 max-md:text-left`}
    >
      {command.name}
    </button>
  )
}

const utilityCommands: Command[] = [
  {
    name: "help",
    description: "Show available commands",
    category: "Core",
    tier: "basic",
    execute: (_args, discoveryState) => {
      const basicProgress = discoveryState?.basicCommandsUsed || 0
      const advancedProgress = discoveryState?.advancedCommandsUsed || 0
      const advancedUnlocked = discoveryState?.advancedUnlocked || false
      const showingHints = discoveryState?.showingHints || false
      const easterEggsFound = discoveryState?.easterEggsFound?.length || 0

      const visibleBasic = allCommands.filter((command) => command.tier === "basic" && command.category !== "Easter Eggs")
      const visibleAdvanced = allCommands.filter((command) => command.tier === "advanced" && command.category !== "Easter Eggs")

      return {
        content: (
          <div className="space-y-6">
            <div>
              <h3 className="text-accent font-semibold text-lg mb-3">Available Commands</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Commands are case-insensitive. Try typing a few letters and press Tab for autocomplete.
              </p>
            </div>

            <div>
              <h4 className="text-foreground font-medium mb-2 flex flex-wrap items-center gap-2">
                <span className="text-terracotta">●</span>
                Basic Commands
                {basicProgress < terminalConfig.discovery.basicUnlockThreshold && (
                  <span className="text-xs bg-terracotta/20 text-terracotta px-2 py-1 rounded">
                    {basicProgress}/{terminalConfig.discovery.basicUnlockThreshold} used
                  </span>
                )}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm pl-6">
                {visibleBasic.map((command) => (
                  <div key={command.name}>
                    <CommandNameButton command={command} /> - {command.description}
                  </div>
                ))}
              </div>
            </div>

            {advancedUnlocked ? (
              <div>
                <h4 className="text-foreground font-medium mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-olive">◆</span>
                  Advanced Commands
                  {!showingHints && (
                    <span className="text-xs bg-olive/20 text-olive px-2 py-1 rounded">
                      {advancedProgress}/{terminalConfig.discovery.advancedUnlockThreshold} used
                    </span>
                  )}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm pl-6">
                  {visibleAdvanced.map((command) => (
                    <div key={command.name}>
                      <CommandNameButton command={command} tone="olive" /> - {command.description}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="opacity-50">
                <h4 className="text-muted-foreground font-medium mb-2 flex flex-wrap items-center gap-2">
                  <span>◇</span>
                  Advanced Commands
                  <span className="text-xs bg-muted/20 text-muted-foreground px-2 py-1 rounded">
                    Locked - Try {Math.max(terminalConfig.discovery.basicUnlockThreshold - basicProgress, 0)} more basic commands
                  </span>
                </h4>
                <p className="text-muted-foreground text-sm pl-6">Use more basic commands to unlock deeper exploration...</p>
              </div>
            )}

            {showingHints ? (
              <div>
                <h4 className="text-foreground font-medium mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-teal-stone">✧</span>
                  Secret Commands
                  <span className="text-xs bg-teal-stone/20 text-teal-stone px-2 py-1 rounded">{easterEggsFound}/5 found</span>
                </h4>
                <div className="space-y-2 text-sm pl-6">
                  {terminalConfig.discovery.secretHints.map((hint) => (
                    <button
                      key={hint.command}
                      type="button"
                      onClick={() => runTerminalCommand(hint.command)}
                      className="block text-left text-teal-stone italic hover:underline max-md:rounded max-md:border max-md:border-teal-stone/20 max-md:bg-teal-stone/10 max-md:px-2 max-md:py-1"
                    >
                      &quot;{hint.hint}&quot;
                      <span className="text-muted-foreground/60 ml-2">Try: {hint.command}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : advancedUnlocked ? (
              <div className="opacity-50">
                <h4 className="text-muted-foreground font-medium mb-2 flex flex-wrap items-center gap-2">
                  <span>✦</span>
                  Secret Commands
                  <span className="text-xs bg-muted/20 text-muted-foreground px-2 py-1 rounded">Hidden - Explore more advanced commands</span>
                </h4>
                <p className="text-muted-foreground text-sm pl-6">There are hidden treasures waiting to be discovered...</p>
              </div>
            ) : null}

            <div className="border-t border-border/20 pt-4">
              <h4 className="text-foreground font-medium mb-2">Suggested journey:</h4>
              <div className="space-y-1 text-sm pl-4">
                {terminalConfig.discovery.journeyPath.map((step) => (
                  <button
                    key={step.command}
                    type="button"
                    onClick={() => runTerminalCommand(step.command)}
                    className="block text-left hover:underline max-md:rounded max-md:border max-md:border-border/60 max-md:bg-muted/20 max-md:px-2 max-md:py-1"
                  >
                    <span className="text-muted-foreground">❯</span> <span className="text-accent">{step.command}</span>{" "}
                    <span className="text-muted-foreground/60">- {step.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ),
      }
    },
  },
  {
    name: "search",
    description: "Search across all content",
    category: "Utilities",
    tier: "basic",
    execute: (args) => {
      const term = args.join(" ").toLowerCase()
      if (!term) return { content: "Usage: search <term>", type: "error" }

      const results: Array<{ type: string; title: string; content: string; slug?: string }> = []

      projects.forEach((project) => {
        if (`${project.title} ${project.summary} ${project.cluster} ${project.status}`.toLowerCase().includes(term)) {
          results.push({ type: "Project", title: project.title, content: project.summary, slug: project.slug })
        }
      })

      writingPosts.forEach((post) => {
        if (`${post.title} ${post.excerpt} ${post.content}`.toLowerCase().includes(term)) {
          results.push({ type: "Writing", title: post.title, content: post.excerpt, slug: post.slug })
        }
      })

      logs.forEach((log) => {
        log.bullets.forEach((bullet) => {
          if (bullet.toLowerCase().includes(term)) {
            results.push({ type: "Log", title: log.date, content: bullet })
          }
        })
      })

      if (results.length === 0) return { content: `No results found for "${term}"`, type: "error" }

      const actions = results
        .filter((result) => result.slug)
        .slice(0, 3)
        .map((result, index) => ({
          label: `open ${result.title}`,
          command: `open ${result.slug}`,
          tone: index === 0 ? "primary" : "muted",
        })) as TerminalAction[]

      return {
        actions,
        content: (
          <div className="space-y-3">
            <p className="text-accent">
              Found {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{term}&quot;:
            </p>
            {results.map((result) => (
              <div key={`${result.type}-${result.title}`} className="border-l-2 border-border/30 pl-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs bg-muted/20 text-muted-foreground px-2 py-1 rounded">{result.type}</span>
                  <span className="text-foreground font-medium">{result.title}</span>
                </div>
                <p className="text-muted-foreground/80 text-sm mt-1">{result.content}</p>
                {result.slug && (
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent("terminal-command", { detail: `open ${result.slug}` }))}
                    className="text-accent text-xs hover:underline mt-1"
                  >
                    open
                  </button>
                )}
              </div>
            ))}
          </div>
        ),
      }
    },
  },
  {
    name: "open",
    description: "Open detailed view of content",
    category: "Utilities",
    tier: "basic",
    execute: (args) => {
      const slug = args[0]
      if (!slug) return { content: "Usage: open <slug>", type: "error" }

      const project = projects.find((item) => item.slug === slug)
      if (project) {
        return {
          actions: [
            { label: "work", command: "work", tone: "primary" },
            { label: "contact", command: "contact", tone: "accent" },
            { label: "writing", command: "writing", tone: "muted" },
          ],
          content: <ProjectDetail project={project} />,
        }
      }

      const post = writingPosts.find((item) => item.slug === slug)
      if (post) {
        return {
          actions: [
            { label: "writing", command: "writing", tone: "primary" },
            { label: "search community", command: "search community", tone: "accent" },
            { label: "work", command: "work", tone: "muted" },
          ],
          content: <WritingPostDetail post={post} />,
        }
      }

      if (slug === "resume") {
        const resumeCommand = getConfiguredCommand("resume")
        if (resumeCommand) return { actions: resumeCommand.actions, content: renderConfiguredCommand(resumeCommand) }
      }

      return { content: `Content not found: ${slug}`, type: "error" }
    },
  },
  {
    name: "cat",
    description: "Print raw content",
    category: "Utilities",
    tier: "basic",
    execute: (args) => {
      const slug = args[0]
      if (!slug) return { content: "Usage: cat <slug>", type: "error" }

      const post = writingPosts.find((item) => item.slug === slug)
      if (!post) return { content: `File not found: ${slug}`, type: "error" }

      return {
        content: (
          <pre className="whitespace-pre-wrap text-sm text-muted-foreground/80">
            {`---\ntitle: ${post.title}\ndate: ${post.date}\nexcerpt: ${post.excerpt}\n---\n\n${post.content}`}
          </pre>
        ),
      }
    },
  },
  {
    name: "clear",
    description: "Clear terminal output",
    category: "Utilities",
    tier: "basic",
    execute: () => ({ content: null, type: "success", action: "clear" }),
  },
  {
    name: "history",
    description: "Show command history",
    category: "Utilities",
    tier: "basic",
    execute: () => {
      const history = JSON.parse(localStorage.getItem("terminal-history") || "[]") as string[]
      if (history.length === 0) return { content: "No command history", type: "error" }

      return {
        content: (
          <div className="space-y-1">
            <p className="text-muted-foreground">Last {Math.min(10, history.length)} commands:</p>
            {history.slice(-10).map((cmd, index) => (
              <div key={`${cmd}-${index}`} className="text-sm">
                <span className="text-muted-foreground/60 mr-2">{Math.max(history.length - 10, 0) + index + 1}</span>
                <span className="text-foreground">{cmd}</span>
              </div>
            ))}
          </div>
        ),
      }
    },
  },
  {
    name: "alias",
    description: "Create command aliases",
    category: "Utilities",
    tier: "basic",
    execute: (args) => {
      const aliasString = args.join(" ")
      const match = aliasString.match(/^(\w+)=(.+)$/)

      if (!match) {
        const aliases = getAliases()
        if (Object.keys(aliases).length === 0) return { content: "No aliases set. Usage: alias <name>=<command>", type: "error" }

        return {
          content: (
            <div className="space-y-1">
              <p className="text-muted-foreground">Current aliases:</p>
              {Object.entries(aliases).map(([alias, command]) => (
                <div key={alias} className="text-sm">
                  <span className="text-accent">{alias}</span>
                  <span className="text-muted-foreground mx-2">=</span>
                  <span className="text-foreground">{command}</span>
                </div>
              ))}
            </div>
          ),
        }
      }

      const [, alias, command] = match
      setAlias(alias, command.trim())

      return { content: `Alias set: ${alias} = ${command.trim()}`, type: "success" }
    },
  },
  {
    name: "theme",
    description: "Change color theme",
    category: "Utilities",
    tier: "basic",
    execute: (args) => {
      const theme = args[0]
      if (!theme || !["dark", "light", "auto"].includes(theme)) return { content: "Usage: theme <dark|light|auto>", type: "error" }

      localStorage.setItem("terminal-theme", theme)
      window.dispatchEvent(new CustomEvent("terminal-theme", { detail: theme }))

      return { content: `Theme set to ${theme}`, type: "success" }
    },
  },
  {
    name: "subscribe",
    description: "Subscribe to updates",
    category: "Utilities",
    tier: "basic",
    execute: () => ({
      content: (
        <div className="space-y-3">
          <p className="text-accent">Subscribe for updates</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="bg-muted/10 border border-border/30 rounded px-3 py-2 text-foreground placeholder-sage/50 flex-1"
            />
            <button className="bg-terracotta hover:bg-terracotta/80 text-foreground px-4 py-2 rounded">Subscribe</button>
          </div>
          <p className="text-muted-foreground/60 text-sm">Get notified about new projects and writing.</p>
        </div>
      ),
    }),
  },
  {
    name: "share",
    description: "Share current terminal state",
    category: "Utilities",
    tier: "basic",
    execute: () => {
      const url = `${window.location.origin}${window.location.pathname}#shared`
      navigator.clipboard.writeText(url)

      return { content: "Permalink copied to clipboard!", type: "success" }
    },
  },
]

const animationCommands: Command[] = [
  {
    name: "turntable",
    description: "Spinning record animation",
    category: "Easter Eggs",
    tier: "secret",
    execute: () => {
      const frames = [
        "    ╭─────────╮\n    │  ●───○  │\n    │    ●    │\n    │  ○───●  │\n    ╰─────────╯",
        "    ╭─────────╮\n    │  ○───●  │\n    │    ○    │\n    │  ●───○  │\n    ╰─────────╯",
      ]

      return {
        content: (
          <div className="space-y-4">
            <div className="font-mono text-center">
              <AnimatedASCII frames={frames} duration={2000} />
            </div>
            <p className="text-center text-muted-foreground">Now spinning...</p>
            <ReplayButton command="turntable" />
          </div>
        ),
      }
    },
  },
  {
    name: "slapbump",
    description: "Jiu-jitsu greeting animation",
    category: "Easter Eggs",
    tier: "secret",
    aliases: ["jits"],
    unlockGroup: "secret",
    execute: () => {
      const frames = ["  o/     \\o  ", "  o|     |o  ", "  o\\     /o  ", "  o/\\   /\\o  ", "  o/\\o o/\\o  "]

      return {
        content: (
          <div className="space-y-4">
            <div className="font-mono text-center">
              <AnimatedASCII frames={frames} duration={2500} />
            </div>
            <p className="text-center text-teal-stone font-medium">Flow like water, adapt like bamboo</p>
            <ReplayButton command="jits" />
          </div>
        ),
        unlockMessage: <div className="text-teal-stone text-sm font-medium">✧ Easter Egg Unlocked: Brazilian Flow ✧</div>,
      }
    },
  },
  {
    name: "analog",
    description: "Vinyl record spinning animation",
    category: "Easter Eggs",
    tier: "secret",
    unlockGroup: "secret",
    execute: () => {
      const frames = [
        "    ╭─────────╮\n    │  ●───○  │\n    │    ●    │\n    │  ○───●  │\n    ╰─────────╯",
        "    ╭─────────╮\n    │  ○───●  │\n    │    ○    │\n    │  ●───○  │\n    ╰─────────╯",
      ]

      return {
        content: (
          <div className="space-y-4">
            <div className="font-mono text-center">
              <AnimatedASCII frames={frames} duration={2000} />
            </div>
            <p className="text-center text-teal-stone">Analog warmth in a digital world</p>
            <ReplayButton command="analog" />
          </div>
        ),
        unlockMessage: <div className="text-teal-stone text-sm font-medium">✧ Easter Egg Unlocked: Vinyl Spin ✧</div>,
      }
    },
  },
  {
    name: "matrix",
    description: "Digital rain animation",
    category: "Easter Eggs",
    tier: "secret",
    unlockGroup: "secret",
    execute: () => ({
      content: (
        <div className="space-y-4">
          <div className="font-mono text-sm">
            <MatrixRain />
          </div>
          <p className="text-center text-teal-stone">There is no spoon...</p>
          <ReplayButton command="matrix" />
        </div>
      ),
      unlockMessage: <div className="text-teal-stone text-sm font-medium">✧ Easter Egg Unlocked: Digital Rain ✧</div>,
    }),
  },
  {
    name: "rangoli",
    description: "Sacred geometry bloom animation",
    category: "Easter Eggs",
    tier: "secret",
    unlockGroup: "secret",
    execute: () => {
      const frames = ["    ·    ", "   ·•·   ", "  ·•○•·  ", " ·•○●○•· ", "·•○●◆●○•·", "•○●◆◇◆●○•"]

      return {
        content: (
          <div className="space-y-4">
            <div className="font-mono text-center">
              <AnimatedASCII frames={frames} duration={3000} />
            </div>
            <p className="text-center text-teal-stone">Sacred patterns emerge from intention</p>
            <ReplayButton command="rangoli" />
          </div>
        ),
        unlockMessage: <div className="text-teal-stone text-sm font-medium">✧ Easter Egg Unlocked: Sacred Geometry ✧</div>,
      }
    },
  },
  {
    name: "play",
    description: "Infinite game meditation",
    category: "Easter Eggs",
    tier: "secret",
    unlockGroup: "secret",
    execute: () => {
      const symbols = ["○", "◯", "⊙", "●", "⚫", "⬤"]
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]

      return {
        content: (
          <div className="space-y-4 text-center">
            <div className="text-6xl text-teal-stone animate-pulse">{randomSymbol}</div>
            <div className="space-y-2">
              <p className="text-teal-stone font-medium">The point of an infinite game is to keep playing</p>
              <p className="text-muted-foreground/70 text-sm italic">Press play again. Each moment, different.</p>
            </div>
            <ReplayButton command="play" />
          </div>
        ),
        unlockMessage: <div className="text-teal-stone text-sm font-medium">✧ Easter Egg Unlocked: Infinite Game ✧</div>,
      }
    },
  },
  {
    name: "linkinpark",
    description: "Figlet banner pulse animation",
    category: "Easter Eggs",
    tier: "secret",
    execute: () => {
      const banner = `
██╗     ██╗███╗   ██╗██╗  ██╗██╗███╗   ██╗    ██████╗  █████╗ ██████╗ ██╗  ██╗
██║     ██║████╗  ██║██║ ██╔╝██║████╗  ██║    ██╔══██╗██╔══██╗██╔══██╗██║ ██╔╝
██║     ██║██╔██╗ ██║█████╔╝ ██║██╔██╗ ██║    ██████╔╝███████║██████╔╝█████╔╝ 
██║     ██║██║╚██╗██║██╔═██╗ ██║██║╚██╗██║    ██╔═══╝ ██╔══██║██╔══██╗██╔═██╗ 
███████╗██║██║ ╚████║██║  ██╗██║██║ ╚████║    ██║     ██║  ██║██║  ██║██║  ██╗
╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
      `

      return {
        content: (
          <div className="space-y-4">
            <div className="font-mono text-xs overflow-x-auto">
              <PulseBanner text={banner} />
            </div>
            <p className="text-center text-muted-foreground">In the end, it doesn&apos;t even matter...</p>
            <ReplayButton command="linkinpark" />
          </div>
        ),
      }
    },
  },
  {
    name: "compile",
    description: "ASCII progress bar with logs",
    category: "Easter Eggs",
    tier: "secret",
    execute: () => ({
      content: (
        <div className="space-y-2">
          <CompileAnimation />
          <ReplayButton command="compile" />
        </div>
      ),
    }),
  },
  {
    name: "deploy",
    description: "Deployment progress animation",
    category: "Easter Eggs",
    tier: "secret",
    execute: () => ({
      content: (
        <div className="space-y-2">
          <DeployAnimation />
          <ReplayButton command="deploy" />
        </div>
      ),
    }),
  },
  {
    name: "tapout",
    description: "Triangle submission animation",
    category: "Easter Eggs",
    tier: "secret",
    execute: () => {
      const frames = ["    /\\    ", "   /  \\   ", "  /____\\  ", "  \\____/  ", "   \\  /   ", "    \\/    "]

      return {
        content: (
          <div className="space-y-4">
            <div className="font-mono text-center">
              <AnimatedASCII frames={frames} duration={2000} />
            </div>
            <p className="text-center text-accent font-medium">Respect the tap. Reset. Go again.</p>
            <ReplayButton command="tapout" />
          </div>
        ),
      }
    },
  },
  {
    name: "oss",
    description: "OSS figlet banner",
    category: "Easter Eggs",
    tier: "secret",
    execute: () => ({
      content: (
        <div className="space-y-4">
          <pre className="font-mono text-sm text-center text-accent">{` ██████╗ ███████╗███████╗
██╔═══██╗██╔════╝██╔════╝
██║   ██║███████╗███████╗
╚██████╔╝███████║███████║
 ╚═════╝ ╚══════╝╚══════╝`}</pre>
          <p className="text-center text-muted-foreground">Onegaishimasu!</p>
          <ReplayButton command="oss" />
        </div>
      ),
    }),
  },
]

const allCommands = [...configuredContentCommands, ...utilityCommands, ...animationCommands]

function parseInput(input: string) {
  const [commandName = "", ...args] = input.trim().split(/\s+/)
  return { commandName, args }
}

function findCommand(name: string) {
  const lowerName = name.toLowerCase()
  return allCommands.find(
    (command) => command.name.toLowerCase() === lowerName || command.aliases?.some((alias) => alias.toLowerCase() === lowerName),
  )
}

export function resolveCommandInput(input: string): ResolvedCommand {
  const { commandName, args } = parseInput(input)
  const lowerCommandName = commandName.toLowerCase()
  const aliases = getAliases()
  const userAliasKey = Object.keys(aliases).find((alias) => alias.toLowerCase() === lowerCommandName)

  if (userAliasKey) {
    const aliasedInput = `${aliases[userAliasKey]} ${args.join(" ")}`.trim()
    return resolveCommandInput(aliasedInput)
  }

  const command = findCommand(lowerCommandName)
  return {
    command,
    canonicalInput: [command?.name || lowerCommandName, ...args].filter(Boolean).join(" "),
    canonicalName: command?.name || lowerCommandName,
    args,
  }
}

export function executeCommand(input: string, discoveryState?: DiscoveryState): CommandResult {
  const { command, canonicalName, args } = resolveCommandInput(input)

  if (!command) {
    const originalName = parseInput(input).commandName
    return { content: `Command not found: ${originalName}. Type 'help' for available commands.`, type: "error" }
  }

  const advancedUnlocked = discoveryState?.advancedUnlocked || false
  const showingHints = discoveryState?.showingHints || false

  if (command.tier === "advanced" && !advancedUnlocked) {
    const remaining = Math.max(terminalConfig.discovery.basicUnlockThreshold - (discoveryState?.basicCommandsUsed || 0), 0)

    return {
      content: (
        <div className="space-y-2">
          <p className="text-muted-foreground">🔒 {terminalConfig.discovery.lockedAdvancedTitle}</p>
          <p className="text-muted-foreground/70 text-sm">
            {terminalConfig.discovery.lockedAdvancedHint.replace("{remaining}", String(remaining))}
          </p>
          <p className="text-ochre text-sm italic">{terminalConfig.discovery.lockedAdvancedExamples}</p>
        </div>
      ),
      type: "error",
    }
  }

  if (command.tier === "secret" && !showingHints) {
    return {
      content: (
        <div className="space-y-2">
          <p className="text-muted-foreground">✧ {terminalConfig.discovery.lockedSecretTitle} ✧</p>
          <p className="text-muted-foreground/70 text-sm">{terminalConfig.discovery.lockedSecretHint}</p>
        </div>
      ),
      type: "error",
    }
  }

  try {
    const result = command.execute(args, discoveryState)

    if (command.unlockGroup === "secret" && result.unlockMessage) {
      return {
        ...result,
        content: (
          <div className="space-y-4">
            {result.unlockMessage}
            {result.content}
          </div>
        ),
      }
    }

    return result
  } catch (error) {
    return { content: `Error executing ${canonicalName}: ${error}`, type: "error" }
  }
}

export function getAllCommands(): Command[] {
  return allCommands
}

export function isCommandVisible(command: Command, discoveryState?: DiscoveryState) {
  if (command.tier === "basic") return true
  if (command.tier === "advanced") return discoveryState?.advancedUnlocked || false
  if (command.tier === "secret") return discoveryState?.showingHints || false
  return false
}

export function getVisibleCommands(discoveryState?: DiscoveryState): Command[] {
  return allCommands.filter((command) => isCommandVisible(command, discoveryState))
}

export function canExecuteCommandInput(input: string, discoveryState?: DiscoveryState) {
  const resolved = resolveCommandInput(input)
  return resolved.command ? isCommandVisible(resolved.command, discoveryState) : false
}

export function getMobileCommandGroups(discoveryState?: DiscoveryState) {
  return mobileMenuGroups
    .map((group) => ({
      ...group,
      commands: group.commands.filter((command) => canExecuteCommandInput(command, discoveryState)),
    }))
    .filter((group) => group.commands.length > 0)
}

export function getDefaultMobileActions(): TerminalAction[] {
  return defaultMobileActions
}

function getOpenSuggestions(query: string) {
  const openQuery = query.replace(/^open\s+/, "").toLowerCase()
  const projectSuggestions = projects
    .filter((project) => project.slug.startsWith(openQuery) || project.title.toLowerCase().includes(openQuery))
    .map((project) => `open ${project.slug}`)
  const writingSuggestions = writingPosts
    .filter((post) => post.slug.startsWith(openQuery) || post.title.toLowerCase().includes(openQuery))
    .map((post) => `open ${post.slug}`)

  return [...projectSuggestions, ...writingSuggestions]
}

export function getCommandSuggestions(input: string, discoveryState?: DiscoveryState): string[] {
  const query = input.toLowerCase()
  const aliases = Object.keys(getAliases())

  if (query.startsWith("open ")) {
    return getOpenSuggestions(query).slice(0, 5)
  }

  const commandNames = allCommands
    .filter((command) => isCommandVisible(command, discoveryState))
    .flatMap((command) => [command.name, ...(command.aliases || [])])

  return [...commandNames, ...aliases]
    .filter((name, index, names) => names.indexOf(name) === index)
    .filter((name) => name.toLowerCase().startsWith(query))
    .slice(0, 5)
}
