import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { isPreviewImageGrayedOut } from "@/lib/academies"
import type { AcademyClassCollectionItem } from "@/lib/academy-collections"

const GOLD = "#b8946a"

/**
 * A single class-year entry in an academy's class library. Renders every
 * field from AcademyClassCollectionItem — including a status badge — and
 * always links to a real, already-existing class page (href is required).
 * A future "coming soon" class with no page yet can omit rendering the
 * link/CTA by leaving item.href undefined at the data layer; this component
 * degrades to a non-interactive card in that case.
 */
export function AcademyClassCard({ item }: { item: AcademyClassCollectionItem }) {
  const grayedOut = isPreviewImageGrayedOut(item.academy, item.classYear)

  const content = (
    <Card className="relative h-full overflow-hidden border-2 border-border transition-colors duration-300 group-hover:border-[--gold] py-0" style={{ "--gold": GOLD } as React.CSSProperties}>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.imageAlt}
          loading="lazy"
          width={1200}
          height={900}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={grayedOut ? { filter: "grayscale(100%) brightness(0.6)" } : undefined}
        />
        <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5">
          <span
            className="inline-block rounded border bg-background/70 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider whitespace-nowrap"
            style={{ borderColor: GOLD, color: GOLD }}
          >
            {item.statusLabel}
          </span>
          <span
            className="inline-block rounded border bg-background/70 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider"
            style={{ borderColor: GOLD, color: GOLD }}
          >
            {"LIMITED EDITION"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-5 md:p-6">
        <h3 className="text-lg md:text-xl font-bold" style={{ color: GOLD }}>
          {item.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
        <span
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity group-hover:opacity-80"
          style={{ color: GOLD }}
        >
          {item.ctaLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Card>
  )

  if (!item.href) {
    return <div className="group h-full">{content}</div>
  }

  return (
    <Link href={item.href} className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-xl">
      {content}
    </Link>
  )
}
