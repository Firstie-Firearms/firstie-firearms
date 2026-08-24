import { describe, expect, it } from "vitest"
import {
  buildInquiryHtml,
  buildInquirySubject,
  buildInquiryText,
  isValidClassYear,
  isValidEmail,
  isValidPhone,
  isValidReunionDate,
  validateReunionInquiry,
} from "./reunion-inquiry"

const validBody = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "(410) 293-1000",
  academy: "USNA",
  classYear: "1996",
  reunionDate: "2026-06-05",
}

describe("isValidEmail", () => {
  it("accepts ordinary addresses", () => {
    expect(isValidEmail("jane@example.com")).toBe(true)
    expect(isValidEmail("jane.doe+tag@mail.example.co.uk")).toBe(true)
  })

  it("rejects addresses without a dotted domain or with spaces", () => {
    expect(isValidEmail("jane@example")).toBe(false)
    expect(isValidEmail("jane example@test.com")).toBe(false)
    expect(isValidEmail("@example.com")).toBe(false)
    expect(isValidEmail("")).toBe(false)
  })
})

describe("isValidPhone", () => {
  it("accepts formatted numbers by counting digits only", () => {
    expect(isValidPhone("(410) 293-1000")).toBe(true)
    expect(isValidPhone("+1 410 293 1000")).toBe(true)
  })

  it("rejects numbers that are too short or too long", () => {
    expect(isValidPhone("12345")).toBe(false)
    expect(isValidPhone("1234567890123456")).toBe(false)
  })
})

describe("isValidClassYear", () => {
  it("accepts four-digit years within academy history", () => {
    expect(isValidClassYear("1996")).toBe(true)
    expect(isValidClassYear("2027")).toBe(true)
  })

  it("rejects non-four-digit or out-of-range years", () => {
    expect(isValidClassYear("96")).toBe(false)
    expect(isValidClassYear("1700")).toBe(false)
    expect(isValidClassYear("abcd")).toBe(false)
  })
})

describe("isValidReunionDate", () => {
  it("accepts the YYYY-MM-DD value a date input produces", () => {
    expect(isValidReunionDate("2026-06-05")).toBe(true)
  })

  it("rejects malformed dates and calendar roll-over", () => {
    expect(isValidReunionDate("06/05/2026")).toBe(false)
    expect(isValidReunionDate("2026-02-31")).toBe(false)
    expect(isValidReunionDate("")).toBe(false)
  })
})

describe("validateReunionInquiry", () => {
  it("accepts a complete submission and normalizes whitespace", () => {
    const result = validateReunionInquiry({ ...validBody, name: "  Jane   Doe  " })
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.inquiry.name).toBe("Jane Doe")
  })

  it("rejects a submission that trips the honeypot", () => {
    const result = validateReunionInquiry({ ...validBody, company: "bot-filled" })
    expect(result).toEqual({ ok: false, error: "Spam detected." })
  })

  it("ignores an empty honeypot, which is what real users submit", () => {
    expect(validateReunionInquiry({ ...validBody, company: "" }).ok).toBe(true)
  })

  it("requires every field", () => {
    for (const field of ["name", "email", "phone", "academy", "classYear", "reunionDate"]) {
      const result = validateReunionInquiry({ ...validBody, [field]: "" })
      expect(result.ok, `${field} should be required`).toBe(false)
    }
  })

  it("rejects an academy outside the supported set", () => {
    const result = validateReunionInquiry({ ...validBody, academy: "HARVARD" })
    expect(result).toEqual({ ok: false, error: "An academy selection is required." })
  })

  it("rejects non-object bodies", () => {
    expect(validateReunionInquiry(null).ok).toBe(false)
    expect(validateReunionInquiry("nope").ok).toBe(false)
  })
})

describe("email rendering", () => {
  const inquiry = (validateReunionInquiry(validBody) as { ok: true; inquiry: never }).inquiry

  it("builds the requested subject line", () => {
    expect(buildInquirySubject(inquiry)).toBe("New Reunion Inquiry - USNA Class of 1996")
  })

  it("includes every collected field in the text body", () => {
    const text = buildInquiryText(inquiry)
    expect(text).toContain("Jane Doe")
    expect(text).toContain("jane@example.com")
    expect(text).toContain("(410) 293-1000")
    expect(text).toContain("United States Naval Academy")
    expect(text).toContain("1996")
    expect(text).toContain("June 5, 2026")
  })

  it("formats the reunion date without timezone drift", () => {
    // A naive `new Date("2026-06-05")` render in a negative UTC offset would
    // show June 4; the UTC-pinned formatter must keep the submitted day.
    expect(buildInquiryText(inquiry)).toContain("June 5, 2026")
  })

  it("escapes HTML so submitted markup cannot break the email", () => {
    const hostile = validateReunionInquiry({ ...validBody, name: '<script>alert("x")</script>' })
    expect(hostile.ok).toBe(true)
    if (!hostile.ok) return
    const html = buildInquiryHtml(hostile.inquiry)
    expect(html).not.toContain("<script>")
    expect(html).toContain("&lt;script&gt;")
  })
})
