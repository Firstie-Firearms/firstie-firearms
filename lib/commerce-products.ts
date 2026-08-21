import type { Academy } from "@/types";

export type CommerceProductKey = `${Lowercase<Academy>}-${string}`;

export interface CommerceProductMapping {
  key: CommerceProductKey;
  academy: Academy;
  year: string;
  productId: number | null;
  variantId: number | null;
  sku?: string;
}

// Outside of production, point at BigCommerce's $0 "Integration Test
// Product – DO NOT PURCHASE" (id 118, variant 83) so the full checkout flow,
// including real payment, can be exercised safely. Production always uses
// the real product/variant below.
const isProduction = process.env.NODE_ENV === "production";

// Add future products here after creating the corresponding BigCommerce
// product/variant. Never place IDs inside visual components.
export const COMMERCE_PRODUCTS: Record<string, CommerceProductMapping> = {
  "usna-2027": {
    key: "usna-2027",
    academy: "USNA",
    year: "2027",
    productId: isProduction ? 112 : 118,
    variantId: isProduction ? 77 : 83,
  },
};

export function getCommerceProduct(key: string) {
  return COMMERCE_PRODUCTS[key];
}

export function isCommerceProductConfigured(key: string) {
  const product = getCommerceProduct(key);
  return Boolean(product?.productId && product?.variantId);
}

export function commerceProductKey(
  academy: Academy,
  classYear: string,
): CommerceProductKey {
  const year = classYear.replace(/\D/g, "");
  return `${academy.toLowerCase() as Lowercase<Academy>}-${year}`;
}
