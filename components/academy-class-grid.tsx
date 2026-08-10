import { AcademyClassCard } from "@/components/academy-class-card"
import type { AcademyClassCollectionItem } from "@/lib/academy-collections"

const GOLD = "#b8946a"

/**
 * Renders the full class library for one academy as a two-column grid on
 * desktop and a single column on mobile. Fully data-driven — adding a class
 * means adding an entry to the array passed in via `classes`, nothing here
 * needs to change.
 */
export function AcademyClassGrid({ heading, classes }: { heading: string; classes: AcademyClassCollectionItem[] }) {
  return (
    <section id="class-collection" className="container mx-auto px-4 py-8 md:py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12" style={{ color: GOLD }}>
        {heading}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
        {classes.map((item) => (
          <AcademyClassCard key={item.classYear} item={item} />
        ))}
      </div>
    </section>
  )
}
