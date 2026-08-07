import { describe, it, expect, beforeEach, vi } from "vitest"
import { AGE_GATE_SESSION_KEY, readAgeGateStatus, writeAgeGateStatus } from "@/lib/age-gate"

describe("age-gate storage helpers", () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it("returns 'pending' when nothing has been stored (new session)", () => {
    expect(readAgeGateStatus()).toBe("pending")
  })

  it("returns 'verified' after writeAgeGateStatus('verified')", () => {
    writeAgeGateStatus("verified")
    expect(readAgeGateStatus()).toBe("verified")
  })

  it("returns 'denied' after writeAgeGateStatus('denied')", () => {
    writeAgeGateStatus("denied")
    expect(readAgeGateStatus()).toBe("denied")
  })

  it("uses sessionStorage, not localStorage", () => {
    writeAgeGateStatus("verified")
    expect(window.sessionStorage.getItem(AGE_GATE_SESSION_KEY)).toBe("verified")
    expect(window.localStorage.getItem(AGE_GATE_SESSION_KEY)).toBeNull()
  })

  it("fails closed ('pending') on garbage/unexpected stored values", () => {
    window.sessionStorage.setItem(AGE_GATE_SESSION_KEY, "not-a-real-status")
    expect(readAgeGateStatus()).toBe("pending")
  })

  it("fails closed ('pending') if sessionStorage.getItem throws", () => {
    const spy = vi.spyOn(window.sessionStorage.__proto__, "getItem").mockImplementation(() => {
      throw new Error("storage disabled")
    })
    expect(readAgeGateStatus()).toBe("pending")
    spy.mockRestore()
  })

  it("simulates a brand-new browser session by clearing sessionStorage", () => {
    writeAgeGateStatus("verified")
    expect(readAgeGateStatus()).toBe("verified")

    // Closing/reopening the browser clears sessionStorage entirely.
    window.sessionStorage.clear()
    expect(readAgeGateStatus()).toBe("pending")
  })
})
