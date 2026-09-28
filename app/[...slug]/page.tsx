import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Terminal } from "@/components/terminal/terminal"
import { getSiteData } from "@/lib/content"
import { getRoutes, routeForPath } from "@/lib/routes"
import { jsonLdString, routeJsonLd } from "@/lib/seo"

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
  const { config } = getSiteData()
  // Per-page social card rendered by app/og/[...slug]/route.tsx.
  const image = { url: `/og${route.path}`, width: 1200, height: 630, alt: route.title }
  const article = route.kind === "post" || route.kind === "research"
  return {
    title: route.title,
    description: route.description,
    alternates: { canonical: route.path },
    openGraph: {
      title: route.title,
      description: route.description,
      url: route.path,
      siteName: config.name,
      locale: "en_US",
      images: [image],
      ...(article
        ? { type: "article", publishedTime: route.date, authors: [config.url], section: route.kind === "post" ? "Blog" : "Research" }
        : { type: "website" }),
    },
    twitter: { card: "summary_large_image", title: route.title, description: route.description, creator: config.twitter, images: [image] },
  }
}

export default async function RoutePage({ params }: Props) {
  const route = await getRoute(params)
  if (!route) notFound()
  const data = getSiteData()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(routeJsonLd(data, route)) }} />
      <Terminal data={data} initialInput={route.input} />
    </>
  )
}
