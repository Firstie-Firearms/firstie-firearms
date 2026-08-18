import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { addCartItem, createCart, getCart, isBigCommerceNotFound, commerceErrorStatus } from "@/lib/bigcommerce"
import { getCommerceProduct } from "@/lib/commerce-products"
import { CART_COOKIE, CART_COOKIE_OPTIONS } from "@/lib/cart-cookie"

export const runtime = "nodejs"
const MAX_QUANTITY = 5

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { productKey?: unknown; quantity?: unknown }
    if (typeof body.productKey !== "string" || !Number.isInteger(body.quantity) || Number(body.quantity) < 1) {
      return NextResponse.json({ message: "Invalid cart request." }, { status: 400 })
    }

    const product = getCommerceProduct(body.productKey)
    if (!product?.productId || !product.variantId) {
      return NextResponse.json({ message: "This product is not yet available to order online." }, { status: 409 })
    }

    const quantity = Number(body.quantity)
    const cookieStore = await cookies()
    const existingCartId = cookieStore.get(CART_COOKIE)?.value
    let cart = null

    if (existingCartId) {
      try {
        const existingCart = await getCart(existingCartId)
        const existingQuantity = existingCart.items
          .filter((item) => item.productId === product.productId && item.variantId === product.variantId)
          .reduce((total, item) => total + item.quantity, 0)
        if (existingQuantity + quantity > MAX_QUANTITY) {
          return NextResponse.json({ message: `Quantity cannot exceed ${MAX_QUANTITY}.` }, { status: 400 })
        }
        cart = await addCartItem(existingCartId, product.productId, product.variantId, quantity)
      } catch (error) {
        if (!isBigCommerceNotFound(error)) throw error
        cookieStore.delete(CART_COOKIE)
      }
    }

    if (!cart) {
      if (quantity > MAX_QUANTITY) {
        return NextResponse.json({ message: `Quantity cannot exceed ${MAX_QUANTITY}.` }, { status: 400 })
      }
      cart = await createCart(product.productId, product.variantId, quantity)
      cookieStore.set(CART_COOKIE, cart.id, CART_COOKIE_OPTIONS)
    }

    return NextResponse.json({ cart })
  } catch (error) {
    return NextResponse.json(
      { message: "We couldn't add this item to your cart. Please try again." },
      { status: commerceErrorStatus(error) },
    )
  }
}
