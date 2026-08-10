import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AcademyShowcase } from "@/components/academy-showcase"
import { ACADEMY_SLUGS, CLASS_YEARS, academyCollectionHref, classYearLabel } from "@/lib/academies"
import { buildBreadcrumbSchema } from "@/lib/breadcrumb-schema"
import { academyNames } from "@/types"

const BASE_URL = "https://www.firstiefirearms.com"

interface AcademyPageProps {
  params: Promise<{ academy: string; year: string }>
}

// Per-page SEO copy — unique titles and descriptions for each academy/year combo.
function getPageSeo(academyKey: string, year: string): { title: string; description: string; h1: string } {
  if (academyKey === "USNA" && year === "2027") {
    return {
      title: "USNA Class of 2027 Graduation Gift | Firstie Firearms",
      description:
        "Discover the made-to-order USNA Class of 2027 commemorative GLOCK 19X V, featuring class-inspired engraving, custom Cerakote, and a two-level presentation case.",
      h1: "USNA Class of 2027 Commemorative GLOCK 19X V",
    }
  }
  if (academyKey === "USMA" && year === "2027") {
    return {
      title: "West Point Class of 2027 Graduation Gift | Firstie Firearms",
      description:
        "Get updates on the West Point Class of 2027 commemorative pistol, a made-to-order commissioning gift inspired by the traditions of the Long Gray Line.",
      h1: "West Point Class of 2027 Commemorative Pistol",
    }
  }
  if (academyKey === "USAFA" && year === "2027") {
    return {
      title: "USAFA Class of 2027 Graduation Gift | Firstie Firearms",
      description:
        "Get updates on the USAFA Class of 2027 commemorative pistol, a made-to-order commissioning gift inspired by Air Force Academy traditions.",
      h1: "USAFA Class of 2027 Commemorative Pistol",
    }
  }
  // Generic fallback for future class years
  const label = classYearLabel(year)
  const academyName = academyNames[academyKey as keyof typeof academyNames] ?? academyKey
  return {
    title: `${academyName} ${label} Graduation Gift | Firstie Firearms`,
    description: `Get updates on the ${academyName} ${label} commemorative pistol, a made-to-order commissioning gift for service academy graduates.`,
    h1: `${academyName} ${label} Commemorative Pistol`,
  }
}

export async function generateStaticParams() {
  return Object.keys(ACADEMY_SLUGS).flatMap((academy) =>
    CLASS_YEARS.map((year) => ({ academy, year })),
  )
}

export async function generateMetadata({ params }: AcademyPageProps): Promise<Metadata> {
  const { academy, year } = await params
  const academyKey = ACADEMY_SLUGS[academy.toLowerCase()]

  if (!academyKey || !CLASS_YEARS.includes(year)) {
    return { title: "Firstie Firearms" }
  }

  const { title, description } = getPageSeo(academyKey, year)
  const canonicalUrl = `${BASE_URL}/${academy.toLowerCase()}/${year}`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
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
      title,
      description,
      images: [`${BASE_URL}/opengraph-image`],
    },
  }
}

export default async function AcademyPage({ params }: AcademyPageProps) {
  const { academy, year } = await params
  const academyKey = ACADEMY_SLUGS[academy.toLowerCase()]

  if (!academyKey || !CLASS_YEARS.includes(year)) {
    notFound()
  }

  const label = classYearLabel(year)
  const { h1 } = getPageSeo(academyKey, year)
  const canonicalUrl = `${BASE_URL}/${academy.toLowerCase()}/${year}`
  const academyName = academyNames[academyKey]
  const collectionHref = academyCollectionHref(academyKey)

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: `${academyName} Graduation Gifts`, href: collectionHref },
    { label },
  ]

  // BreadcrumbList schema — always present, mirrors breadcrumbItems above
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: `${academyName} Graduation Gifts`, url: `${BASE_URL}${collectionHref}` },
    { name: label, url: canonicalUrl },
  ])

  // Product schema only for USNA Class of 2027 (the only currently orderable product)
  const productSchema =
    academyKey === "USNA" && year === "2027"
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: "USNA Class of 2027 Commemorative GLOCK 19X V",
          description:
            "Made-to-order USNA Class of 2027 commemorative GLOCK 19X V featuring class-inspired engraving, Tungsten and Burnt Bronze Cerakote, Overwatch Precision PolyDAT trigger, SLR Rifleworks magwell, and a custom two-level presentation case.",
          brand: { "@type": "Brand", name: "Firstie Firearms" },
          category: "Commemorative Firearms",
          url: canonicalUrl,
        }
      : null

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <AcademyShowcase academy={academyKey} classYear={label} h1={h1} breadcrumbItems={breadcrumbItems} />
    </>
  )
}
