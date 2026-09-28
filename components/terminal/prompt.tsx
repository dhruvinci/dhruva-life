"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { funCommands } from "@/lib/commands/fun"
import type { Registry } from "@/lib/commands/registry"
import { useTerminalApi } from "./context"

interface PromptProps {
  registry: Registry
  history: string[]
  path: string
  funUnlocked: boolean
  inputRef: React.RefObject<HTMLInputElement | null>
}

/** Where the persistent contact strip shows, and what it says there. */
const CONTACT_PROMPTS: Array<{ prefix: string; text: string }> = [
  { prefix: "/research", text: "Want to collaborate on research?" },
  { prefix: "/work", text: "Building vision AI or robots? Let's talk." },
]

/**
 * Claude Code-style prompt: a bordered input, and a slash menu that opens above it.
 * "/" lists commands; "/blog " lists posts; Enter or Tab picks the highlighted row.
 */
export function Prompt({ registry, history, path, funUnlocked, inputRef }: PromptProps) {
  const { run } = useTerminalApi()
  const [input, setInput] = useState("")
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [focused, setFocused] = useState(false)
  const [active, setActive] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  const items = useMemo(() => registry.menu(input, funUnlocked), [input, registry, funUnlocked])
  const contactPrompt = CONTACT_PROMPTS.find((entry) => path === entry.prefix || path.startsWith(`${entry.prefix}/`))
  const { contact } = registry.data.config
  const menuOpen = focused && !dismissed && items.length > 0
  const activeItem = items[Math.min(active, items.length - 1)]

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) inputRef.current?.focus({ preventScroll: true })

    // "/" from anywhere on the page opens the command menu.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement
      if (target.closest("input, textarea, [contenteditable=true]")) return
      event.preventDefault()
      setInput("/")
      setActive(0)
      setDismissed(false)
      inputRef.current?.focus()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [inputRef])

  const update = (value: string) => {
    setInput(value)
    setActive(0)
    setDismissed(false)
    setHistoryIndex(-1)
  }

  const submit = (command: string) => {
    if (!command.trim()) return
    run(command, "typed")
    update("")
  }

  /** Tab: fill in the highlighted row; commands with items get a trailing space to open their list. */
  const complete = () => {
    if (!activeItem) return
    const command = registry.find(activeItem.value.slice(1).split(" ")[0])
    const isBareCommand = !activeItem.value.includes(" ")
    update(isBareCommand && command?.complete ? `${activeItem.value} ` : activeItem.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      submit(menuOpen && activeItem ? activeItem.value : input)
    } else if (event.key === "Tab") {
      if (!menuOpen) return
      event.preventDefault()
      complete()
    } else if (event.key === "ArrowDown") {
      event.preventDefault()
      if (menuOpen) setActive((index) => Math.min(index + 1, items.length - 1))
      else if (historyIndex !== -1) {
        const index = historyIndex + 1
        setHistoryIndex(index >= history.length ? -1 : index)
        setInput(index >= history.length ? "" : history[index])
        setDismissed(true)
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      if (menuOpen) setActive((index) => Math.max(index - 1, 0))
      else if (history.length > 0) {
        const index = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(index)
        setInput(history[index])
        setDismissed(true)
      }
    } else if (event.key === "Escape") {
      event.preventDefault()
      if (menuOpen) setDismissed(true)
      else update("")
    }
  }

  return (
    <div className="print:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border pb-safe">
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-3 space-y-2">
        {menuOpen && (
          <ul
            id="slash-menu"
            role="listbox"
            aria-label="Commands"
            className="max-h-[45vh] overflow-y-auto rounded-lg border border-border bg-card py-1 text-sm shadow-lg"
          >
            {items.map((item, index) => (
              <li
                key={item.value}
                id={`slash-${index}`}
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => submit(item.value)}
                className={`grid grid-cols-[minmax(7rem,auto)_1fr] gap-x-4 px-3 py-2 md:py-1.5 cursor-pointer ${
                  index === active ? "bg-muted" : ""
                }`}
              >
                <span className={`truncate ${index === active ? "text-accent" : "text-foreground"}`}>{item.label}</span>
                <span className="truncate text-muted-foreground">{item.description}</span>
              </li>
            ))}
          </ul>
        )}

        {contactPrompt && (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-xs">
            <span className="text-muted-foreground">{contactPrompt.text}</span>
            <a href={`mailto:${contact.email}`} className="text-accent hover:underline">
              email me
            </a>
            <a href={contact.calendar} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              book a call
            </a>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              LinkedIn
            </a>
          </p>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              update("/")
              inputRef.current?.focus()
            }}
            className="md:hidden shrink-0 rounded-lg border border-border bg-card px-3 py-2 text-sm text-accent"
            aria-label="Show commands"
          >
            /
          </button>
          <label className="flex flex-1 min-w-0 items-center gap-3 py-2">
            <span className="text-sage text-sm" aria-hidden>
              $
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => update(event.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              enterKeyHint="go"
              role="combobox"
              aria-label="Command"
              aria-expanded={menuOpen}
              aria-controls="slash-menu"
              aria-activedescendant={menuOpen ? `slash-${Math.min(active, items.length - 1)}` : undefined}
              aria-autocomplete="list"
              placeholder="type / for commands"
              className="prompt-input w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </label>
          {funUnlocked && (
            <nav aria-label="Fun" className="flex shrink-0 items-center gap-0.5">
              {funCommands(registry.data).map((item) => (
                <button
                  key={item.command}
                  type="button"
                  onClick={() => run(item.command)}
                  className="rounded px-1.5 py-1 text-lg leading-none hover:bg-muted"
                  aria-label={item.label}
                  title={item.command}
                >
                  {item.emoji}
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  )
}
