import { academyNames, type Academy } from "@/types"

/** Where completed inquiries are delivered. */
export const INQUIRY_RECIPIENT = "info@firstiefirearms.com"

/** Upper bound on any single submitted field, to keep payloads sane. */
const MAX_FIELD_LENGTH = 200

/** Longest plausible academy class year, used to bound the year check. */
const MAX_CLASS_YEAR = 2100
const MIN_CLASS_YEAR = 1802

const ACADEMY_CODES = new Set<string>(["USNA", "USMA", "USAFA"])

/** A validated reunion inquiry, ready to be turned into an email. */
export interface ReunionInquiry {
  name: string
  email: string
  phone: string
  academy: Academy
  classYear: string
  reunionDate: string
}

export type ValidationResult =
  | { ok: true; inquiry: ReunionInquiry }
  | { ok: false; error: string }

/** Collapses whitespace and trims, so " John  Doe " becomes "John Doe". */
function normalize(value: unknown): string {
  if (typeof value !== "string") return ""
  return value.replace(/\s+/g, " ").trim().slice(0, MAX_FIELD_LENGTH)
}

/**
 * Pragmatic email check: a single @ with a dot-bearing domain. Deliberately
 * not RFC 5322 — the authoritative test is whether the reply actually sends,
 * and an over-strict pattern would reject valid addresses.
 */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/** Requires at least 7 digits, ignoring formatting like spaces and dashes. */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "")
  return digits.length >= 7 && digits.length <= 15
}

/** Accepts a 4-digit class year inside the range the academies have existed. */
export function isValidClassYear(value: string): boolean {
  if (!/^\d{4}$/.test(value)) return false
  const year = Number(value)
  return year >= MIN_CLASS_YEAR && year <= MAX_CLASS_YEAR
}

/** Accepts the `YYYY-MM-DD` value produced by `<input type="date">`. */
export function isValidReunionDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return false
  // Guard against roll-over (e.g. 2026-02-31 parsing as March 3).
  return parsed.toISOString().slice(0, 10) === value
}

/**
 * Validates a raw submission body. Returns a single generic message per
 * failure rather than field-level errors, because the client already enforces
 * `required` and `type` on every input — this is the server-side backstop for
 * direct API calls and for browsers that bypass native validation.
 */
export function validateReunionInquiry(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body." }
  }

  const raw = body as Record<string, unknown>

  // Honeypot: a real user never sees this field, so any value means a bot.
  // Treated as a validation failure here and silently accepted by the route.
  if (normalize(raw.company) !== "") {
    return { ok: false, error: "Spam detected." }
  }

  const name = normalize(raw.name)
  const email = normalize(raw.email)
  const phone = normalize(raw.phone)
  const academy = normalize(raw.academy)
  const classYear = normalize(raw.classYear)
  const reunionDate = normalize(raw.reunionDate)

  if (!name) return { ok: false, error: "Name is required." }
  if (!isValidEmail(email)) return { ok: false, error: "A valid email address is required." }
  if (!isValidPhone(phone)) return { ok: false, error: "A valid phone number is required." }
  if (!ACADEMY_CODES.has(academy)) return { ok: false, error: "An academy selection is required." }
  if (!isValidClassYear(classYear)) return { ok: false, error: "A four-digit class year is required." }
  if (!isValidReunionDate(reunionDate)) return { ok: false, error: "A valid reunion date is required." }

  return {
    ok: true,
    inquiry: { name, email, phone, academy: academy as Academy, classYear, reunionDate },
  }
}

/** Verified transactional sender on the Resend notify subdomain. */
export const INQUIRY_SENDER = "Firstie Firearms <reunions@notify.firstiefirearms.com>"

/** Subject line, e.g. "New Reunion Inquiry - USNA Class of 1996". */
export function buildInquirySubject(inquiry: ReunionInquiry): string {
  return `New Reunion Inquiry — ${inquiry.academy} Class of ${inquiry.classYear}`
}

/** Subject shown on the customer confirmation email. */
export const CUSTOMER_CONFIRMATION_SUBJECT = "We received your Firstie Firearms reunion inquiry"

/** Renders the reunion date as "June 5, 2026" for readability in the email. */
function formatReunionDate(value: string): string {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/** Escapes user input before interpolation into the HTML email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/** Ordered field list shared by both the text and HTML renderings. */
function inquiryRows(inquiry: ReunionInquiry): Array<[string, string]> {
  return [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Phone", inquiry.phone],
    ["Academy", `${inquiry.academy} — ${academyNames[inquiry.academy]}`],
    ["Class", inquiry.classYear],
    ["Reunion date", formatReunionDate(inquiry.reunionDate)],
  ]
}

/** Plain-text email body, for clients that do not render HTML. */
export function buildInquiryText(inquiry: ReunionInquiry): string {
  const lines = inquiryRows(inquiry).map(([label, value]) => `${label}: ${value}`)
  return [buildInquirySubject(inquiry), "", ...lines].join("\n")
}

/** Customer-facing plain-text confirmation body. */
export function buildCustomerConfirmationText(inquiry: ReunionInquiry): string {
  return [
    "Thank you for contacting Firstie Firearms.",
    "",
    "We received your reunion inquiry and recorded the following details:",
    `Academy: ${academyNames[inquiry.academy]}`,
    `Class Year: ${inquiry.classYear}`,
    `Reunion Date: ${formatReunionDate(inquiry.reunionDate)}`,
    "",
    "A member of the Firstie Firearms team will follow up with you.",
  ].join("\\n")
}

/** Customer-facing HTML confirmation body. */
export function buildCustomerConfirmationHtml(inquiry: ReunionInquiry): string {
  return (
    `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#111111;line-height:1.5;">` +
    `<h2 style="margin:0 0 16px;font-size:18px;">Thank you for contacting Firstie Firearms</h2>` +
    `<p>We received your reunion inquiry.</p>` +
    `<p><strong>Academy:</strong> ${escapeHtml(academyNames[inquiry.academy])}<br>` +
    `<strong>Class Year:</strong> ${escapeHtml(inquiry.classYear)}<br>` +
    `<strong>Reunion Date:</strong> ${escapeHtml(formatReunionDate(inquiry.reunionDate))}</p>` +
    `<p>A member of the Firstie Firearms team will follow up with you.</p>` +
    `</div>`
  )
}

/** HTML email body — a simple definition table, safe for every mail client. */
export function buildInquiryHtml(inquiry: ReunionInquiry): string {
  const rows = inquiryRows(inquiry)
    .map(
      ([label, value]) =>
        `<tr>` +
        `<td style="padding:6px 16px 6px 0;color:#6b6b6b;font-size:14px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>` +
        `<td style="padding:6px 0;color:#111111;font-size:14px;font-weight:600;">${escapeHtml(value)}</td>` +
        `</tr>`,
    )
    .join("")

  return (
    `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;">` +
    `<h2 style="margin:0 0 16px;font-size:18px;color:#111111;">${escapeHtml(buildInquirySubject(inquiry))}</h2>` +
    `<table role="presentation" cellpadding="0" cellspacing="0">${rows}</table>` +
    `<p style="margin:20px 0 0;font-size:13px;color:#6b6b6b;">Reply directly to this email to reach ${escapeHtml(inquiry.name)}.</p>` +
    `</div>`
  )
}
