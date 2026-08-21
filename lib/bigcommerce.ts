import "server-only"

import type { CommerceCart, CartItem } from "@/lib/cart-types"

const API_VERSION = "v3"

type BigCommerceItem = {
  id: string
  product_id: number
  variant_id: number
  name: string
  sku?: string
  image_url?: string
  quantity: number
  sale_price?: number
  list_price?: number
  extended_sale_price?: number
  extended_list_price?: number
  options?: Array<{
    name?: string
    name_id?: number
    value?: string
    value_id?: number
  }>
}

type BigCommerceCart = {
  id: string
  currency?: {
    code?: string
  }
  cart_amount?: number
  base_amount?: number
  line_items?: {
    physical_items?: BigCommerceItem[]
    digital_items?: BigCommerceItem[]
    gift_certificates?: BigCommerceItem[]
  }
  redirect_urls?: {
    cart_url?: string
    checkout_url?: string
    embedded_checkout_url?: string
  }
}

class BigCommerceError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = "BigCommerceError"
  }
}

function config() {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH
  const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN

  if (!storeHash || !accessToken) {
    throw new BigCommerceError("Commerce is not configured.", 503)
  }

  return {
    storeHash,
    accessToken,
  }
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const { storeHash, accessToken } = config()

  const response = await fetch(
    `https://api.bigcommerce.com/stores/${storeHash}/${API_VERSION}${path}`,
    {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Auth-Token": accessToken,
        ...init?.headers,
      },
      cache: "no-store",
    },
  )

  if (!response.ok) {
    const errorText = await response.text()

    console.error("BigCommerce API error:", {
      status: response.status,
      method: init?.method ?? "GET",
      path,
      response: errorText,
    })

    const status =
      response.status === 404
        ? 404
        : response.status >= 500
          ? 502
          : 400

    throw new BigCommerceError(
      `BigCommerce cart request failed: ${errorText}`,
      status,
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  const payload = (await response.json()) as
    | { data: T }
    | T

  return "data" in (payload as object)
    ? (payload as { data: T }).data
    : (payload as T)
}

function mapItem(item: BigCommerceItem): CartItem {
  const unitPrice =
    item.sale_price ??
    item.list_price ??
    0

  return {
    id: item.id,
    productId: item.product_id,
    variantId: item.variant_id,
    name: item.name,
    sku: item.sku ?? "",
    imageUrl: item.image_url ?? null,
    quantity: item.quantity,
    unitPrice,
    lineTotal:
      item.extended_sale_price ??
      item.extended_list_price ??
      unitPrice * item.quantity,
    options: (item.options ?? []).map((option) => ({
      name:
        option.name ??
        String(option.name_id ?? "Option"),
      value:
        option.value ??
        String(option.value_id ?? ""),
    })),
  }
}

export function normalizeCart(
  cart: BigCommerceCart,
): CommerceCart {
  const rawItems = [
    ...(cart.line_items?.physical_items ?? []),
    ...(cart.line_items?.digital_items ?? []),
    ...(cart.line_items?.gift_certificates ?? []),
  ]

  const items = rawItems.map(mapItem)

  return {
    id: cart.id,
    items,
    itemCount: items.reduce(
      (total, item) => total + item.quantity,
      0,
    ),
    subtotal:
      cart.base_amount ??
      items.reduce(
        (total, item) => total + item.lineTotal,
        0,
      ),
    total:
      cart.cart_amount ??
      cart.base_amount ??
      0,
    currency:
      cart.currency?.code ??
      "USD",
  }
}

export async function createCart(
  productId: number,
  variantId: number,
  quantity: number,
) {
  const channelId =
    process.env.BIGCOMMERCE_CHANNEL_ID

  const cart = await request<BigCommerceCart>(
    "/carts?include=redirect_urls",
    {
      method: "POST",
      body: JSON.stringify({
        ...(channelId
          ? { channel_id: Number(channelId) }
          : {}),
        line_items: [
          {
            product_id: productId,
            variant_id: variantId,
            quantity,
          },
        ],
      }),
    },
  )

  return normalizeCart(cart)
}

export async function getCart(
  cartId: string,
) {
  return normalizeCart(
    await request<BigCommerceCart>(
      `/carts/${encodeURIComponent(
        cartId,
      )}?include=redirect_urls`,
    ),
  )
}

export async function addCartItem(
  cartId: string,
  productId: number,
  variantId: number,
  quantity: number,
) {
  const cart = await request<BigCommerceCart>(
    `/carts/${encodeURIComponent(
      cartId,
    )}/items?include=redirect_urls`,
    {
      method: "POST",
      body: JSON.stringify({
        line_items: [
          {
            product_id: productId,
            variant_id: variantId,
            quantity,
          },
        ],
      }),
    },
  )

  return normalizeCart(cart)
}

export async function updateCartItem(
  cartId: string,
  itemId: string,
  productId: number,
  variantId: number,
  quantity: number,
) {
  // BigCommerce's Update Cart Line Item endpoint requires `product_id` (and
  // `variant_id` for products with variants) in the request body, not just
  // `quantity`. Omitting them causes BigCommerce to reject the request with
  // a 400, so we must pass them through.
  const cart = await request<BigCommerceCart>(
    `/carts/${encodeURIComponent(
      cartId,
    )}/items/${encodeURIComponent(
      itemId,
    )}?include=redirect_urls`,
    {
      method: "PUT",
      body: JSON.stringify({
        line_item: {
          product_id: productId,
          variant_id: variantId,
          quantity,
        },
      }),
    },
  )

  return normalizeCart(cart)
}

export async function removeCartItem(
  cartId: string,
  itemId: string,
) {
  await request<void>(
    `/carts/${encodeURIComponent(
      cartId,
    )}/items/${encodeURIComponent(itemId)}`,
    {
      method: "DELETE",
    },
  )

  try {
    return await getCart(cartId)
  } catch (error) {
    if (isBigCommerceNotFound(error)) {
      return null
    }

    throw error
  }
}

export async function getCheckoutUrl(
  cartId: string,
) {
  const cart = await request<BigCommerceCart>(
    `/carts/${encodeURIComponent(
      cartId,
    )}?include=redirect_urls`,
  )

  const itemCount =
    (cart.line_items?.physical_items?.length ?? 0) +
    (cart.line_items?.digital_items?.length ?? 0) +
    (cart.line_items?.gift_certificates?.length ?? 0)

  if (itemCount === 0) {
    throw new BigCommerceError(
      "Your cart is empty.",
      400,
    )
  }

  const checkoutUrl =
    cart.redirect_urls?.checkout_url

  if (!checkoutUrl) {
    throw new BigCommerceError(
      "Checkout is temporarily unavailable.",
      502,
    )
  }

  if (new URL(checkoutUrl).protocol !== "https:") {
    throw new BigCommerceError(
      "Invalid checkout destination.",
      502,
    )
  }

  return checkoutUrl
}

export function isBigCommerceNotFound(
  error: unknown,
) {
  return (
    error instanceof BigCommerceError &&
    error.status === 404
  )
}

export function commerceErrorStatus(
  error: unknown,
) {
  return error instanceof BigCommerceError
    ? error.status
    : 500
}
