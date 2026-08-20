import Link from "next/link"
import type { Academy } from "@/types"
import { academyNames } from "@/types"
import { CURRENT_AVAILABLE_YEAR, academyCollectionHref, isClassAvailable } from "@/lib/academies"
import { getAcademyClasses } from "@/lib/academy-collections"
import { ACADEMY_PAGE_CONTENT } from "@/lib/academy-page-content"
import { SiteBreadcrumb } from "@/components/site-breadcrumb"
import { AcademyClassGrid } from "@/components/academy-class-grid"
import { AcademyFaqSection } from "@/components/academy-faq-section"

const GOLD = "#b8946a"
const ALL_ACADEMIES: Academy[] = ["USNA", "USMA", "USAFA"]

/**
 * Shared template rendered by every academy evergreen page
 * (/naval-academy-graduation-gifts, /west-point-graduation-gifts,
 * /air-force-academy-graduation-gifts). Academy-specific copy and class
 * data come entirely from lib/academy-page-content.ts and
 * lib/academy-collections.ts — this file only defines layout/structure, so
 * no marketing copy is duplicated between academies and no page-specific
 * JSX needs to be written per academy.
 */
export function AcademyCollectionPage({ academy }: { academy: Academy }) {
  const academyName = academyNames[academy]
  const content = ACADEMY_PAGE_CONTENT[academy]
  const classes = getAcademyClasses(academy)
  const currentClass = classes.find((c) => c.status === "available") ?? classes[0]
  const otherAcademies = ALL_ACADEMIES.filter((a) => a !== academy)
  const available = isClassAvailable(academy, CURRENT_AVAILABLE_YEAR)

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <SiteBreadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: content.breadcrumbLabel },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <img
            src={
              content.heroImageSrc ||
              `/custom-glock-pistol-.jpg?height=800&width=1600&query=${encodeURIComponent(content.heroImageQuery)}`
            }
            alt={`${academyName} commemorative GLOCK pistol collection`}
            className="h-full w-full object-cover opacity-30"
            style={available ? undefined : { filter: "grayscale(100%) brightness(0.6)" }}
          />
        </div>
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: GOLD }}>
            {academyName}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-balance mb-6" style={{ color: GOLD }}>
            {content.heroHeading}
          </h1>
          <div className="space-y-4">
            {content.heroParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Class Collection / Class Library */}
      <AcademyClassGrid heading={content.collectionHeading} classes={classes} />

      {/* Why This Collection Exists */}
      <section className="container mx-auto px-4 py-8 md:py-16 border-t border-border">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: GOLD }}>
            {content.whyHeading}
          </h2>
          {content.whyParagraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="container mx-auto px-4 py-8 md:py-16 border-t border-border">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: GOLD }}>
            {content.craftsmanshipHeading}
          </h2>
          {content.craftsmanshipParagraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Who The Collection Is For */}
      <section className="container mx-auto px-4 py-8 md:py-16 border-t border-border">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: GOLD }}>
            {content.whoHeading}
          </h2>
          {content.whoParagraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <AcademyFaqSection heading={content.faqHeading} faqs={content.faqs} />

      {/* Related Links */}
      <section className="container mx-auto px-4 py-8 md:py-16 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: GOLD }}>
            {"Continue Exploring"}
          </h2>
          <nav aria-label="Related pages" className="flex flex-col gap-y-3 text-sm md:text-base">
            {currentClass?.href && (
              <Link href={currentClass.href} className="font-semibold hover:opacity-80 transition-opacity" style={{ color: GOLD }}>
                {`View the Current ${academyName} Class`}
              </Link>
            )}
            {otherAcademies.map((other) => (
              <Link
                key={other}
                href={academyCollectionHref(other)}
                className="font-semibold hover:opacity-80 transition-opacity"
                style={{ color: GOLD }}
              >
                {`Explore ${academyNames[other]} Collection`}
              </Link>
            ))}
            <Link href="/heritage" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: GOLD }}>
              {"Our Heritage"}
            </Link>
            <Link href="/faq" className="font-semibold hover:opacity-80 transition-opacity" style={{ color: GOLD }}>
              {"Frequently Asked Questions"}
            </Link>
          </nav>
        </div>
      </section>
    </div>
  )
}
