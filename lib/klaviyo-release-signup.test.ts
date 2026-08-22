import { describe, expect, it } from "vitest"
import {
  buildReleaseSignupContext,
  isValidE164Phone,
  isValidEmail,
  normalizePhoneToE164,
  parseAcademyPath,
  sanitizeReleaseSignupContext,
  toKlaviyoProfileProperties,
} from "./klaviyo-release-signup"

describe("parseAcademyPath", () => {
  it("parses an academy class page and uppercases the academy", () => {
    expect(parseAcademyPath("/usna/2028")).toEqual({ academy: "USNA", classYear: "2028" })
    expect(parseAcademyPath("/usma/2028")).toEqual({ academy: "USMA", classYear: "2028" })
    expect(parseAcademyPath("/usafa/2029")).toEqual({ academy: "USAFA", classYear: "2029" })
  })

  it("works for academies that do not exist yet without code changes", () => {
    expect(parseAcademyPath("/uscga/2031")).toEqual({ academy: "USCGA", classYear: "2031" })
    expect(parseAcademyPath("/usmma/2030")).toEqual({ academy: "USMMA", classYear: "2030" })
  })

  it("tolerates trailing slashes and deeper paths", () => {
    expect(parseAcademyPath("/usna/2028/")).toEqual({ academy: "USNA", classYear: "2028" })
    expect(parseAcademyPath("/usna/2028/details")).toEqual({ academy: "USNA", classYear: "2028" })
  })

  it("rejects non class-year pages", () => {
    expect(parseAcademyPath("/usna/reunions")).toBeNull()
    expect(parseAcademyPath("/cart")).toBeNull()
    expect(parseAcademyPath("/faq")).toBeNull()
    expect(parseAcademyPath("/privacy-policy")).toBeNull()
    expect(parseAcademyPath("/")).toBeNull()
    expect(parseAcademyPath("")).toBeNull()
  })

  it("rejects malformed years", () => {
    expect(parseAcademyPath("/usna/28")).toBeNull()
    expect(parseAcademyPath("/usna/20288")).toBeNull()
    expect(parseAcademyPath("/usna/abcd")).toBeNull()
  })
})

describe("buildReleaseSignupContext", () => {
  it("derives every Klaviyo property from the URL", () => {
    const context = buildReleaseSignupContext({
      pathname: "/usna/2028",
      origin: "https://www.firstiefirearms.com",
      referrer: "https://google.com",
      timestamp: "2026-08-22T12:00:00.000Z",
    })

    expect(context).toEqual({
      academy: "USNA",
      classYear: "2028",
      interestCode: "USNA-2028",
      interestPage: "/usna/2028",
      productUrl: "https://www.firstiefirearms.com/usna/2028",
      signupSource: "Website Release Notification",
      referrer: "https://google.com",
      signupTimestamp: "2026-08-22T12:00:00.000Z",
    })
  })

  it("strips query strings and trailing slashes out of the derived URLs", () => {
    const context = buildReleaseSignupContext({
      pathname: "/usna/2028/",
      origin: "https://www.firstiefirearms.com/",
    })

    expect(context?.interestPage).toBe("/usna/2028")
    expect(context?.productUrl).toBe("https://www.firstiefirearms.com/usna/2028")
  })

  it("returns null for pages that are not academy class pages", () => {
    expect(
      buildReleaseSignupContext({ pathname: "/faq", origin: "https://www.firstiefirearms.com" }),
    ).toBeNull()
  })
})

describe("sanitizeReleaseSignupContext", () => {
  it("recomputes derived fields instead of trusting the client", () => {
    const sanitized = sanitizeReleaseSignupContext({
      academy: "usna",
      classYear: "2028",
      // All of the following are deliberately wrong and must be ignored.
      interestCode: "SPOOFED",
      interestPage: "/evil",
      productUrl: "https://evil.example.com/attacker/path",
      signupSource: "spoofed source",
      referrer: "https://google.com",
      signupTimestamp: "2026-08-22T12:00:00.000Z",
    })

    expect(sanitized?.interestCode).toBe("USNA-2028")
    expect(sanitized?.interestPage).toBe("/usna/2028")
    expect(sanitized?.signupSource).toBe("Website Release Notification")
    // Only the origin of the reported URL is reused, never its path.
    expect(sanitized?.productUrl).toBe("https://evil.example.com/usna/2028")
  })

  it("rejects junk payloads", () => {
    expect(sanitizeReleaseSignupContext(null)).toBeNull()
    expect(sanitizeReleaseSignupContext({})).toBeNull()
    expect(sanitizeReleaseSignupContext({ academy: "usna" })).toBeNull()
    expect(sanitizeReleaseSignupContext({ academy: "usna", classYear: "nope" })).toBeNull()
  })

  it("falls back to a generated timestamp when the supplied one is invalid", () => {
    const sanitized = sanitizeReleaseSignupContext({
      academy: "usna",
      classYear: "2028",
      signupTimestamp: "not-a-date",
    })

    expect(Number.isNaN(Date.parse(sanitized?.signupTimestamp ?? ""))).toBe(false)
  })
})

describe("toKlaviyoProfileProperties", () => {
  it("maps onto the documented Klaviyo property names", () => {
    const context = buildReleaseSignupContext({
      pathname: "/usna/2028",
      origin: "https://www.firstiefirearms.com",
      referrer: "https://google.com",
      timestamp: "2026-08-22T12:00:00.000Z",
    })

    expect(toKlaviyoProfileProperties(context!)).toEqual({
      Academy: "USNA",
      ClassYear: "2028",
      InterestCode: "USNA-2028",
      InterestPage: "/usna/2028",
      ProductURL: "https://www.firstiefirearms.com/usna/2028",
      SignupSource: "Website Release Notification",
      Referrer: "https://google.com",
      SignupTimestamp: "2026-08-22T12:00:00.000Z",
    })
  })
})

describe("identifier validation", () => {
  it("accepts well formed emails", () => {
    expect(isValidEmail("grad@example.com")).toBe(true)
    expect(isValidEmail("first.last+tag@sub.example.co.uk")).toBe(true)
  })

  it("rejects malformed emails", () => {
    expect(isValidEmail("not-an-email")).toBe(false)
    expect(isValidEmail("missing@domain")).toBe(false)
    expect(isValidEmail("")).toBe(false)
    expect(isValidEmail(undefined)).toBe(false)
  })

  it("accepts only E.164 phone numbers", () => {
    expect(isValidE164Phone("+12025550147")).toBe(true)
    expect(isValidE164Phone("(202) 555-0147")).toBe(false)
    expect(isValidE164Phone("2025550147")).toBe(false)
    expect(isValidE164Phone("")).toBe(false)
  })
})

describe("normalizePhoneToE164", () => {
  it("passes through numbers that are already E.164", () => {
    expect(normalizePhoneToE164("+12025550147")).toBe("+12025550147")
  })

  it("normalizes common US formats", () => {
    expect(normalizePhoneToE164("(202) 555-0147")).toBe("+12025550147")
    expect(normalizePhoneToE164("202-555-0147")).toBe("+12025550147")
    expect(normalizePhoneToE164("202.555.0147")).toBe("+12025550147")
    expect(normalizePhoneToE164("1 (202) 555-0147")).toBe("+12025550147")
  })

  it("normalizes formatted international numbers", () => {
    expect(normalizePhoneToE164("+44 20 7946 0958")).toBe("+442079460958")
  })

  it("returns undefined for input it cannot confidently normalize", () => {
    expect(normalizePhoneToE164("555-0147")).toBeUndefined()
    expect(normalizePhoneToE164("not a phone")).toBeUndefined()
    expect(normalizePhoneToE164("")).toBeUndefined()
    expect(normalizePhoneToE164(undefined)).toBeUndefined()
  })
})
