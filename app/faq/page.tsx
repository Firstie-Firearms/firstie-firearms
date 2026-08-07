import type { Metadata } from "next"
import { FaqPage } from "@/components/faq-page"

export const metadata: Metadata = {
  title: "FAQ | Firstie Firearms",
  description:
    "Answers to common questions about ordering, production timelines, and FFL delivery for Firstie Firearms commemorative pistols.",
  alternates: { canonical: "https://www.firstiefirearms.com/faq" },
  openGraph: {
    title: "FAQ | Firstie Firearms",
    description:
      "Answers to common questions about ordering, production timelines, and FFL delivery for Firstie Firearms commemorative pistols.",
    url: "https://www.firstiefirearms.com/faq",
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
    title: "FAQ | Firstie Firearms",
    description:
      "Answers to common questions about ordering, production timelines, and FFL delivery for Firstie Firearms commemorative pistols.",
    images: ["https://www.firstiefirearms.com/opengraph-image"],
  },
}

export default function FaqRoute() {
  return <FaqPage />
}
