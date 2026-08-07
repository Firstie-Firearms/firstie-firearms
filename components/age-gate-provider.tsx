"use client"

import { useEffect, useState } from "react"
import { AgeGate } from "@/components/age-verification-modal"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { readAgeGateStatus } from "@/lib/age-gate"

/**
 * AgeGateProvider — the single application-level gate wrapping every route.
 *
 * This lives in the root layout so it automatically protects all current
 * and future public routes with no per-page logic required. Site content
 * is:
 *   1. Hidden via CSS by default (see globals.css `#site-content` rule),
 *      which fails closed before any JS runs.
 *   2. Marked `inert` + `aria-hidden` while unverified, so keyboard and
 *      screen-reader users cannot reach or interact with it even though it
 *      remains in the DOM for SEO purposes.
 */
export function AgeGateProvider({ children }: { children: React.ReactNode }) {
  // Fails closed: default is unverified until we positively confirm
  // otherwise from sessionStorage on mount.
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    setVerified(readAgeGateStatus() === "verified")
  }, [])

  return (
    <div className="relative min-h-screen">
      <div id="site-content" aria-hidden={!verified} inert={!verified ? true : undefined}>
        <Header />
        {children}
        <Footer />
      </div>
      <AgeGate onVerified={() => setVerified(true)} />
    </div>
  )
}
