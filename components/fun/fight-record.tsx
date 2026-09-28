import { CommandLink } from "@/components/terminal/command-link"
import type { Fight } from "@/lib/site-types"

function Pips({ wins, losses }: { wins: number; losses: number }) {
  return (
    <span className="inline-flex gap-1" aria-label={`${wins} wins, ${losses} losses`}>
      {Array.from({ length: wins }, (_, index) => (
        <span key={`w${index}`} className="grid h-5 w-5 place-items-center rounded-sm bg-olive/20 text-[10px] font-semibold text-olive">
          W
        </span>
      ))}
      {Array.from({ length: losses }, (_, index) => (
        <span key={`l${index}`} className="grid h-5 w-5 place-items-center rounded-sm bg-destructive/15 text-[10px] font-semibold text-destructive">
          L
        </span>
      ))}
    </span>
  )
}

/** Competition record: totals, then one card per event (newest first). */
export function FightRecord({ fights }: { fights: Fight[] }) {
  if (fights.length === 0) return null
  const wins = fights.reduce((sum, fight) => sum + fight.wins, 0)
  const losses = fights.reduce((sum, fight) => sum + fight.losses, 0)

  return (
    <section className="not-prose space-y-4 font-mono text-sm">
      <div className="flex flex-wrap items-end gap-x-8 gap-y-3 rounded-lg border border-border bg-card px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Record</p>
          <p className="text-3xl font-semibold leading-tight">
            <span className="text-olive">{wins}</span>
            <span className="text-muted-foreground"> – </span>
            <span className="text-destructive">{losses}</span>
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Competitions</p>
          <p className="text-3xl font-semibold leading-tight">{fights.length}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Fights</p>
          <p className="text-3xl font-semibold leading-tight">{wins + losses}</p>
        </div>
        <p className="text-xs text-muted-foreground sm:ml-auto">guard player</p>
      </div>

      <ol className="space-y-3">
        {fights.map((fight) => (
          <li key={`${fight.event}-${fight.date}`} className="rounded-lg border border-border px-4 py-3 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <div>
                <p className="font-medium text-foreground">{fight.event}</p>
                <p className="text-xs text-muted-foreground">{[fight.date, fight.location].filter(Boolean).join(" · ")}</p>
              </div>
              <div className="flex items-center gap-3">
                <Pips wins={fight.wins} losses={fight.losses} />
                <span className="text-xs text-muted-foreground">
                  {fight.wins}–{fight.losses}
                </span>
              </div>
            </div>
            <p className="font-serif text-base text-muted-foreground">{fight.note}</p>
            {fight.essay && (
              <p className="text-xs">
                <CommandLink command={`/blog ${fight.essay}`}>read the story →</CommandLink>
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
