"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface OutputBlockProps {
  id: string
  timestamp: string
  command: string
  content: React.ReactNode
  type?: "command" | "error" | "success"
}

export function OutputBlock({ id, timestamp, command, content, type = "command" }: OutputBlockProps) {
  const [showMore, setShowMore] = useState(false)
  const [isLongContent, setIsLongContent] = useState(false)

  useEffect(() => {
    const contentString = typeof content === "string" ? content : content?.toString() || ""
    const lineCount = contentString.split("\n").length
    setIsLongContent(lineCount > 12)
  }, [content])

  const typeColors = {
    command: "text-foreground",
    error: "text-destructive",
    success: "text-primary",
  }

  const handleCopyLink = async () => {
    const permalink = `${window.location.origin}${window.location.pathname}#block-${id}`
    await navigator.clipboard.writeText(permalink)
    const toast = document.createElement("div")
    toast.textContent = "Link copied."
    toast.className =
      "fixed top-4 right-4 bg-primary text-primary-foreground px-3 py-2 rounded text-sm z-50 transition-opacity font-mono"
    document.body.appendChild(toast)
    setTimeout(() => {
      toast.style.opacity = "0"
      setTimeout(() => document.body.removeChild(toast), 300)
    }, 1500)

    if ("vibrate" in navigator) {
      navigator.vibrate(10)
    }
  }

  return (
    <div className="group mb-6" id={`block-${id}`}>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-muted-foreground text-xs mt-1">{timestamp}</span>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sage text-sm">$</span>
          <span className="text-foreground text-sm">{command}</span>
        </div>
        <button
          onClick={handleCopyLink}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-opacity text-xs p-1"
        >
          ⧉
        </button>
      </div>

      <div className={`${typeColors[type]} text-sm leading-relaxed ml-6`}>
        {isLongContent && !showMore ? (
          <div>
            <div
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 10,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {content}
            </div>
            <button
              onClick={() => setShowMore(true)}
              className="mt-3 text-xs text-muted-foreground hover:text-foreground border border-border rounded px-3 py-1 hover:bg-muted/20 transition-colors"
            >
              Show more
            </button>
          </div>
        ) : (
          <div>
            {content}
            {isLongContent && showMore && (
              <button
                onClick={() => setShowMore(false)}
                className="mt-3 text-xs text-muted-foreground hover:text-foreground border border-border rounded px-3 py-1 hover:bg-muted/20 transition-colors"
              >
                Show less
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
