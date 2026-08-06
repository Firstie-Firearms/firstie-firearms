"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { academyColors, academyNames, type Academy } from "@/types"

interface AcademySelectorProps {
  selectedAcademy: Academy
  onSelectAcademy: (academy: Academy) => void
}

export function AcademySelector({ selectedAcademy, onSelectAcademy }: AcademySelectorProps) {
  const academies: Academy[] = ["USNA", "USMA", "USAFA"]

  useEffect(() => {
    const colors = academyColors[selectedAcademy]
    document.documentElement.style.setProperty("--primary", colors.primary)
    document.documentElement.style.setProperty("--secondary", colors.secondary)
  }, [selectedAcademy])

  return (
    <div className="text-center space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{"Choose Your Academy"}</h2>
        <p className="text-muted-foreground">{"Each design features academy-specific colors and insignia"}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {academies.map((academy) => {
          const isSelected = selectedAcademy === academy
          const colors = academyColors[academy]

          return (
            <motion.div key={academy} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => onSelectAcademy(academy)}
                variant={isSelected ? "default" : "outline"}
                className="w-full h-auto p-6 flex flex-col items-center gap-3"
                style={
                  isSelected
                    ? {
                        backgroundColor: colors.primary,
                        borderColor: colors.secondary,
                        color: "#fff",
                      }
                    : {}
                }
              >
                <div className="w-12 h-12 rounded-full" style={{ backgroundColor: colors.secondary }} />
                <div className="space-y-1">
                  <div className="font-bold text-lg">{academy}</div>
                  <div className="text-xs opacity-80">{academyNames[academy]}</div>
                </div>
              </Button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
