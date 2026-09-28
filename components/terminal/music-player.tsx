"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Track } from "@/lib/site-types"

// Minimal types for Spotify's iFrame embed API (https://developer.spotify.com/documentation/embeds).
interface SpotifyController {
  loadUri: (uri: string) => void
  play: () => void
  destroy: () => void
}
interface SpotifyIFrameAPI {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    callback: (controller: SpotifyController) => void,
  ) => void
}
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void
  }
}

let apiPromise: Promise<SpotifyIFrameAPI> | null = null
function loadSpotifyApi() {
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      window.onSpotifyIframeApiReady = resolve
      const script = document.createElement("script")
      script.src = "https://open.spotify.com/embed/iframe-api/v1"
      script.async = true
      document.body.appendChild(script)
    })
  }
  return apiPromise
}

const SOURCE_LABEL: Record<Track["source"], string> = {
  vinyl: "from my record shelf",
  live: "a band I've seen live",
  both: "on my shelf, and seen live",
}

function randomIndex(length: number, not?: number) {
  if (length <= 1) return 0
  let index = not
  while (index === not) index = Math.floor(Math.random() * length)
  return index as number
}

interface MusicPlayerProps {
  playlist: Track[]
  /** Bumped every time /music runs; each bump plays a new random song. */
  request: number
  onClose: () => void
}

/** A small persistent player, docked above the prompt. Survives navigation. */
export function MusicPlayer({ playlist, request, onClose }: MusicPlayerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<SpotifyController | null>(null)
  const [index, setIndex] = useState(() => randomIndex(playlist.length))
  const track = playlist[index]

  const play = useCallback(
    (nextIndex: number) => {
      setIndex(nextIndex)
      const uri = `spotify:track:${playlist[nextIndex].spotify}`
      if (controllerRef.current) {
        controllerRef.current.loadUri(uri)
        controllerRef.current.play()
      }
    },
    [playlist],
  )

  // Create the embed once.
  useEffect(() => {
    let cancelled = false
    loadSpotifyApi().then((api) => {
      if (cancelled || !mountRef.current || controllerRef.current) return
      api.createController(mountRef.current, { uri: `spotify:track:${playlist[index].spotify}`, width: "100%", height: 80 }, (controller) => {
        controllerRef.current = controller
        controller.play()
      })
    })
    return () => {
      cancelled = true
    }
    // Only on mount; later songs go through play().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Each new /music request shuffles to another song.
  const firstRequest = useRef(request)
  useEffect(() => {
    if (request === firstRequest.current) return
    play(randomIndex(playlist.length, index))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request])

  useEffect(
    () => () => {
      controllerRef.current?.destroy()
      controllerRef.current = null
    },
    [],
  )

  if (!track) return null

  return (
    <div className="print:hidden fixed z-40 right-3 left-3 sm:left-auto sm:w-80 bottom-[4.75rem] rounded-lg border border-border bg-card shadow-lg overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
        <span className="truncate text-muted-foreground">
          <span aria-hidden>🎵 </span>
          {SOURCE_LABEL[track.source]}
        </span>
        <span className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => play(randomIndex(playlist.length, index))}
            className="text-muted-foreground hover:text-accent"
            aria-label="Play another random song"
            title="Another random song"
          >
            ⤮ shuffle
          </button>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-accent" aria-label="Close player">
            ✕
          </button>
        </span>
      </div>
      <div ref={mountRef} />
    </div>
  )
}
