"use client"

import { useEffect, useState } from "react"
import type { Photo } from "@/lib/site-types"

/** Photo grid for /camera. Clicking opens a lightbox; photos never link anywhere. */
export function Gallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (open === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null)
      if (event.key === "ArrowRight") setOpen((index) => (index === null ? null : (index + 1) % photos.length))
      if (event.key === "ArrowLeft") setOpen((index) => (index === null ? null : (index - 1 + photos.length) % photos.length))
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, photos.length])

  if (photos.length === 0) {
    return <p className="text-sm text-muted-foreground">The gallery is being developed. Check back soon.</p>
  }

  const current = open === null ? null : photos[open]

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setOpen(index)}
            className="group aspect-square overflow-hidden rounded border border-border bg-muted"
            aria-label={`Open photo: ${photo.alt}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static images from public/ */}
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {current && (
        <div role="dialog" aria-modal="true" aria-label={current.alt} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" aria-label="Close" className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={() => setOpen(null)} />
          <figure className="relative max-h-full max-w-4xl space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- static images from public/ */}
            <img src={current.src} alt={current.alt} className="max-h-[80vh] w-auto rounded border border-border" />
            <figcaption className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
              <span>{current.caption ?? current.alt}</span>
              <span className="flex gap-3">
                <button type="button" onClick={() => setOpen((open! - 1 + photos.length) % photos.length)} className="hover:text-foreground">
                  ← prev
                </button>
                <button type="button" onClick={() => setOpen((open! + 1) % photos.length)} className="hover:text-foreground">
                  next →
                </button>
                <button type="button" onClick={() => setOpen(null)} className="hover:text-foreground">
                  esc
                </button>
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
