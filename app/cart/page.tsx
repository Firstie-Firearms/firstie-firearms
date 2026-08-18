import type { Metadata } from "next"
import { CartPage } from "@/components/cart-page"

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your Firstie Firearms cart and continue to secure hosted checkout.",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <CartPage />
}
