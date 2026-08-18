"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { motion, AnimatePresence } from "framer-motion"
import type { Academy } from "@/types"
import { ACADEMY_TO_SLUG, academyCollectionHref } from "@/lib/academies"

const CLASS_YEARS = ["2027", "2028", "2029", "2030"]

const NAV_ITEMS: { label: string; academy: Academy }[] = [
  { label: "Naval Academy", academy: "USNA" },
  { label: "Military Academy", academy: "USMA" },
  { label: "Air Force Academy", academy: "USAFA" },
]

export function Header() {
  const { cart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<Academy | null>(null)
  const [openMobileAccordion, setOpenMobileAccordion] = useState<Academy | null>(null)

  const toggleMobileAccordion = (academy: Academy) => {
    setOpenMobileAccordion((prev) => (prev === academy ? null : academy))
  }

  return (
    <header className="site-header fixed top-0 left-0 right-0 z-40 glass border-b border-border/50">
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
                    className="absolute top-full left-0 w-44 rounded border border-border bg-background shadow-lg overflow-hidden z-50"
                    style={{ marginTop: "0px", paddingTop: "8px" }}
                  >
                    <Link
                      href={academyCollectionHref(academy)}
                      onClick={() => setOpenDropdown(null)}
                      className="block w-full text-left px-4 py-2 text-base font-bold hover:bg-muted transition-colors border-b border-border"
                      style={{ color: "#b8946a" }}
                    >
                      {`All ${label} Classes`}
                    </Link>
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
          <Link
            href="/cart"
            className="flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity"
            style={{ color: "#b8946a" }}
            aria-label={`Cart with ${cart?.itemCount ?? 0} items`}
          >
            <ShoppingBag className="size-5" aria-hidden="true" />
            {`Cart (${cart?.itemCount ?? 0})`}
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label={`Cart with ${cart?.itemCount ?? 0} items`}>
              <ShoppingBag />
              {(cart?.itemCount ?? 0) > 0 && (
                <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {cart?.itemCount}
                </span>
              )}
            </Link>
          </Button>
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/50"
            style={{ overflow: "hidden" }}
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {NAV_ITEMS.map(({ label, academy }) => (
                <div key={academy}>
                  <button
                    type="button"
                    onClick={() => toggleMobileAccordion(academy)}
                    className="w-full flex items-center justify-between text-sm font-bold py-3 hover:opacity-80 transition-opacity"
                    style={{ color: "#b8946a" }}
                  >
                    {label}
                    <ChevronDown
                      className="w-4 h-4 transition-transform duration-200"
                      style={{
                        transform: openMobileAccordion === academy ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>

                  {/* Use CSS max-height transition instead of framer-motion to avoid key conflicts */}
                  <div
                    style={{
                      maxHeight: openMobileAccordion === academy ? "500px" : "0px",
                      overflow: "hidden",
                      transition: "max-height 0.25s ease",
                    }}
                  >
                    <div className="pl-4 pb-3 space-y-1">
                      <Link
                        href={academyCollectionHref(academy)}
                        onClick={() => {
                          setIsMenuOpen(false)
                          setOpenMobileAccordion(null)
                        }}
                        className="block text-xs font-bold hover:opacity-80 transition-opacity py-1.5 border-b border-border mb-1 pb-2"
                        style={{ color: "#b8946a" }}
                      >
                        {`All ${label} Classes`}
                      </Link>
                      {CLASS_YEARS.map((year) => (
                        <Link
                          key={year}
                          href={`/${ACADEMY_TO_SLUG[academy]}/${year}`}
                          onClick={() => {
                            setIsMenuOpen(false)
                            setOpenMobileAccordion(null)
                          }}
                          className="block text-xs font-medium hover:opacity-80 transition-opacity py-1.5"
                          style={{ color: "#b8946a" }}
                        >
                          {`Class of ${year}`}
                        </Link>
                      ))}
                      <Link
                        href={`/${ACADEMY_TO_SLUG[academy]}/reunions`}
                        onClick={() => {
                          setIsMenuOpen(false)
                          setOpenMobileAccordion(null)
                        }}
                        className="block text-xs font-medium hover:opacity-80 transition-opacity py-1.5 border-t border-border mt-1 pt-2"
                        style={{ color: "#b8946a" }}
                      >
                        {"Reunions"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              <Link
                href="/heritage"
                onClick={() => {
                  setIsMenuOpen(false)
                  setOpenMobileAccordion(null)
                }}
                className="block text-sm font-bold hover:opacity-80 transition-opacity py-3"
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
