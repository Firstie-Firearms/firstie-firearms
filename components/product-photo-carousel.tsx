"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ImageLightbox, useLightboxChromeHidden, type LightboxImage } from "@/components/image-lightbox"
import { cn } from "@/lib/utils"

/**
 * Shape of a product photo. Structurally identical to `LightboxImage`, which
 * the shared full-screen viewer consumes; aliased here so existing callers
 * keep importing `ProductPhoto` from this module.
 */
export type ProductPhoto = LightboxImage

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

  useLightboxChromeHidden(lightboxIndex !== null)

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
    const amount = el.clientWidth * 0.9
    const maxScroll = el.scrollWidth - el.clientWidth
    const atStart = el.scrollLeft <= 4
    const atEnd = el.scrollLeft >= maxScroll - 4

    // Wrap at either edge so the carousel remains continuous. The photo
    // number is still derived from the stable ordered `images` array.
    if (direction === "left" && atStart) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" })
      return
    }
    if (direction === "right" && atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" })
      return
    }

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
          aria-label={canScrollLeft ? "Scroll product photos left" : "Loop to last product photo"}
          className={cn(
            "absolute left-1 top-1/2 -translate-y-1/2 z-10",
            "flex h-11 w-11 items-center justify-center rounded-full",
            "bg-background/80 border backdrop-blur-sm",
            "transition-opacity duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "opacity-100 hover:bg-background",
          )}
          style={{ borderColor: accentColor, "--tw-ring-color": accentColor } as React.CSSProperties}
        >
          <ChevronLeft className="h-5 w-5" style={{ color: accentColor }} />
        </button>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scrollByGroup("right")}
          aria-label={canScrollRight ? "Scroll product photos right" : "Loop to first product photo"}
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2 z-10",
            "flex h-11 w-11 items-center justify-center rounded-full",
            "bg-background/80 border backdrop-blur-sm",
            "transition-opacity duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "opacity-100 hover:bg-background",
          )}
          style={{ borderColor: accentColor, "--tw-ring-color": accentColor } as React.CSSProperties}
        >
          <ChevronRight className="h-5 w-5" style={{ color: accentColor }} />
        </button>
      </div>

      {lightboxIndex !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <ImageLightbox
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
