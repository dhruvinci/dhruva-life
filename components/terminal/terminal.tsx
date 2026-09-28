"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "@/hooks/use-theme"
import { createRegistry } from "@/lib/commands/registry"
import { routeForPath } from "@/lib/routes"
import type { SiteData } from "@/lib/site-types"
import { storage } from "@/lib/storage"
import { TerminalContext, type TerminalApi } from "./context"
import { Welcome } from "./intro"
import { MusicPlayer } from "./music-player"
import { OutputBlock, type Block } from "./output-block"
import { Prompt } from "./prompt"

interface TerminalProps {
  data: SiteData
  /** Command already "run" when the page loads, e.g. "/work" on /work. Rendered on the server. */
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

/** Keeps the saved theme applied and listens for /theme. There is no theme button. */
function ThemeController() {
  useTheme()
  return null
}

export function Terminal({ data, initialInput }: TerminalProps) {
  const registry = useMemo(() => createRegistry(data), [data])
  const nextId = useRef(1)
  const pendingScroll = useRef<{ id?: string; focus: boolean } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const baseTitle = `${data.config.name} - terminal`

  const [initial] = useState(() => (initialInput ? registry.execute(initialInput, { data }) : undefined))
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
  const [announcement, setAnnouncement] = useState("")
  const [funUnlocked, setFunUnlocked] = useState(false)
  const [music, setMusic] = useState<{ open: boolean; request: number }>({ open: false, request: 0 })

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
    (input: string, source: Source = "click") => {
      const trimmed = input.trim()
      if (!trimmed) return

      if (source === "typed") {
        const nextHistory = [...storage.getHistory().filter((item) => item !== trimmed), trimmed].slice(-50)
        storage.setHistory(nextHistory)
        setHistory(nextHistory)
      }

      const { result, resolved, path: routePath } = registry.execute(trimmed, { data })
      if (result.unlockFun || resolved.command?.fun) {
        setFunUnlocked(true)
        storage.setFun()
      }
      if (result.playMusic && data.playlist.length > 0) setMusic((current) => ({ open: true, request: current.request + 1 }))

      const block: Block = {
        id: `b${nextId.current++}`,
        input: trimmed.startsWith("/") ? trimmed : `/${trimmed}`,
        content: result.content,
        tone: result.tone,
        path: routePath,
        next: result.next,
      }

      setBlocks((previous) => (source === "typed" ? [...previous, block].slice(-MAX_BLOCKS) : [block]))
      pendingScroll.current = { id: block.id, focus: source === "click" }
      setAnnouncement(result.title ?? `${block.input}${result.tone === "error" ? " failed" : ""}`)

      if (routePath) {
        setPath(routePath)
        if (source !== "history" && routePath !== window.location.pathname) window.history.pushState(null, "", routePath)
        if (result.title) document.title = `${result.title} | ${data.config.name}`
      }
    },
    [data, registry],
  )

  useEffect(() => {
    setHistory(storage.getHistory())
    setFunUnlocked(storage.getFun())
  }, [])

  // Back/forward shows the page for that URL instead of reloading.
  const runRef = useRef(run)
  const goHomeRef = useRef(goHome)
  useEffect(() => {
    runRef.current = run
    goHomeRef.current = goHome
  }, [run, goHome])
  useEffect(() => {
    const onPopState = () => {
      const route = routeForPath(data, window.location.pathname)
      if (route) runRef.current(route.input, "history")
      else goHomeRef.current("history")
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [data])

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
  // modified clicks (new tab, etc.) fall through to normal browser behaviour.
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
      goHome("click")
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
      <ThemeController />
      <div onClick={handleClick} className="min-h-screen">
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-[35vh] print:p-0 print:max-w-none">
          <div className="print:hidden">
            <Welcome data={data} compact={blocks.length > 0} />
          </div>
          <div className="space-y-10 mt-8 print:mt-0">
            {blocks.map((block, index) => (
              <OutputBlock key={block.id} block={block} latest={index === blocks.length - 1} />
            ))}
          </div>
        </main>
        {music.open && (
          <MusicPlayer playlist={data.playlist} request={music.request} onClose={() => setMusic((current) => ({ ...current, open: false }))} />
        )}
        <Prompt registry={registry} history={history} path={path} funUnlocked={funUnlocked} inputRef={inputRef} />
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </div>
    </TerminalContext.Provider>
  )
}
