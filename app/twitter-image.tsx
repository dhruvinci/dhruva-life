import { getSiteData } from "@/lib/content"
import { ogSize, renderOgImage } from "@/lib/og"

export const alt = "Dhruva Chakravarthi · dhruva.life"
export const size = ogSize
export const contentType = "image/png"

export default function Image() {
  const { config } = getSiteData()
  return renderOgImage({ path: "/", title: config.author, description: config.description })
}
