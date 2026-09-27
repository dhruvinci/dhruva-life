import { Terminal } from "@/components/terminal/terminal"
import { getSiteData } from "@/lib/content"

export default function HomePage() {
  return <Terminal data={getSiteData()} />
}
