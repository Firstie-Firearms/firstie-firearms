// Single source of truth for age-gate session storage.
//
// IMPORTANT: This is intentionally SESSION-scoped (sessionStorage), not
// persisted (localStorage/cookies with long expiry). A visitor must re-verify
// every time they start a new browser session, per 18 U.S.C. § 922(b)(1) /
// 27 C.F.R. § 478.99 compliance requirements for this site.

export const AGE_GATE_SESSION_KEY = "ff-age-gate-status"

export type AgeGateStatus = "pending" | "verified" | "denied"

/**
 * Reads the current age-gate status from sessionStorage.
 * Fails closed: any error, unavailability, or unexpected value results in
 * "pending" (i.e. the gate must be shown).
 */
export function readAgeGateStatus(): AgeGateStatus {
  try {
    const raw = window.sessionStorage.getItem(AGE_GATE_SESSION_KEY)
    if (raw === "verified" || raw === "denied") {
      return raw
    }
    return "pending"
  } catch {
    // sessionStorage unavailable (e.g. disabled, privacy mode edge cases) —
    // fail closed and show the gate.
    return "pending"
  }
}

/**
 * Persists the age-gate status for the current browser session only.
 * Swallows storage errors — if we can't persist, the gate will simply be
 * shown again on next check, which is the safe (fail-closed) behavior.
 */
export function writeAgeGateStatus(status: AgeGateStatus): void {
  try {
    window.sessionStorage.setItem(AGE_GATE_SESSION_KEY, status)
  } catch {
    // ignore — fail closed on next read
  }
}

/** Inline script source injected into <head>, executed before paint.
 *
 * This runs synchronously and BEFORE React hydrates, so it sets a
 * data attribute on <html> that CSS uses to hide site content until we
 * positively know the visitor verified their age in this session. If this
 * script fails for any reason (storage disabled, exception, etc.) the
 * attribute is left as "pending" (the default already present in the
 * server-rendered HTML), so the site fails closed.
 */
export const AGE_GATE_INLINE_SCRIPT = `
(function() {
  try {
    var v = window.sessionStorage.getItem("${AGE_GATE_SESSION_KEY}");
    if (v === "verified") {
      document.documentElement.setAttribute("data-age-gate", "verified");
    } else {
      document.documentElement.setAttribute("data-age-gate", "pending");
    }
  } catch (e) {
    document.documentElement.setAttribute("data-age-gate", "pending");
  }
})();
`
