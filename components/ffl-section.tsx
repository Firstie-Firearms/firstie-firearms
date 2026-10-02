"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FFLSection() {
  return (
    <section id="ffl" className="py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{"Gun Dealer (FFL) Transfer Required"}</h2>
          <p className="text-muted-foreground">{"Federal law requires firearms to be shipped to a licensed gun dealer"}</p>
        </div>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>{"Find Your Local Gun Dealer (FFL)"}</CardTitle>
            <CardDescription>
              {"Enter your ZIP code to locate licensed gun dealers (FFLs) in your area"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="text" placeholder="Enter ZIP code" className="pl-10 bg-background/50" />
              </div>
              <Button className="bg-primary hover:bg-primary/90">{"Search"}</Button>
            </div>

            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <h4 className="font-semibold mb-2 text-sm">{"What is a gun dealer (FFL) transfer?"}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {
                  "A gun dealer (FFL) transfer is the legal process of transferring firearm ownership through a dealer holding a Federal Firearms License. Your selected gun dealer will receive the firearm, perform a background check, and complete all required paperwork before releasing it to you."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
