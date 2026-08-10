import { Target, Crosshair, Shield, Gauge, Flame, Briefcase } from "lucide-react"
import { Card } from "@/components/ui/card"
import { StickyOrderButton } from "@/components/sticky-order-button"
import { ProductPhotoCarousel, type ProductPhoto } from "@/components/product-photo-carousel"
import type { Academy } from "@/types"

interface AcademyShowcaseProps {
  academy: Academy
  classYear?: string
  h1?: string
  pageTitle?: string
}

const academyConfig = {
  USNA: {
    name: "United States Naval Academy",
    shortName: "USNA",
    color: "#002147",
    gold: "#b99a6a",
    crest: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/United_States_Naval_Academy-tTSarHxYETtrZURkwZlzNjkYOUg86d.png",
  },
  USMA: {
    name: "United States Military Academy",
    shortName: "USMA",
    color: "#4a5859",
    gold: "#b99a6a",
    crest: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/U.S._Military_Academy_Coat_of_Arms.svg-kA3Q6qWA5YuVIxst6ZbFnSyGHsRRZZ.png",
  },
  USAFA: {
    name: "United States Air Force Academy",
    shortName: "USAFA",
    color: "#003087",
    gold: "#b99a6a",
    crest: "/usafa-shield.svg",
  },
}

const weaponFeatures = [
  {
    icon: Target,
    title: "Marksman Barrel",
    subtitle: "Enhanced Polygonal Rifling",
  },
  {
    icon: Crosshair,
    title: "Night Sights",
    subtitle: "Tritium Inserts",
  },
  {
    icon: Shield,
    title: "Aggressive Frame",
    subtitle: "Ambidextrous Controls",
  },
  {
    icon: Gauge,
    title: "Deep Laser",
    subtitle: "Multi-Layer Engraving",
  },
  {
    icon: Flame,
    title: "Cerakote",
    subtitle: "Custom Paint Finishes",
  },
  {
    icon: Briefcase,
    title: "Custom Case",
    subtitle: "Two Levels",
  },
]

/**
 * Product photo array for the carousel. This is the ONLY place photos need
 * to be added, removed, or reordered — the carousel component itself is
 * fully dynamic and works with any number of images.
 *
 * To add a photo: append a new object to the `views` array below.
 * To remove a photo: delete its entry from the `views` array.
 * To reorder photos: change the order of entries in the `views` array —
 * the carousel and full-screen viewer always follow this array's order.
 *
 * Replace the placeholder `/custom-glock-pistol-.jpg?...` query-based src
 * with real photography URLs when available. `thumbnailSrc` can point to a
 * smaller/optimized version for the carousel strip; `src` is used for the
 * full-screen viewer and should be the highest-resolution version.
 */
function getProductPhotos(academy: Academy, classYear: string): ProductPhoto[] {
  const shortName = academyConfig[academy].shortName
  const views = [
    "complete left side profile",
    "complete right side profile",
    "slide top engraving detail",
    "left grip panel engraving detail",
    "right grip panel engraving detail",
    "front sight and barrel detail",
    "rear tritium night sight detail",
    "trigger and PolyDAT trigger shoe detail",
    "magwell and controls detail",
    "Cerakote finish close-up",
    "muzzle and rifling detail",
    "presentation case closed, exterior",
    "presentation case open with pistol and magazines",
    "class crest engraving detail",
    "full set with case, magazines, and documentation",
  ]

  return views.map((view) => {
    const query = encodeURIComponent(
      `custom engraved GLOCK 19X V pistol ${shortName} ${classYear} commemorative, ${view}`,
    )
    return {
      src: `/custom-glock-pistol-.jpg?height=1400&width=2000&query=${query}`,
      thumbnailSrc: `/custom-glock-pistol-.jpg?height=500&width=700&query=${query}`,
      alt: `${shortName} ${classYear} commemorative GLOCK 19X V \u2014 ${view}`,
    }
  })
}

export function AcademyShowcase({ academy, classYear = "Class of 2027", h1, pageTitle }: AcademyShowcaseProps) {
  const config = academyConfig[academy]
  const productPhotos = getProductPhotos(academy, classYear)

  return (
    <div className="min-h-screen pt-20" style={{ "--academy-color": config.color, "--gold-color": config.gold } as any}>
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-80 border-r border-border p-6 space-y-6">
          {/* Academy Name */}
          <div className="flex items-center justify-center">
            <span className="text-7xl font-bold tracking-widest text-center" style={{ color: config.gold }}>
              {config.shortName}
            </span>
          </div>

          {/* Class Year Section */}
          <div className="space-y-4 pt-6 border-t border-border">
            <p className="text-sm font-bold text-center leading-relaxed" style={{ color: config.gold }}>
              {pageTitle
                ? `Designed in Collaboration with Members of Reunion Classes`
                : (classYear === "Class of 2027" || classYear === "Class of 2028")
                ? `Designed in Collaboration with Members of the ${classYear}`
                : `To be Designed in Collaboration with Members of the ${classYear}`
              }
            </p>

            {/* Class Year or Page Title */}
            <div className="flex items-center justify-center">
              <span
                className={`font-bold tracking-wider text-center ${pageTitle ? "text-5xl" : "text-7xl"}`}
                style={{ color: config.gold }}
              >
                {pageTitle ?? classYear.replace(/\D/g, "")}
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {"Founded by Academy Graduates, Firstie Firearms creates custom firearms rooted in honor, service, and tradition."}
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Mobile Info Section - shown only on mobile */}
          <section className="lg:hidden container mx-auto px-4 py-6 space-y-4">
            <div className="flex items-center justify-center h-32">
              <span className="text-6xl font-bold tracking-widest text-center" style={{ color: config.gold }}>
                {config.shortName}
              </span>
            </div>
            <p className="text-sm font-bold text-center leading-relaxed px-4" style={{ color: config.gold }}>
              {pageTitle
                ? `Designed in Collaboration with Members of Reunion Classes`
                : (classYear === "Class of 2027" || classYear === "Class of 2028")
                ? `Designed in Collaboration with Members of the ${classYear}`
                : `To be Designed in Collaboration with Members of the ${classYear}`
              }
            </p>
            
            {/* Class Year or Page Title */}
            <div className="flex items-center justify-center">
              <span
                className={`font-bold tracking-wider text-center ${pageTitle ? "text-4xl" : "text-6xl"}`}
                style={{ color: config.gold }}
              >
                {pageTitle ?? classYear.replace(/\D/g, "")}
              </span>
            </div>
          </section>

          {/* Hero Section */}
          <section className="relative h-[30vh] md:h-[50vh] overflow-hidden">
            {h1 && <h1 className="sr-only">{h1}</h1>}
            <img
              src={`/custom-glock-pistol-.jpg?height=800&width=1600&query=custom glock pistol ${academy} military academy on tactical background`}
              alt={`${config.shortName} commemorative GLOCK pistol for graduation`}
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 items-start">
              <div
                className="inline-block px-3 py-1 text-xs font-mono border rounded bg-background/60"
                style={{ borderColor: config.gold, color: config.gold }}
              >
                {pageTitle
                  ? "COMING SOON"
                  : classYear === "Class of 2027"
                  ? academy === "USNA"
                    ? "COMING SOON - AUGUST '26"
                    : "COMING SOON - OCTOBER '26"
                  : `COMING SOON - AUGUST '${String((Number.parseInt(classYear.replace(/\D/g, ""), 10) - 1) % 100).padStart(2, "0")}`}
              </div>
              <div
                className="inline-block px-3 py-1 text-xs font-mono border rounded bg-background/60"
                style={{ borderColor: config.gold, color: config.gold }}
              >
                {"LIMITED EDITION"}
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* Delivery Batch Banner — full viewport width, outside sidebar layout */}
      {classYear === "Class of 2027" ? (
        <div className="w-full border-y border-white/10 overflow-x-auto" style={{ backgroundColor: config.color }}>
          <div className="flex flex-col sm:flex-row sm:justify-center sm:min-w-max items-stretch divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {/* Batch 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 px-6 sm:px-8 py-2.5 gap-1 whitespace-nowrap">
              <p className="font-sans text-sm font-bold whitespace-nowrap" style={{ color: config.gold }}>
                First Production Batch
              </p>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 whitespace-nowrap">
                <div className="flex items-baseline justify-between sm:justify-start gap-2 whitespace-nowrap">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-white/50 whitespace-nowrap">Order Deadline</span>
                  <span className="font-sans text-xs font-semibold text-white whitespace-nowrap">November 1, 2026</span>
                </div>
                <div className="flex items-baseline justify-between sm:justify-start gap-2 whitespace-nowrap">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-white/50 whitespace-nowrap">Est. Delivery</span>
                  <span className="font-sans text-xs font-semibold text-white whitespace-nowrap">December 15, 2026</span>
                </div>
              </div>
            </div>
            {/* Batch 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 px-6 sm:px-8 py-2.5 gap-1 whitespace-nowrap">
              <p className="font-sans text-sm font-bold whitespace-nowrap" style={{ color: config.gold }}>
                Commissioning Delivery Batch
              </p>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 whitespace-nowrap">
                <div className="flex items-baseline justify-between sm:justify-start gap-2 whitespace-nowrap">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-white/50 whitespace-nowrap">Order Deadline</span>
                  <span className="font-sans text-xs font-semibold text-white whitespace-nowrap">April 1, 2027</span>
                </div>
                <div className="flex items-baseline justify-between sm:justify-start gap-2 whitespace-nowrap">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-white/50 whitespace-nowrap">Est. Delivery</span>
                  <span className="font-sans text-xs font-semibold text-white whitespace-nowrap">May 15, 2027</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full border-y border-white/10 flex items-center justify-center py-1.5 px-4 overflow-x-auto" style={{ backgroundColor: config.color }}>
          {pageTitle ? (
            <a
              href="mailto:info@firstiefirearms.com"
              className="font-sans text-xs font-semibold uppercase tracking-widest px-6 py-1 border transition-opacity hover:opacity-80 whitespace-nowrap"
              style={{ borderColor: config.gold, color: config.gold }}
            >
              Contact Firstie Firearms
            </a>
          ) : (
            <button
              type="button"
              className="font-sans text-xs font-semibold uppercase tracking-widest px-6 py-1 border transition-opacity hover:opacity-80 whitespace-nowrap"
              style={{ borderColor: config.gold, color: config.gold }}
            >
              Sign Up for Release Update
            </button>
          )}
        </div>
      )}

      {/* Product Photo Carousel */}
      <section className="w-full px-4 py-6 md:py-8">
        <ProductPhotoCarousel images={productPhotos} accentColor={config.gold} />
      </section>

      {/* Reunion narrative — only shown on Reunions pages */}
      {pageTitle && (
        <section className="w-full border-b border-border px-6 py-12 md:py-16">
          <div className="w-full text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold leading-tight whitespace-nowrap inline-block" style={{ color: config.gold }}>
              {"Commemorate Your Reunion with a Custom Firstie Firearm"}
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {"Every reunion is an opportunity to honor the bonds forged through shared hardship, service, and sacrifice. A custom reunion edition from Firstie Firearms is more than a firearm—it's a lasting tribute to your class and the legacy you've built together."}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {"Whether you're celebrating a 5th, 10th, 25th, or 50th reunion, we'll work with your class representatives to design a one-of-a-kind commemorative pistol featuring artwork, insignia, class mottos, milestones, or other meaningful elements unique to your class."}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {"From the initial concept through final production, our team will collaborate closely with you to create a firearm that every classmate will be proud to own and pass down for generations."}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {"If you're interested in creating a custom reunion edition for your class, we'd love to hear from you. "}
              <a
                href="mailto:info@firstiefirearms.com"
                className="font-semibold transition-opacity hover:opacity-75"
                style={{ color: config.gold }}
              >
                {"Contact Firstie Firearms"}
              </a>
              {" to begin the design process and bring your class's vision to life."}
            </p>
          </div>
        </section>
      )}

      {/* Custom Build Features — full width, no sidebar */}
      <section id="features-anchor" className="relative px-4 py-8 md:py-16">
        <div className="mb-8 md:mb-12 max-w-screen-xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: config.gold }}>
            {"Custom Build Features"}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 max-w-screen-xl mx-auto">
          {weaponFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="p-3 md:p-4 border-2 hover:border-opacity-100 transition-all duration-300"
                style={{ borderColor: config.gold }}
              >
                <div className="space-y-2 md:space-y-3 text-center">
                  <div className="flex justify-center py-1 md:py-2">
                    <Icon className="w-8 h-8 md:w-10 md:h-10" style={{ color: config.gold }} />
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-bold" style={{ color: config.gold }}>{feature.title}</div>
                    <div className="text-[10px] md:text-xs text-muted-foreground">{feature.subtitle}</div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Below features: product details sidebar + description/tech data */}
      <div className="flex border-t border-border">

        {/* Product Details Sidebar — same w-80 as left nav, only on lg+ */}
        {!pageTitle && (
          <aside className="hidden lg:block w-80 shrink-0 border-r border-border">
            <div className="p-6 space-y-6">

              {/* Package Contents */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Package Contents</h3>
                <ul className="space-y-1.5">
                  {[
                    `One finished ${config.shortName} ${classYear} commemorative GLOCK 19X V`,
                    "One custom two-level protective presentation case",
                    "Two 17+2-round factory magazines",
                    "One 17-round factory magazine",
                    "State-compliant magazines provided where required by law",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: config.gold }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Base Firearm */}
              <div className="space-y-2 pt-4 border-t border-border">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Base Firearm</h3>
                <ul className="space-y-1.5">
                  {[
                    "GLOCK 19X V",
                    "9x19 mm",
                    "Marksman Barrel",
                    "Safe Action System",
                    "Tritium Night Sights",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: config.gold }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Custom Components */}
              <div className="space-y-2 pt-4 border-t border-border">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Custom Components</h3>
                <ul className="space-y-1.5">
                  {[
                    "Overwatch Precision PolyDAT trigger shoe",
                    "SLR Rifleworks magwell",
                    "Deep multi-layer laser engraving",
                    "Hand-finishing and polishing",
                    ...(academy === "USNA" && classYear === "Class of 2027"
                      ? ["Custom Cerakote - Battleship Gray", "Custom Cerakote - Admiral Bronze"]
                      : ["Custom Cerakote"]),
                    "Custom two-level presentation case",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: config.gold }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Included Magazines */}
              <div className="space-y-2 pt-4 border-t border-border">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Included Magazines</h3>
                <ul className="space-y-1.5">
                  {[
                    "Two 17+2-round factory magazines",
                    "One 17-round factory magazine",
                    "State-compliant magazines provided where required by law",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: config.gold }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </aside>
        )}

        {/* Right: description + tech data */}
        <div className="flex-1 min-w-0">

          {/* GLOCK 19X V Section */}
          {academy === "USNA" && classYear === "Class of 2027" ? (
            <section className="container mx-auto px-4 py-8 md:py-16 border-t border-border">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 md:mb-4" style={{ color: config.gold }}>
                {"USNA Class of 2027\u2019s Custom GLOCK 19X V"}
              </h2>
              <p className="text-center text-sm md:text-base font-bold mb-8 md:mb-12 text-balance" style={{ color: config.gold }}>
                {"A Legacy Forged in Steel. A Tribute to Service. A Gift Worthy of an Annapolis Graduate."}
              </p>

              <div className="max-w-4xl mx-auto space-y-8">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
                  {"The United States Naval Academy Class of 2027\u2019s Custom GLOCK 19X V is more than a firearm\u2014it is a commemorative heirloom created to honor one of life's greatest achievements: earning a commission as an officer in the United States Navy or Marine Corps."}
                </p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
                  {"Every pistol begins as a GLOCK 19X V and is transformed through an extensive deep-laser engraving process that captures the history, traditions, and future of the Naval Academy. The slide is precision-engraved, polished to highlight every detail, and protected with a durable Cerakote coating designed to preserve the artwork for generations."}
                </p>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold" style={{ color: config.gold }}>{"Honoring the Class of 2027"}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
                    {"The left side of the slide is dedicated to the Class of 2027 and incorporates the elements of the class crest. Atlas stands at the muzzle, carrying the world on his shoulders while looking toward the future. Flowing behind him is the class motto, \u201CDe Profundis Ad Caelos Vincimus\u201D (\u201CFrom the Depths to the Skies, We Conquer\u201D), framed within a ribbon. A historic age-of-sail warship pays tribute to the Navy's rich heritage, while Zeus and Poseidon symbolize strength, leadership, and mastery of sea and sky. The design concludes with the proud inscription USNA framing the rear."}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold" style={{ color: config.gold }}>{"The Future Fleet"}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
                    {"The right side of the slide honors the warfare communities that many members of the Class of 2027 will enter upon graduation. A United States Marine leads from the front, representing the Corps' warrior ethos. Behind him are symbols of the Navy's modern fighting force: an Arleigh Burke-class destroyer for the Surface Navy, a Virginia-class fast attack submarine for the Submarine Force, and an F-35 Lightning II representing Naval Aviation."}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold" style={{ color: config.gold }}>{"A Tribute to the Academy"}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
                    {"The top of the slide celebrates the United States Naval Academy and the institution that shaped the Class of 2027 into future naval leaders. A trident symbolizes sea power, maritime leadership, and the Academy\u2019s enduring mission to prepare officers for service at sea. Incorporated directly from the Class of 2027 crest are the dove of peace and Polaris, the North Star. The dove represents the commitment to pursue peace through strength, while Polaris has long guided mariners across the world\u2019s oceans, symbolizing steadfast leadership, purpose, and an unwavering moral compass. Together, these elements unite the identity of the Class of 2027 with the Academy that forged it, reflecting the values, character, and sense of duty that will guide its graduates throughout their careers. Completing the design, a banner proudly bearing CLASS OF 2027 commemorates the class\u2019s transition from midshipmen to commissioned officers and marks the beginning of a lifetime of service to the nation."}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold" style={{ color: config.gold }}>{"The Link in the Chain"}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
                    {"Running between both sides of the slide is an engraved chain inspired by the Fifth Law of the Navy:"}
                  </p>
                  <blockquote className="border-l-2 pl-4 italic text-sm md:text-base text-muted-foreground leading-relaxed font-serif" style={{ borderColor: config.gold }}>
                    {"\u201COn the strength of one link in the cable, dependeth the might of the chain. Who knows when thou mayest be tested? So live that thou bearest the strain.\u201D"}
                  </blockquote>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
                    {"The chain connects the classes of 1977 and 2027, honoring the Naval Academy tradition of linking generations of graduates and reminding every officer that they are part of something larger than themselves."}
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
                    {"Along the left edge of the slide is the immortal command \u201CDON'T GIVE UP THE SHIP,\u201D spoken by Captain James Lawrence in 1813 and carried forward through generations of naval officers. Today, those words remain a defining symbol of perseverance and duty, displayed prominently in Memorial Hall at the Naval Academy."}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold" style={{ color: config.gold }}>{"Custom Finishes and Upgrades"}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
                    {"The frame is finished in Battleship Gray accented by Admiral Bronze, creating a distinctive appearance inspired by the Navy's fleet. Performance upgrades include an Overwatch Precision PolyDAT trigger and an SLR Rifleworks GLOCK 19X V magwell, both custom finished to complement the pistol's commemorative design."}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold" style={{ color: config.gold }}>{"A Presentation Worthy of the Occasion"}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
                    {"A commemorative firearm deserves a presentation equal to the achievement it honors. Each USNA Class of 2027 Custom GLOCK 19X V is housed in an exclusive two-level presentation case designed specifically for this class. Framed by Navy anchors, the inside lid features the mission of the United States Naval Academy, while dense, closed-cell black-core foam securely protects the pistol and included magazines. A lower compartment provides dedicated storage for additional magazines and personal keepsakes, centered around a fixed Navy anchor symbolizing a lifetime of service."}
                  </p>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
                    {"Built to honor the occasion without sacrificing function, the case is as practical as it is beautiful. Durable enough for transport to and from the range, it protects a battle-ready GLOCK that is meant to be fired, carried, and enjoyed\u2014not simply displayed. It is a presentation worthy of a lasting heirloom and a firearm built for generations of service."}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg md:text-xl font-bold" style={{ color: config.gold }}>{"A Gift That Lasts a Lifetime"}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
                    {"Whether purchased for a graduating midshipman, proud parent, family member, sponsor, or mentor, the USNA Class of 2027\u2019s Custom GLOCK 19X V stands as a lasting tribute to sacrifice, achievement, and the beginning of a career dedicated to serving the nation."}
                  </p>
                </div>

                <p className="text-center text-base md:text-lg font-bold text-balance" style={{ color: config.gold }}>
                  {"Commemorate the Journey. Honor the Accomplishment. Establish the Legacy."}
                </p>
              </div>
            </section>
          ) : (
            <section className="container mx-auto px-4 py-8 md:py-16 border-t border-border">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-10" style={{ color: config.gold }}>
                {"GLOCK 19X V"}
              </h2>
              
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
                  {"The GLOCK 19X V pistol combines the best features of two of the most popular and most trusted field-tested GLOCK pistols into one. The full-size GLOCK 17 frame and the compact GLOCK 19 slide have joined forces to produce the ideal pistol for all conditions and all situations. The G19X V pistol comes in the coyote color with a nPVD slide coating to prevent corrosion. Additional features include the GLOCK Marksman Barrel (GMB), no finger grooves, and ambidextrous slide stop levers. Included with the pistol is a standard 17-round magazine, two 17+2-round magazines, and a custom Firstie Firearms pistol case."}
                </p>
                
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-serif">
                  {"The SAFE ACTION\u00AE System is a fully automatic safety system consisting of three passive, independently operating, mechanical safeties. All three safeties disengage sequentially as the trigger is pulled and automatically re-engage when the trigger is released."}
                </p>
              </div>
            </section>
          )}

          {/* Technical Data Section */}
          <section className="container mx-auto px-4 py-8 md:py-16 border-t border-border">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12" style={{ color: config.gold }}>
              {"Technical Data"}
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {/* Caliber */}
                <div className="border-2 rounded-lg p-4 text-center" style={{ borderColor: config.gold }}>
                  <div className="text-xs text-muted-foreground mb-1">{"Caliber"}</div>
                  <div className="text-sm md:text-base font-bold" style={{ color: config.gold }}>{"9x19 mm"}</div>
                </div>
                
                {/* System */}
                <div className="border-2 rounded-lg p-4 text-center" style={{ borderColor: config.gold }}>
                  <div className="text-xs text-muted-foreground mb-1">{"System"}</div>
                  <div className="text-sm md:text-base font-bold" style={{ color: config.gold }}>{"Safe Action\u00AE"}</div>
                </div>
                
                {/* Mag Capacity */}
                <div className="border-2 rounded-lg p-4 text-center" style={{ borderColor: config.gold }}>
                  <div className="text-xs text-muted-foreground mb-1">{"Mag. Capacity"}</div>
                  <div className="text-sm md:text-base font-bold" style={{ color: config.gold }}>{"2x19 & 1x17"}</div>
                </div>
                
                {/* Barrel Length */}
                <div className="border-2 rounded-lg p-4 text-center" style={{ borderColor: config.gold }}>
                  <div className="text-xs text-muted-foreground mb-1">{"Barrel Length"}</div>
                  <div className="text-sm md:text-base font-bold" style={{ color: config.gold }}>{"102 mm | 4.02 inch"}</div>
                </div>
                
                {/* Weight without magazine */}
                <div className="border-2 rounded-lg p-4 text-center" style={{ borderColor: config.gold }}>
                  <div className="text-xs text-muted-foreground mb-1">{"Weight (no mag)"}</div>
                  <div className="text-sm md:text-base font-bold" style={{ color: config.gold }}>{"625 g | 22.05 oz"}</div>
                </div>
                
                {/* Weight with empty magazine */}
                <div className="border-2 rounded-lg p-4 text-center" style={{ borderColor: config.gold }}>
                  <div className="text-xs text-muted-foreground mb-1">{"Weight (empty mag)"}</div>
                  <div className="text-sm md:text-base font-bold" style={{ color: config.gold }}>{"704 g | 24.83 oz"}</div>
                </div>
                
                {/* Weight with loaded magazine */}
                <div className="border-2 rounded-lg p-4 text-center" style={{ borderColor: config.gold }}>
                  <div className="text-xs text-muted-foreground mb-1">{"Weight (loaded mag)"}</div>
                  <div className="text-sm md:text-base font-bold" style={{ color: config.gold }}>{"890 g | 31.39 oz"}</div>
                </div>
                
                {/* Trigger Pull */}
                <div className="border-2 rounded-lg p-4 text-center" style={{ borderColor: config.gold }}>
                  <div className="text-xs text-muted-foreground mb-1">{"Trigger Pull"}</div>
                  <div className="text-sm md:text-base font-bold" style={{ color: config.gold }}>{"26 N"}</div>
                </div>
              </div>
            </div>
          </section>
        </div>{/* end right flex-1 */}
      </div>{/* end below-hero flex row */}

      {/* Product Details — mobile only, shown below description */}
      {!pageTitle && (
        <div className="block lg:hidden border-t border-border px-6 py-8 space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">What&apos;s Included</h2>

          {/* Package Contents */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Package Contents</h3>
            <ul className="space-y-1.5">
              {[
                `One finished ${config.shortName} ${classYear} commemorative GLOCK 19X V`,
                "One custom two-level protective presentation case",
                "Two 17+2-round factory magazines",
                "One 17-round factory magazine",
                "State-compliant magazines provided where required by law",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: config.gold }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Base Firearm */}
          <div className="space-y-2 pt-4 border-t border-border">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Base Firearm</h3>
            <ul className="space-y-1.5">
              {[
                "GLOCK 19X V",
                "9x19 mm",
                "Marksman Barrel",
                "Safe Action System",
                "Tritium Night Sights",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: config.gold }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Custom Components */}
          <div className="space-y-2 pt-4 border-t border-border">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Custom Components</h3>
            <ul className="space-y-1.5">
              {[
                "Overwatch Precision PolyDAT trigger shoe",
                "SLR Rifleworks magwell",
                "Deep multi-layer laser engraving",
                "Hand-finishing and polishing",
                ...(academy === "USNA" && classYear === "Class of 2027"
                  ? ["Custom Cerakote - Battleship Gray", "Custom Cerakote - Admiral Bronze"]
                  : ["Custom Cerakote"]),
                "Custom two-level presentation case",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: config.gold }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Included Magazines */}
          <div className="space-y-2 pt-4 border-t border-border">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Included Magazines</h3>
            <ul className="space-y-1.5">
              {[
                "Two 17+2-round factory magazines",
                "One 17-round factory magazine",
                "State-compliant magazines provided where required by law",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: config.gold }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Sticky / floating order CTA — hides until features section scrolls out of view */}
      {!pageTitle && (
        <StickyOrderButton
          label={`${
            Number.parseInt(classYear.replace(/\D/g, ""), 10) >= 2028 ? "Preorder" : "Order"
          } ${classYear} Pistol`}
          gold={config.gold}
          anchorSelector="#features-anchor"
          price={Number.parseInt(classYear.replace(/\D/g, ""), 10) === 2027 ? "$2,395.00" : "$500.00"}
        />
      )}
    </div>
  )
}
