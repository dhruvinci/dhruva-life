"use client"

import { useEffect } from "react"
import { DARK_THEMES, THEME_NAMES } from "@/lib/themes"

const KEY = "terminal-theme"

/** Applies a theme to <html>: data-theme for its palette, .dark for dark ones. */
export function applyTheme(name: string) {
  const theme = THEME_NAMES.includes(name) ? name : "dark"
  const root = document.documentElement
  root.dataset.theme = theme
  root.classList.toggle("dark", DARK_THEMES.includes(theme))
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // Theme still applies for this visit.
  }
}

// The inline script in app/layout.tsx applies the saved theme before paint;
// this listens for /theme changes.
export function useTheme() {
  useEffect(() => {
    const onChange = (event: Event) => applyTheme((event as CustomEvent<string>).detail)
    window.addEventListener("terminal-theme", onChange)
    return () => window.removeEventListener("terminal-theme", onChange)
  }, [])
}
