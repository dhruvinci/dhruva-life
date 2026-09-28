import type { MetadataRoute } from "next"
import { getSiteData } from "@/lib/content"

// Everything is public, including to AI crawlers; /llms.txt is the guide for those.
export default function robots(): MetadataRoute.Robots {
  const { url } = getSiteData().config
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${url}/sitemap.xml`,
    host: url,
  }
}
