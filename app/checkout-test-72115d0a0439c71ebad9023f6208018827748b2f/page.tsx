import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CART_COOKIE, CART_COOKIE_OPTIONS } from "@/lib/cart-cookie"
import { createCart, getCheckoutUrl } from "@/lib/bigcommerce"
import { CHECKOUT_TEST_PRODUCT } from "@/lib/commerce-products"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Checkout Test",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
}

function isCheckoutTestEnabled() {
  return process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview"
}

async function startTestCheckout() {
  "use server"

  if (!isCheckoutTestEnabled()) notFound()

  const cart = await createCart(
    CHECKOUT_TEST_PRODUCT.productId,
    CHECKOUT_TEST_PRODUCT.variantId,
    1,
  )
  const cookieStore = await cookies()
  cookieStore.set(CART_COOKIE, cart.id, CART_COOKIE_OPTIONS)

  redirect(await getCheckoutUrl(cart.id))
}

export default function CheckoutTestPage() {
  if (!isCheckoutTestEnabled()) notFound()

  return (
    <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
      <section className="flex w-full max-w-xl flex-col items-center gap-6 text-center">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
            {"Unlisted checkout test"}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {"Test secure checkout"}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {"This Preview-only test creates a fresh cart with the $0 BigCommerce integration test product (ID 118, variant 83), then opens secure checkout. It replaces the cart in this browser. No order is placed unless you submit checkout."}
          </p>
        </div>
        <form action={startTestCheckout} className="w-full">
          <Button type="submit" size="lg" className="w-full">
            {"Create test cart and continue to checkout"}
          </Button>
        </form>
      </section>
    </main>
  )
}
