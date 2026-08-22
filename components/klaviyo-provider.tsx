"use client"

import { useEffect } from "react"
import Script from "next/script"
import { resolveReleaseSignupContext } from "@/lib/klaviyo-onsite"
import {
  KLAVIYO_RELEASE_FORM_ID,
  isValidEmail,
  normalizePhoneToE164,
} from "@/lib/klaviyo-release-signup"

/**
 * Loads the Klaviyo onsite script and enriches release-notification signups.
 *
 * Mounted once in the root layout. It does two things:
 *  1. Loads `klaviyo.js` so the existing popup (`RnVatL`) can be opened.
 *  2. Listens for Klaviyo's `klaviyoForms` submit event and forwards the
 *     visitor's identifiers plus the page metadata to our own API route,
 *     which writes the custom profile properties server-side.
 *
 * Klaviyo's onsite forms cannot attach arbitrary custom profile properties at
 * submit time without adding hidden fields to the form itself, so the
 * documented fallback (a secure server-side Profiles API call) is used.
 */

/** Keys Klaviyo has used for the email field across form versions. */
const EMAIL_KEYS = ["$email", "email", "Email", "EMAIL"]

/** Keys Klaviyo has used for the SMS field across form versions. */
const PHONE_KEYS = ["$phone_number", "phone_number", "$phone", "phone", "PhoneNumber"]

const EMAIL_SHAPE = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/

interface KlaviyoFormsEventDetail {
  type?: string
  formId?: string
  metaData?: Record<string, unknown>
}

function pickString(
  source: Record<string, unknown>,
  keys: readonly string[],
): string | undefined {
  for (const key of keys) {
    const value = source[key]
    if (typeof value === "string" && value.trim().length > 0) return value.trim()
  }
  return undefined
}

/** Last-resort scan for an email-looking value under an unexpected key. */
function findEmailByShape(source: Record<string, unknown>): string | undefined {
  for (const value of Object.values(source)) {
    if (typeof value === "string" && EMAIL_SHAPE.test(value.trim())) {
      return value.trim()
    }
  }
  return undefined
}

export function KlaviyoProvider() {
  const publicApiKey = process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_API_KEY

  useEffect(() => {
    // Guards against duplicate network calls when a multi-step popup fires
    // more than one submit event carrying identical data.
    const sentSignatures = new Set<string>()

    const handleKlaviyoForms = (event: Event) => {
      const detail = (event as CustomEvent<KlaviyoFormsEventDetail>).detail
      if (!detail || detail.type !== "submit") return

      // Only enrich the release-notification popup, never other Klaviyo forms.
      if (detail.formId && detail.formId !== KLAVIYO_RELEASE_FORM_ID) return

      const metaData = detail.metaData ?? {}
      const rawEmail = pickString(metaData, EMAIL_KEYS) ?? findEmailByShape(metaData)
      const email = isValidEmail(rawEmail) ? rawEmail : undefined
      const phoneNumber = normalizePhoneToE164(pickString(metaData, PHONE_KEYS))

      // Nothing to identify the profile by — the popup still handled the
      // signup itself, so there is nothing to recover from here.
      if (!email && !phoneNumber) return

      const context = resolveReleaseSignupContext()
      if (!context) return

      const signature = `${email ?? ""}|${phoneNumber ?? ""}|${context.interestCode}`
      if (sentSignatures.has(signature)) return
      sentSignatures.add(signature)

      // `keepalive` so the request still completes if the visitor navigates
      // away right after submitting. Failures are logged and swallowed — the
      // popup has already added them to the Klaviyo list.
      void fetch("/api/klaviyo/release-signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, phoneNumber, context }),
        keepalive: true,
      })
        .then(async (response) => {
          if (!response.ok) {
            console.error("[v0] klaviyo enrichment responded", response.status)
            return
          }
          const result = (await response.json().catch(() => null)) as
            | { ok?: boolean; reason?: string }
            | null
          if (result && result.ok === false) {
            console.error("[v0] klaviyo enrichment failed:", result.reason)
          }
        })
        .catch((error) => {
          console.error("[v0] klaviyo enrichment request error:", error)
        })
    }

    window.addEventListener("klaviyoForms", handleKlaviyoForms)
    return () => window.removeEventListener("klaviyoForms", handleKlaviyoForms)
  }, [])

  if (!publicApiKey) return null

  return (
    <Script
      id="klaviyo-onsite"
      src={`https://static.klaviyo.com/onsite/js/${publicApiKey}/klaviyo.js`}
      strategy="afterInteractive"
    />
  )
}
