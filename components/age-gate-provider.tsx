import { AgeVerificationModal } from "@/components/age-verification-modal"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export function AgeGateProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <Header />
      {children}
      <Footer />
      <AgeVerificationModal />
    </div>
  )
}
