import { upsertReleaseSignupProfile } from "@/lib/klaviyo-profile"
import {
  isValidE164Phone,
  isValidEmail,
  sanitizeReleaseSignupContext,
} from "@/lib/klaviyo-release-signup"

/**
 * `POST /api/klaviyo/release-signup`
 *
 * Attaches release-notification metadata to a Klaviyo profile after the
 * existing Klaviyo popup (form `RnVatL`) has been submitted successfully.
 *
 * This endpoint is intentionally forgiving: the visitor has already been added
 * to the Klaviyo list by the popup itself, so a failure here must never be
 * surfaced as a broken signup. Errors are logged and swallowed.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Simple in-memory limiter to keep this public endpoint from being abused. */
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 12
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const bucket = rateLimitBuckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  bucket.count += 1
  if (bucket.count > RATE_LIMIT_MAX_REQUESTS) return true

  // Opportunistically evict stale buckets so the map cannot grow unbounded.
  if (rateLimitBuckets.size > 5_000) {
    for (const [bucketKey, value] of rateLimitBuckets) {
      if (now > value.resetAt) rateLimitBuckets.delete(bucketKey)
    }
  }

  return false
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
}

export async function POST(request: Request) {
  if (isRateLimited(clientKey(request))) {
    // 202 rather than 429: the popup already succeeded, so there is nothing
    // for the browser to retry or report.
    return Response.json({ ok: false, reason: "rate_limited" }, { status: 202 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, reason: "invalid_json" }, { status: 400 })
  }

  const payload = (body ?? {}) as Record<string, unknown>

  const rawEmail = typeof payload.email === "string" ? payload.email.trim() : ""
  const rawPhone = typeof payload.phoneNumber === "string" ? payload.phoneNumber.trim() : ""

  const email = isValidEmail(rawEmail) ? rawEmail.toLowerCase() : undefined
  // Klaviyo only accepts E.164. The browser normalizes before posting, but
  // normalize again here so the endpoint is correct on its own terms; anything
  // that cannot be normalized is dropped rather than failing the request.
  const phoneNumber = normalizePhoneToE164(rawPhone)

  if (!email && !phoneNumber) {
    console.log("[v0] klaviyo release signup: no usable identifier in submission")
    return Response.json({ ok: false, reason: "missing_identifier" }, { status: 400 })
  }

  const context = sanitizeReleaseSignupContext(payload.context)
  if (!context) {
    console.log("[v0] klaviyo release signup: submission was not from an academy class page")
    return Response.json({ ok: false, reason: "invalid_context" }, { status: 400 })
  }

  const result = await upsertReleaseSignupProfile({ email, phoneNumber, context })

  if (!result.ok) {
    console.error(
      `[v0] klaviyo release signup failed for ${context.interestCode}:`,
      result.status ?? "",
      result.reason,
    )
    // Still a 202 — the customer is on the list, only the enrichment failed.
    return Response.json({ ok: false, reason: result.reason }, { status: 202 })
  }

  console.log(
    `[v0] klaviyo release signup ${result.created ? "created" : "updated"} profile ${result.profileId} for ${context.interestCode}`,
  )

  return Response.json({ ok: true, created: result.created })
}
