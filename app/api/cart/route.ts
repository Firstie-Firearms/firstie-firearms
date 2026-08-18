import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getCart, isBigCommerceNotFound, commerceErrorStatus } from "@/lib/bigcommerce"
import { CART_COOKIE } from "@/lib/cart-cookie"

export const runtime = "nodejs"

export async function GET() {
  const cookieStore = await cookies()
  const cartId = cookieStore.get(CART_COOKIE)?.value
  if (!cartId) return NextResponse.json({ cart: null })

  try {
    return NextResponse.json({ cart: await getCart(cartId) })
  } catch (error) {
    if (isBigCommerceNotFound(error)) {
      cookieStore.delete(CART_COOKIE)
      return NextResponse.json({ cart: null })
    }
    return NextResponse.json(
      { cart: null, message: "We couldn't load your cart. Please try again." },
      { status: commerceErrorStatus(error) },
    )
  }
}
