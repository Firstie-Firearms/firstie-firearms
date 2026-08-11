import type { Metadata } from "next"
import { AcademyCollectionPage } from "@/components/academy-collection-page"
import { buildBreadcrumbSchema } from "@/lib/breadcrumb-schema"

const BASE_URL = "https://www.firstiefirearms.com"
const CANONICAL_URL = `${BASE_URL}/west-point-graduation-gifts`

const TITLE = "West Point Graduation Gifts | Firstie Firearms"
const DESCRIPTION =
  "Explore the full collection of made-to-order West Point commemorative pistols, with class-specific engraving, custom Cerakote, and a two-level presentation case for every graduating class."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL_URL,
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Firstie Firearms — Commemorative Service Academy Pistols",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${BASE_URL}/opengraph-image`],
  },
}

export default function WestPointGraduationGiftsPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "United States Military Academy", url: CANONICAL_URL },
  ])

  return (
    <>
      <link rel="canonical" href={CANONICAL_URL} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AcademyCollectionPage academy="USMA" />
    </>
  )
}
