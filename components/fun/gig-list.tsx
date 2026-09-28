"use client"

import { useMemo, useState } from "react"

const PREVIEW = 60

/** Every band seen live, numbered in the order they were seen, with a filter. */
export function GigList({ gigs }: { gigs: string[] }) {
  const [query, setQuery] = useState("")
  const [expanded, setExpanded] = useState(false)

  const numbered = useMemo(() => gigs.map((band, index) => ({ band, n: index + 1 })), [gigs])
  const q = query.trim().toLowerCase()
  const matches = q ? numbered.filter((gig) => gig.band.toLowerCase().includes(q)) : numbered
  const shown = q || expanded ? matches : matches.slice(0, PREVIEW)
  const pad = String(gigs.length).length

  return (
    <section className="space-y-4 font-mono text-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground">Seen live</h3>
          <p className="text-3xl font-semibold leading-tight">
            {gigs.length} <span className="text-base font-normal text-muted-foreground">bands, in the order I saw them</span>
          </p>
        </div>
        <label className="flex items-center gap-2 rounded border border-border bg-card px-3 py-1.5 text-xs focus-within:border-accent/60">
          <span className="text-muted-foreground" aria-hidden>
            ⌕
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="find a band"
            aria-label="Find a band"
            className="w-36 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      {q && matches.length === 0 ? (
        <p className="text-muted-foreground">Not on the list (yet).</p>
      ) : (
        <ol className="columns-1 gap-x-8 sm:columns-2 lg:columns-3">
          {shown.map((gig) => (
            <li key={gig.n} className="flex break-inside-avoid gap-3 py-0.5">
              <span className="w-8 shrink-0 text-right text-xs text-muted-foreground tabular-nums">{String(gig.n).padStart(pad, "0")}</span>
              <span className="text-foreground">{gig.band}</span>
            </li>
          ))}
        </ol>
      )}

      {!q && gigs.length > PREVIEW && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          className="rounded border border-border bg-card px-3 py-1 text-xs text-muted-foreground hover:text-accent hover:border-accent/40"
        >
          {expanded ? "show fewer" : `show all ${gigs.length}`}
        </button>
      )}
    </section>
  )
}
