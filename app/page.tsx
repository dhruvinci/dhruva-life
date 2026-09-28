import { Terminal } from "@/components/terminal/terminal"
import { getSiteData } from "@/lib/content"
import { homeJsonLd, jsonLdString } from "@/lib/seo"

export default function HomePage() {
  const data = getSiteData()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(homeJsonLd(data)) }} />
      <Terminal data={data} />
    </>
  )
}
