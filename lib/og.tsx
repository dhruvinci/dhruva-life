import { ImageResponse } from "next/og"

export const ogSize = { width: 1200, height: 630 }

/** Social card in the dark palette: prompt path, title, one line of description. */
export function renderOgImage({ path, title, description }: { path: string; title: string; description: string }) {
  const trimmed = description.length > 140 ? `${description.slice(0, 137)}…` : description
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#161412",
          color: "#ece5d8",
          padding: "72px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 30 }}>
          <span style={{ color: "#93a898" }}>dhruva@life</span>
          <span style={{ color: "#a69d90" }}>:</span>
          <span style={{ color: "#d6b36a" }}>~{path === "/" ? "" : path}</span>
          <span style={{ color: "#a69d90" }}>&nbsp;$</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: title.length > 28 ? 64 : 80, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 30, color: "#a69d90", lineHeight: 1.35 }}>{trimmed}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a69d90" }}>
          <span style={{ color: "#df7c5c" }}>dhruva.life</span>
          <span>Dhruva Chakravarthi</span>
        </div>
      </div>
    ),
    ogSize,
  )
}
