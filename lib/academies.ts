import type { Academy } from "@/types"

// Map URL slugs to Academy keys
export const ACADEMY_SLUGS: Record<string, Academy> = {
  usna: "USNA",
  usma: "USMA",
  usafa: "USAFA",
}

// Map Academy keys to URL slugs
export const ACADEMY_TO_SLUG: Record<Academy, string> = {
  USNA: "usna",
  USMA: "usma",
  USAFA: "usafa",
}

// Valid class year segments used in routes
export const CLASS_YEARS = ["2027", "2028", "2029", "2030"]

export function classYearLabel(year: string) {
  return `Class of ${year}`
}

// Permanent, evergreen academy collection pages — the parent page for every
// class-year product page under that academy. These URLs are intended to
// remain stable indefinitely; class-year routes (ACADEMY_TO_SLUG + year)
// nest beneath them but keep their own permanent URLs unchanged.
export const ACADEMY_COLLECTION_SLUGS: Record<Academy, string> = {
  USNA: "naval-academy-graduation-gifts",
  USMA: "west-point-graduation-gifts",
  USAFA: "air-force-academy-graduation-gifts",
}

// Map collection-page URL slugs back to Academy keys.
export const ACADEMY_COLLECTION_SLUG_TO_ACADEMY: Record<string, Academy> = Object.fromEntries(
  Object.entries(ACADEMY_COLLECTION_SLUGS).map(([academy, slug]) => [slug, academy as Academy]),
) as Record<string, Academy>

export function academyCollectionHref(academy: Academy) {
  return `/${ACADEMY_COLLECTION_SLUGS[academy]}`
}
