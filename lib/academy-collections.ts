import type { Academy } from "@/types"
import { academyNames } from "@/types"
import { ACADEMY_TO_SLUG, CLASS_YEARS, classYearLabel, getComingSoonLabel, isClassAvailable } from "@/lib/academies"

export type ClassCollectionStatus = "available" | "coming-soon"

export interface AcademyClassCollectionItem {
  academy: Academy
  classYear: string
  title: string
  description: string
  image: string
  imageAlt: string
  href: string
  status: ClassCollectionStatus
  statusLabel: string
  ctaLabel: string
}

const SHORT_NAMES: Record<Academy, string> = { USNA: "USNA", USMA: "USMA", USAFA: "USAFA" }

/**
 * Builds the class library for a single academy from the shared CLASS_YEARS
 * list. To add a future class (e.g. Class of 2031), add its year to
 * CLASS_YEARS in lib/academies.ts — this function, and every academy page
 * that calls it, will automatically render a new card with no other code
 * changes required.
 *
 * Availability (and therefore the grayed-out preview treatment + status tag)
 * comes from the shared isClassAvailable/getComingSoonLabel helpers in
 * lib/academies.ts, so this stays perfectly in sync with the homepage,
 * collection-page hero, and individual product pages.
 */
export function getAcademyClasses(academy: Academy): AcademyClassCollectionItem[] {
  const slug = ACADEMY_TO_SLUG[academy]
  const shortName = SHORT_NAMES[academy]
  const academyName = academyNames[academy]

  return [...CLASS_YEARS]
    .sort((a, b) => Number(a) - Number(b))
    .map((year) => {
      const label = classYearLabel(year)
      const isAvailable = isClassAvailable(academy, year)
      // USNA's Class of 2027 is the featured exception shown in full color
      // (see isPreviewImageGrayedOut) even though isClassAvailable is false
      // for every academy/year today — its card link should read "View",
      // not "Preview", to match that featured treatment.
      const useViewLabel = isAvailable || (academy === "USNA" && year === "2027")
      const imageQuery = encodeURIComponent(
        `custom engraved GLOCK 19X V pistol ${shortName} ${label} commemorative with presentation case`,
      )

      return {
        academy,
        classYear: year,
        title: `${shortName} ${label}`,
        description: isAvailable
          ? `The current commemorative edition for the ${academyName}, designed in collaboration with members of the ${label}.`
          : `A future commemorative edition for the ${academyName} ${label}, released once class-specific artwork is finalized.`,
        image: `/custom-glock-pistol-.jpg?height=900&width=1200&query=${imageQuery}`,
        imageAlt: `${shortName} ${label} commemorative GLOCK 19X V`,
        href: `/${slug}/${year}`,
        status: isAvailable ? "available" : "coming-soon",
        statusLabel: isAvailable ? "AVAILABLE NOW" : getComingSoonLabel(academy, year),
        ctaLabel: useViewLabel ? `View ${label}` : `Preview ${label}`,
      } satisfies AcademyClassCollectionItem
    })
}
