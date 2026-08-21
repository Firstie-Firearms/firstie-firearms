import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { SWRConfig } from "swr"
import { CartPage } from "@/components/cart-page"
import { CartProvider } from "@/components/cart-provider"
import type { CommerceCart } from "@/lib/cart-types"

const item: CommerceCart["items"][number] = {
  id: "item-1",
  productId: 1,
  variantId: 1,
  name: "Class of 2027 Commemorative Pistol",
  sku: "USNA-2027",
  imageUrl: null,
  quantity: 1,
  unitPrice: 1200,
  lineTotal: 1200,
  options: [],
}

const cartWithItem: CommerceCart = {
  id: "cart-1",
  items: [item],
  itemCount: 1,
  subtotal: 1200,
  total: 1200,
  currency: "USD",
}

const emptyCart: CommerceCart = {
  id: "cart-1",
  items: [],
  itemCount: 0,
  subtotal: 0,
  total: 0,
  currency: "USD",
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response
}

function renderCartPage() {
  // Each test gets its own SWR cache — otherwise the default global cache
  // leaks the resolved `/api/cart` data across tests and desyncs the ordered
  // `fetchMock` responses queued per test.
  return render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <CartProvider>
        <CartPage />
      </CartProvider>
    </SWRConfig>,
  )
}

async function waitForInitialLoad() {
  await waitFor(() => expect(screen.queryByText(/loading cart/i)).not.toBeInTheDocument())
}

describe("Cart page — checkout guardrails & resilience", () => {
  let fetchMock: ReturnType<typeof vi.fn>
  let assignSpy: ReturnType<typeof vi.fn>
  const originalLocation = window.location

  beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)
    assignSpy = vi.fn()
    // jsdom's Location.prototype.assign is non-configurable, so spying on it
    // directly throws — replace the whole `window.location` property instead.
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, assign: assignSpy },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    Object.defineProperty(window, "location", { configurable: true, value: originalLocation })
  })

  it("TEST: rapid double-click on checkout only fires one checkout-session request", async () => {
    fetchMock
      .mockImplementationOnce(async () => jsonResponse({ cart: cartWithItem })) // initial cart load
      .mockImplementationOnce(async () => jsonResponse({ cart: cartWithItem })) // revalidate before checkout
      .mockImplementationOnce(async () => jsonResponse({ checkoutUrl: "https://secure.bigcommerce.example/checkout" })) // checkout POST

    renderCartPage()
    await waitForInitialLoad()

    const button = screen.getByRole("button", { name: /proceed to secure checkout/i })
    fireEvent.click(button)
    fireEvent.click(button)

    await waitFor(() => expect(assignSpy).toHaveBeenCalledWith("https://secure.bigcommerce.example/checkout"))

    const postCalls = fetchMock.mock.calls.filter(([, init]) => (init as RequestInit | undefined)?.method === "POST")
    expect(postCalls).toHaveLength(1)
    expect(postCalls[0][0]).toBe("/api/cart/checkout")
  })

  it("TEST: checkout button disables while a checkout request is in flight", async () => {
    let resolveRevalidate: (() => void) | undefined
    const revalidateGate = new Promise<void>((resolve) => {
      resolveRevalidate = resolve
    })

    fetchMock
      .mockImplementationOnce(async () => jsonResponse({ cart: cartWithItem })) // initial load
      .mockImplementationOnce(async () => {
        await revalidateGate
        return jsonResponse({ cart: cartWithItem })
      }) // revalidate before checkout, held open
      .mockImplementationOnce(async () => jsonResponse({ checkoutUrl: "https://secure.bigcommerce.example/checkout" }))

    renderCartPage()
    await waitForInitialLoad()

    const button = screen.getByRole("button", { name: /proceed to secure checkout/i })
    fireEvent.click(button)

    await waitFor(() => expect(screen.getByRole("button", { name: /preparing checkout/i })).toBeDisabled())

    resolveRevalidate?.()

    await waitFor(() => expect(assignSpy).toHaveBeenCalled())
  })

  it("TEST: a cart that revalidates to empty blocks checkout without calling the checkout endpoint", async () => {
    fetchMock
      .mockImplementationOnce(async () => jsonResponse({ cart: cartWithItem })) // initial load shows the item
      .mockImplementationOnce(async () => jsonResponse({ cart: emptyCart })) // revalidate finds it now empty

    renderCartPage()
    await waitForInitialLoad()

    const button = screen.getByRole("button", { name: /proceed to secure checkout/i })
    fireEvent.click(button)

    await waitFor(() => expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument())

    const postCalls = fetchMock.mock.calls.filter(([, init]) => (init as RequestInit | undefined)?.method === "POST")
    expect(postCalls).toHaveLength(0)
    expect(assignSpy).not.toHaveBeenCalled()
  })

  it("TEST: a failed checkout request shows an error, leaves the cart intact, and a retry succeeds", async () => {
    fetchMock
      .mockImplementationOnce(async () => jsonResponse({ cart: cartWithItem })) // initial load
      .mockImplementationOnce(async () => jsonResponse({ cart: cartWithItem })) // revalidate before first attempt
      .mockImplementationOnce(async () =>
        jsonResponse({ message: "Secure checkout is temporarily unavailable. Please try again." }, 502),
      ) // first checkout attempt fails

    renderCartPage()
    await waitForInitialLoad()

    const button = screen.getByRole("button", { name: /proceed to secure checkout/i })
    fireEvent.click(button)

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/secure checkout is temporarily unavailable/i),
    )
    // Cart is untouched — the item is still shown and the retry button is available.
    expect(screen.getByText(item.name)).toBeInTheDocument()
    expect(assignSpy).not.toHaveBeenCalled()

    fetchMock
      .mockImplementationOnce(async () => jsonResponse({ cart: cartWithItem })) // revalidate before retry
      .mockImplementationOnce(async () => jsonResponse({ checkoutUrl: "https://secure.bigcommerce.example/checkout" })) // retry succeeds

    fireEvent.click(screen.getByRole("button", { name: /proceed to secure checkout/i }))

    await waitFor(() => expect(assignSpy).toHaveBeenCalledWith("https://secure.bigcommerce.example/checkout"))
  })

  it("TEST: a completed purchase (cart invalidated server-side) shows the empty-cart view on return, not stale items", async () => {
    // Simulates a fresh page load after BigCommerce consumed the cart on order
    // completion — app/api/cart/route.ts already turns the resulting 404 into
    // { cart: null } and clears the cookie server-side before this ever runs.
    fetchMock.mockImplementationOnce(async () => jsonResponse({ cart: null })) // initial load, cart already invalidated

    renderCartPage()
    await waitForInitialLoad()

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
    expect(screen.queryByText(item.name)).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /proceed to secure checkout/i })).not.toBeInTheDocument()
  })

  it("TEST: a declined payment leaves the cart intact on return, with items and checkout available to retry", async () => {
    // Simulates a fresh page load after a decline — BigCommerce left the cart
    // untouched, so /api/cart returns the same cart with items, same as any
    // ordinary fresh load.
    fetchMock.mockImplementationOnce(async () => jsonResponse({ cart: cartWithItem })) // initial load, cart untouched by decline

    renderCartPage()
    await waitForInitialLoad()

    expect(screen.getByText(item.name)).toBeInTheDocument()
    const button = screen.getByRole("button", { name: /proceed to secure checkout/i })
    expect(button).toBeEnabled()
  })
})
