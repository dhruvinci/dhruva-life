"use client"

import { useEffect, useState } from "react"

type ThemeMode = "light" | "dark" | "auto"

function resolveTheme(mode: ThemeMode) {
  if (mode !== "auto") return mode
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>("dark")
  const [resolved, setResolved] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const savedTheme = localStorage.getItem("terminal-theme") as ThemeMode | null
    if (savedTheme && ["dark", "light", "auto"].includes(savedTheme)) {
      setMode(savedTheme)
    }
  }, [])

  useEffect(() => {
    const applyTheme = () => {
      const nextResolved = resolveTheme(mode)
      setResolved(nextResolved)
      document.documentElement.classList.toggle("dark", nextResolved === "dark")
    }

    applyTheme()

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)")
    mediaQuery.addEventListener("change", applyTheme)

    return () => mediaQuery.removeEventListener("change", applyTheme)
  }, [mode])

  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const nextMode = (event as CustomEvent<ThemeMode>).detail
      if (["dark", "light", "auto"].includes(nextMode)) {
        setMode(nextMode)
      }
    }

    window.addEventListener("terminal-theme", handleThemeChange)
    return () => window.removeEventListener("terminal-theme", handleThemeChange)
  }, [])

  const setTheme = (nextMode: ThemeMode) => {
    setMode(nextMode)
    localStorage.setItem("terminal-theme", nextMode)
  }

  return {
    theme: resolved,
    mode,
    setTheme,
  }
}
