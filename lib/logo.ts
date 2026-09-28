// The logo: a terminal window with a prompt and a blinking cursor. One definition for
// every size: favicon, app icons, social cards, and the mark in the site header.

export const LOGO = {
  viewBox: "0 0 64 64",
  window: { x: 9, y: 15, width: 46, height: 34, rx: 5, strokeWidth: 3.5 },
  prompt: { d: "M19 26l8 6-8 6", strokeWidth: 4 },
  cursor: { d: "M32 39h12", strokeWidth: 4 },
}

/** Brand colours from the dark theme in app/globals.css. */
export const LOGO_COLORS = { ground: "#161412", window: "#df7c5c", prompt: "#ece5d8", cursor: "#93a898" }

interface SvgOptions {
  /** Draw on a rounded dark tile (for browser and app icons). */
  tile?: boolean
  /** Round the tile's corners. Off for app icons, which phones round themselves. */
  rounded?: boolean
  /** Blink the cursor. Browsers that animate SVG favicons (Firefox) will show it. */
  blink?: boolean
}

/** The logo as a standalone SVG document. */
export function logoSvg({ tile = false, rounded = true, blink = false }: SvgOptions = {}) {
  const { window: w, prompt, cursor } = LOGO
  const c = LOGO_COLORS
  const animate = blink ? `<animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.5;0.5;1" dur="1.1s" repeatCount="indefinite"/>` : ""
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOGO.viewBox}">${tile ? `<rect width="64" height="64" rx="${rounded ? 14 : 0}" fill="${c.ground}"/>` : ""}<g fill="none" stroke-linecap="round" stroke-linejoin="round"${
    tile ? ` transform="translate(2.6 2.6) scale(0.92)"` : ""
  }><rect x="${w.x}" y="${w.y}" width="${w.width}" height="${w.height}" rx="${w.rx}" stroke="${c.window}" stroke-width="${w.strokeWidth}"/><path d="${prompt.d}" stroke="${c.prompt}" stroke-width="${prompt.strokeWidth}"/><path d="${cursor.d}" stroke="${c.cursor}" stroke-width="${cursor.strokeWidth}">${animate}</path></g></svg>`
}

export const logoDataUri = (options: SvgOptions = {}) => `data:image/svg+xml;base64,${Buffer.from(logoSvg(options)).toString("base64")}`
