"use client"

import { useState, useEffect } from "react"

const bootSequence = [
  "dhruva.life",
  "Loading identity...",
  "",
  "I build products for people I care about",
  "RESPONSIVE_LINE",
  "Type help to begin",
]

interface BootScreenProps {
  onComplete: () => void
  hasExecutedCommand: boolean
}

export function BootScreen({ onComplete, hasExecutedCommand }: BootScreenProps) {
  const [step, setStep] = useState(0)
  const [skipped, setSkipped] = useState(false)

  useEffect(() => {
    const handleSkip = () => {
      if (!skipped) {
        setSkipped(true)
        onComplete()
      }
    }

    const handleKeyPress = () => handleSkip()
    const handleClick = () => handleSkip()

    document.addEventListener("keydown", handleKeyPress)
    document.addEventListener("click", handleClick)

    const timers = bootSequence.map((_, index) =>
      setTimeout(() => {
        if (!skipped) {
          setStep(index + 1)
          // Auto-complete after the last step
          if (index + 1 === bootSequence.length) {
            setTimeout(() => {
              if (!skipped) {
                setSkipped(true)
                onComplete()
              }
            }, 500) // Small delay after last step
          }
        }
      }, index * 400),
    )

    return () => {
      timers.forEach(clearTimeout)
      document.removeEventListener("keydown", handleKeyPress)
      document.removeEventListener("click", handleClick)
    }
  }, [skipped, onComplete])

  if (skipped && hasExecutedCommand) {
    return (
      <div className="bg-background text-foreground overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
          <div className="space-y-3 opacity-60 break-words">
            {bootSequence.map((line, index) => (
              <div
                key={index}
                className={`text-sm ${
                  index === 3
                    ? "text-terracotta font-medium"
                    : index === 4
                      ? "text-muted-foreground text-xs"
                      : index === 5
                        ? "text-muted-foreground text-xs"
                        : ""
                }`}
              >
                {line === "RESPONSIVE_LINE" ? (
                  <div className="w-full h-px bg-muted-foreground my-2"></div>
                ) : (
                  line
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (skipped && !hasExecutedCommand) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
          <div className="space-y-3 break-words">
            {bootSequence.map((line, index) => (
              <div
                key={index}
                className={`text-sm ${
                  index === 3
                    ? "text-terracotta font-medium"
                    : index === 4
                      ? "text-muted-foreground text-xs"
                      : index === 5
                        ? "text-muted-foreground text-xs"
                        : ""
                }`}
              >
                {line === "RESPONSIVE_LINE" ? (
                  <div className="w-full h-px bg-muted-foreground my-2"></div>
                ) : (
                  line
                )}
              </div>
            ))}
            <div className="text-muted-foreground text-xs mt-8">Terminal of Life initializing...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background text-foreground min-h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <div className="space-y-3 break-words">
          {bootSequence.slice(0, step).map((line, index) => (
            <div
              key={index}
              className={`text-sm transition-opacity duration-300 ${
                index === 3 ? "text-terracotta font-medium" : index === 4 ? "text-muted-foreground text-xs" : index === 5 ? "text-muted-foreground text-xs" : ""
              }`}
            >
              {line === "RESPONSIVE_LINE" ? (
                <div className="w-full h-px bg-muted-foreground my-2"></div>
              ) : (
                line
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}
