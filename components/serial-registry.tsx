"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Academy } from "@/types"

interface SerialRegistryProps {
  selectedSerial: number | null
  onSelectSerial: (serial: number | null) => void
  academy: Academy
}

// Mock sold serials
const soldSerials = new Set([
  1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
])

export function SerialRegistry({ selectedSerial, onSelectSerial, academy }: SerialRegistryProps) {
  const serials = Array.from({ length: 100 }, (_, i) => i + 1)

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{"The Serial Number Registry"}</h2>
        <p className="text-muted-foreground">{"Select your exclusive serial number from the available units"}</p>
      </div>

      <div className="glass rounded-lg p-6 md:p-8">
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 md:gap-3">
          {serials.map((serial) => {
            const isSold = soldSerials.has(serial)
            const isSelected = selectedSerial === serial

            return (
              <motion.button
                key={serial}
                whileHover={!isSold ? { scale: 1.1 } : {}}
                whileTap={!isSold ? { scale: 0.95 } : {}}
                onClick={() => !isSold && onSelectSerial(isSelected ? null : serial)}
                disabled={isSold}
                className={cn(
                  "relative aspect-square rounded-md font-mono text-sm font-bold transition-all",
                  isSold && "opacity-30 cursor-not-allowed",
                  !isSold &&
                    !isSelected &&
                    "bg-muted hover:bg-muted/80 border-2 border-transparent hover:border-secondary",
                  isSelected && "bg-primary text-primary-foreground border-2 glow-bar",
                )}
              >
                <span className={cn(isSold && "line-through")}>{String(serial).padStart(3, "0")}</span>
                {isSold && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-destructive rotate-45" />
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted border-2 border-secondary" />
            <span className="text-muted-foreground">{"Available"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted opacity-30 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-destructive rotate-45" />
              </div>
            </div>
            <span className="text-muted-foreground">{"Sold"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary" />
            <span className="text-muted-foreground">{"Reserved"}</span>
          </div>
        </div>

        {selectedSerial && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
            <Badge className="bg-primary text-primary-foreground">
              {"Serial #"}
              {String(selectedSerial).padStart(3, "0")} {"RESERVED"}
            </Badge>
          </motion.div>
        )}
      </div>
    </div>
  )
}
