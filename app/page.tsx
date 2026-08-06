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
  },
}

export default function HomePage() {
  return <MainHero />
}
