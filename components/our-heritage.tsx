export function OurHeritage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[30vh] md:min-h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/custom-tactical-glock-pistol-close-up-on-dark-back.jpg"
            alt="Firstie Firearms Heritage"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: "#b8946a" }}>
            {"About Firstie Firearms"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-serif">
            <span>{"Forged in Tradition |"}</span>
            <br className="md:hidden" />
            <span className="md:before:content-['_']">{"Establishing a Legacy"}</span>
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto space-y-8 md:space-y-12">
          {/* About Section */}
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#b8946a" }}>
              {"About Firstie Firearms"}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-serif">
              {"Founded by graduates of the United States service academies, Firstie Firearms was born from a shared commitment to honor, service, and tradition. Our founders, having walked the hallowed grounds of West Point, Annapolis, and Colorado Springs, understand the weight of duty and the bonds forged through rigorous training and unwavering dedication to country. We created Firstie Firearms to craft custom firearms that embody these values—each piece a testament to the excellence instilled in every academy graduate."}
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-serif">
              {"The name \"Firstie\" pays homage to the senior cadets and midshipmen who have earned their place through years of perseverance. Just as a Firstie represents the culmination of the academy experience, our firearms represent the pinnacle of craftsmanship and heritage. Every detail is carefully considered, from the precision engineering to the academy-specific insignia, ensuring that each firearm is not merely a tool but a symbol of the enduring legacy shared by military college graduates."}
            </p>
          </div>

          {/* Mission Section */}
          <div className="space-y-4 md:space-y-6 pt-6 md:pt-8 border-t border-border">
            <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#b8946a" }}>
              {"Our Mission"}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-serif">
              {"At Firstie Firearms, our mission is to honor the service and sacrifice of military academy graduates by creating custom firearms that reflect their commitment to duty, honor, and country. We believe that those who have dedicated their lives to defending our nation deserve firearms crafted with the same precision, integrity, and excellence they demonstrated throughout their careers. Each limited-edition piece connects its owner to a brotherhood and sisterhood that spans generations—linking past, present, and future defenders of freedom."}
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-serif">
              {"We are committed to preserving the traditions and values of the United States Military Academy, United States Naval Academy, and United States Air Force Academy through our work. Through custom engravings and class-year-specific designs, we ensure that every firearm remains exclusive and meaningful. Firstie Firearms is more than a company\u2014it is a tribute to the Long Gray Line, the Fleet, and the Wild Blue Yonder."}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
