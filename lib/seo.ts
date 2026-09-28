// Titles and structured data shared by page metadata and the terminal (which updates
// document.title as commands run), so a page's title is the same however you reach it.

import type { Route } from "./routes"
import type { SiteData } from "./site-types"

/** Home page title, e.g. "Dhruva Chakravarthi · Teaching machines how humans interact". */
export const homeTitle = (data: SiteData) => `${data.config.author} · ${data.config.tagline}`

/** Title template for every other page, e.g. "Work · Dhruva Chakravarthi". */
export const titleTemplate = (data: SiteData) => `%s · ${data.config.author}`

export const pageTitle = (data: SiteData, title: string) => titleTemplate(data).replace("%s", title)

function person(data: SiteData) {
  const { config } = data
  return {
    "@type": "Person",
    "@id": `${config.url}/#person`,
    name: config.author,
    url: config.url,
    email: `mailto:${config.contact.email}`,
    sameAs: config.profiles ?? [],
  }
}

/** schema.org JSON-LD for the home page: the site and the person it's about. */
export function homeJsonLd(data: SiteData) {
  const { config } = data
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${config.url}/#website`, name: config.name, url: config.url, description: config.description, author: { "@id": `${config.url}/#person` } },
      { "@type": "ProfilePage", url: config.url, mainEntity: { "@id": `${config.url}/#person` } },
      { ...person(data), description: config.description },
    ],
  }
}

/** schema.org JSON-LD for a routed page: the page itself plus a breadcrumb trail. */
export function routeJsonLd(data: SiteData, route: Route) {
  const { config } = data
  const url = `${config.url}${route.path}`
  const author = person(data)
  const image = `${config.url}/og${route.path}`

  const page =
    route.kind === "post"
      ? { "@type": "BlogPosting", headline: route.title, datePublished: route.date, author, image }
      : route.kind === "research"
        ? { "@type": route.eyebrow?.startsWith("Paper") ? "ScholarlyArticle" : "Article", headline: route.title, datePublished: route.date, author, image }
        : route.kind === "project"
          ? { "@type": "CreativeWork", name: route.title, creator: author, image }
          : route.path === "/about" || route.path === "/contact"
            ? { "@type": route.path === "/about" ? "AboutPage" : "ContactPage", name: route.title, mainEntity: author }
            : route.kind === "index"
              ? { "@type": "CollectionPage", name: route.title }
              : { "@type": "WebPage", name: route.title }

  const segments = route.path.split("/").filter(Boolean)
  const crumbs = [
    { name: config.name, url: config.url },
    ...segments.map((_, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`
      return { name: index === segments.length - 1 ? route.title : segments[index].replace(/^\w/, (c) => c.toUpperCase()), url: `${config.url}${path}` }
    }),
  ]

  return {
    "@context": "https://schema.org",
    "@graph": [
      { ...page, "@id": url, url, description: route.description, isPartOf: { "@id": `${config.url}/#website` } },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: crumb.url })),
      },
    ],
  }
}

/** Safe to drop into a <script type="application/ld+json">. */
export const jsonLdString = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c")
