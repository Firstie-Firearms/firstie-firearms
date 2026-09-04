import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { PolicyPage } from "@/components/policy-page"
import { policies } from "@/lib/policy-content"

export const metadata: Metadata = { title: "Delivery Timeframe | Firstie Firearms", description: policies["delivery-timeframe"].description }
export default function DeliveryTimeframePage() { return <><PolicyPage policy={policies["delivery-timeframe"]} /><Footer /></> }
