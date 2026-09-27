"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createRegistry } from "@/lib/commands/registry"
import type { Discovery } from "@/lib/commands/types"
import { routeForPath } from "@/lib/routes"
import type { SiteData } from "@/lib/site-types"
import { emptyDiscovery, storage } from "@/lib/storage"
import { TerminalContext, type TerminalApi } from "./context"
import { Intro } from "./intro"
import { OutputBlock, type Block } from "./output-block"
import { Prompt } from "./prompt"

interface TerminalProps {
  data: SiteData
  /** Command already "run" when the page loads, e.g. "work" on /work. Rendered on the server. */
  initialInput?: string
}

const MAX_BLOCKS = 50

function isInteractive(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("a, button, input, textarea, select, [role=button]"))
}

export function Terminal({ data, initialInput }: TerminalProps) {
  const registry = useMemo(() => createRegistry(data), [data])
  const nextId = useRef(1)
  const scrollTarget = useRef<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [initial] = useState(() => (initialInput ? registry.execute(initialInput, { data, discovery: emptyDiscovery }) : undefined))
  const [blocks, setBlocks] = useState<Block[]>(() =>
    initial && initialInput
      ? [{ id: "b0", input: initialInput, content: initial.result.content, tone: initial.result.tone, path: initial.path }]
      : [],
  )
  const [chips, setChips] = useState<string[]>(initial?.result.next ?? data.config.quickActions)
  const [history, setHistory] = useState<string[]>([])
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

  const run = useCallback(
    (input: string, { fromHistory = false } = {}) => {
      const trimmed = input.trim()
      if (!trimmed) return

      if (!fromHistory) {
        const nextHistory = [...storage.getHistory().filter((item) => item !== trimmed), trimmed].slice(-50)
        storage.setHistory(nextHistory)
        setHistory(nextHistory)
      }

      const { result, resolved, path } = registry.execute(trimmed, { data, discovery: discovery.current }, storage.getAliases())

      if (result.clear) {
        setBlocks([])
        setChips(data.config.quickActions)
        if (window.location.pathname !== "/") window.history.replaceState(null, "", "/")
        document.title = `${data.config.name} - terminal`
        return
      }

      const notice =
        resolved.command && result.tone !== "error"
          ? recordDiscovery(resolved.command.name, resolved.command.section === "secret")
          : undefined

      const block: Block = {
        id: `b${nextId.current++}`,
        input: trimmed,
        content: result.content,
        tone: result.tone,
        path,
        notice,
      }
      scrollTarget.current = block.id
      setBlocks((previous) => [...previous, block].slice(-MAX_BLOCKS))
      if (result.next) setChips(result.next)

      if (path) {
        if (!fromHistory && path !== window.location.pathname) window.history.pushState(null, "", path)
        if (result.title) document.title = `${result.title} | ${data.config.name}`
      }
    },
    [data, recordDiscovery, registry],
  )

  // Restore per-visitor state once mounted (never during SSR, so hydration matches).
  useEffect(() => {
    setHistory(storage.getHistory())
    discovery.current = storage.getDiscovery()
    setDiscoverySnapshot(discovery.current)
    if (initial?.resolved.command) recordDiscovery(initial.resolved.command.name, false)
    storage.markVisited()
  }, [initial, recordDiscovery])

  // Back/forward replays the command for that URL instead of reloading the page.
  const runRef = useRef(run)
  useEffect(() => {
    runRef.current = run
  }, [run])
  useEffect(() => {
    const onPopState = () => {
      const route = routeForPath(data, window.location.pathname)
      if (route) runRef.current(route.input, { fromHistory: true })
      else window.scrollTo({ top: 0 })
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [data])

  useEffect(() => {
    if (!scrollTarget.current) return
    const element = document.getElementById(scrollTarget.current)
    scrollTarget.current = null
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    element?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })
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
    const route = href?.startsWith("/") ? routeForPath(data, href) : undefined
    if (!route) return

    event.preventDefault()
    run(route.input)
  }

  const api = useMemo<TerminalApi>(() => ({ run, pathFor: registry.pathFor }), [run, registry])

  return (
    <TerminalContext.Provider value={api}>
      <div onClick={handleClick} className="min-h-screen">
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-[45vh]">
          <Intro config={data.config} variant={initialInput && blocks.length > 0 ? "compact" : "full"} dimmed={blocks.length > 0} />
          <div className="space-y-10 mt-8">
            {blocks.map((block) => (
              <OutputBlock key={block.id} block={block} />
            ))}
          </div>
        </main>
        <Prompt
          data={data}
          registry={registry}
          history={history}
          chips={chips}
          discovery={discoverySnapshot}
          inputRef={inputRef}
        />
      </div>
    </TerminalContext.Provider>
  )
}
