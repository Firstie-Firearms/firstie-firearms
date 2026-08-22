import type { Metadata } from "next"
import { PrivacyPolicyPage } from "@/components/privacy-policy-page"

const title = "Privacy Policy | Firstie Firearms"
const description =
  "How Firstie Firearms collects, uses, and protects your information, including email and SMS consent, Klaviyo, cookies, and your privacy choices."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://www.firstiefirearms.com/privacy-policy" },
  openGraph: {
    title,
    description,
    url: "https://www.firstiefirearms.com/privacy-policy",
    images: [
      {
        url: "https://www.firstiefirearms.com/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Firstie Firearms — Commemorative Service Academy Pistols",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://www.firstiefirearms.com/opengraph-image"],
  },
}

export default function PrivacyPolicyRoute() {
  return <PrivacyPolicyPage />
}
