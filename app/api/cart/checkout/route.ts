import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getCheckoutUrl, commerceErrorStatus } from "@/lib/bigcommerce"
import { CART_COOKIE } from "@/lib/cart-cookie"

export const runtime = "nodejs"

export async function POST() {
  try {
    const cartId = (await cookies()).get(CART_COOKIE)?.value
    if (!cartId) return NextResponse.json({ message: "Your cart is empty." }, { status: 400 })
    return NextResponse.json({ checkoutUrl: await getCheckoutUrl(cartId) })
  } catch (error) {
    return NextResponse.json(
      { message: "Secure checkout is temporarily unavailable. Please try again." },
      { status: commerceErrorStatus(error) },
    )
  }
}
