"use client"

import { useEffect, useState } from "react"

type ThemeMode = "light" | "dark" | "auto"

const MODES: ThemeMode[] = ["dark", "light", "auto"]

function savedMode(): ThemeMode {
  try {
    const saved = localStorage.getItem("terminal-theme") as ThemeMode | null
    return saved && MODES.includes(saved) ? saved : "dark"
  } catch {
    return "dark"
  }
}

function persist(mode: ThemeMode) {
  try {
    localStorage.setItem("terminal-theme", mode)
  } catch {
    // Theme still applies for this visit.
  }
}

function resolveTheme(mode: ThemeMode) {
  if (mode !== "auto") return mode
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
}

// The inline script in app/layout.tsx applies the saved theme before paint;
// this hook keeps React in sync with it and handles changes.
export function useTheme() {
  const [mode, setMode] = useState<ThemeMode | null>(null)
  const [resolved, setResolved] = useState<"light" | "dark">("dark")

  useEffect(() => {
    setMode(savedMode())

    const handleThemeChange = (event: Event) => {
      const next = (event as CustomEvent<ThemeMode>).detail
      if (!MODES.includes(next)) return
      setMode(next)
      persist(next)
    }
    window.addEventListener("terminal-theme", handleThemeChange)
    return () => window.removeEventListener("terminal-theme", handleThemeChange)
  }, [])

  useEffect(() => {
    if (!mode) return

    const applyTheme = () => {
      const next = resolveTheme(mode)
      setResolved(next)
      document.documentElement.classList.toggle("dark", next === "dark")
    }
    applyTheme()

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)")
    mediaQuery.addEventListener("change", applyTheme)
    return () => mediaQuery.removeEventListener("change", applyTheme)
  }, [mode])

  const setTheme = (next: ThemeMode) => {
    setMode(next)
    persist(next)
  }

  return { theme: resolved, mode, setTheme }
}
