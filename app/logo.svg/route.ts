import { logoSvg } from "@/lib/logo"

export const dynamic = "force-static"

// The favicon: the mark on a dark tile. Firefox animates SVG favicons, so the cursor blinks there.
export function GET() {
  return new Response(logoSvg({ tile: true, blink: true }), {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" },
  })
}
