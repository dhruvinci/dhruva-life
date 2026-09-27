import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Terminal } from "@/components/terminal/terminal"
import { getSiteData } from "@/lib/content"
import { getRoutes, routeForPath } from "@/lib/routes"

interface Props {
  params: Promise<{ slug: string[] }>
}

// Every route is prerendered from content/; unknown paths 404.
export const dynamicParams = false

export function generateStaticParams() {
  return getRoutes(getSiteData()).map((route) => ({ slug: route.path.slice(1).split("/") }))
}

async function getRoute(params: Props["params"]) {
  const { slug } = await params
  return routeForPath(getSiteData(), `/${slug.join("/")}`)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const route = await getRoute(params)
  if (!route) return {}
  return {
    title: route.title,
    description: route.description,
    alternates: { canonical: route.path },
    // Nested openGraph/twitter objects replace the root ones, so the shared card image is repeated here.
    openGraph: { title: route.title, description: route.description, url: route.path, images: ["/opengraph-image"] },
    twitter: { card: "summary_large_image", title: route.title, description: route.description, images: ["/twitter-image"] },
  }
}

export default async function RoutePage({ params }: Props) {
  const route = await getRoute(params)
  if (!route) notFound()
  return <Terminal data={getSiteData()} initialInput={route.input} />
}
