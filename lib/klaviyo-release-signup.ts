/**
 * Shared (isomorphic) contract for the "Sign Up for Release Notification"
 * Klaviyo integration.
 *
 * The URL is the single source of truth for academy + class year, so this
 * module works automatically for any future `/academy/classyear` page
 * (`/usna/2027`, `/usma/2028`, `/usafa/2030`, ...) with no code changes.
 *
 * No `window` access happens at module scope so this file is safe to import
 * from Server Components, Route Handlers, and the browser alike.
 */

/** ID of the Klaviyo popup that already exists in the Klaviyo account. */
export const KLAVIYO_RELEASE_FORM_ID = "RnVatL"

/** Value written to the `SignupSource` Klaviyo profile property. */
export const RELEASE_SIGNUP_SOURCE = "Website Release Notification"

/**
 * Metadata attached to the Klaviyo profile after a successful popup submit.
 * Property names map 1:1 onto Klaviyo custom profile properties.
 */
export interface ReleaseSignupContext {
  /** Uppercased academy slug from the URL, e.g. `USNA`. */
  academy: string
  /** Four digit class year from the URL, e.g. `2028`. */
  classYear: string
  /** `${academy}-${classYear}`, e.g. `USNA-2028`. */
  interestCode: string
  /** Pathname of the page the visitor signed up from, e.g. `/usna/2028`. */
  interestPage: string
  /** Absolute URL of that page, e.g. `https://www.firstiefirearms.com/usna/2028`. */
  productUrl: string
  /** Always {@link RELEASE_SIGNUP_SOURCE}. */
  signupSource: string
  /** `document.referrer`, or an empty string when unavailable. */
  referrer: string
  /** ISO 8601 timestamp of the signup. */
  signupTimestamp: string
}

/** Request body accepted by `POST /api/klaviyo/release-signup`. */
export interface ReleaseSignupRequest {
  email?: string
  phoneNumber?: string
  context: ReleaseSignupContext
}

/**
 * Academy slug: a short alphanumeric segment. Intentionally generic — no
 * academy is hardcoded, so new academies work without a deploy.
 */
const ACADEMY_SEGMENT_PATTERN = /^[a-z][a-z0-9-]{1,31}$/i

/** Four digit class year, loosely bounded to plausible calendar years. */
const CLASS_YEAR_PATTERN = /^(?:19|20|21)\d{2}$/

/** Conservative email shape check (Klaviyo does the authoritative validation). */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/

/** E.164, which is the only phone format Klaviyo accepts. */
const E164_PATTERN = /^\+[1-9]\d{7,14}$/

/** Upper bound on any single string we forward to Klaviyo. */
const MAX_FIELD_LENGTH = 512

/**
 * Extracts the academy and class year from a `/academy/classyear` pathname.
 *
 * Returns `null` for any pathname that is not an academy class page —
 * including `/usna/reunions`, `/cart`, `/faq`, and `/`.
 */
export function parseAcademyPath(
  pathname: string,
): { academy: string; classYear: string } | null {
  if (typeof pathname !== "string" || pathname.length === 0) return null

  const segments = pathname.split("/").filter((segment) => segment.length > 0)
  if (segments.length < 2) return null

  const [academySegment, classYearSegment] = segments
  if (!ACADEMY_SEGMENT_PATTERN.test(academySegment)) return null
  if (!CLASS_YEAR_PATTERN.test(classYearSegment)) return null

  return { academy: academySegment.toUpperCase(), classYear: classYearSegment }
}

/**
 * Builds the full signup context from raw page values.
 *
 * Split out from {@link captureReleaseSignupContext} so it stays unit
 * testable without a DOM.
 */
export function buildReleaseSignupContext(input: {
  pathname: string
  origin: string
  referrer?: string
  timestamp?: string
}): ReleaseSignupContext | null {
  const parsed = parseAcademyPath(input.pathname)
  if (!parsed) return null

  const { academy, classYear } = parsed
  // Normalize to `/academy/classyear` so query strings and trailing slashes
  // never leak into InterestPage / ProductURL.
  const interestPage = `/${academy.toLowerCase()}/${classYear}`
  const origin = input.origin.replace(/\/+$/, "")

  return {
    academy,
    classYear,
    interestCode: `${academy}-${classYear}`,
    interestPage,
    productUrl: `${origin}${interestPage}`,
    signupSource: RELEASE_SIGNUP_SOURCE,
    referrer: input.referrer ?? "",
    signupTimestamp: input.timestamp ?? new Date().toISOString(),
  }
}

/**
 * Browser-only convenience wrapper that reads the current page.
 * Returns `null` when the visitor is not on an academy class page.
 */
export function captureReleaseSignupContext(): ReleaseSignupContext | null {
  if (typeof window === "undefined") return null

  return buildReleaseSignupContext({
    pathname: window.location.pathname,
    origin: window.location.origin,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
  })
}

export function isValidEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= MAX_FIELD_LENGTH &&
    EMAIL_PATTERN.test(value.trim())
  )
}

/** Klaviyo only accepts E.164, so anything else is dropped rather than sent. */
export function isValidE164Phone(value: unknown): value is string {
  return typeof value === "string" && E164_PATTERN.test(value.trim())
}

/**
 * Best-effort conversion of a phone number to E.164.
 *
 * Klaviyo's popup usually reports an already-normalized number, but it can
 * also hand back locally formatted input. Anything that cannot be confidently
 * normalized returns `undefined` so it is omitted rather than rejected by
 * Klaviyo. Defaults to +1 (NANP) because this is a US-only storefront.
 */
export function normalizePhoneToE164(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined

  const trimmed = value.trim()
  if (trimmed.length === 0) return undefined
  // Regex used directly rather than the `isValidE164Phone` type guard, which
  // would narrow `trimmed` to `never` in the branches below.
  if (E164_PATTERN.test(trimmed)) return trimmed

  const digits = trimmed.replace(/\D/g, "")

  // 10 digit NANP number, e.g. 2025550147
  if (digits.length === 10 && !digits.startsWith("0") && !digits.startsWith("1")) {
    return `+1${digits}`
  }

  // 11 digit NANP number with country code, e.g. 12025550147
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`
  }

  // Explicit international prefix that survived formatting, e.g. +44 20 7946 0958
  if (value.trim().startsWith("+") && digits.length >= 8 && digits.length <= 15) {
    const candidate = `+${digits}`
    return E164_PATTERN.test(candidate) ? candidate : undefined
  }

  return undefined
}

/**
 * Re-validates and re-derives a context received over the network.
 *
 * The API route is public, so nothing from the client is trusted: the
 * derived fields (`interestCode`, `interestPage`, `productUrl`,
 * `signupSource`) are recomputed server-side from the academy/class year,
 * and only `referrer` + `signupTimestamp` are carried across after
 * sanitizing.
 */
export function sanitizeReleaseSignupContext(
  value: unknown,
): ReleaseSignupContext | null {
  if (typeof value !== "object" || value === null) return null
  const candidate = value as Record<string, unknown>

  const academy = candidate.academy
  const classYear = candidate.classYear
  if (typeof academy !== "string" || typeof classYear !== "string") return null

  // Re-run the same parser used in the browser so the server enforces the
  // identical `/academy/classyear` contract.
  const parsed = parseAcademyPath(`/${academy}/${classYear}`)
  if (!parsed) return null

  const productUrl =
    typeof candidate.productUrl === "string" ? candidate.productUrl : ""
  let origin = ""
  try {
    // Trust only the origin of the reported URL, never its path.
    origin = new URL(productUrl).origin
  } catch {
    origin = ""
  }

  const referrer =
    typeof candidate.referrer === "string"
      ? candidate.referrer.slice(0, MAX_FIELD_LENGTH)
      : ""

  const rawTimestamp = candidate.signupTimestamp
  const timestamp =
    typeof rawTimestamp === "string" && !Number.isNaN(Date.parse(rawTimestamp))
      ? new Date(rawTimestamp).toISOString()
      : new Date().toISOString()

  return buildReleaseSignupContext({
    pathname: `/${parsed.academy}/${parsed.classYear}`,
    origin,
    referrer,
    timestamp,
  })
}

/** Maps the context onto the Klaviyo custom profile property names. */
export function toKlaviyoProfileProperties(
  context: ReleaseSignupContext,
): Record<string, string> {
  return {
    Academy: context.academy,
    ClassYear: context.classYear,
    InterestCode: context.interestCode,
    InterestPage: context.interestPage,
    ProductURL: context.productUrl,
    SignupSource: context.signupSource,
    Referrer: context.referrer,
    SignupTimestamp: context.signupTimestamp,
  }
}
