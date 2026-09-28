import { getSiteData } from "@/lib/content"
import Link from "next/link"

export default function NotFound() {
  const { config } = getSiteData()

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-[15vh] space-y-4 text-sm">
      <p>
        <span className="text-sage">$</span> <span className="text-destructive">404</span>
      </p>
      <p className="text-destructive">Nothing lives at this path.</p>
      <p className="text-muted-foreground">Try one of these:</p>
      <nav className="flex flex-wrap gap-x-4 gap-y-2">
        <Link href="/" className="text-accent hover:underline">
          home
        </Link>
        {config.nav.map((name) => (
          <a key={name} href={`/${name}`} className="text-accent hover:underline">
            /{name}
          </a>
        ))}
      </nav>
    </main>
  )
}
