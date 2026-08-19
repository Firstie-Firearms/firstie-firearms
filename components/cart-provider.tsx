"use client"

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react"
import useSWR from "swr"
import type { CartResponse, CommerceCart } from "@/lib/cart-types"

interface CartContextValue {
  cart: CommerceCart | null
  isLoading: boolean
  isMutating: boolean
  error: string | null
  addItem: (productKey: string, quantity?: number) => Promise<boolean>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  checkout: () => Promise<void>
  refresh: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

async function fetcher(url: string): Promise<CartResponse> {
  const response = await fetch(url, { credentials: "same-origin" })
  const payload = (await response.json()) as CartResponse
  if (!response.ok) throw new Error(payload.message ?? "We couldn't load your cart.")
  return payload
}

async function cartRequest(url: string, init: RequestInit) {
  const response = await fetch(url, {
    ...init,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", ...init.headers },
  })
  const payload = (await response.json()) as CartResponse & { checkoutUrl?: string }
  if (!response.ok) throw new Error(payload.message ?? "We couldn't update your cart.")
  return payload
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { data, error: loadError, isLoading, mutate } = useSWR<CartResponse>("/api/cart", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })
  const [isMutating, setIsMutating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const mutationInFlight = useRef(false)

  const runMutation = async (operation: () => Promise<CartResponse>): Promise<boolean> => {
    if (mutationInFlight.current) return false
    mutationInFlight.current = true
    setIsMutating(true)
    setActionError(null)
    try {
      const result = await operation()
      await mutate(result, { revalidate: false })
      return true
    } catch (error) {
      // Errors are surfaced to the UI via `actionError` below. Callers that fire and
      // forget this promise (e.g. `void updateItem(...)`) must not see an unhandled
      // rejection, so we intentionally swallow it here instead of re-throwing.
      setActionError(error instanceof Error ? error.message : "We couldn't update your cart.")
      return false
    } finally {
      mutationInFlight.current = false
      setIsMutating(false)
    }
  }

  const value = useMemo<CartContextValue>(
    () => ({
      cart: data?.cart ?? null,
      isLoading,
      isMutating,
      error: actionError ?? (loadError instanceof Error ? loadError.message : null),
      addItem: (productKey, quantity = 1) =>
        runMutation(() =>
          cartRequest("/api/cart/items", {
            method: "POST",
            body: JSON.stringify({ productKey, quantity }),
          }),
        ),
      updateItem: async (itemId, quantity) => {
        await runMutation(() =>
          cartRequest(`/api/cart/items/${encodeURIComponent(itemId)}`, {
            method: "PATCH",
            body: JSON.stringify({ quantity }),
          }),
        )
      },
      removeItem: async (itemId) => {
        await runMutation(() => cartRequest(`/api/cart/items/${encodeURIComponent(itemId)}`, { method: "DELETE" }))
      },
      checkout: async () => {
        setIsMutating(true)
        setActionError(null)
        try {
          const result = await cartRequest("/api/cart/checkout", { method: "POST" })
          if (!result.checkoutUrl) throw new Error("Secure checkout is temporarily unavailable.")
          if (window.self !== window.top) window.open(result.checkoutUrl, "_blank", "noopener,noreferrer")
          else window.location.assign(result.checkoutUrl)
        } catch (error) {
          // Swallowed intentionally: the error is surfaced via `actionError`, and
          // `checkout` is invoked as `void checkout()` from the UI, so re-throwing
          // here would only produce an unhandled promise rejection.
          setActionError(error instanceof Error ? error.message : "Secure checkout is temporarily unavailable.")
        } finally {
          setIsMutating(false)
        }
      },
      refresh: async () => {
        await mutate()
      },
    }),
    [actionError, data?.cart, isLoading, isMutating, loadError, mutate],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
