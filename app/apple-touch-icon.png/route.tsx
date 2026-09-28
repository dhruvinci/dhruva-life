import { logoPng } from "@/lib/logo-png"

export const dynamic = "force-static"

export function GET() {
  return logoPng(180)
}
