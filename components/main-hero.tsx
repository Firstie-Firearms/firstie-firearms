"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { Academy } from "@/types"
import { ACADEMY_TO_SLUG } from "@/lib/academies"

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
          {(Object.keys(academyData) as Academy[]).map((academy, index) => (
            <motion.div
              key={academy}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col gap-3 md:gap-4"
            >
              <h2 className="text-base md:text-lg font-bold tracking-wide text-center" style={{ color: "#b8946a" }}>{academyData[academy].name}</h2>

              <Link href={`/${ACADEMY_TO_SLUG[academy]}/2027`} className="block">
              <Card
                className="relative overflow-hidden border-2 hover:border-secondary transition-all duration-300 cursor-pointer group h-[350px] md:h-[500px]"
                style={{ borderColor: academyData[academy].borderColor }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10" />

                <img
                  src={`/custom-glock-pistol-.jpg?height=800&width=600&query=custom glock pistol ${academy} military academy themed on tactical background`}
                  alt={`${academy} Custom Glock`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={academy === "USMA" || academy === "USAFA" ? { filter: "grayscale(100%) brightness(0.5)" } : undefined}
                />

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-20 flex flex-col gap-2 md:gap-3">
                  {(academy === "USMA" || academy === "USAFA") ? (
                    <div
                      className="inline-block self-start px-3 py-1 text-xs font-mono border rounded"
                      style={{
                        borderColor: academyData[academy].goldColor,
                        color: academyData[academy].goldColor,
                      }}
                    >
                      {"COMING SOON - OCTOBER '26"}
                    </div>
                  ) : (
                    <div
                      className="inline-block self-start px-3 py-1 text-xs font-mono border rounded"
                      style={{
                        borderColor: academyData[academy].goldColor,
                        color: academyData[academy].goldColor,
                      }}
                    >
                      {"COMING SOON - AUGUST '26"}
                    </div>
                  )}

                  <h3 className="text-2xl md:text-3xl font-bold" style={{ color: academyData[academy].goldColor }}>
                    {academyData[academy].shortName}
                  </h3>

                  <p className="text-sm text-muted-foreground font-serif">{academyData[academy].tagline}</p>
                </div>
              </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Founders Section */}
      <section id="heritage" className="container mx-auto px-4 py-16 border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-6">

          <p className="text-lg text-muted-foreground font-serif leading-relaxed">
            {"Founded by Academy graduates and family, Firstie Firearms creates custom firearms rooted in honor, service, and tradition. Each piece serves as a symbol connecting those who carry it to the enduring legacy of military college graduates, past, present, and future."}
          </p>
        </div>
      </section>
    </div>
  )
}
