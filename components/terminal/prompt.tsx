"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import type { Registry } from "@/lib/commands/registry"
import type { Discovery } from "@/lib/commands/types"
import type { SiteData } from "@/lib/site-types"
import { storage } from "@/lib/storage"
import { useTerminalApi } from "./context"

interface PromptProps {
  data: SiteData
  registry: Registry
  history: string[]
  path: string
  discovery: Discovery
  inputRef: React.RefObject<HTMLInputElement | null>
  onFind: () => void
}

function menuGroups(data: SiteData, registry: Registry, discovery: Discovery) {
  const groups = [
    { label: "Start", commands: data.config.nav },
    { label: "Research", commands: data.research.map((item) => `open ${item.slug}`) },
    { label: "Work", commands: data.projects.map((project) => `open ${project.slug}`) },
    { label: "Writing", commands: data.posts.map((post) => `open ${post.slug}`) },
    { label: "Go deeper", commands: registry.commands.filter((c) => c.section === "more").map((c) => c.name) },
    { label: "Utilities", commands: ["help", "ls", "history", "theme dark", "theme light", "clear"] },
  ]
  if (discovery.commandsRun.length >= data.config.secrets.hintsAfter) {
    groups.push({ label: "Secrets", commands: data.config.secrets.hints.map((hint) => hint.command) })
  }
  return groups.filter((group) => group.commands.length > 0)
}

export function Prompt({ data, registry, history, path, discovery, inputRef, onFind }: PromptProps) {
  const { run } = useTerminalApi()
  const eggsTotal = registry.commands.filter((command) => command.section === "secret").length
  const [input, setInput] = useState("")
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [focused, setFocused] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const suggestions = useMemo(() => registry.suggest(input, storage.getAliases()), [input, registry])
  const ghost = suggestions[0]?.startsWith(input.toLowerCase()) && input ? suggestions[0].slice(input.length) : ""

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) inputRef.current?.focus({ preventScroll: true })

    // "/" jumps to the prompt from anywhere, like many docs sites.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey) return
      const target = event.target as HTMLElement
      if (target.closest("input, textarea, [contenteditable=true]")) return
      event.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [inputRef])

  // Typed commands append like a real terminal; picks from the menu navigate (replace).
  const submit = (command: string, source: "typed" | "click" = "typed") => {
    run(command, source)
    setInput("")
    setHistoryIndex(-1)
    setMenuOpen(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      submit(input)
    } else if (event.key === "Tab") {
      if (!input) return
      event.preventDefault()
      if (ghost) setInput(input + ghost)
      else if (suggestions[0]) setInput(suggestions[0])
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      if (history.length === 0) return
      const index = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(index)
      setInput(history[index])
    } else if (event.key === "ArrowDown") {
      event.preventDefault()
      if (historyIndex === -1) return
      const index = historyIndex + 1
      setHistoryIndex(index >= history.length ? -1 : index)
      setInput(index >= history.length ? "" : history[index])
    } else if (event.key === "Escape" || (event.ctrlKey && event.key === "l")) {
      event.preventDefault()
      if (event.key === "l") run("clear")
      setInput("")
      setHistoryIndex(-1)
    }
  }

  const showSuggestions = focused && input.length > 0 && suggestions.length > 0

  return (
    <div className="print:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border pb-safe">
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-3 space-y-2">
        {showSuggestions && (
          <div className="flex flex-wrap gap-2" aria-label="Suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => submit(suggestion)}
                className="rounded border border-border bg-muted px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {suggestion}
              </button>
            ))}
            <span className="hidden md:inline self-center text-xs text-muted-foreground">Tab to complete</span>
          </div>
        )}

        <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="md:hidden shrink-0 rounded border border-border bg-card px-2.5 py-2 text-xs"
          aria-label="Open command menu"
        >
          ☰
        </button>
        <label className="flex flex-1 items-center gap-3 rounded md:rounded-none border md:border-0 border-border bg-card md:bg-transparent px-3 md:px-0 py-2 md:py-1">
          <span className="text-sage text-sm" aria-hidden>
            $
          </span>
          <span className="relative flex-1">
            {ghost && (
              <span aria-hidden className="pointer-events-none absolute inset-0 whitespace-pre text-sm text-muted-foreground/40">
                <span className="invisible">{input}</span>
                {ghost}
              </span>
            )}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => {
                setInput(event.target.value)
                setHistoryIndex(-1)
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              enterKeyHint="go"
              aria-label="Command"
              placeholder="type a command, or help"
              className="prompt-input relative w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </span>
        </label>
        </div>

        <div className="hidden md:flex items-center justify-between gap-4 text-xs text-muted-foreground" aria-hidden>
          <span className="truncate">
            <span className="text-sage">{data.config.name}</span>
            <span className="text-ochre"> ~{path === "/" ? "" : path}</span>
          </span>
          <span className="flex items-center gap-3 shrink-0">
            <span>
              secrets {discovery.eggsFound.length}/{eggsTotal}
            </span>
            <span>tab complete</span>
            <button type="button" tabIndex={-1} onClick={onFind} className="hover:text-foreground">
              ⌘K jump
            </button>
            <span>/ focus</span>
          </span>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Commands">
          <button type="button" className="absolute inset-0 bg-background/70" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
          <div className="absolute bottom-0 inset-x-0 max-h-[75vh] overflow-y-auto rounded-t-lg border border-border bg-background px-4 pt-4 pb-safe shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium">commands</h2>
              <button type="button" onClick={() => setMenuOpen(false)} className="rounded border border-border px-2 py-1 text-xs text-muted-foreground">
                close
              </button>
            </div>
            <div className="space-y-5 pb-5">
              {menuGroups(data, registry, discovery).map((group) => (
                <section key={group.label} className="space-y-2">
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground">{group.label}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.commands.map((command) => (
                      <button
                        key={command}
                        type="button"
                        onClick={() => submit(command, "click")}
                        className="rounded border border-border bg-muted px-2.5 py-1.5 text-xs"
                      >
                        {command}
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
