"use client"

import { motion } from "framer-motion"
import type { Academy } from "@/types"

interface UrgencyBarProps {
  soldCount: number
  totalCount: number
  academy: Academy
}

export function UrgencyBar({ soldCount, totalCount, academy }: UrgencyBarProps) {
  const percentage = (soldCount / totalCount) * 100

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-mono text-muted-foreground">{"UNITS FORGED"}</span>
        <span className="font-mono font-bold">
          {soldCount}/{totalCount}
        </span>
      </div>

      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 glow-bar rounded-full"
          style={{
            backgroundColor: `var(--primary)`,
          }}
        />
      </div>

      <p className="text-xs text-center text-muted-foreground font-mono">
        {totalCount - soldCount} {"UNITS REMAINING"}
      </p>
    </div>
  )
}
