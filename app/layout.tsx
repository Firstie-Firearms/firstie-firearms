import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AgeGateProvider } from "@/components/age-gate-provider"
import { CartProvider } from "@/components/cart-provider"
import { ScrollToTop } from "@/components/scroll-to-top"
import { AGE_GATE_INLINE_SCRIPT } from "@/lib/age-gate"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

const BASE_URL = "https://www.firstiefirearms.com"

const OG_IMAGE = `${BASE_URL}/opengraph-image`
// Default title/description for pages that don't set their own metadata.
// The homepage (app/page.tsx) overrides these with an `absolute` title so
// the "%s | Firstie Firearms" template below is never applied to it —
// that keeps "Firstie Firearms" from being appended a second time.
const DEFAULT_TITLE = "Firstie Firearms - Service Academy Commemorative Pistols"
const DEFAULT_DESCRIPTION =
  "Made-to-order commemorative pistols for Naval Academy, West Point, and Air Force Academy graduates, featuring class-inspired artwork, custom cases, and lawful FFL delivery."

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Firstie Firearms",
  },
  description: DEFAULT_DESCRIPTION,
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
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
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
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
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
  // Factual only — no telephone, address, reviews, ratings, founders, awards,
  // or affiliations are included unless verified elsewhere in the project.
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Firstie Firearms",
    url: BASE_URL,
    description:
      "Veteran-owned, academy-graduate-founded Type 07 FFL creating made-to-order commemorative firearms for service academy graduates.",
    logo: `${BASE_URL}/favicon.png`,
  }

  // WebSite entity so Google can resolve the correct site name in search
  // results independent of the homepage <title>.
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Firstie Firearms",
    alternateName: "Firstie Firearms",
    url: BASE_URL,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <ScrollToTop />
        <CartProvider>
          <AgeGateProvider>{children}</AgeGateProvider>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
