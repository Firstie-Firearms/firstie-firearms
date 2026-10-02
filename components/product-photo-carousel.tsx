"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
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

const AUTO_SCROLL_START_DELAY_MS = 3000
const AUTO_SCROLL_SPEED_PX_PER_SEC = 24

interface ProductPhotoCarouselProps {
  images: ProductPhoto[]
  /** Accent color (e.g. academy gold) used for arrow rings/focus states. */
  accentColor?: string
  className?: string
}

export function ProductPhotoCarousel({ images, accentColor = "#b99a6a", className }: ProductPhotoCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const count = images.length

  useLightboxChromeHidden(lightboxIndex !== null)

  // The strip renders three identical copies of the photos. The user always
  // browses the middle copy; when scrolling settles inside the first or third
  // copy we instantly shift by one copy's width, which is visually identical,
  // so the loop never appears to reach an end or rewind.
  const getSetWidth = useCallback(() => {
    const el = trackRef.current
    if (!el || count === 0) return 0
    const items = el.children as HTMLCollectionOf<HTMLElement>
    if (items.length < count * 2) return 0
    return items[count].offsetLeft - items[0].offsetLeft
  }, [count])

  const recenter = useCallback(() => {
    const el = trackRef.current
    const setWidth = getSetWidth()
    if (!el || setWidth === 0) return
    let next = el.scrollLeft
    while (next < setWidth) next += setWidth
    while (next >= setWidth * 2) next -= setWidth
    if (next === el.scrollLeft) return
    const previousBehavior = el.style.scrollBehavior
    const previousSnapType = el.style.scrollSnapType
    el.style.scrollBehavior = "auto"
    el.style.scrollSnapType = "none"
    el.scrollLeft = next
    requestAnimationFrame(() => {
      el.style.scrollBehavior = previousBehavior
      el.style.scrollSnapType = previousSnapType
    })
  }, [getSetWidth])

  useLayoutEffect(() => {
    const el = trackRef.current
    const setWidth = getSetWidth()
    if (!el || setWidth === 0) return
    el.style.scrollBehavior = "auto"
    el.scrollLeft = setWidth
    el.style.scrollBehavior = ""
  }, [getSetWidth])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let settleTimer: ReturnType<typeof setTimeout> | undefined
    const handleScroll = () => {
      clearTimeout(settleTimer)
      settleTimer = setTimeout(recenter, 140)
    }
    el.addEventListener("scroll", handleScroll, { passive: true })
    const resizeObserver = new ResizeObserver(recenter)
    resizeObserver.observe(el)
    return () => {
      clearTimeout(settleTimer)
      el.removeEventListener("scroll", handleScroll)
      resizeObserver.disconnect()
    }
  }, [recenter])

  const hoverPausedRef = useRef(false)
  const focusPausedRef = useRef(false)
  const touchPausedRef = useRef(false)
  const lightboxOpenRef = useRef(false)
  const touchResumeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    lightboxOpenRef.current = lightboxIndex !== null
  }, [lightboxIndex])

  // Ambient auto-scroll: a slow, continuous drift that moves the photos left
  // to right. Snap is disabled while drifting so the strip glides instead of
  // jumping between slides; it is restored whenever the carousel pauses so the
  // arrow buttons still land on whole photos.
  useEffect(() => {
    const el = trackRef.current
    if (!el || count === 0) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    let lastTime = 0
    let position: number | null = null
    let drifting = false

    const restoreScrollStyles = () => {
      el.style.scrollSnapType = ""
      el.style.scrollBehavior = ""
    }

    const step = (now: number) => {
      frame = requestAnimationFrame(step)
      const paused =
        hoverPausedRef.current ||
        focusPausedRef.current ||
        touchPausedRef.current ||
        lightboxOpenRef.current ||
        document.hidden
      if (paused) {
        // Re-enabling snap would yank the strip to the nearest photo, so hover,
        // focus, and lightbox pauses keep snap off and freeze in place. Only a
        // touch interaction restores snap, so swipes still settle on a photo.
        if (drifting && touchPausedRef.current) {
          drifting = false
          restoreScrollStyles()
        }
        lastTime = 0
        position = null
        return
      }
      if (!drifting) {
        drifting = true
        el.style.scrollSnapType = "none"
        el.style.scrollBehavior = "auto"
      }
      if (lastTime === 0 || position === null) {
        lastTime = now
        position = el.scrollLeft
        return
      }
      const elapsed = Math.min(now - lastTime, 100)
      lastTime = now
      const setWidth = getSetWidth()
      if (setWidth === 0) return
      position += (AUTO_SCROLL_SPEED_PX_PER_SEC * elapsed) / 1000
      while (position < setWidth) position += setWidth
      while (position >= setWidth * 2) position -= setWidth
      el.scrollLeft = position
    }

    const startTimer = setTimeout(() => {
      frame = requestAnimationFrame(step)
    }, AUTO_SCROLL_START_DELAY_MS)

    return () => {
      clearTimeout(startTimer)
      cancelAnimationFrame(frame)
      clearTimeout(touchResumeTimerRef.current)
      restoreScrollStyles()
    }
  }, [count, getSetWidth])

  const handlePointerEnter = useCallback((event: React.PointerEvent) => {
    if (event.pointerType === "mouse") hoverPausedRef.current = true
  }, [])

  const handlePointerLeave = useCallback((event: React.PointerEvent) => {
    if (event.pointerType === "mouse") hoverPausedRef.current = false
  }, [])

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    if (event.pointerType === "mouse") return
    clearTimeout(touchResumeTimerRef.current)
    touchPausedRef.current = true
  }, [])

  const handlePointerRelease = useCallback((event: React.PointerEvent) => {
    if (event.pointerType === "mouse") return
    clearTimeout(touchResumeTimerRef.current)
    touchResumeTimerRef.current = setTimeout(() => {
      touchPausedRef.current = false
    }, AUTO_SCROLL_START_DELAY_MS)
  }, [])

  const handleFocus = useCallback((event: React.FocusEvent) => {
    focusPausedRef.current = event.target instanceof HTMLElement && event.target.matches(":focus-visible")
  }, [])

  const handleBlur = useCallback((event: React.FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) focusPausedRef.current = false
  }, [])

  const scrollByGroup = useCallback((direction: "left" | "right") => {
    const el = trackRef.current
    if (!el) return
    const amount = el.clientWidth * 0.9
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" })
  }, [])

  const loopedImages = count > 0 ? [...images, ...images, ...images] : []

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? prev : (prev - 1 + count) % count))
  }, [count])

  const showNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? prev : (prev + 1) % count))
  }, [count])

  if (images.length === 0) return null

  return (
    <div className={cn("relative w-full", className)}>
      {/* Horizontal carousel strip */}
      <div
        className="relative"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerRelease}
        onPointerCancel={handlePointerRelease}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <div
          ref={trackRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 py-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {loopedImages.map((image, loopIndex) => {
            const index = loopIndex % count
            const isClone = loopIndex < count || loopIndex >= count * 2
            return (
            <button
              key={loopIndex}
              type="button"
              onClick={() => openLightbox(index)}
              aria-label={`Open full screen: ${image.alt}`}
              aria-hidden={isClone || undefined}
              tabIndex={isClone ? -1 : undefined}
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
            )
          })}
        </div>

        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scrollByGroup("left")}
          aria-label="Scroll product photos left"
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
          aria-label="Scroll product photos right"
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
