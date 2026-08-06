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
  },
}

export default function HeritagePage() {
  return <OurHeritage />
}
