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

// The single class currently orderable across the entire site. Every other
// academy/year combination is "coming soon" and should render grayed-out
// preview imagery — see isClassAvailable below. Update these two constants
// when the next class becomes available; every page that calls
// isClassAvailable / getComingSoonLabel will follow automatically.
export const CURRENT_AVAILABLE_ACADEMY: Academy = "USNA"
export const CURRENT_AVAILABLE_YEAR = "2027"

/**
 * Whether a given academy + class year combination is actually orderable
 * today. Only USNA's Class of 2027 is available; every other academy/year
 * pairing (including USNA 2028-2030 and every USMA/USAFA class) is
 * "coming soon" and should be grayed out and tagged consistently wherever
 * its preview image appears (homepage, collection pages, product pages).
 */
export function isClassAvailable(academy: Academy, year: string) {
  const digits = year.replace(/\D/g, "")
  return academy === CURRENT_AVAILABLE_ACADEMY && digits === CURRENT_AVAILABLE_YEAR
}

/**
 * Release month for a given academy/year's "coming soon" tag. USNA classes
 * always release in August. USMA/USAFA's Class of 2027 releases in October,
 * but Classes of 2028, 2029, and 2030 release in August.
 */
function getComingSoonMonth(academy: Academy, yearNum: number) {
  if (academy === "USNA") return "AUGUST"
  return yearNum === 2027 ? "OCTOBER" : "AUGUST"
}

/**
 * Single source of truth for the "COMING SOON - <MONTH> '<YY>" tag shown on
 * every not-yet-available pistol preview image (homepage cards, collection
 * page heroes, class library cards, and individual product pages). Keeping
 * this in one place ensures the date/format never drifts between pages.
 */
export function getComingSoonLabel(academy: Academy, year: string) {
  const yearNum = Number.parseInt(year.replace(/\D/g, ""), 10)
  const labelYear = String((yearNum - 1) % 100).padStart(2, "0")
  return `COMING SOON - ${getComingSoonMonth(academy, yearNum)} '${labelYear}`
}
