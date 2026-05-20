import { ImageResponse } from "next/og"

export const alt = "dhruva.life terminal card"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#f5f5f5",
          padding: "76px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ color: "#7a8f80", fontSize: 30, marginBottom: 30 }}>$ dhruva.life</div>
        <div style={{ color: "#c7684a", fontSize: 74, fontWeight: 700, lineHeight: 1.05 }}>Creative Technologist</div>
        <div style={{ color: "#ede6da", fontSize: 74, fontWeight: 700, lineHeight: 1.05 }}>& Product Builder</div>
        <div style={{ width: "100%", height: 2, background: "#262626", margin: "42px 0" }} />
        <div style={{ color: "#a3a3a3", fontSize: 30 }}>I build products for people I care about.</div>
      </div>
    ),
    size,
  )
}
