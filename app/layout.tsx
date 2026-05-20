import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://dhruva.life"),
  title: {
    default: "dhruva.life - terminal",
    template: "%s | dhruva.life",
  },
  description: "Creative Technologist & Product Builder. I build product for people I care about.",
  applicationName: "dhruva.life",
  authors: [{ name: "Dhruva Chakravarthi" }],
  creator: "Dhruva Chakravarthi",
  keywords: [
    "Dhruva Chakravarthi",
    "creative technologist",
    "product builder",
    "AI",
    "Web3",
    "terminal website",
    "jiu-jitsu",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "dhruva.life - terminal",
    description: "Creative Technologist & Product Builder. I build product for people I care about.",
    url: "/",
    siteName: "dhruva.life",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "dhruva.life terminal card",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "dhruva.life - terminal",
    description: "Creative Technologist & Product Builder. I build product for people I care about.",
    creator: "@dhrude",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <head>
        <style>{`
html {
  font-family: ${jetbrainsMono.style.fontFamily};
  --font-mono: ${jetbrainsMono.style.fontFamily};
}
        `}</style>
      </head>
      <body className="font-mono antialiased">{children}</body>
    </html>
  )
}
