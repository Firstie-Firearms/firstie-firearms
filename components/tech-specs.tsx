"use client"

import { Target, Crosshair, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const specs = [
  {
    icon: Target,
    title: "Custom Trigger Job",
    description: "Competition-grade 3.5lb trigger pull",
    details:
      "Professionally polished internals with reduced overtravel and reset. Smooth, crisp break for enhanced accuracy.",
  },
  {
    icon: Crosshair,
    title: "RMR Optic Cut",
    description: "Direct mount optics ready",
    details:
      "Precision milled slide accepts Trijicon RMR and compatible footprints. Co-witness with suppressor height sights included.",
  },
  {
    icon: Shield,
    title: "Frame Stippling",
    description: "Aggressive tactical grip",
    details:
      "Hand-stippled pattern for maximum control in any condition. Undercut trigger guard and reduced grip texture.",
  },
]

export function TechSpecs() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{"Technical Specifications"}</h2>
        <p className="text-muted-foreground">{"Premium modifications by certified armorers"}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {specs.map((spec, index) => (
          <motion.div
            key={spec.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="glass border-border/50 group hover:border-secondary/50 transition-colors h-full">
              <CardHeader>
                <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <spec.icon className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">{spec.title}</CardTitle>
                <CardDescription className="font-mono text-xs">{spec.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{spec.details}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
