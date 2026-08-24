import { Resend } from "resend"
import {
  INQUIRY_RECIPIENT,
  INQUIRY_SENDER,
  buildInquiryHtml,
  buildInquirySubject,
  buildInquiryText,
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
    const { error } = await resend.emails.send({
      from: INQUIRY_SENDER,
      to: INQUIRY_RECIPIENT,
      // Lets the team reply straight to the customer from their inbox.
      replyTo: inquiry.email,
      subject: buildInquirySubject(inquiry),
      text: buildInquiryText(inquiry),
      html: buildInquiryHtml(inquiry),
    })

    if (error) {
      // Log the provider's reason, but never surface it to the client.
      console.error("[v0] Resend rejected the reunion inquiry:", error)
      return Response.json({ error: "Could not send inquiry." }, { status: 502 })
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error("[v0] Unexpected error sending reunion inquiry:", error)
    return Response.json({ error: "Could not send inquiry." }, { status: 500 })
  }
}
