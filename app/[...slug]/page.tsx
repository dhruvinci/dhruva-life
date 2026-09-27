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
    // Per-page social card rendered by app/og/[...slug]/route.tsx.
    openGraph: { title: route.title, description: route.description, url: route.path, images: [`/og${route.path}`] },
    twitter: { card: "summary_large_image", title: route.title, description: route.description, images: [`/og${route.path}`] },
  }
}

export default async function RoutePage({ params }: Props) {
  const route = await getRoute(params)
  if (!route) notFound()
  return <Terminal data={getSiteData()} initialInput={route.input} />
}
