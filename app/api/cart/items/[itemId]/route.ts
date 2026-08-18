import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getCart, updateCartItem, removeCartItem, commerceErrorStatus } from "@/lib/bigcommerce"
import { CART_COOKIE } from "@/lib/cart-cookie"

export const runtime = "nodejs"
const MAX_QUANTITY = 5
const SAFE_ID = /^[A-Za-z0-9-]{1,128}$/

async function cartId() {
  return (await cookies()).get(CART_COOKIE)?.value
}

export async function PATCH(request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params
    const body = (await request.json()) as { quantity?: unknown }
    const id = await cartId()
    const quantity = Number(body.quantity)
    if (!id || !SAFE_ID.test(itemId) || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return NextResponse.json({ message: "Invalid cart update." }, { status: 400 })
    }

    const current = await getCart(id)
    const target = current.items.find((item) => item.id === itemId)
    if (!target) return NextResponse.json({ message: "Cart item not found." }, { status: 404 })
    const otherQuantity = current.items
      .filter((item) => item.id !== itemId && item.productId === target.productId && item.variantId === target.variantId)
      .reduce((total, item) => total + item.quantity, 0)
    if (otherQuantity + quantity > MAX_QUANTITY) {
      return NextResponse.json({ message: `Quantity cannot exceed ${MAX_QUANTITY}.` }, { status: 400 })
    }

    return NextResponse.json({ cart: await updateCartItem(id, itemId, quantity) })
  } catch (error) {
    return NextResponse.json(
      { message: "We couldn't update your cart. Please try again." },
      { status: commerceErrorStatus(error) },
    )
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params
    const id = await cartId()
    if (!id || !SAFE_ID.test(itemId)) return NextResponse.json({ message: "Invalid cart request." }, { status: 400 })
    return NextResponse.json({ cart: await removeCartItem(id, itemId) })
  } catch (error) {
    return NextResponse.json(
      { message: "We couldn't remove this item. Please try again." },
      { status: commerceErrorStatus(error) },
    )
  }
}
