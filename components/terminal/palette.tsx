"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import type { Registry } from "@/lib/commands/registry"
import { getRoutes } from "@/lib/routes"

interface PaletteItem {
  label: string
  hint: string
  input: string
}

interface PaletteProps {
  registry: Registry
  onRun: (input: string) => void
  onClose: () => void
}

function buildItems(registry: Registry): PaletteItem[] {
  const routes = getRoutes(registry.data).map((route) => ({ label: route.title, hint: route.path, input: route.input }))
  const tools = ["help", "ls", "history", "share", "clear", "theme dark", "theme light", "theme auto"].map((input) => ({
    label: input,
    hint: registry.find(input.split(" ")[0])?.description ?? "",
    input,
  }))
  return [{ label: "Home", hint: "/", input: "cd ~" }, ...routes, ...tools]
}

/**
 * Lower is better; undefined means no match. A substring match in any one field
 * (title, path, command) beats scattered letters, and earlier beats later.
 */
function score(item: PaletteItem, query: string) {
  const fields = [item.label, item.hint.replace(/^\/[^/]+\//, ""), item.input.replace(/^open /, "")].map((field) => field.toLowerCase())
  const direct = Math.min(...fields.map((field) => field.indexOf(query)).filter((index) => index !== -1))
  if (Number.isFinite(direct)) return direct

  const haystack = fields.join(" ")
  let position = -1
  for (const char of query) {
    position = haystack.indexOf(char, position + 1)
    if (position === -1) return undefined
  }
  return 100 + position
}

export function Palette({ registry, onRun, onClose }: PaletteProps) {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const items = useMemo(() => buildItems(registry), [registry])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items
      .map((item) => ({ item, rank: score(item, q) }))
      .filter((entry): entry is { item: PaletteItem; rank: number } => entry.rank !== undefined)
      .sort((a, b) => a.rank - b.rank)
      .map((entry) => entry.item)
  }, [items, query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const choose = (item: PaletteItem | undefined) => {
    if (!item) return
    onClose()
    onRun(item.input)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((index) => Math.min(index + 1, results.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((index) => Math.max(index - 1, 0))
    } else if (event.key === "Enter") {
      event.preventDefault()
      choose(results[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Jump to">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto mt-[12vh] w-[calc(100%-2rem)] max-w-lg rounded-lg border border-border bg-card shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="text-sage" aria-hidden>
            ❯
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="jump to..."
            aria-label="Jump to"
            aria-controls="palette-results"
            aria-activedescendant={results[active] ? `palette-${active}` : undefined}
            className="prompt-input flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="text-xs text-muted-foreground">esc</kbd>
        </div>
        <ul id="palette-results" role="listbox" className="max-h-[50vh] overflow-y-auto py-1">
          {results.length === 0 && <li className="px-4 py-3 text-sm text-muted-foreground">Nothing matches. Try search &lt;term&gt; in the prompt.</li>}
          {results.map((item, index) => (
            <li
              key={item.input}
              id={`palette-${index}`}
              role="option"
              aria-selected={index === active}
              onMouseEnter={() => setActive(index)}
              onClick={() => choose(item)}
              className={`flex items-baseline justify-between gap-4 px-4 py-2 text-sm cursor-pointer ${
                index === active ? "bg-muted text-foreground" : "text-muted-foreground"
              }`}
            >
              <span className={index === active ? "text-accent" : "text-foreground"}>{item.label}</span>
              <span className="truncate text-xs">{item.hint}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
