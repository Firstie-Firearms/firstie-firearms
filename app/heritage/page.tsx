import type { Metadata } from "next"
import { OurHeritage } from "@/components/our-heritage"

export const metadata: Metadata = {
  title: "About Firstie Firearms | Academy-Graduate Founded",
  description:
    "Firstie Firearms is a veteran-owned, academy-graduate-founded Type 07 FFL creating made-to-order commemorative firearms for service academy graduates.",
  alternates: { canonical: "https://www.firstiefirearms.com/heritage" },
  openGraph: {
    title: "About Firstie Firearms | Academy-Graduate Founded",
    description:
      "Firstie Firearms is a veteran-owned, academy-graduate-founded Type 07 FFL creating made-to-order commemorative firearms for service academy graduates.",
    url: "https://www.firstiefirearms.com/heritage",
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
    title: "About Firstie Firearms | Academy-Graduate Founded",
    description:
      "Firstie Firearms is a veteran-owned, academy-graduate-founded Type 07 FFL creating made-to-order commemorative firearms for service academy graduates.",
    images: ["https://www.firstiefirearms.com/opengraph-image"],
  },
}

export default function HeritagePage() {
  return <OurHeritage />
}
