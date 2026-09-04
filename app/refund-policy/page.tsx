import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { PolicyPage } from "@/components/policy-page"
import { policies } from "@/lib/policy-content"

export const metadata: Metadata = { title: "Refund Policy | Firstie Firearms", description: policies["refund-policy"].description }
export default function RefundPolicyPage() { return <><PolicyPage policy={policies["refund-policy"]} /><Footer /></> }
