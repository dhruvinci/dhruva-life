import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono, Newsreader } from "next/font/google"
import { getSiteData } from "@/lib/content"
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

const { config } = getSiteData()

export const metadata: Metadata = {
  metadataBase: new URL(config.url),
  title: {
    default: `${config.name} - terminal`,
    template: `%s | ${config.name}`,
  },
  description: config.description,
  applicationName: config.name,
  authors: [{ name: config.author }],
  creator: config.author,
  openGraph: {
    title: `${config.name} - terminal`,
    description: config.description,
    url: "/",
    siteName: config.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${config.name} - terminal`,
    description: config.description,
    creator: config.twitter,
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/feed.xml", title: `${config.name} writing` }] },
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Runs before paint so the saved theme applies without a flash.
const bootScript = `try{var t=localStorage.getItem("terminal-theme")||"dark",m=t==="auto"?(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):t,c=document.documentElement.classList;c.toggle("dark",m==="dark")}catch(e){}`

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
