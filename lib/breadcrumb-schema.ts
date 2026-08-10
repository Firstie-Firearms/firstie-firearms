export interface BreadcrumbSchemaItem {
  name: string
  url: string
}

/**
 * Builds a schema.org BreadcrumbList object from an ordered list of
 * {name, url} items. Shared by every page that renders a <SiteBreadcrumb />
 * so breadcrumb structured data stays consistent as pages are added.
 */
export function buildBreadcrumbSchema(items: BreadcrumbSchemaItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
