"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { type AgeGateStatus, readAgeGateStatus, writeAgeGateStatus } from "@/lib/age-gate"

/**
 * AgeGate — single source of truth for age-verification state.
 *
 * Renders the age-verification dialog (or the "denied" blocking screen) and
 * controls visibility of `#site-content` via a `data-age-gate` attribute on
 * <html>. Fails closed: until this component positively determines the
 * visitor verified their age THIS BROWSER SESSION (sessionStorage), the
 * gate is shown and the rest of the site is inert and hidden.
 */
export function AgeGate({ onVerified }: { onVerified?: () => void }) {
  // Start in "pending" on every render (including first client render),
  // matching the server-rendered fail-closed default. We only ever move out
  // of "pending" after positively reading sessionStorage on mount.
  const [status, setStatus] = useState<AgeGateStatus>("pending")
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)

  // Check stored confirmation on mount (client-only, keeps page content
  // server-rendered for SEO while still failing closed for human visitors).
  useEffect(() => {
    setStatus(readAgeGateStatus())
  }, [])

  // Keep the <html data-age-gate> attribute in sync with React state so the
  // fail-closed CSS rule in globals.css reveals #site-content only when
  // verified.
  useEffect(() => {
    document.documentElement.setAttribute("data-age-gate", status === "verified" ? "verified" : "pending")
  }, [status])

  const isOpen = status !== "verified"

  // Lock background scroll while the gate is shown.
  useEffect(() => {
    if (!isOpen) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [isOpen])

  // Move focus into the dialog whenever it (re)opens or its content changes.
  useEffect(() => {
    if (isOpen) {
      confirmRef.current?.focus()
    }
  }, [isOpen, status])

  // Focus trap + block Escape from dismissing.
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.preventDefault()
      return
    }
    if (e.key !== "Tab") return

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (!focusable || focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  function handleConfirm() {
    writeAgeGateStatus("verified")
    setStatus("verified")
    onVerified?.()
  }

  function handleDeny() {
    // Do not persist "denied" — this is intentionally not remembered so we
    // always fail closed (show the gate again) rather than remembering a
    // decision across reloads via any long-lived mechanism.
    setStatus("denied")
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md p-4"
      onKeyDown={handleKeyDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-modal-title"
        aria-describedby="age-modal-desc"
        className="glass w-full max-w-md rounded-lg p-8 md:p-10 text-center space-y-6 shadow-2xl"
      >
        <div className="flex justify-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/firstie_firearms_logo_transparent-qz4KbeTUSjr6grAxHDEtDGNMFyyrzZ.png"
            alt="Firstie Firearms"
            width={320}
            height={160}
            className="object-contain"
            priority
          />
        </div>

        <p className="text-xs font-bold tracking-[0.2em] text-secondary uppercase">{"Firstie Firearms"}</p>

        {status === "denied" ? (
          <>
            <h2 id="age-modal-title" className="text-2xl md:text-3xl font-bold tracking-tight text-balance">
              {"Access Restricted"}
            </h2>
            <p id="age-modal-desc" className="text-sm md:text-base text-muted-foreground leading-relaxed text-pretty">
              {"You must be 21 years of age or older to access Firstie Firearms."}
            </p>
          </>
        ) : (
          <>
            <h2 id="age-modal-title" className="text-2xl md:text-3xl font-bold tracking-tight text-balance">
              {"Age Verification"}
            </h2>
            <p id="age-modal-desc" className="text-sm md:text-base text-muted-foreground leading-relaxed text-pretty">
              {"You must be 21 years of age or older to enter this website."}
            </p>
            <p className="text-xs text-muted-foreground">
              {"By entering this website, you confirm that you are at least 21 years old."}
            </p>

            <div className="flex flex-col gap-3">
              <Button
                ref={confirmRef}
                onClick={handleConfirm}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wide"
              >
                {"I Am 21 or Older"}
              </Button>
              <Button onClick={handleDeny} variant="outline" size="lg" className="w-full font-medium bg-transparent">
                {"I Am Under 21"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
