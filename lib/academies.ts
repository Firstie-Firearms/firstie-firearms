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
