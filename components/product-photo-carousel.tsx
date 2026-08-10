"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ProductPhoto {
  /** Full-resolution image source, used in the full-screen viewer. */
  src: string
  /** Descriptive alt text — never generic ("image 1", "product photo"). */
  alt: string
  /** Optional smaller/optimized source for the carousel strip. Falls back to `src`. */
  thumbnailSrc?: string
  /** Optional caption shown in the full-screen viewer. */
  caption?: string
}

interface ProductPhotoCarouselProps {
  images: ProductPhoto[]
  /** Accent color (e.g. academy gold) used for arrow rings/focus states. */
  accentColor?: string
  className?: string
}

export function ProductPhotoCarousel({ images, accentColor = "#b99a6a", className }: ProductPhotoCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // The site header and sticky order bar use backdrop-filter, which renders
  // into its own GPU compositing layer and can paint above other fixed
  // overlays regardless of z-index. Hide them via a body class while the
  // full-screen lightbox is open so no chrome bleeds over the photo.
  useEffect(() => {
    if (lightboxIndex === null) return
    document.body.classList.add("photo-lightbox-open")
    return () => {
      document.body.classList.remove("photo-lightbox-open")
    }
  }, [lightboxIndex])

  const updateArrowState = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < maxScroll - 4)
  }, [])

  useEffect(() => {
    updateArrowState()
    const el = trackRef.current
    if (!el) return
    el.addEventListener("scroll", updateArrowState, { passive: true })
    const resizeObserver = new ResizeObserver(updateArrowState)
    resizeObserver.observe(el)
    return () => {
      el.removeEventListener("scroll", updateArrowState)
      resizeObserver.disconnect()
    }
  }, [updateArrowState, images.length])

  const scrollByGroup = useCallback((direction: "left" | "right") => {
    const el = trackRef.current
    if (!el) return
    // Advance by ~90% of the visible width so it feels like a "group" move
    // rather than a single item nudge, while still overlapping slightly so
    // visitors keep context of where they are.
    const amount = el.clientWidth * 0.9
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
  }, [])

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? prev : Math.max(0, prev - 1)))
  }, [])

  const showNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? prev : Math.min(images.length - 1, prev + 1)))
  }, [images.length])

  if (images.length === 0) return null

  return (
    <div className={cn("relative w-full", className)}>
      {/* Horizontal carousel strip */}
      <div className="relative">
        <div
          ref={trackRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 py-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => openLightbox(index)}
              aria-label={`Open full screen: ${image.alt}`}
              className={cn(
                "group relative shrink-0 snap-start overflow-hidden rounded-md border border-border bg-card",
                "w-[42vw] sm:w-[30vw] md:w-[19%] lg:w-[16%]",
                "aspect-[4/3] cursor-zoom-in",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "transition-transform duration-200",
              )}
              style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
            >
              <img
                src={image.thumbnailSrc || image.src}
                alt={image.alt}
                loading="lazy"
                sizes="(max-width: 640px) 42vw, (max-width: 768px) 30vw, (max-width: 1024px) 19vw, 16vw"
                className="absolute inset-0 h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
                draggable={false}
              />
            </button>
          ))}
        </div>

        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scrollByGroup("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll product photos left"
          className={cn(
            "absolute left-1 top-1/2 -translate-y-1/2 z-10",
            "flex h-11 w-11 items-center justify-center rounded-full",
            "bg-background/80 border backdrop-blur-sm",
            "transition-opacity duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            canScrollLeft ? "opacity-100 hover:bg-background" : "opacity-30 pointer-events-none",
          )}
          style={{ borderColor: accentColor, "--tw-ring-color": accentColor } as React.CSSProperties}
        >
          <ChevronLeft className="h-5 w-5" style={{ color: accentColor }} />
        </button>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scrollByGroup("right")}
          disabled={!canScrollRight}
          aria-label="Scroll product photos right"
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2 z-10",
            "flex h-11 w-11 items-center justify-center rounded-full",
            "bg-background/80 border backdrop-blur-sm",
            "transition-opacity duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            canScrollRight ? "opacity-100 hover:bg-background" : "opacity-30 pointer-events-none",
          )}
          style={{ borderColor: accentColor, "--tw-ring-color": accentColor } as React.CSSProperties}
        >
          <ChevronRight className="h-5 w-5" style={{ color: accentColor }} />
        </button>
      </div>

      {lightboxIndex !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <Lightbox
            images={images}
            index={lightboxIndex}
            accentColor={accentColor}
            onClose={closeLightbox}
            onPrev={showPrev}
            onNext={showNext}
          />,
          document.body,
        )}
    </div>
  )
}

interface LightboxProps {
  images: ProductPhoto[]
  index: number
  accentColor: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function Lightbox({ images, index, accentColor, onClose, onPrev, onNext }: LightboxProps) {
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
      className="fixed inset-0 z-[100] flex h-dvh w-dvw flex-col bg-black/95"
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
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 rounded-full bg-black/50 px-3 py-1 text-xs font-mono text-white/80 border border-white/10">
        {index + 1} / {images.length}
      </div>

      {/* Main image area */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-12 sm:py-16 md:px-20 pointer-events-none">
        <img
          key={image.src}
          src={image.src}
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

      {/* Next arrow */}
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
    </div>
  )
}
