"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createRegistry } from "@/lib/commands/registry"
import type { Discovery } from "@/lib/commands/types"
import { routeForPath } from "@/lib/routes"
import type { SiteData } from "@/lib/site-types"
import { emptyDiscovery, storage } from "@/lib/storage"
import { TerminalContext, type TerminalApi } from "./context"
import { Header } from "./header"
import { Intro } from "./intro"
import { OutputBlock, type Block } from "./output-block"
import { Palette } from "./palette"
import { Prompt } from "./prompt"

interface TerminalProps {
  data: SiteData
  /** Command already "run" when the page loads, e.g. "work" on /work. Rendered on the server. */
  initialInput?: string
}

/**
 * typed:   appended below earlier output, like a shell.
 * click:   replaces the screen, like following a link.
 * history: back/forward; replaces without pushing a new history entry.
 */
type Source = "typed" | "click" | "history"

const MAX_BLOCKS = 50

function isInteractive(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("a, button, input, textarea, select, [role=button], [role=option]"))
}

export function Terminal({ data, initialInput }: TerminalProps) {
  const registry = useMemo(() => createRegistry(data), [data])
  const nextId = useRef(1)
  const pendingScroll = useRef<{ id?: string; focus: boolean } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const baseTitle = `${data.config.name} - terminal`

  const [initial] = useState(() => (initialInput ? registry.execute(initialInput, { data, discovery: emptyDiscovery }) : undefined))
  const [blocks, setBlocks] = useState<Block[]>(() =>
    initial && initialInput
      ? [
          {
            id: "b0",
            input: initialInput,
            content: initial.result.content,
            tone: initial.result.tone,
            path: initial.path,
            next: initial.result.next,
          },
        ]
      : [],
  )
  const [path, setPath] = useState(initial?.path ?? "/")
  const [history, setHistory] = useState<string[]>([])
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [announcement, setAnnouncement] = useState("")
  const discovery = useRef<Discovery>(emptyDiscovery)
  const [discoverySnapshot, setDiscoverySnapshot] = useState<Discovery>(emptyDiscovery)

  const recordDiscovery = useCallback(
    (name: string, isEgg: boolean) => {
      const previous = discovery.current
      const next: Discovery = {
        commandsRun: previous.commandsRun.includes(name) ? previous.commandsRun : [...previous.commandsRun, name],
        eggsFound: isEgg && !previous.eggsFound.includes(name) ? [...previous.eggsFound, name] : previous.eggsFound,
      }
      discovery.current = next
      setDiscoverySnapshot(next)
      storage.setDiscovery(next)

      const notices: string[] = []
      if (next.eggsFound.length > previous.eggsFound.length) {
        const total = registry.commands.filter((command) => command.section === "secret").length
        notices.push(`✧ Easter egg found (${next.eggsFound.length}/${total})`)
      }
      const threshold = data.config.secrets.hintsAfter
      if (previous.commandsRun.length < threshold && next.commandsRun.length >= threshold) {
        notices.push("✧ Secret hints unlocked. Check help.")
      }
      return notices.length > 0 ? notices.join("  ") : undefined
    },
    [data, registry],
  )

  const goHome = useCallback(
    (source: Source, { replace = false } = {}) => {
      setBlocks([])
      setPath("/")
      if (source !== "history" && window.location.pathname !== "/") {
        if (replace) window.history.replaceState(null, "", "/")
        else window.history.pushState(null, "", "/")
      }
      document.title = baseTitle
      setAnnouncement("Home")
      pendingScroll.current = { focus: false }
    },
    [baseTitle],
  )

  const run = useCallback(
    function runCommand(input: string, source: Source = "click", depth = 0): void {
      const trimmed = input.trim()
      if (!trimmed) return

      if (source === "typed") {
        const nextHistory = [...storage.getHistory().filter((item) => item !== trimmed), trimmed].slice(-50)
        storage.setHistory(nextHistory)
        setHistory(nextHistory)
      }

      const { result, resolved, path: routePath } = registry.execute(trimmed, { data, discovery: discovery.current }, storage.getAliases())

      if (result.redirect && depth < 2) return runCommand(result.redirect, source, depth + 1)
      if (result.clear) return goHome(source, { replace: true })
      if (result.home) return goHome(source)

      const notice =
        resolved.command && result.tone !== "error"
          ? recordDiscovery(resolved.command.name, resolved.command.section === "secret")
          : undefined

      const block: Block = {
        id: `b${nextId.current++}`,
        input: trimmed,
        content: result.content,
        tone: result.tone,
        path: routePath,
        notice,
        next: result.next,
      }

      setBlocks((previous) => (source === "typed" ? [...previous, block].slice(-MAX_BLOCKS) : [block]))
      pendingScroll.current = { id: block.id, focus: source === "click" }
      setAnnouncement(result.title ?? `${trimmed}${result.tone === "error" ? " failed" : ""}`)

      if (routePath) {
        setPath(routePath)
        if (source !== "history" && routePath !== window.location.pathname) window.history.pushState(null, "", routePath)
        if (result.title) document.title = `${result.title} | ${data.config.name}`
      }
    },
    [data, goHome, recordDiscovery, registry],
  )

  // Restore per-visitor state once mounted (never during SSR, so hydration matches).
  useEffect(() => {
    setHistory(storage.getHistory())
    discovery.current = storage.getDiscovery()
    setDiscoverySnapshot(discovery.current)
    if (initial?.resolved.command) recordDiscovery(initial.resolved.command.name, false)
    storage.markVisited()
  }, [initial, recordDiscovery])

  // Back/forward shows the page for that URL instead of reloading.
  const runRef = useRef(run)
  useEffect(() => {
    runRef.current = run
  }, [run])
  useEffect(() => {
    const onPopState = () => {
      const route = routeForPath(data, window.location.pathname)
      runRef.current(route ? route.input : "cd ~", "history")
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [data])

  // ⌘K / Ctrl+K opens the jump palette from anywhere.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    const pending = pendingScroll.current
    if (!pending) return
    pendingScroll.current = null
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const element = pending.id ? document.getElementById(pending.id) : null

    if (element && blocks.length > 1) {
      element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })
    } else {
      window.scrollTo({ top: 0, behavior: "auto" })
    }
    // Move focus to new content after navigation so keyboard and screen-reader users land on it.
    if (pending.focus) element?.focus({ preventScroll: true })
  }, [blocks])

  // Plain left-clicks on internal links run the matching command in place;
  // modified clicks (new tab, etc.) fall through to normal browser behavior.
  const handleClick = (event: React.MouseEvent) => {
    const anchor = event.target instanceof Element ? event.target.closest("a") : null

    if (!anchor) {
      const selecting = Boolean(window.getSelection()?.toString())
      if (!isInteractive(event.target) && !selecting && window.matchMedia("(min-width: 768px)").matches) {
        inputRef.current?.focus({ preventScroll: true })
      }
      return
    }

    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (anchor.target === "_blank") return
    const href = anchor.getAttribute("href")
    if (!href?.startsWith("/")) return

    if (href === "/") {
      event.preventDefault()
      run("cd ~")
      return
    }
    const route = routeForPath(data, href)
    if (!route) return
    event.preventDefault()
    run(route.input)
  }

  const api = useMemo<TerminalApi>(() => ({ run: (input, source) => run(input, source), pathFor: registry.pathFor }), [run, registry])

  return (
    <TerminalContext.Provider value={api}>
      <div onClick={handleClick} className="min-h-screen">
        <Header config={data.config} path={path} onFind={() => setPaletteOpen(true)} />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-[35vh] print:p-0 print:max-w-none">
          {blocks.length === 0 && <Intro data={data} />}
          <div className="space-y-10">
            {blocks.map((block, index) => (
              <OutputBlock key={block.id} block={block} latest={index === blocks.length - 1} />
            ))}
          </div>
        </main>
        <Prompt
          data={data}
          registry={registry}
          history={history}
          path={path}
          discovery={discoverySnapshot}
          inputRef={inputRef}
          onFind={() => setPaletteOpen(true)}
        />
        {paletteOpen && <Palette registry={registry} onRun={(input) => run(input)} onClose={() => setPaletteOpen(false)} />}
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </div>
    </TerminalContext.Provider>
  )
}
