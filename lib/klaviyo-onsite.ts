import {
  KLAVIYO_RELEASE_FORM_ID,
  type ReleaseSignupContext,
  captureReleaseSignupContext,
} from "@/lib/klaviyo-release-signup"

/**
 * Browser-side bridge to the Klaviyo onsite JavaScript API.
 *
 * The popup itself already exists in Klaviyo (form `RnVatL`); nothing here
 * renders UI. This module only opens that popup and remembers which academy
 * page the visitor opened it from, so the submit listener can attach the
 * correct metadata afterwards.
 */

declare global {
  interface Window {
    _klOnsite?: unknown[]
  }
}

/**
 * Context captured at click time.
 *
 * The Klaviyo popup renders in its own layer and its submit event carries no
 * page context, so the page the visitor clicked from is recorded here first.
 * It is deliberately not cleared after being read: multi-step popups (email
 * step, then SMS step) fire one `submit` event per step and both need it.
 */
let pendingContext: ReleaseSignupContext | null = null

/** True once the Klaviyo onsite script has reported itself as loaded. */
export function isKlaviyoOnsiteReady(): boolean {
  return typeof window !== "undefined" && Array.isArray(window._klOnsite)
}

/**
 * Opens the existing Klaviyo release-notification popup.
 *
 * Uses the exact `_klOnsite` push documented by Klaviyo. Pushing onto the
 * queue works whether or not `klaviyo.js` has finished loading, so this is
 * safe to call immediately after hydration and never triggers a page reload.
 */
export function openReleaseNotificationForm(): void {
  if (typeof window === "undefined") return

  // Record the page context before the popup takes over the screen.
  pendingContext = captureReleaseSignupContext()

  window._klOnsite = window._klOnsite || []
  window._klOnsite.push(["openForm", KLAVIYO_RELEASE_FORM_ID])
}

/**
 * Returns the context to attach to a submission.
 *
 * Falls back to parsing the current URL, which covers popups opened by
 * Klaviyo's own targeting rules rather than by our button. Returns `null`
 * when the visitor is not on an academy class page, in which case no
 * metadata is sent.
 */
export function resolveReleaseSignupContext(): ReleaseSignupContext | null {
  return pendingContext ?? captureReleaseSignupContext()
}

/** Test seam — clears the remembered click context. */
export function resetReleaseSignupContext(): void {
  pendingContext = null
}
