"use client"

import { useMemo, useState } from "react"
import type { VinylRecord } from "@/lib/site-types"

const PREVIEW = 18

/** The record shelf: genre filter, then sleeve-like tiles. */
export function RecordShelf({ records }: { records: VinylRecord[] }) {
  const genres = useMemo(() => [...new Set(records.map((record) => record.genre))], [records])
  const [genre, setGenre] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const inGenre = genre ? records.filter((record) => record.genre === genre) : records
  const shown = genre || expanded ? inGenre : inGenre.slice(0, PREVIEW)

  return (
    <section className="space-y-4 font-mono text-sm">
      <div>
        <h3 className="text-xs uppercase tracking-widest text-muted-foreground">On the shelf</h3>
        <p className="text-3xl font-semibold leading-tight">
          {records.length} <span className="text-base font-normal text-muted-foreground">records</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">A few are ex-radio-station copies with the reviewer&apos;s notes still on the sleeve.</p>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by genre">
        {[null, ...genres].map((name) => (
          <button
            key={name ?? "all"}
            type="button"
            onClick={() => setGenre(name)}
            aria-pressed={genre === name}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              genre === name ? "border-accent/60 bg-accent/15 text-accent" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {name ?? "all"}
            <span className="ml-1.5 opacity-60">{name ? records.filter((record) => record.genre === name).length : records.length}</span>
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {shown.map((record) => (
          <li
            key={`${record.artist}-${record.album}`}
            className="flex min-h-[5.5rem] flex-col justify-between rounded-md border border-border bg-card p-3"
          >
            <p className="font-serif text-base italic leading-snug text-foreground">{record.album}</p>
            <div>
              {record.artist && <p className="text-xs text-muted-foreground">{record.artist}</p>}
              {record.note && <p className="text-[11px] text-ochre">{record.note}</p>}
            </div>
          </li>
        ))}
      </ul>

      {!genre && records.length > PREVIEW && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="rounded border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:text-accent hover:border-accent/40"
        >
          {expanded ? "show fewer" : `show all ${records.length}`}
        </button>
      )}
    </section>
  )
}
