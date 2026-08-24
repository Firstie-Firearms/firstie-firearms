"use client"

import { useCallback, useState } from "react"
import { createPortal } from "react-dom"
import { Expand } from "lucide-react"
import { ImageLightbox, useLightboxChromeHidden, type LightboxImage } from "@/components/image-lightbox"
import { cn } from "@/lib/utils"

interface ExpandableImageProps {
  /**
   * The full set of images in this group. Every instance receives the same
   * array so the full-screen viewer can page through all of them, letting a
   * visitor open one image inline and then browse the rest without closing.
   */
  images: LightboxImage[]
  /** Index of the image this instance renders, within `images`. */
  index: number
  /** Accent color (e.g. academy gold) for focus rings and the expand hint. */
  accentColor?: string
  /** Classes for the rendered `img`, so callers keep full layout control. */
  imageClassName?: string
  /** Classes for the button wrapper. */
  className?: string
}

/**
 * An inline image that expands into the shared full-screen viewer on click.
 *
 * Used for the images interleaved with product description copy, where a
 * carousel would break the reading flow. Rendering as a real `button` gives
 * keyboard and screen-reader support for free.
 */
export function ExpandableImage({
  images,
  index,
  accentColor = "#b99a6a",
  imageClassName,
  className,
}: ExpandableImageProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const image = images[index]

  useLightboxChromeHidden(lightboxIndex !== null)

  const close = useCallback(() => setLightboxIndex(null), [])
  const showPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? prev : Math.max(0, prev - 1)))
  }, [])
  const showNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? prev : Math.min(images.length - 1, prev + 1)))
  }, [images.length])

  if (!image) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setLightboxIndex(index)}
        aria-label={`Expand to full screen: ${image.alt}`}
        className={cn(
          "group relative block w-full cursor-zoom-in overflow-hidden",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
        style={{ "--tw-ring-color": accentColor } as React.CSSProperties}
      >
        <img
          src={image.src || "/placeholder.svg"}
          alt={image.alt}
          loading="lazy"
          className={cn("block h-auto w-full object-contain", imageClassName)}
          draggable={false}
        />

        {/* Affordance so it reads as expandable, not just decorative. */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full",
            "border bg-background/70 backdrop-blur-sm",
            "opacity-70 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100",
          )}
          style={{ borderColor: accentColor }}
        >
          <Expand className="h-4 w-4" style={{ color: accentColor }} />
        </span>
      </button>

      {lightboxIndex !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <ImageLightbox
            images={images}
            index={lightboxIndex}
            accentColor={accentColor}
            onClose={close}
            onPrev={showPrev}
            onNext={showNext}
          />,
          document.body,
        )}
    </>
  )
}
