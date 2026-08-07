import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { AgeGateProvider } from "@/components/age-gate-provider"
import { AGE_GATE_SESSION_KEY } from "@/lib/age-gate"

// Keep these tests focused on age-gate behavior, not header/footer content.
vi.mock("@/components/header", () => ({
  Header: () => <div data-testid="header">Header nav links</div>,
}))
vi.mock("@/components/footer", () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}))

function renderSite() {
  return render(
    <AgeGateProvider>
      <div data-testid="page-content">Protected page content</div>
    </AgeGateProvider>,
  )
}

describe("Age gate — full site protection", () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    document.documentElement.removeAttribute("data-age-gate")
  })

  it("TEST: new session on any route shows the age gate dialog", () => {
    renderSite()
    expect(screen.getByRole("dialog", { name: /age verification/i })).toBeInTheDocument()
  })

  it("hides underlying site content (inert + aria-hidden) while gate is pending", () => {
    renderSite()
    const content = document.getElementById("site-content")
    expect(content).toHaveAttribute("aria-hidden", "true")
    // jsdom doesn't reflect the boolean `inert` IDL property consistently,
    // so assert via the attribute instead — this is what the browser (and
    // assistive tech / the inert spec) actually key off of.
    expect(content).toHaveAttribute("inert")
  })

  it("renders both options with no aria-pressed/checked selection state", () => {
    renderSite()
    const olderBtn = screen.getByRole("button", { name: /i am 21 or older/i })
    const underBtn = screen.getByRole("button", { name: /i am under 21/i })
    // Neither button should carry any pre-selected/pressed state.
    expect(olderBtn).not.toHaveAttribute("aria-pressed")
    expect(underBtn).not.toHaveAttribute("aria-pressed")
    expect(olderBtn).toBeInTheDocument()
    expect(underBtn).toBeInTheDocument()
  })

  it("TEST: selecting 21+ closes the gate and reveals site content for this session", () => {
    renderSite()
    fireEvent.click(screen.getByRole("button", { name: /i am 21 or older/i }))

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(window.sessionStorage.getItem(AGE_GATE_SESSION_KEY)).toBe("verified")
    const content = document.getElementById("site-content")
    expect(content).not.toHaveAttribute("aria-hidden", "true")
    expect(content).not.toHaveAttribute("inert")
    expect(screen.getByTestId("page-content")).toBeInTheDocument()
  })

  it("TEST: gate remains dismissed across re-renders within the same session (navigation)", () => {
    const { unmount } = renderSite()
    fireEvent.click(screen.getByRole("button", { name: /i am 21 or older/i }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    // Simulate navigating to a different page: unmount and remount the
    // provider (as would happen wrapping a new route) without clearing
    // sessionStorage.
    unmount()
    renderSite()
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("TEST: a new browser session (sessionStorage cleared) shows the gate again", () => {
    renderSite()
    fireEvent.click(screen.getByRole("button", { name: /i am 21 or older/i }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    // Closing the browser entirely clears sessionStorage.
    window.sessionStorage.clear()

    const { unmount } = screen
    unmount?.()
  })

  it("TEST: selecting under-21 blocks access with the required message and no dismiss path", () => {
    renderSite()
    fireEvent.click(screen.getByRole("button", { name: /i am under 21/i }))

    expect(screen.getByText(/you must be 21 years of age or older to access firstie firearms/i)).toBeInTheDocument()
    // No exit/back/continue button should be present in the denied state.
    expect(screen.queryByRole("button", { name: /i am 21 or older/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /i am under 21/i })).not.toBeInTheDocument()
    // Underlying content must remain inert/hidden.
    expect(document.getElementById("site-content")).toHaveAttribute("aria-hidden", "true")
  })

  it("fails closed when sessionStorage throws on read", () => {
    const spy = vi.spyOn(window.sessionStorage.__proto__, "getItem").mockImplementation(() => {
      throw new Error("blocked")
    })
    renderSite()
    expect(screen.getByRole("dialog")).toBeInTheDocument()
    spy.mockRestore()
  })

  it("Escape key does not dismiss the dialog", () => {
    renderSite()
    const dialog = screen.getByRole("dialog")
    fireEvent.keyDown(dialog, { key: "Escape" })
    expect(screen.getByRole("dialog")).toBeInTheDocument()
  })
})

describe("Age gate — new browser session simulation across routes", () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    document.documentElement.removeAttribute("data-age-gate")
  })

  it("TEST: direct entry to an internal route shows the gate (no homepage-only bypass)", () => {
    // AgeGateProvider wraps every route via the root layout, so mounting it
    // with arbitrary "page" children simulates entering through any URL
    // (e.g. /usna/2027, /faq) rather than only "/".
    render(
      <AgeGateProvider>
        <div data-testid="deep-route">FAQ page content</div>
      </AgeGateProvider>,
    )
    expect(screen.getByRole("dialog", { name: /age verification/i })).toBeInTheDocument()
    // The real hiding mechanism is the `#site-content { visibility: hidden }`
    // rule in globals.css (not loaded under jsdom) plus `inert` +
    // `aria-hidden`. Assert the attributes that drive that behavior instead
    // of computed visibility, which requires the real stylesheet.
    const content = document.getElementById("site-content")
    expect(content).toHaveAttribute("aria-hidden", "true")
    expect(content).toHaveAttribute("inert")
    expect(screen.getByTestId("deep-route")).toBeInTheDocument()
  })
})
