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
 *
 * The two sends are deliberately sequential and weighted differently:
 * the internal notification to the team is the inquiry itself, so a failure
 * there is a hard 500. The customer confirmation is a courtesy — once the
 * team has the inquiry the submission has succeeded, so a bounce there is
 * logged for us but never surfaced to the visitor as a failure.
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
      return Response.json({ ok: true, success: true })
    }
    return Response.json({ error: result.error }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error("[v0] RESEND_API_KEY is not configured")
    return Response.json({ error: "Email is not configured." }, { status: 500 })
  }

  const { inquiry } = result
  const resend = new Resend(apiKey)

  // 1. Internal notification. This one is load-bearing.
  try {
    const { data, error } = await resend.emails.send({
      from: INQUIRY_SENDER,
      to: INQUIRY_RECIPIENT,
      // Lets the team reply straight to the customer from their inbox.
      replyTo: inquiry.email,
      subject: buildInquirySubject(inquiry),
      text: buildInquiryText(inquiry),
      html: buildInquiryHtml(inquiry),
    })

    if (error) {
      // Serialize explicitly: Resend errors carry name/message/statusCode that
      // a bare console.error of the object can flatten to "[object Object]".
      console.error("[v0] Resend rejected the internal reunion notification:", {
        from: INQUIRY_SENDER,
        to: INQUIRY_RECIPIENT,
        name: error.name,
        message: error.message,
        error: JSON.stringify(error),
      })
      return Response.json({ error: "Could not send inquiry." }, { status: 500 })
    }

    console.log("[v0] Reunion inquiry delivered to team, id:", data?.id)
  } catch (error) {
    console.error("[v0] Unexpected error sending the internal reunion notification:", error)
    return Response.json({ error: "Could not send inquiry." }, { status: 500 })
  }

  // 2. Customer confirmation. Best-effort — the inquiry is already delivered,
  //    so any failure here is logged but never fails the request.
  try {
    const { data, error } = await resend.emails.send({
      from: INQUIRY_SENDER,
      to: inquiry.email,
      replyTo: INQUIRY_RECIPIENT,
      subject: CUSTOMER_CONFIRMATION_SUBJECT,
      text: buildCustomerConfirmationText(inquiry),
      html: buildCustomerConfirmationHtml(inquiry),
    })

    if (error) {
      console.error("[v0] Resend rejected the customer confirmation (inquiry still delivered):", {
        from: INQUIRY_SENDER,
        to: inquiry.email,
        name: error.name,
        message: error.message,
        error: JSON.stringify(error),
      })
    } else {
      console.log("[v0] Customer confirmation sent, id:", data?.id)
    }
  } catch (error) {
    console.error("[v0] Unexpected error sending the customer confirmation (inquiry still delivered):", error)
  }

  // `ok` is retained alongside `success` so the existing client check, which
  // only inspects `response.ok`, keeps working for any other consumer.
  return Response.json({ ok: true, success: true })
}
