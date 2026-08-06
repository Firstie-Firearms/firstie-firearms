"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const STORAGE_KEY = "ff-age-verified"
// Confirmation is valid for 30 days
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000

export function AgeVerificationModal() {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)

  // Check stored confirmation on mount (client-only, keeps page content server-rendered)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const expiresAt = Number.parseInt(raw, 10)
        if (!Number.isNaN(expiresAt) && expiresAt > Date.now()) {
          return
        }
      }
    } catch {
      // localStorage unavailable — show modal to be safe
    }
    setOpen(true)
  }, [])

  // Lock background scroll while open
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  // Move focus into the dialog when it opens
  useEffect(() => {
    if (open) {
      confirmRef.current?.focus()
    }
  }, [open])

  // Focus trap + block Escape from dismissing
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
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now() + EXPIRY_MS))
    } catch {
      // ignore storage failures
    }
    setOpen(false)
  }

  function handleExit() {
    window.location.href = "https://www.google.com"
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
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

        <h2 id="age-modal-title" className="text-2xl md:text-3xl font-bold tracking-tight text-balance">
          {"Confirm You Are 21+"}
        </h2>

        <p id="age-modal-desc" className="text-sm md:text-base text-muted-foreground leading-relaxed text-pretty">
          {
            "This website contains firearm-related content and is intended only for adults who are legally permitted to view and purchase firearms."
          }
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
          <Button onClick={handleExit} variant="outline" size="lg" className="w-full font-medium bg-transparent">
            {"Exit Site"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          {"By entering, you confirm compliance with all applicable firearms laws."}
        </p>
      </div>
    </div>
  )
}
