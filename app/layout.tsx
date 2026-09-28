import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono, Newsreader } from "next/font/google"
import { getSiteData } from "@/lib/content"
import { homeTitle, titleTemplate } from "@/lib/seo"
import { DARK_THEMES, THEME_NAMES } from "@/lib/themes"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
})

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-newsreader",
})

const data = getSiteData()
const { config } = data

export const metadata: Metadata = {
  metadataBase: new URL(config.url),
  title: {
    default: homeTitle(data),
    template: titleTemplate(data),
  },
  description: config.description,
  applicationName: config.name,
  authors: [{ name: config.author }],
  creator: config.author,
  openGraph: {
    title: homeTitle(data),
    description: config.description,
    url: "/",
    siteName: config.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle(data),
    description: config.description,
    creator: config.twitter,
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/feed.xml", title: `${config.author}'s blog` }] },
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
}

// Runs before paint so the saved theme applies without a flash.
const bootScript = `try{var t=localStorage.getItem("terminal-theme")||"dark",d=${JSON.stringify(DARK_THEMES)},r=document.documentElement;if(${JSON.stringify(THEME_NAMES)}.indexOf(t)<0)t="dark";r.dataset.theme=t;r.classList.toggle("dark",d.indexOf(t)>=0)}catch(e){}`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${newsreader.variable} dark`} suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${jetbrainsMono.style.fontFamily};
  --font-mono: ${jetbrainsMono.style.fontFamily};
}
        `}</style>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="font-mono antialiased">
        {children}
      </body>
    </html>
  )
}
