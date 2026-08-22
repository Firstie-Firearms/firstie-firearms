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
    klaviyo?: {
      openForm?: (formId: string) => void
      push?: (args: unknown[]) => void
    }
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

/** True once the Klaviyo onsite script has installed its real API. */
export function isKlaviyoOnsiteReady(): boolean {
  return typeof window !== "undefined" && typeof window.klaviyo?.openForm === "function"
}

/**
 * Opens the existing Klaviyo release-notification popup.
 *
 * Uses the `_klOnsite` command queue, which is correct in both states:
 * before `klaviyo.js` loads it is a plain array that the script drains on
 * init, and after loading the script replaces `push` with a dispatcher that
 * invokes the command immediately. Either way the popup opens without a
 * page reload, so no readiness check or branching is needed here.
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
