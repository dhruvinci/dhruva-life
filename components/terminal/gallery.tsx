"use client"

import { useEffect, useState } from "react"
import type { Photo } from "@/lib/site-types"

/** Photo grid for /camera. Clicking a photo only enlarges it; nothing links anywhere. */
export function Gallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const step = (by: number) => setOpen((index) => (index === null ? null : (index + by + photos.length) % photos.length))

  useEffect(() => {
    if (open === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null)
      if (event.key === "ArrowRight") step(1)
      if (event.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (photos.length === 0) return null
  const current = open === null ? null : photos[open]

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpen(index)}
            className="group aspect-square overflow-hidden rounded-md bg-muted"
            aria-label={`View photo: ${photo.alt}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- small static set in public/ */}
            <img
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {current && (
        <div role="dialog" aria-modal="true" aria-label={current.alt} className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 p-4">
          <button type="button" aria-label="Close" className="absolute inset-0 bg-background/95 backdrop-blur-sm" onClick={() => setOpen(null)} />
          {/* eslint-disable-next-line @next/next/no-img-element -- small static set in public/ */}
          <img
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            className="relative max-h-[82vh] w-auto max-w-full rounded-md object-contain"
          />
          <div className="relative flex w-full max-w-3xl items-center justify-between gap-4 text-xs text-muted-foreground">
            <span>{current.caption ?? current.alt}</span>
            <span className="flex gap-4">
              <button type="button" onClick={() => step(-1)} className="hover:text-foreground">
                ← prev
              </button>
              <span>
                {(open ?? 0) + 1}/{photos.length}
              </span>
              <button type="button" onClick={() => step(1)} className="hover:text-foreground">
                next →
              </button>
              <button type="button" onClick={() => setOpen(null)} className="hover:text-foreground">
                esc
              </button>
            </span>
          </div>
        </div>
      )}
    </>
  )
}
