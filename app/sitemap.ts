import type { MetadataRoute } from "next"
import { ACADEMY_SLUGS, CLASS_YEARS } from "@/lib/academies"

const BASE_URL = "https://www.firstiefirearms.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/heritage`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  const academyRoutes: MetadataRoute.Sitemap = Object.keys(ACADEMY_SLUGS).flatMap((slug) =>
    CLASS_YEARS.map((year) => ({
      url: `${BASE_URL}/${slug}/${year}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      // Class of 2027 pages are the current flagship — highest priority
      priority: year === "2027" ? 0.9 : 0.5,
    })),
  )

  return [...staticRoutes, ...academyRoutes]
}
