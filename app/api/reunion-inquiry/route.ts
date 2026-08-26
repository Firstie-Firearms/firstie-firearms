import { Resend } from "resend"
import {
  INQUIRY_RECIPIENT,
  INQUIRY_SENDER,
  buildCustomerConfirmationHtml,
  buildCustomerConfirmationText,
  buildInquiryHtml,
  buildInquirySubject,
  buildInquiryText,
  CUSTOMER_CONFIRMATION_SUBJECT,
  validateReunionInquiry,
} from "@/lib/reunion-inquiry"

/**
 * Receives reunion inquiries and forwards them to the Firstie Firearms inbox.
 *
 * Runs server-side only so `RESEND_API_KEY` is never shipped to the browser.
 * The client sends the raw form values; every field is re-validated here
 * because client-side `required` attributes are trivially bypassed.
 */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 })
  }

  const result = validateReunionInquiry(body)

  if (!result.ok) {
    // Report success to bots that tripped the honeypot so they get no signal
    // about why the submission failed, while sending no email.
    if (result.error === "Spam detected.") {
      return Response.json({ ok: true })
    }
    return Response.json({ error: result.error }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[v0] RESEND_API_KEY is not configured; cannot send reunion inquiry")
    return Response.json({ error: "Email is not configured." }, { status: 500 })
  }

  const { inquiry } = result

  try {
    const resend = new Resend(apiKey)
    const [internalResult, customerResult] = await Promise.all([
      resend.emails.send({
        from: INQUIRY_SENDER,
        to: INQUIRY_RECIPIENT,
        replyTo: inquiry.email,
        subject: buildInquirySubject(inquiry),
        text: buildInquiryText(inquiry),
        html: buildInquiryHtml(inquiry),
      }),
      resend.emails.send({
        from: INQUIRY_SENDER,
        to: inquiry.email,
        replyTo: INQUIRY_RECIPIENT,
        subject: CUSTOMER_CONFIRMATION_SUBJECT,
        text: buildCustomerConfirmationText(inquiry),
        html: buildCustomerConfirmationHtml(inquiry),
      }),
    ])

    if (internalResult.error || customerResult.error) {
      // Do not report success unless both messages were accepted by Resend.
      console.error("[v0] Resend rejected reunion email(s):", {
        internal: internalResult.error,
        customer: customerResult.error,
      })
      return Response.json({ error: "Could not send inquiry." }, { status: 502 })
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error("[v0] Unexpected error sending reunion inquiry:", error)
    return Response.json({ error: "Could not send inquiry." }, { status: 500 })
  }
}
