"use client"

import Link from "next/link"
import { Loader2, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react"
import { SiteBreadcrumb } from "@/components/site-breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"

function money(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value)
}

export function CartPage() {
  const { cart, isLoading, isMutating, error, updateItem, removeItem, checkout } = useCart()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 pb-20 pt-28 md:px-6">
        <SiteBreadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        <div className="flex flex-col gap-2 py-8">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Secure order review</p>
          <h1 className="text-balance font-sans text-3xl font-bold md:text-5xl">Your cart</h1>
          <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            Review your commemorative pistol order before continuing to BigCommerce&apos;s secure hosted checkout.
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-6 border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-72 items-center justify-center" aria-live="polite">
            <Loader2 className="size-6 animate-spin text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Loading cart</span>
          </div>
        ) : !cart || cart.items.length === 0 ? (
          <section className="flex min-h-80 flex-col items-center justify-center gap-5 border border-border bg-card px-6 text-center">
            <ShoppingBag className="size-8 text-muted-foreground" aria-hidden="true" />
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Your cart is empty.</h2>
              <p className="text-muted-foreground">Explore the academy collections to find your class commemorative pistol.</p>
            </div>
            <Button asChild><Link href="/naval-academy-graduation-gifts">View Commemorative Pistols</Link></Button>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <section aria-labelledby="cart-items-heading" className="flex flex-col gap-4">
              <h2 id="cart-items-heading" className="sr-only">Cart items</h2>
              {cart.items.map((item) => (
                <article key={item.id} className="flex flex-col gap-5 border border-border bg-card p-5 sm:flex-row">
                  <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden bg-muted">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="size-full object-contain" />
                    ) : (
                      <ShoppingBag className="size-7 text-muted-foreground" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-pretty text-lg font-semibold">{item.name}</h3>
                      {item.sku && <p className="font-mono text-xs text-muted-foreground">SKU: {item.sku}</p>}
                      {item.options.map((option) => (
                        <p key={`${option.name}-${option.value}`} className="text-sm text-muted-foreground">{option.name}: {option.value}</p>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center border border-border" aria-label={`Quantity for ${item.name}`}>
                        <Button variant="ghost" size="icon" disabled={isMutating || item.quantity <= 1} onClick={() => void updateItem(item.id, item.quantity - 1)} aria-label="Decrease quantity"><Minus /></Button>
                        <span className="min-w-10 text-center text-sm font-semibold" aria-live="polite">{item.quantity}</span>
                        <Button variant="ghost" size="icon" disabled={isMutating || item.quantity >= 5} onClick={() => void updateItem(item.id, item.quantity + 1)} aria-label="Increase quantity"><Plus /></Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-semibold">{money(item.lineTotal, cart.currency)}</p>
                        <Button variant="ghost" size="icon" disabled={isMutating} onClick={() => void removeItem(item.id)} aria-label={`Remove ${item.name}`}><Trash2 /></Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit border border-border bg-card p-6 lg:sticky lg:top-28" aria-labelledby="order-summary-heading">
              <div className="flex flex-col gap-5">
                <h2 id="order-summary-heading" className="text-xl font-semibold">Order summary</h2>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Subtotal</span><span>{money(cart.subtotal, cart.currency)}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Shipping</span><span>Calculated at checkout</span></div>
                  <div className="flex justify-between gap-4"><span className="text-muted-foreground">Taxes</span><span>Calculated at checkout</span></div>
                </div>
                <Separator />
                <div className="flex items-baseline justify-between gap-4"><span className="font-semibold">Estimated total</span><span className="text-xl font-bold">{money(cart.total, cart.currency)}</span></div>
                <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
                  By proceeding to checkout, you acknowledge that you have reviewed and agree to our{" "}
                  <Link href="/terms-and-conditions" className="underline underline-offset-4 hover:text-foreground">Terms &amp; Conditions</Link>{" "}
                  and <Link href="/refund-policy" className="underline underline-offset-4 hover:text-foreground">Refund Policy</Link>.
                </p>
                <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
                  Custom firearm orders may be cancelled within 48 hours of purchase. After 48 hours, custom firearm orders are non-refundable.
                </p>
                <Button size="lg" disabled={isMutating || !cart || cart.items.length === 0} onClick={() => void checkout()}>
                  {isMutating ? <Loader2 className="animate-spin" data-icon="inline-start" /> : <ShieldCheck data-icon="inline-start" />}
                  {isMutating ? "Preparing checkout…" : "Proceed to Secure Checkout"}
                </Button>
                <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
                  Firearms are transferred through a licensed FFL where required. Final transfer and state-compliant magazine requirements are handled as part of purchase and fulfillment.
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}
