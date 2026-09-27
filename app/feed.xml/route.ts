import { getSiteData } from "@/lib/content"

export const dynamic = "force-static"

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export function GET() {
  const { config, posts } = getSiteData()
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escape(post.title)}</title>
      <link>${config.url}/writing/${post.slug}</link>
      <guid>${config.url}/writing/${post.slug}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(post.excerpt)}</description>
      <content:encoded><![CDATA[${post.html}]]></content:encoded>
    </item>`,
    )
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escape(config.name)}</title>
    <link>${config.url}/writing</link>
    <description>${escape(config.description)}</description>
${items}
  </channel>
</rss>
`
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } })
}
