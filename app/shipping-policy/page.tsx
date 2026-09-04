import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { PolicyPage } from "@/components/policy-page"
import { policies } from "@/lib/policy-content"

export const metadata: Metadata = { title: "Shipping Policy | Firstie Firearms", description: policies["shipping-policy"].description }
export default function ShippingPolicyPage() { return <><PolicyPage policy={policies["shipping-policy"]} /><Footer /></> }
