import { getSiteData } from "@/lib/content"
import { llmsFullTxt } from "@/lib/llms"

export const dynamic = "force-static"

export function GET() {
  return new Response(llmsFullTxt(getSiteData()), { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
