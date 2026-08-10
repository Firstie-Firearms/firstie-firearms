"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { Academy } from "@/types"
import { CURRENT_AVAILABLE_YEAR, academyCollectionHref, getComingSoonLabel, isClassAvailable } from "@/lib/academies"

const academyData = {
  USNA: {
    name: "United States Naval Academy",
    shortName: "USNA",
    tagline: "Duty, Honor, Loyalty",
    borderColor: "#002147",
    goldColor: "#b99a6a",
  },
  USMA: {
    name: "United States Military Academy",
    shortName: "USMA",
    tagline: "Duty, Honor, Country",
    borderColor: "#b99a6a",
    goldColor: "#b99a6a",
  },
  USAFA: {
    name: "United States Air Force Academy",
    shortName: "USAFA",
    tagline: "Integrity, Service, Excellence",
    borderColor: "#6b7280",
    goldColor: "#b99a6a",
  },
}

export function MainHero() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/custom-tactical-glock-pistol-close-up-on-dark-back.jpg"
            alt="Custom commemorative GLOCK pistol for service academy graduation"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="container mx-auto px-4 z-10 text-center space-y-4">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="space-y-2">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-sans text-foreground leading-relaxed text-balance">
              {"Commemorative Service Academy Pistols for Graduation and Commissioning"}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-sans text-balance">
              {"Forged in Tradition | Establishing a Legacy"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Academy Selection Grid */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {(Object.keys(academyData) as Academy[]).map((academy, index) => {
            const available = isClassAvailable(academy, CURRENT_AVAILABLE_YEAR)

            return (
              <motion.div
                key={academy}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="flex flex-col gap-3 md:gap-4"
              >
                <h2 className="text-base md:text-lg font-bold tracking-wide text-center" style={{ color: "#b8946a" }}>{academyData[academy].name}</h2>

                <Link href={academyCollectionHref(academy)} className="block">
                <Card
                  className="relative overflow-hidden border-2 hover:border-secondary transition-all duration-300 cursor-pointer group h-[350px] md:h-[500px]"
                  style={{ borderColor: academyData[academy].borderColor }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10" />

                  <img
                    src={`/custom-glock-pistol-.jpg?height=800&width=600&query=custom glock pistol ${academy} military academy themed on tactical background`}
                    alt={`${academy} Custom GLOCK`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={available ? undefined : { filter: "grayscale(100%) brightness(0.5)" }}
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 flex flex-col gap-2 md:gap-3">
                    <div className="flex flex-col gap-2 items-start">
                      <div
                        className="inline-block self-start px-3 py-1 text-xs font-mono border rounded whitespace-nowrap"
                        style={{
                          borderColor: academyData[academy].goldColor,
                          color: academyData[academy].goldColor,
                        }}
                      >
                        {available ? "AVAILABLE NOW" : getComingSoonLabel(academy, CURRENT_AVAILABLE_YEAR)}
                      </div>
                      <div
                        className="inline-block self-start px-3 py-1 text-xs font-mono border rounded"
                        style={{
                          borderColor: academyData[academy].goldColor,
                          color: academyData[academy].goldColor,
                        }}
                      >
                        {"LIMITED EDITION"}
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold" style={{ color: academyData[academy].goldColor }}>
                      {academyData[academy].shortName}
                    </h3>

                    <p className="text-sm text-muted-foreground font-serif">{academyData[academy].tagline}</p>
                  </div>
                </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Founders Section */}
      <section id="heritage" className="container mx-auto px-4 py-16 border-t border-border">
        <div className="text-center px-4">
          <p className="text-lg text-muted-foreground font-serif leading-relaxed">
            {"Founded by Academy graduates and family, Firstie Firearms creates custom firearms rooted in honor, service, and tradition."}
          </p>
          <p className="text-lg text-muted-foreground font-serif leading-relaxed mt-2">
            {"Each piece serves as a symbol connecting those who carry it to the enduring legacy of military college graduates, past, present, and future."}
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="container mx-auto px-4 py-16 border-t border-border">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: "#b8946a" }}>
            {"Our Mission"}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-serif">
            {"At Firstie Firearms, our mission is to honor the service and sacrifice of military academy graduates by creating custom firearms that reflect their commitment to duty, honor, and country. We believe that those who have dedicated their lives to defending our nation deserve firearms crafted with the same precision, integrity, and excellence they demonstrated throughout their careers. Each limited-edition piece connects its owner to a brotherhood and sisterhood that spans generations—linking past, present, and future defenders of freedom."}
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-serif">
            {"We are committed to preserving the traditions and values of the United States Military Academy, United States Naval Academy, and United States Air Force Academy through our work. Through individually numbered engravings and class-year-specific designs, we ensure that every firearm remains exclusive and meaningful. Firstie Firearms is more than a company\u2014it is a tribute to the Long Gray Line, the Fleet, and the Wild Blue Yonder."}
          </p>
        </div>
      </section>
    </div>
  )
}
