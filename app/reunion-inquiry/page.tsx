import type { Metadata } from "next"
import { ReunionInquiryForm } from "@/components/reunion-inquiry-form"
import type { Academy } from "@/types"

export const metadata: Metadata = {
  title: "Reunion Inquiry | Firstie Firearms",
  description: "Contact Firstie Firearms about a limited commemorative service academy reunion edition.",
}

const academyCodes = new Set<Academy>(["USNA", "USMA", "USAFA"])

export default async function ReunionInquiryPage({
  searchParams,
}: {
  searchParams: Promise<{ academy?: string }>
}) {
  const { academy } = await searchParams
  const initialAcademy = academy && academyCodes.has(academy as Academy) ? (academy as Academy) : undefined

  return <ReunionInquiryForm initialAcademy={initialAcademy} />
}
