import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AgeGateProvider } from "@/components/age-gate-provider"
import { ScrollToTop } from "@/components/scroll-to-top"
import { AGE_GATE_INLINE_SCRIPT } from "@/lib/age-gate"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

const BASE_URL = "https://www.firstiefirearms.com"

const OG_IMAGE = `${BASE_URL}/opengraph-image`
const OG_TITLE = "Firstie Firearms - Service Academy Commemorative Pistols"
const OG_DESCRIPTION =
  "Made-to-order commemorative pistols for Naval Academy, West Point, and Air Force Academy graduates, featuring class-inspired artwork, custom cases, and lawful FFL delivery."

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: OG_TITLE,
    template: "%s | Firstie Firearms",
  },
  description: OG_DESCRIPTION,
  generator: "v0.app",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Firstie Firearms",
    locale: "en_US",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        secureUrl: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Firstie Firearms logo — Commemorative Service Academy Pistols",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Firstie Firearms LLC",
    url: BASE_URL,
    description:
      "Veteran-owned, academy-graduate-founded Type 07 FFL creating made-to-order commemorative firearms for service academy graduates.",
    logo: `${BASE_URL}/favicon.png`,
    foundingLocation: {
      "@type": "Place",
      addressCountry: "US",
      addressRegion: "TX",
    },
  }

  return (
    <html lang="en" className="bg-background" data-age-gate="pending">
      <head>
        {/*
          Blocking, synchronous script — runs before <body> paints and
          before React hydrates. It only ever sets data-age-gate to
          "verified" if sessionStorage positively confirms the visitor
          already verified their age THIS browser session; any error or
          missing value leaves it at the fail-closed "pending" default
          already set above, which keeps #site-content hidden (see
          globals.css).
        */}
        <script dangerouslySetInnerHTML={{ __html: AGE_GATE_INLINE_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <ScrollToTop />
        <AgeGateProvider>{children}</AgeGateProvider>
        <Analytics />
      </body>
    </html>
  )
}
