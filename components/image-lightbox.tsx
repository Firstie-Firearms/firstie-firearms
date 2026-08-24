"use client"

import { useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface LightboxImage {
  /** Full-resolution image source, used in the full-screen viewer. */
  src: string
  /** Descriptive alt text — never generic ("image 1", "product photo"). */
  alt: string
  /** Optional smaller/optimized source for thumbnails. Falls back to `src`. */
  thumbnailSrc?: string
  /** Optional caption shown in the full-screen viewer. */
  caption?: string
}

/**
 * Hides site chrome while a full-screen viewer is open.
 *
 * The site header and sticky order bar use backdrop-filter, which renders
 * into its own GPU compositing layer and can paint above other fixed
 * overlays regardless of z-index. The body class is styled in globals.css.
 */
export function useLightboxChromeHidden(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return
    document.body.classList.add("photo-lightbox-open")
    return () => {
      document.body.classList.remove("photo-lightbox-open")
    }
  }, [isOpen])
}

interface ImageLightboxProps {
  images: LightboxImage[]
  index: number
  accentColor: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

/**
 * Full-screen image viewer with keyboard, swipe, and click-to-dismiss
 * controls. Shared by the product photo carousel and the inline expandable
 * images in product descriptions so both behave identically.
 */
export function ImageLightbox({ images, index, accentColor, onClose, onPrev, onNext }: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef<number | null>(null)
  const image = images[index]
  const hasPrev = index > 0
  const hasNext = index < images.length - 1

  // Prevent page scroll while open, and restore on close.
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  // Focus trap + keyboard controls.
  useEffect(() => {
    closeButtonRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        onPrev()
        return
      }
      if (e.key === "ArrowRight") {
        e.preventDefault()
        onNext()
        return
      }
      if (e.key === "Tab") {
        // Simple trap: keep focus cycling within the dialog.
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
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
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose, onPrev, onNext])

  function handleBackgroundClick(e: React.MouseEvent<HTMLDivElement>) {
    // Only close if the click landed on the backdrop itself, not the image
    // or controls (which stop propagation below).
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const SWIPE_THRESHOLD = 50
    if (deltaX > SWIPE_THRESHOLD) {
      onPrev()
    } else if (deltaX < -SWIPE_THRESHOLD) {
      onNext()
    }
    touchStartX.current = null
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Full screen product photo: ${image.alt}`}
      onClick={handleBackgroundClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-[100] flex h-dvh w-dvw flex-col bg-black"
    >
      {/* Close button */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close full screen image"
        className={cn(
          "absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full",
          "bg-black/50 border border-white/20 text-white",
          "hover:bg-black/70 transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        )}
        style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
      >
        <X className="h-5 w-5" />
      </button>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 rounded-full bg-black/50 px-3 py-1 text-xs font-mono text-white/80 border border-white/10">
          {index + 1} / {images.length}
        </div>
      )}

      {/* Main image area */}
      <div className="relative min-h-0 flex-1 flex items-center justify-center px-4 py-12 sm:py-16 md:px-20 pointer-events-none">
        <img
          key={image.src}
          src={image.src || "/placeholder.svg"}
          alt={image.alt}
          className="max-h-full max-w-full w-auto h-auto object-contain pointer-events-auto select-none"
          draggable={false}
        />
      </div>

      {image.caption && (
        <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-center text-xs md:text-sm text-white/60 px-4">
          {image.caption}
        </p>
      )}

      {/* Previous arrow */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          disabled={!hasPrev}
          aria-label="Previous product image"
          className={cn(
            "absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20",
            "flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full",
            "bg-black/50 border border-white/20 text-white",
            "transition-opacity duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
            hasPrev ? "opacity-100 hover:bg-black/70" : "opacity-30 pointer-events-none",
          )}
          style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Next arrow */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          disabled={!hasNext}
          aria-label="Next product image"
          className={cn(
            "absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20",
            "flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full",
            "bg-black/50 border border-white/20 text-white",
            "transition-opacity duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
            hasNext ? "opacity-100 hover:bg-black/70" : "opacity-30 pointer-events-none",
          )}
          style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}
