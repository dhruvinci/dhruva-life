"use client"

import { useTerminalApi } from "@/components/terminal/context"

/** The 🎵 in the prompt bar, as a button: plays a random favourite in the docked player. */
export function PlaySong({ count }: { count: number }) {
  const { playMusic } = useTerminalApi()
  return (
    <button
      type="button"
      onClick={playMusic}
      className="group flex w-full items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 text-left font-mono transition-colors hover:border-accent/60"
    >
      <span aria-hidden className="text-3xl transition-transform group-hover:-rotate-12 group-hover:scale-110 group-active:scale-95">
        🎵
      </span>
      <span className="min-w-0">
        <span className="block text-sm text-foreground group-hover:text-accent">Play me a song</span>
        <span className="block text-xs text-muted-foreground">
          A random one of {count} favourites from the shelf and the gigs. Tap again to shuffle.
        </span>
      </span>
    </button>
  )
}
