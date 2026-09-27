import type { MetadataRoute } from "next"
import { getSiteData } from "@/lib/content"
import { getRoutes } from "@/lib/routes"

export default function sitemap(): MetadataRoute.Sitemap {
  const data = getSiteData()
  return [{ url: data.config.url }, ...getRoutes(data).map((route) => ({ url: `${data.config.url}${route.path}` }))]
}
