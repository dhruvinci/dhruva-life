"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import type { Track } from "@/lib/site-types"

// Minimal types for the YouTube IFrame Player API (https://developers.google.com/youtube/iframe_api_reference).
interface YouTubePlayer {
  loadVideoById: (id: string) => void
  playVideo: () => void
  pauseVideo: () => void
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
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number }
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
  vinyl: "on my shelf",
  live: "seen live",
  both: "on my shelf & seen live",
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  )
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
  const [playing, setPlaying] = useState(false)
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
        height: "100%",
        playerVars: { autoplay: 1, playsinline: 1, rel: 0, controls: 0, iv_load_policy: 3, disablekb: 1 },
        events: {
          onReady: (event) => event.target.playVideo(),
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) setPlaying(true)
            if (event.data === YT.PlayerState.PAUSED) setPlaying(false)
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

  const toggle = () => {
    if (playing) playerRef.current?.pauseVideo()
    else playerRef.current?.playVideo()
  }

  return (
    <div className="print:hidden fixed z-40 right-3 left-3 sm:left-auto sm:w-96 bottom-[4.25rem] rounded-xl border border-border bg-card p-2 shadow-xl">
      <div className="overflow-hidden rounded-lg bg-black aspect-video min-h-[200px] [&_iframe]:h-full [&_iframe]:w-full">
        <div ref={mountRef} />
      </div>
      <div className="flex items-center gap-2 px-1.5 pt-2 pb-0.5">
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm text-foreground">{track.title}</p>
          <p className="truncate text-xs text-muted-foreground">
            {track.artist} · {SOURCE_LABEL[track.source]}
          </p>
        </div>
        <IconButton label={playing ? "Pause" : "Play"} onClick={toggle}>
          {playing ? (
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden>
              <rect x="3" y="2.5" width="3.5" height="11" rx="1" />
              <rect x="9.5" y="2.5" width="3.5" height="11" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden>
              <path d="M4 2.8v10.4a.8.8 0 0 0 1.2.7l8.4-5.2a.8.8 0 0 0 0-1.4L5.2 2.1A.8.8 0 0 0 4 2.8z" />
            </svg>
          )}
        </IconButton>
        <IconButton label="Another random song" onClick={() => play(randomIndex(playlist.length, indexRef.current))}>
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 4h2.5c3 0 4 8 7 8H14M2 12h2.5c1.2 0 2-1.3 2.7-3M9.3 7c.7-1.7 1.5-3 2.7-3H14M12 2l2 2-2 2M12 10l2 2-2 2" />
          </svg>
        </IconButton>
        <IconButton label="Close player" onClick={onClose}>
          <svg viewBox="0 0 16 16" className="h-3 w-3 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </IconButton>
      </div>
    </div>
  )
}
