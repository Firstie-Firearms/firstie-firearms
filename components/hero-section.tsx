"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import type { Academy } from "@/types"

interface HeroSectionProps {
  selectedAcademy: Academy
}

export function HeroSection({ selectedAcademy }: HeroSectionProps) {
  return (
    <section id="armory" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Scanning light effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-primary/20 to-transparent scan-line"
          style={{ width: "200%" }}
        />
      </div>

      {/* Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/custom-glock-pistol-tactical-black-on-dark-backgro.jpg"
          alt="Academy Custom Glock"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center space-y-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <Badge className="bg-secondary text-secondary-foreground mb-4 text-sm px-4 py-1">{"LIMITED EDITION"}</Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-balance mb-6">
            {"Precision Engineered"}
            <br />
            {"For the Elite"}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {"Exclusive custom Glock firearms crafted for military academy graduates. Each individually numbered and engraved."}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
