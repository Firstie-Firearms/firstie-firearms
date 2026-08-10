"use client"

export function ComingSoonMarquee() {
  const comingSoon = ["VMI", "THE CITADEL", "NORWICH", "TEXAS A&M", "USMMA"]

  return (
    <div className="py-16 overflow-hidden border-y border-border/50">
      <div className="space-y-4">
        <h3 className="text-center text-sm font-mono text-muted-foreground tracking-wider">{"COMING SOON"}</h3>
        <h3 className="text-center text-sm font-mono text-muted-foreground tracking-wider">{"LIMITED EDITION"}</h3>

        <div className="relative flex overflow-x-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...comingSoon, ...comingSoon].map((academy, index) => (
              <div
                key={index}
                className="mx-8 text-2xl md:text-3xl font-bold tracking-tight opacity-30 hover:opacity-60 transition-opacity"
              >
                {academy}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  )
}
