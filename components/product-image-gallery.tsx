"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface GalleryImage {
  src: string
  alt: string
  thumbnailSrc?: string
  caption?: string
}

interface ProductImageGalleryProps {
  images: GalleryImage[]
  /** Accent color used for the selected-thumbnail ring and control focus rings. */
  accentColor?: string
  className?: string
}

/**
 * Premium product photo gallery: large primary image + single-row horizontal
 * thumbnail carousel + fullscreen lightbox. Scales to any number of images.
 */
export function ProductImageGallery({ images, accentColor = "#b99a6a", className }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const railRef = useRef<HTMLDivElement>(null)
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([])
  const primaryTouchStartX = useRef<number | null>(null)
  const lightboxTouchStartX = useRef<number | null>(null)

  const count = images.length

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return
      const next = ((index % count) + count) % count
      setSelectedIndex(next)
    },
    [count],
  )

  const goPrev = useCallback(() => goTo(selectedIndex - 1), [goTo, selectedIndex])
  const goNext = useCallback(() => goTo(selectedIndex + 1), [goTo, selectedIndex])

  // Keep the selected thumbnail visible within the rail whenever it changes.
  useEffect(() => {
    const el = thumbRefs.current[selectedIndex]
    el?.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" })
  }, [selectedIndex])

  // Track scroll position to enable/disable the rail's chevron controls.
  const updateScrollState = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const maxScroll = rail.scrollWidth - rail.clientWidth
    setCanScrollLeft(rail.scrollLeft > 4)
    setCanScrollRight(rail.scrollLeft < maxScroll - 4)
  }, [])

  useEffect(() => {
    updateScrollState()
    const rail = railRef.current
    if (!rail) return
    rail.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)
    return () => {
      rail.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [updateScrollState])

  function scrollRailByGroup(direction: 1 | -1) {
    const rail = railRef.current
    if (!rail) return
    // Advance by ~80% of the visible width so it feels like "one group" while
    // still overlapping slightly for visual continuity.
    const amount = rail.clientWidth * 0.8 * direction
    rail.scrollBy({ left: amount, behavior: "smooth" })
  }

  // Keyboard navigation while the lightbox is open.
  useEffect(() => {
    if (!lightboxOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false)
      else if (e.key === "ArrowLeft") goPrev()
      else if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen, goPrev, goNext])

  // Lock body scroll while the lightbox is open.
  useEffect(() => {
    if (!lightboxOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [lightboxOpen])

  const current = images[selectedIndex]

  const ringStyle = useMemo(
    () => ({ "--gallery-accent": accentColor }) as React.CSSProperties,
    [accentColor],
  )

  if (count === 0 || !current) return null

  return (
    <div className={cn("w-full", className)} style={ringStyle}>
      {/* Primary image */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/10] bg-card rounded-md overflow-hidden border border-border">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 z-10 cursor-zoom-in"
          aria-label={`Open fullscreen view of ${current.alt}`}
          onTouchStart={(e) => {
            primaryTouchStartX.current = e.touches[0]?.clientX ?? null
          }}
          onTouchEnd={(e) => {
            if (primaryTouchStartX.current === null) return
            const deltaX = (e.changedTouches[0]?.clientX ?? 0) - primaryTouchStartX.current
            primaryTouchStartX.current = null
            if (Math.abs(deltaX) < 40) return
            if (deltaX < 0) goNext()
            else goPrev()
          }}
        />
        <Image
          key={current.src}
          src={current.src || "/placeholder.svg"}
          alt={current.alt}
          fill
          sizes="(min-width: 768px) 60vw, 100vw"
          className="object-contain transition-opacity duration-200"
          priority={selectedIndex === 0}
        />

        {/* Primary image prev/next arrows */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous product image"
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-background/70 border border-white/15 text-foreground backdrop-blur-sm transition-all duration-200 hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next product image"
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-background/70 border border-white/15 text-foreground backdrop-blur-sm transition-all duration-200 hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </>
        )}

        {/* Image counter */}
        {count > 1 && (
          <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 z-20 px-2.5 py-1 rounded-full bg-background/70 border border-white/10 backdrop-blur-sm">
            <span className="text-xs font-mono text-foreground/80 tabular-nums">
              {selectedIndex + 1} / {count}
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail carousel */}
      {count > 1 && (
        <div className="relative mt-3 md:mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollRailByGroup(-1)}
            disabled={!canScrollLeft}
            aria-label="Scroll thumbnails left"
            className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-card border border-border text-foreground transition-all duration-200 hover:bg-muted disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={railRef}
            className="flex-1 flex gap-2 md:gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((image, index) => {
              const isSelected = index === selectedIndex
              return (
                <button
                  key={image.src + index}
                  ref={(el) => {
                    thumbRefs.current[index] = el
                  }}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`View image ${index + 1} of ${count}: ${image.alt}`}
                  aria-current={isSelected}
                  className={cn(
                    "relative shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden border-2 bg-card transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isSelected ? "opacity-100" : "border-border opacity-60 hover:opacity-90",
                  )}
                  style={{
                    borderColor: isSelected ? accentColor : undefined,
                    "--tw-ring-color": accentColor,
                  } as React.CSSProperties}
                >
                  <Image
                    src={image.thumbnailSrc || image.src || "/placeholder.svg"}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-contain"
                    loading="lazy"
                  />
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollRailByGroup(1)}
            disabled={!canScrollRight}
            aria-label="Scroll thumbnails right"
            className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-card border border-border text-foreground transition-all duration-200 hover:bg-muted disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Fullscreen lightbox */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Fullscreen product image viewer, image ${selectedIndex + 1} of ${count}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={(e) => {
            lightboxTouchStartX.current = e.touches[0]?.clientX ?? null
          }}
          onTouchEnd={(e) => {
            if (lightboxTouchStartX.current === null) return
            const deltaX = (e.changedTouches[0]?.clientX ?? 0) - lightboxTouchStartX.current
            lightboxTouchStartX.current = null
            if (Math.abs(deltaX) < 40) return
            if (deltaX < 0) goNext()
            else goPrev()
          }}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxOpen(false)
            }}
            aria-label="Close full screen image"
            className="absolute top-4 right-4 z-10 flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative w-full h-full max-w-6xl mx-auto p-6 md:p-16 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={current.src}
              src={current.src || "/placeholder.svg"}
              alt={current.alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
                aria-label="Previous product image"
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
                aria-label="Next product image"
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
              </button>
            </>
          )}

          {count > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-white/10">
              <span className="text-sm font-mono text-white/90 tabular-nums">
                {selectedIndex + 1} / {count}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
