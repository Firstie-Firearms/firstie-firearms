"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import type { Academy } from "@/types"
import { ACADEMY_TO_SLUG } from "@/lib/academies"

const CLASS_YEARS = ["2027", "2028", "2029", "2030"]

const NAV_ITEMS: { label: string; academy: Academy }[] = [
  { label: "Naval Academy", academy: "USNA" },
  { label: "Military Academy", academy: "USMA" },
  { label: "Air Force Academy", academy: "USAFA" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<Academy | null>(null)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50">
      <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo — links to home */}
        <Link href="/" className="flex items-center gap-3 focus:outline-none" aria-label="Go to home page">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/firstie_firearms_logo_transparent-qz4KbeTUSjr6grAxHDEtDGNMFyyrzZ.png"
            alt="Firstie Firearms"
            className="h-12 md:h-14 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(({ label, academy }) => (
            <div
              key={academy}
              className="relative"
              onMouseEnter={() => setOpenDropdown(academy)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div
                className="flex items-center gap-1 text-lg font-bold cursor-default"
                style={{ color: "#b8946a" }}
              >
                {label}
                <ChevronDown className="w-4 h-4" />
              </div>

              <AnimatePresence>
                {openDropdown === academy && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-44 rounded border border-border bg-background shadow-lg overflow-hidden z-50"
                  >
                    {CLASS_YEARS.map((year) => (
                      <Link
                        key={year}
                        href={`/${ACADEMY_TO_SLUG[academy]}/${year}`}
                        onClick={() => setOpenDropdown(null)}
                        className="block w-full text-left px-4 py-2 text-base font-medium hover:bg-muted transition-colors"
                        style={{ color: "#b8946a" }}
                      >
                        {`Class of ${year}`}
                      </Link>
                    ))}
                    <Link
                      href={`/${ACADEMY_TO_SLUG[academy]}/reunions`}
                      onClick={() => setOpenDropdown(null)}
                      className="block w-full text-left px-4 py-2 text-base font-medium hover:bg-muted transition-colors border-t border-border"
                      style={{ color: "#b8946a" }}
                    >
                      {"Reunions"}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          <Link
            href="/heritage"
            className="text-lg font-bold hover:opacity-80 transition-opacity"
            style={{ color: "#b8946a" }}
          >
            {"Our Heritage"}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border/50 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {NAV_ITEMS.map(({ label, academy }) => (
                <div key={academy}>
                  <div
                    className="block text-sm font-bold py-2"
                    style={{ color: "#b8946a" }}
                  >
                    {label}
                  </div>
                  <div className="pl-4 space-y-1">
                    {CLASS_YEARS.map((year) => (
                      <Link
                        key={year}
                        href={`/${ACADEMY_TO_SLUG[academy]}/${year}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-xs font-medium hover:opacity-80 transition-opacity py-1"
                        style={{ color: "#b8946a" }}
                      >
                        {`Class of ${year}`}
                      </Link>
                    ))}
                    <Link
                      href={`/${ACADEMY_TO_SLUG[academy]}/reunions`}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-xs font-medium hover:opacity-80 transition-opacity py-1"
                      style={{ color: "#b8946a" }}
                    >
                      {"Reunions"}
                    </Link>
                  </div>
                </div>
              ))}
              <Link
                href="/heritage"
                onClick={() => setIsMenuOpen(false)}
                className="block text-sm font-bold hover:opacity-80 transition-opacity py-2"
                style={{ color: "#b8946a" }}
              >
                {"Our Heritage"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
