export interface CartItem {
  id: string
  productId: number
  variantId: number
  name: string
  sku: string
  imageUrl: string | null
  quantity: number
  unitPrice: number
  lineTotal: number
  options: Array<{ name: string; value: string }>
}

export interface CommerceCart {
  id: string
  items: CartItem[]
  itemCount: number
  subtotal: number
  total: number
  currency: string
}

export interface CartResponse {
  cart: CommerceCart | null
  message?: string
}
