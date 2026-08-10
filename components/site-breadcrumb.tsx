import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export interface SiteBreadcrumbItem {
  label: string
  href?: string
}

/**
 * Reusable, semantic breadcrumb trail. The final item is always rendered as
 * the current page (no link); every earlier item renders as a crawlable
 * <a> link via next/link. Pair with buildBreadcrumbSchema() from
 * lib/breadcrumb-schema.ts to emit matching BreadcrumbList structured data.
 */
export function SiteBreadcrumb({ items, className }: { items: SiteBreadcrumbItem[]; className?: string }) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <div key={item.label} className="contents">
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
