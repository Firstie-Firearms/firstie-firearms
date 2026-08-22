"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { ReleaseNotificationButton } from "@/components/release-notification-button"

interface StickyOrderButtonProps {
  label: string
  gold: string
  /**
   * Kept for caller ergonomics and future use. Release-notification metadata
   * is derived from the URL, not from these props, so the Klaviyo integration
   * keeps working for academy pages that do not exist yet.
   */
  academy?: string
  classYear?: string
  mode?: "commerce" | "release" | "contact"
  contactHref?: string
  productKey?: string
  isConfigured?: boolean
}

export function StickyOrderButton({
  label,
  gold,
  mode = "commerce",
  contactHref,
  productKey,
  isConfigured = false,
}: StickyOrderButtonProps) {
  const router = useRouter()
  const { addItem, isMutating } = useCart()
  const buttonClass =
    "flex w-full items-center justify-center rounded-sm px-8 py-3 font-sans text-xs font-bold uppercase tracking-widest text-background shadow-lg transition-all hover:brightness-110 active:scale-[0.98] sm:w-auto sm:text-sm"

  const handleOrder = async () => {
    if (!productKey || !isConfigured || isMutating) return
    const added = await addItem(productKey, 1)
    if (added) router.push("/cart")
  }

  let action: React.ReactNode

  if (mode === "release") {
    // Academy + class year are intentionally not passed through: the URL is
    // the single source of truth for the Klaviyo profile metadata.
    action = (
      <ReleaseNotificationButton className={buttonClass} gold={gold}>
        <span className="text-center text-xs sm:text-sm">SIGN UP FOR RELEASE NOTIFICATION</span>
      </ReleaseNotificationButton>
    )
  } else if (mode === "contact" && contactHref) {
    action = (
      <Link href={contactHref} className={buttonClass} style={{ backgroundColor: gold }}>
        CONTACT FIRSTIE FIREARMS NOW
      </Link>
    )
  } else {
    action = (
      <button
        type="button"
        onClick={handleOrder}
        disabled={!isConfigured || isMutating}
        className={`${buttonClass} disabled:cursor-not-allowed disabled:opacity-60`}
        style={{ backgroundColor: gold }}
        title={!isConfigured ? "BigCommerce product identifiers still need to be configured." : undefined}
      >
        {isMutating && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />}
        {isMutating ? "Adding to cart…" : label}
      </button>
    )
  }

  const displayLabel = mode === "release"
    ? "SIGN UP FOR RELEASE NOTIFICATION"
    : mode === "contact"
      ? "CONTACT FIRSTIE FIREARMS NOW"
      : label

  return (
    <div id={mode === "release" ? "release-notification" : undefined} className="site-sticky-order-bar fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between gap-6 px-6 py-4">
        <p className="hidden text-sm font-semibold text-foreground sm:block">{displayLabel}</p>
        {action}
      </div>
    </div>
  )
}
