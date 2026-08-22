"use client"

import { openReleaseNotificationForm } from "@/lib/klaviyo-onsite"

/**
 * Opens the existing Klaviyo release-notification popup.
 *
 * Styling, label, and placement are inherited from the caller so this is a
 * drop-in replacement for the previous placeholder dialog trigger — no new
 * button is introduced anywhere.
 */
interface ReleaseNotificationButtonProps {
  className: string
  gold: string
  children: React.ReactNode
}

export function ReleaseNotificationButton({
  className,
  gold,
  children,
}: ReleaseNotificationButtonProps) {
  return (
    <button
      type="button"
      className={className}
      style={{ backgroundColor: gold }}
      onClick={openReleaseNotificationForm}
    >
      {children}
    </button>
  )
}

/**
 * Ribbon variant: same popup, but the caller supplies border/text colors
 * instead of a filled background.
 */
export function ReleaseNotificationRibbonButton({
  className,
  gold,
  children,
}: ReleaseNotificationButtonProps) {
  return (
    <button
      type="button"
      className={className}
      style={{ borderColor: gold, color: gold }}
      onClick={openReleaseNotificationForm}
    >
      {children}
    </button>
  )
}
