import type { MetadataRoute } from "next"
import { getSiteData } from "@/lib/content"

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${getSiteData().config.url}/sitemap.xml` }
}
