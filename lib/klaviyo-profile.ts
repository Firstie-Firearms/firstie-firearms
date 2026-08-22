import "server-only"

import {
  type ReleaseSignupContext,
  toKlaviyoProfileProperties,
} from "@/lib/klaviyo-release-signup"

/**
 * Server-only Klaviyo Profiles API client.
 *
 * `KLAVIYO_PRIVATE_API_KEY` is read here and nowhere else, and this module is
 * marked `server-only` so it can never be pulled into a browser bundle.
 */

const KLAVIYO_API_BASE = "https://a.klaviyo.com/api"

/** Pinned API revision. Verified against the live account before shipping. */
const KLAVIYO_REVISION = "2025-07-15"

const REQUEST_TIMEOUT_MS = 8_000

export type KlaviyoUpsertResult =
  | { ok: true; profileId: string | null; created: boolean }
  | { ok: false; reason: string; status?: number }

/**
 * Creates or updates a Klaviyo profile and attaches the release-notification
 * metadata as custom profile properties.
 *
 * Uses `POST /api/profile-import`, Klaviyo's documented upsert endpoint: it
 * matches on email / phone number and updates the existing profile rather
 * than creating a duplicate.
 */
export async function upsertReleaseSignupProfile(input: {
  email?: string
  phoneNumber?: string
  context: ReleaseSignupContext
}): Promise<KlaviyoUpsertResult> {
  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY

  if (!apiKey) {
    return { ok: false, reason: "missing_api_key" }
  }

  if (!input.email && !input.phoneNumber) {
    return { ok: false, reason: "missing_identifier" }
  }

  const attributes: Record<string, unknown> = {
    properties: toKlaviyoProfileProperties(input.context),
  }
  if (input.email) attributes.email = input.email
  if (input.phoneNumber) attributes.phone_number = input.phoneNumber

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${KLAVIYO_API_BASE}/profile-import/`, {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        revision: KLAVIYO_REVISION,
        "content-type": "application/vnd.api+json",
        accept: "application/vnd.api+json",
      },
      body: JSON.stringify({ data: { type: "profile", attributes } }),
      signal: controller.signal,
      cache: "no-store",
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => "")
      return {
        ok: false,
        reason: detail.slice(0, 500) || response.statusText,
        status: response.status,
      }
    }

    const payload = (await response.json().catch(() => null)) as
      | { data?: { id?: string } }
      | null

    return {
      ok: true,
      profileId: payload?.data?.id ?? null,
      // Klaviyo returns 201 when it created the profile, 200 when it updated
      // an existing one.
      created: response.status === 201,
    }
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "AbortError"
        ? "timeout"
        : error instanceof Error
          ? error.message
          : "unknown_error"
    return { ok: false, reason }
  } finally {
    clearTimeout(timeout)
  }
}
