// /llms.txt (https://llmstxt.org): a plain-Markdown map of the site for language models,
// and /llms-full.txt: the same, with every page's Markdown inline. Both lead with an
// "At a glance" block, because the most common reader is an agent assessing Dhruva for
// a role or a research position.

import type { SiteData } from "./site-types"

const line = (url: string, title: string, note?: string) => `- [${title}](${url})${note ? `: ${note}` : ""}`

/** Site-relative links ("/work/kakashi") become absolute, so they work out of context. */
const absolute = (data: SiteData, markdown: string) =>
  markdown.replace(/<!--[\s\S]*?-->\n?/g, "").replace(/\]\(\//g, `](${data.config.url}/`)

/** The body of a "## Heading" section in a Markdown document, or "". */
function section(markdown: string, heading: string) {
  const match = markdown.match(new RegExp(`^## ${heading}\\s*\\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`, "m"))
  return match ? match[1].trim() : ""
}

function header(data: SiteData) {
  const { config } = data
  return [
    `# ${config.author}`,
    "",
    `> ${config.description}`,
    "",
    `${config.url} is ${config.author}'s personal site. It looks like a terminal, but every page listed here is a normal URL with server-rendered HTML. Everything below comes from the site's own content.`,
  ]
}

function atAGlance(data: SiteData) {
  const { config, notes } = data
  const current = data.projects[0]
  const paper = data.research.find((item) => item.kind === "paper")
  const contactPage = data.pages.find((page) => page.name === "contact")
  const openTo = (contactPage?.raw ?? "")
    .split(/\n\s*\n/)
    .filter((paragraph) => paragraph.startsWith("**Open to"))
    .map((paragraph) => `- ${paragraph.trim()}`)
  const github = config.profiles?.find((url) => url.includes("github.com"))

  return absolute(
    data,
    [
      "## At a glance",
      "",
      current && `- **Now:** ${current.title}, ${current.role ?? current.cluster} (${current.period ?? current.year}). ${current.summary}`,
      paper && `- **Published:** "${paper.title}", ${[paper.venue, paper.date.slice(0, 4)].filter(Boolean).join(", ")}. ${paper.summary} [Read more](/research/${paper.slug})`,
      ...openTo,
      `- **Contact:** ${config.contact.email} · book a call: ${config.contact.calendar} · ${config.contact.linkedin}${github ? ` · ${github}` : ""}`,
      "",
      "### Education",
      "",
      section(notes.workOutro, "Education"),
      "",
      "### Skills",
      "",
      section(notes.workOutro, "Skills"),
      "",
      "### Code",
      "",
      section(notes.researchOutro, "Code"),
      section(notes.workOutro, "Also built"),
    ]
      .filter((item): item is string => typeof item === "string")
      .join("\n"),
  )
}

export function llmsTxt(data: SiteData) {
  const { url } = data.config
  const pages = (fun: boolean) => data.pages.filter((page) => page.fun === fun)
  return [
    ...header(data),
    "",
    atAGlance(data),
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
    line(`${url}/llms-full.txt`, "Full text", "every page above in one file, as Markdown"),
    line(`${url}/feed.xml`, "RSS feed", "the blog"),
    "",
  ].join("\n")
}

export function llmsFullTxt(data: SiteData) {
  const { url } = data.config
  const { notes } = data
  // Page bodies use "##" headings of their own, so each page is a "#" section here.
  const page = (title: string, link: string, meta: Array<string | false | undefined>, body: string) =>
    [`# ${title}`, "", `URL: ${link}`, ...meta.filter(Boolean), "", absolute(data, body.trim()), ""].join("\n")

  return [
    ...header(data),
    "",
    atAGlance(data),
    "",
    ...data.pages.filter((item) => !item.fun).map((item) => page(item.title, `${url}/${item.name}`, [], item.raw)),
    page("Research", `${url}/research`, [], [notes.researchIntro, notes.researchOutro].join("\n\n")),
    ...data.research.map((item) =>
      page(
        item.title,
        `${url}/research/${item.slug}`,
        [item.venue && `Venue: ${item.venue}`, `Date: ${item.date}`, `Status: ${item.kind}`, ...item.links.map((link) => `${link.label}: ${link.href}`)],
        [item.summary, "", ...item.highlights.map((highlight) => `- ${highlight}`), "", item.raw].join("\n"),
      ),
    ),
    page("Work", `${url}/work`, [], [notes.workIntro, notes.workOutro].join("\n\n")),
    ...data.projects.map((project) =>
      page(project.title, `${url}/work/${project.slug}`, [project.role && `Role: ${project.role}`, `Period: ${project.period ?? project.year}`], [project.summary, "", project.raw].join("\n")),
    ),
    ...data.posts.map((post) => page(post.title, `${url}/blog/${post.slug}`, [`Date: ${post.date}`], post.raw)),
    ...data.pages.filter((item) => item.fun).map((item) => page(item.title, `${url}/${item.name}`, [], item.raw)),
  ].join("\n")
}
