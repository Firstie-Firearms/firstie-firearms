"use client"

import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useCart } from "@/components/cart-provider"

interface StickyOrderButtonProps {
  label: string
  gold: string
  productKey?: string
  isConfigured?: boolean
}

export function StickyOrderButton({ label, gold, productKey, isConfigured = false }: StickyOrderButtonProps) {
  const router = useRouter()
  const { addItem, isMutating } = useCart()
  const btnClass =
    "flex items-center justify-center font-sans font-bold uppercase tracking-widest text-background rounded-sm shadow-lg transition-all hover:brightness-110 active:scale-[0.98] px-8 py-3 disabled:cursor-not-allowed disabled:opacity-60"

  const displayLabel = isConfigured ? label : "Online Ordering Setup Pending"
  const spaceIdx = displayLabel.indexOf(" ")
  const firstWord = spaceIdx !== -1 ? displayLabel.slice(0, spaceIdx) : displayLabel
  const restWords = spaceIdx !== -1 ? displayLabel.slice(spaceIdx + 1) : ""

  const handleOrder = async () => {
    if (!productKey || !isConfigured || isMutating) return
    const added = await addItem(productKey, 1)
    if (added) router.push("/cart")
  }

  return (
    <div className="site-sticky-order-bar fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between gap-6 px-6 py-4">
        <p className="hidden text-sm font-semibold text-foreground sm:block">{displayLabel}</p>
        <button
          type="button"
          onClick={handleOrder}
          disabled={!isConfigured || isMutating}
          className={`${btnClass} w-full sm:w-auto`}
          style={{ backgroundColor: gold }}
          title={!isConfigured ? "BigCommerce product identifiers still need to be configured." : undefined}
        >
          {isMutating && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />}
          <span className="flex flex-col items-center text-xs leading-tight tracking-widest sm:hidden">
            <span>{isMutating ? "Adding" : firstWord}</span>
            <span>{isMutating ? "to cart…" : restWords}</span>
          </span>
          <span className="hidden text-sm sm:inline">{isMutating ? "Adding to cart…" : displayLabel}</span>
        </button>
      </div>
    </div>
  )
}
