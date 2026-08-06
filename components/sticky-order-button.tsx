"use client"

interface StickyOrderButtonProps {
  label: string
  href?: string
  gold: string
  anchorSelector?: string
}

export function StickyOrderButton({ label, href = "#order", gold }: StickyOrderButtonProps) {
  const btnClass =
    "flex items-center justify-center font-sans font-bold uppercase tracking-widest text-background rounded-sm shadow-lg transition-all hover:brightness-110 active:scale-[0.98] px-8 py-3"

  // Split "Order Class of 2027 Pistol" → ["Order", "Class of 2027 Pistol"]
  const spaceIdx = label.indexOf(" ")
  const firstWord = spaceIdx !== -1 ? label.slice(0, spaceIdx) : label
  const restWords = spaceIdx !== -1 ? label.slice(spaceIdx + 1) : ""

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between gap-6 px-6 py-4">
        <p className="text-sm font-semibold text-foreground hidden sm:block">{label}</p>
        <a href={href} className={`${btnClass} w-full sm:w-auto`} style={{ backgroundColor: gold }}>
          {/* Mobile: two lines. Desktop: single line. */}
          <span className="sm:hidden flex flex-col items-center leading-tight text-xs tracking-widest">
            <span>{firstWord}</span>
            {restWords && <span>{restWords}</span>}
          </span>
          <span className="hidden sm:inline text-sm">{label}</span>
        </a>
      </div>
    </div>
  )
}
