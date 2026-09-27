import { getSiteData } from "@/lib/content"
import { getRoutes } from "@/lib/routes"
import Link from "next/link"

export default function NotFound() {
  const data = getSiteData()
  const top = getRoutes(data).filter((route) => data.config.nav.includes(route.input))

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-[15vh] space-y-4 text-sm">
      <p>
        <span className="text-sage">$</span> cd <span className="text-destructive">???</span>
      </p>
      <p className="text-destructive">404: nothing lives at this path.</p>
      <p className="text-muted-foreground">Try one of these:</p>
      <nav className="flex flex-wrap gap-x-4 gap-y-2 pl-4">
        <Link href="/" className="text-accent hover:underline">
          ~
        </Link>
        {top.map((route) => (
          <a key={route.path} href={route.path} className="text-accent hover:underline">
            {route.input}
          </a>
        ))}
      </nav>
    </main>
  )
}
