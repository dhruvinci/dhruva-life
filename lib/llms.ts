// /llms.txt (https://llmstxt.org): a plain-Markdown map of the site for language models,
// and /llms-full.txt: the same, with every page's full text inline.

import type { SiteData } from "./site-types"

const line = (url: string, title: string, note?: string) => `- [${title}](${url})${note ? `: ${note}` : ""}`

function header(data: SiteData) {
  const { config } = data
  return [
    `# ${config.author}`,
    "",
    `> ${config.description}`,
    "",
    `${config.url} is ${config.author}'s personal site. It looks like a terminal, but every page below is a normal URL with server-rendered HTML.`,
    "",
    `Contact: ${config.contact.email} · ${config.contact.linkedin}`,
  ]
}

export function llmsTxt(data: SiteData) {
  const { url } = data.config
  const pages = (fun: boolean) => data.pages.filter((page) => page.fun === fun)
  return [
    ...header(data),
    "",
    "## About",
    "",
    ...pages(false).map((page) => line(`${url}/${page.name}`, page.title, page.seo ?? page.description)),
    "",
    "## Research",
    "",
    ...data.research.map((item) => line(`${url}/research/${item.slug}`, item.title, `${[item.venue, item.date].filter(Boolean).join(", ")}. ${item.summary}`)),
    "",
    "## Work",
    "",
    ...data.projects.map((project) =>
      line(`${url}/work/${project.slug}`, project.title, `${[project.role, project.period ?? project.year].filter(Boolean).join(", ")}. ${project.summary}`),
    ),
    "",
    "## Blog",
    "",
    ...data.posts.map((post) => line(`${url}/blog/${post.slug}`, post.title, `${post.date}. ${post.excerpt}`)),
    "",
    "## Optional",
    "",
    ...pages(true).map((page) => line(`${url}/${page.name}`, page.title, page.seo ?? page.description)),
    line(`${url}/llms-full.txt`, "Full text", "every page above in one file"),
    line(`${url}/feed.xml`, "RSS feed", "the blog"),
    "",
  ].join("\n")
}

export function llmsFullTxt(data: SiteData) {
  const { url } = data.config
  const section = (title: string, link: string, meta: string[], body: string) =>
    [`## ${title}`, "", `URL: ${link}`, ...meta.filter(Boolean), "", body.trim(), ""].join("\n")

  return [
    ...header(data),
    "",
    ...data.pages.map((page) => section(page.title, `${url}/${page.name}`, [], page.text)),
    ...data.research.map((item) =>
      section(item.title, `${url}/research/${item.slug}`, [item.venue ? `Venue: ${item.venue}` : "", `Date: ${item.date}`, ...item.links.map((l) => `${l.label}: ${l.href}`)], [item.summary, ...item.highlights.map((h) => `- ${h}`), "", item.text].join("\n")),
    ),
    ...data.projects.map((project) =>
      section(project.title, `${url}/work/${project.slug}`, [project.role ? `Role: ${project.role}` : "", `Period: ${project.period ?? project.year}`], [project.summary, "", project.text].join("\n")),
    ),
    ...data.posts.map((post) => section(post.title, `${url}/blog/${post.slug}`, [`Date: ${post.date}`], post.raw)),
  ].join("\n")
}
