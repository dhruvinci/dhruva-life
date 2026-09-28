import { getSiteData } from "@/lib/content"
import { renderOgImage } from "@/lib/og"
import { getRoutes, routeForPath } from "@/lib/routes"

// Social card per page, e.g. /og/work/graicie. (Next doesn't allow opengraph-image files
// under a catch-all segment, so the pages point here from generateMetadata.)
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getRoutes(getSiteData()).map((route) => ({ slug: route.path.slice(1).split("/") }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const route = routeForPath(getSiteData(), `/${slug.join("/")}`)
  if (!route) return new Response("Not found", { status: 404 })
  return renderOgImage({ path: route.path, title: route.title, description: route.description, eyebrow: route.eyebrow })
}
