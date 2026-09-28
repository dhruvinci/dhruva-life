import type { MetadataRoute } from "next"
import { getSiteData } from "@/lib/content"
import { LOGO_COLORS } from "@/lib/logo"

export default function manifest(): MetadataRoute.Manifest {
  const { config } = getSiteData()
  return {
    name: config.author,
    short_name: config.name,
    description: config.description,
    start_url: "/",
    display: "standalone",
    background_color: LOGO_COLORS.ground,
    theme_color: LOGO_COLORS.ground,
    icons: [
      { src: "/logo.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/logo.png", type: "image/png", sizes: "512x512" },
      { src: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
  }
}
