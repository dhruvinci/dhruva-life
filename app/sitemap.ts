import type { MetadataRoute } from "next"
import { getSiteData } from "@/lib/content"
import { getRoutes } from "@/lib/routes"

export default function sitemap(): MetadataRoute.Sitemap {
  const data = getSiteData()
  const latest = data.posts.map((post) => post.date).sort().at(-1)
  return [
    { url: data.config.url, lastModified: latest, priority: 1 },
    ...getRoutes(data).map((route) => ({
      url: `${data.config.url}${route.path}`,
      lastModified: route.date,
      priority: route.kind === "index" || route.kind === "page" ? 0.8 : 0.6,
    })),
  ]
}
