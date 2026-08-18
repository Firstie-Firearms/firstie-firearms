import type { Academy } from "@/types"

export type CommerceProductKey = `${Lowercase<Academy>}-${string}`

export interface CommerceProductMapping {
  key: CommerceProductKey
  academy: Academy
  year: string
  productId: number | null
  variantId: number | null
  sku?: string
}

// Add future products here after creating the corresponding BigCommerce
// product/variant. Never place IDs inside visual components.
export const COMMERCE_PRODUCTS: Record<string, CommerceProductMapping> = {
  "usna-2027": {
    key: "usna-2027",
    academy: "USNA",
    year: "2027",
    // TODO: Replace with the real BigCommerce IDs before enabling ordering.
    productId: 112,
    variantId: 77,
  },
}

export function getCommerceProduct(key: string) {
  return COMMERCE_PRODUCTS[key]
}

export function isCommerceProductConfigured(key: string) {
  const product = getCommerceProduct(key)
  return Boolean(product?.productId && product?.variantId)
}

export function commerceProductKey(academy: Academy, classYear: string): CommerceProductKey {
  const year = classYear.replace(/\D/g, "")
  return `${academy.toLowerCase() as Lowercase<Academy>}-${year}`
}
