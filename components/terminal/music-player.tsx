"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Track } from "@/lib/site-types"

// Minimal types for the YouTube IFrame Player API (https://developers.google.com/youtube/iframe_api_reference).
interface YouTubePlayer {
  loadVideoById: (id: string) => void
  playVideo: () => void
  destroy: () => void
}
interface YouTubeNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string
      width: string | number
      height: string | number
      playerVars?: Record<string, number | string>
      events?: {
        onReady?: (event: { target: YouTubePlayer }) => void
        onStateChange?: (event: { data: number }) => void
      }
    },
  ) => YouTubePlayer
  PlayerState: { ENDED: number }
}
declare global {
  interface Window {
    YT?: YouTubeNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<YouTubeNamespace> | null = null
function loadYouTubeApi() {
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      if (window.YT?.Player) return resolve(window.YT)
      window.onYouTubeIframeAPIReady = () => resolve(window.YT as YouTubeNamespace)
      const script = document.createElement("script")
      script.src = "https://www.youtube.com/iframe_api"
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

/**
 * A small persistent player docked above the prompt. Plays full songs through YouTube
 * and moves on to another random song when one ends, so it keeps going while you browse.
 * YouTube requires the video itself to stay visible (at least 200px tall), so it is.
 */
export function MusicPlayer({ playlist, request, onClose }: MusicPlayerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const [index, setIndex] = useState(() => randomIndex(playlist.length))
  const indexRef = useRef(index)
  const track = playlist[index]

  const play = useCallback(
    (nextIndex: number) => {
      indexRef.current = nextIndex
      setIndex(nextIndex)
      playerRef.current?.loadVideoById(playlist[nextIndex].youtube)
    },
    [playlist],
  )
  const playRef = useRef(play)
  useEffect(() => {
    playRef.current = play
  }, [play])

  // Create the player once; later songs go through play().
  useEffect(() => {
    let cancelled = false
    loadYouTubeApi().then((YT) => {
      if (cancelled || !mountRef.current || playerRef.current) return
      playerRef.current = new YT.Player(mountRef.current, {
        videoId: playlist[indexRef.current].youtube,
        width: "100%",
        height: 200,
        playerVars: { autoplay: 1, playsinline: 1, rel: 0 },
        events: {
          onReady: (event) => event.target.playVideo(),
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.ENDED) playRef.current(randomIndex(playlist.length, indexRef.current))
          },
        },
      })
    })
    return () => {
      cancelled = true
      playerRef.current?.destroy()
      playerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Each new /music request shuffles to another song.
  const firstRequest = useRef(request)
  useEffect(() => {
    if (request === firstRequest.current) return
    play(randomIndex(playlist.length, indexRef.current))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request])

  if (!track) return null

  return (
    <div className="print:hidden fixed z-40 right-3 left-3 sm:left-auto sm:w-[22rem] bottom-[4.25rem] rounded-lg border border-border bg-card shadow-lg overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
        <span className="min-w-0 truncate">
          <span className="text-foreground">{track.title}</span>
          <span className="text-muted-foreground"> · {track.artist}</span>
        </span>
        <span className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => play(randomIndex(playlist.length, indexRef.current))}
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
      <div className="bg-black">
        <div ref={mountRef} />
      </div>
      <p className="px-3 py-1.5 text-[11px] text-muted-foreground">
        <span aria-hidden>🎵 </span>
        {SOURCE_LABEL[track.source]} · plays on as you browse
      </p>
    </div>
  )
}
