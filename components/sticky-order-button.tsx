"use client"

interface StickyOrderButtonProps {
  label: string
  href?: string
  gold: string
  anchorSelector?: string
}

export function StickyOrderButton({ label, href = "#order", gold }: StickyOrderButtonProps) {
  const btnClass =
    "flex items-center justify-center font-sans font-bold uppercase tracking-widest text-background text-sm px-8 py-3 rounded-sm shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between gap-6 px-6 py-4">
        <p className="text-sm font-semibold text-foreground hidden sm:block">{label}</p>
        <a href={href} className={`${btnClass} w-full sm:w-auto`} style={{ backgroundColor: gold }}>
          {label}
        </a>
      </div>
    </div>
  )
}
