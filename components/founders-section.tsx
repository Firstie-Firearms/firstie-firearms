"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FoundersSection() {
  return (
    <section id="heritage" className="py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <Card className="glass border-border/50 overflow-hidden">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-3xl font-serif text-center">{"The Long Gray Line & The Fleet"}</CardTitle>
          </CardHeader>
          <CardContent className="p-8 md:p-12">
            <div className="space-y-6 font-serif text-muted-foreground leading-relaxed">
              <p className="text-lg">
                {
                  "Academy Custom GLOCKs is owned and operated by graduates of the United States Military Academy and the United States Naval Academy."
                }
              </p>
              <p>
                {
                  "Our mission is simple: to provide the finest custom firearms to those who have dedicated their lives to service and excellence. Each piece is a testament to the values of Duty, Honor, and Country that define our nation's service academies."
                }
              </p>
              <p>
                {
                  "Every firearm is hand-crafted by certified armorers who understand the precision and reliability required by those who serve. We're not just building firearms—we're honoring a legacy."
                }
              </p>
              <div className="pt-6 border-t border-border/50">
                <p className="text-sm text-center font-sans">
                  <span className="font-bold">{"Owned & Operated by Academy Grads"}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  )
}
