import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AcademyShowcase } from "@/components/academy-showcase"
import { ACADEMY_SLUGS } from "@/lib/academies"
import { academyNames } from "@/types"

const BASE_URL = "https://www.firstiefirearms.com"

interface ReunionsPageProps {
  params: Promise<{ academy: string }>
}

export async function generateStaticParams() {
  return Object.keys(ACADEMY_SLUGS).map((academy) => ({ academy }))
}

export async function generateMetadata({ params }: ReunionsPageProps): Promise<Metadata> {
  const { academy } = await params
  const academyKey = ACADEMY_SLUGS[academy.toLowerCase()]

  if (!academyKey) {
    return { title: "Firstie Firearms" }
  }

  const academyName = academyNames[academyKey]
  const title = `${academyName} Reunions Commemorative Pistol | Firstie Firearms`
  const description = `Get updates on the ${academyName} Reunions commemorative pistol, a made-to-order gift honoring the milestone reunion years of service academy graduates.`
  const canonicalUrl = `${BASE_URL}/${academy.toLowerCase()}/reunions`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
  }
}

export default async function ReunionsPage({ params }: ReunionsPageProps) {
  const { academy } = await params
  const academyKey = ACADEMY_SLUGS[academy.toLowerCase()]

  if (!academyKey) {
    notFound()
  }

  const academyName = academyNames[academyKey]
  const canonicalUrl = `${BASE_URL}/${academy.toLowerCase()}/reunions`
  const h1 = `${academyName} Reunions Commemorative Pistol`

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: academyName, item: `${BASE_URL}/${academy.toLowerCase()}/reunions` },
      { "@type": "ListItem", position: 3, name: "Reunions", item: canonicalUrl },
    ],
  }

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AcademyShowcase academy={academyKey} classYear="Class of 2030" h1={h1} pageTitle="Reunions" />
    </>
  )
}
