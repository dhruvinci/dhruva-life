"use client"

import { useState, useEffect } from "react"

const compileLogs = [
  "Checking dependencies...",
  "Compiling TypeScript...",
  "Bundling assets...",
  "Optimizing build...",
  "Build complete!",
]

const deployStages = ["Building application...", "Uploading to CDN...", "Configuring routes...", "Deployment complete!"]

interface AnimatedASCIIProps {
  frames: string[]
  duration: number
}

export function AnimatedASCII({ frames, duration }: AnimatedASCIIProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (!isAnimating) return

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length)
    }, duration / frames.length)

    const timeout = setTimeout(() => {
      setIsAnimating(false)
      setCurrentFrame(frames.length - 1)
    }, duration)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [frames, duration, isAnimating])

  return <div className="whitespace-pre font-mono">{frames[currentFrame]}</div>
}

interface PulseBannerProps {
  text: string
}

export function PulseBanner({ text }: PulseBannerProps) {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity((prev) => (prev === 1 ? 0.3 : 1))
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="whitespace-pre transition-opacity duration-300" style={{ opacity }}>
      {text}
    </div>
  )
}

export function MatrixRain() {
  const [matrix, setMatrix] = useState<string[][]>([])

  useEffect(() => {
    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789"
    const columns = 20
    const rows = 8

    const generateMatrix = () => {
      return Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => chars[Math.floor(Math.random() * chars.length)]),
      )
    }

    setMatrix(generateMatrix())

    const interval = setInterval(() => {
      setMatrix(generateMatrix())
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-olive font-mono text-xs leading-tight">
      {matrix.map((row, i) => (
        <div key={i}>{row.join("")}</div>
      ))}
    </div>
  )
}

export function CompileAnimation() {
  const [progress, setProgress] = useState(0)
  const [currentLog, setCurrentLog] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2
        if (newProgress >= 100) {
          setIsComplete(true)
          return 100
        }
        return newProgress
      })
    }, 50)

    const logInterval = setInterval(() => {
      setCurrentLog((prev) => Math.min(prev + 1, compileLogs.length - 1))
    }, 600)

    return () => {
      clearInterval(interval)
      clearInterval(logInterval)
    }
  }, [])

  const progressBar = "█".repeat(Math.floor(progress / 5)) + "░".repeat(20 - Math.floor(progress / 5))

  return (
    <div className="space-y-2 font-mono text-sm">
      <div className="text-ochre">
        [{progressBar}] {progress}%
      </div>
      <div className="text-sage">
        {compileLogs.slice(0, currentLog + 1).map((log, i) => (
          <div key={i} className={i === currentLog ? "text-olive" : "text-sage opacity-60"}>
            {log}
          </div>
        ))}
      </div>
      {isComplete && <div className="text-olive font-medium">✓ Compilation successful</div>}
    </div>
  )
}

export function DeployAnimation() {
  const [stage, setStage] = useState(0)
  const [dots, setDots] = useState("")

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStage((prev) => Math.min(prev + 1, deployStages.length - 1))
    }, 800)

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 300)

    return () => {
      clearInterval(stageInterval)
      clearInterval(dotsInterval)
    }
  }, [])

  return (
    <div className="space-y-2 font-mono text-sm">
      {deployStages.slice(0, stage + 1).map((stageText, i) => (
        <div key={i} className={i === stage ? "text-olive" : "text-sage opacity-60"}>
          {i === stage && stage < deployStages.length - 1 ? `${stageText}${dots}` : stageText}
          {i < stage && " ✓"}
        </div>
      ))}
      {stage === deployStages.length - 1 && <div className="text-olive font-medium">🚀 Live at dhruva.life</div>}
    </div>
  )
}

interface ReplayButtonProps {
  command: string
}

export function ReplayButton({ command }: ReplayButtonProps) {
  const handleReplay = () => {
    // Trigger command re-execution
    const event = new CustomEvent("replayCommand", { detail: { command } })
    window.dispatchEvent(event)
  }

  return (
    <button
      onClick={handleReplay}
      className="px-3 py-1 text-xs bg-muted/20 text-muted-foreground border border-muted/30 rounded hover:bg-muted/30 transition-colors"
    >
      ↻ Replay
    </button>
  )
}
