import fs from "node:fs"
import path from "node:path"
import { ImageResponse } from "next/og"
import { logoDataUri } from "./logo"

// Cards are rendered at build time with the site's own faces (both SIL Open Font License).
const font = (file: string) => fs.readFileSync(path.join(process.cwd(), "assets", "fonts", file))
const fonts = [
  { name: "JetBrains Mono", data: font("JetBrainsMono-Regular.ttf"), weight: 400 as const, style: "normal" as const },
  { name: "Newsreader", data: font("Newsreader-Medium.ttf"), weight: 500 as const, style: "normal" as const },
]

/** Shortens to a whole word under max characters. */
function clip(text: string, max: number) {
  if (text.length <= max) return text
  return `${text.slice(0, max).replace(/\s+\S*$/, "").replace(/[\s,;:.-]+$/, "")}…`
}

export const ogSize = { width: 1200, height: 630 }

/** Social card in the dark palette: prompt path, title, one line of description. */
export function renderOgImage({ path, title, description, eyebrow }: { path: string; title: string; description: string; eyebrow?: string }) {
  const trimmed = clip(description, title.length > 45 ? 95 : 150)
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#121212",
          color: "#f1eee8",
          padding: "72px",
          fontFamily: "JetBrains Mono",
        }}
      >
        <div style={{ display: "flex", fontSize: 30 }}>
          <span style={{ color: "#9fb3a5" }}>dhruva@life</span>
          <span style={{ color: "#a19d96" }}>:</span>
          <span style={{ color: "#f2b93b" }}>~{path === "/" ? "" : path}</span>
          <span style={{ color: "#a19d96" }}>&nbsp;$</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {eyebrow && <div style={{ fontSize: 26, color: "#f2b93b", letterSpacing: 1 }}>{eyebrow}</div>}
          <div style={{ fontFamily: "Newsreader", fontSize: title.length > 60 ? 56 : title.length > 28 ? 72 : 92, lineHeight: 1.05, letterSpacing: -1 }}>{title}</div>
          <div style={{ fontSize: 27, color: "#a19d96", lineHeight: 1.45 }}>{trimmed}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a19d96" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 14, color: "#f7821b" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- rendered to PNG by next/og */}
            <img src={logoDataUri()} width={40} height={40} alt="" />
            dhruva.life
          </span>
          <span>Dhruva Chakravarthi</span>
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  )
}
