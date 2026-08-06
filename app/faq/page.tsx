import type { Metadata } from "next"
import { FaqPage } from "@/components/faq-page"

export const metadata: Metadata = {
  title: "FAQ | Firstie Firearms",
  description:
    "Answers to common questions about ordering, personalization, production timelines, and FFL delivery for Firstie Firearms commemorative pistols.",
  alternates: { canonical: "https://www.firstiefirearms.com/faq" },
  openGraph: {
    title: "FAQ | Firstie Firearms",
    description:
      "Answers to common questions about ordering, personalization, production timelines, and FFL delivery for Firstie Firearms commemorative pistols.",
    url: "https://www.firstiefirearms.com/faq",
  },
}

export default function FaqRoute() {
  return <FaqPage />
}
