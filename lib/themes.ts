// Every theme the site can wear. /theme <name> switches; the choice is remembered.
// "dark" themes also get the .dark class so dark-mode styles apply.

export interface ThemeInfo {
  name: string
  label: string
  description: string
  dark: boolean
}

export const THEMES: ThemeInfo[] = [
  { name: "dark", label: "Dark", description: "Charcoal and orange, the default", dark: true },
  { name: "light", label: "Light", description: "Paper and ink", dark: false },
  { name: "matrix", label: "Matrix", description: "Green rain on black", dark: true },
  { name: "pokemon", label: "Pokémon", description: "Original Game Boy green", dark: false },
  { name: "claude", label: "Claude", description: "Cream, ink and clay", dark: false },
  { name: "amber", label: "Amber", description: "An old CRT monitor", dark: true },
]

export const THEME_NAMES = THEMES.map((theme) => theme.name)
export const DARK_THEMES = THEMES.filter((theme) => theme.dark).map((theme) => theme.name)
