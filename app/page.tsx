import type { Metadata } from "next"
import { MainHero } from "@/components/main-hero"

export const metadata: Metadata = {
  title: "Firstie Firearms - Service Academy Commemorative Pistols",
  description:
    "Made-to-order commemorative pistols for Naval Academy, West Point, and Air Force Academy graduates, featuring class-inspired artwork, custom cases, and lawful FFL delivery.",
  alternates: {
    canonical: "https://www.firstiefirearms.com",
  },
  openGraph: {
    title: "Firstie Firearms - Service Academy Commemorative Pistols",
    description:
      "Made-to-order commemorative pistols for Naval Academy, West Point, and Air Force Academy graduates, featuring class-inspired artwork, custom cases, and lawful FFL delivery.",
    url: "https://www.firstiefirearms.com",
    images: [
      {
        url: "https://www.firstiefirearms.com/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Firstie Firearms — Commemorative Service Academy Pistols",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Firstie Firearms - Service Academy Commemorative Pistols",
    description:
      "Made-to-order commemorative pistols for Naval Academy, West Point, and Air Force Academy graduates, featuring class-inspired artwork, custom cases, and lawful FFL delivery.",
    images: ["https://www.firstiefirearms.com/opengraph-image"],
  },
}

export default function HomePage() {
  return <MainHero />
}
