import type { Metadata } from "next"
import { MainHero } from "@/components/main-hero"

// Exact strings requested for the Google search-result appearance. `title`
// uses `absolute` so the root layout's "%s | Firstie Firearms" template is
// NOT applied here — otherwise "Firstie Firearms" would be appended twice.
const HOME_TITLE = "Service Academy Graduation Gifts | Firstie Firearms"
const HOME_DESCRIPTION =
  "Commemorative pistols for Naval Academy, West Point, and Air Force Academy graduates, featuring class-specific artwork and custom presentation cases."

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: "https://www.firstiefirearms.com/",
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "https://www.firstiefirearms.com/",
    siteName: "Firstie Firearms",
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
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["https://www.firstiefirearms.com/opengraph-image"],
  },
}

export default function HomePage() {
  return <MainHero />
}
