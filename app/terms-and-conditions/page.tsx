import type { Metadata } from "next"
import { Footer } from "@/components/footer"
import { PolicyPage } from "@/components/policy-page"
import { policies } from "@/lib/policy-content"

export const metadata: Metadata = { title: "Terms & Conditions | Firstie Firearms", description: policies["terms-and-conditions"].description }
export default function TermsPage() { return <><PolicyPage policy={policies["terms-and-conditions"]} /><Footer /></> }
